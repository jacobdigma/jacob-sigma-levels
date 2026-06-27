import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

// Globální konfigurace balíčků pro snadnou úpravu
const packsConfig = [
    { name: "Sapphire Pack", color: "#0070ff", points: 15, levels: ["Verity", "B", "Deadlocked"] },
    { name: "Ruby Pack", color: "#ff0000", points: 25, levels: ["Theory of Everything 2", "Blackfire Backfire"] },
    { name: "Quantum Pack", color: "#00ffcc", points: 50, levels: ["Speed Racer", "Clubstep"] }
];

// Pomocná funkce pro ověření, zda hráč splnil konkrétní balíček
function checkPackCompletion(entry, pack) {
    if (!entry) return false;
    
    // Sesbíráme názvy všech levelů, které hráč dokončil (completed) nebo ověřil (verified)
    const playerLevels = [];
    if (entry.completed) {
        entry.completed.forEach(score => playerLevels.push(score.level));
    }
    if (entry.verified) {
        entry.verified.forEach(score => playerLevels.push(score.level));
    }
    
    // Balíček je splněn pouze tehdy, když hráč má všechny potřebné levely
    return pack.levels.every(neededLevel => playerLevels.includes(neededLevel));
}

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
        packsConfig: packsConfig // Zpřístupnění konfigurace pro HTML šablonu
    }),
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        
        // AUTOMATICKÝ PŘEPOČET BODŮ ZA BALÍČKY
        // Projdeme každého hráče na žebříčku a přičteme mu body, pokud splnil nějaký balíček
        if (leaderboard) {
            leaderboard.forEach(player => {
                let bonusPoints = 0;
                packsConfig.forEach(pack => {
                    if (checkPackCompletion(player, pack)) {
                        bonusPoints += pack.points;
                    }
                });
                // Přičtení bonusu k celkovému skóre hráče
                player.total += bonusPoints;
            });
            
            // Po přičtení bodů žebříček znovu seřadíme od nejvyššího počtu bodů po nejnižší
            leaderboard.sort((a, b) => b.total - a.total);
        }

        this.leaderboard = leaderboard;
        this.err = err;
        
        // Skrytí načítacího kolečka
        this.loading = false;
    },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(entry, i) in leaderboard">
                            <td class="class-rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="class-total">
                                <p class="type-label-lg">{{ localize(entry.total) }}</p>
                            </td>
                            <td class="class-user" :class="{ 'active': selected === i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ entry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="player-container">
                    <div class="div class="player" v-if="entry">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>
                        
                        <!-- NOVÁ SEKCE: COMPLETED PACKS PRO PROFILE HRÁČE -->
                        <div v-if="hasAnyPack(entry)" style="margin-top: 25px; margin-bottom: 25px; background: #111214; padding: 15px; border-radius: 8px;">
                            <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 12px; color: #8a8e94; text-transform: uppercase; letter-spacing: 0.5px;">Completed Packs</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                <template v-for="pack in packsConfig">
                                    <div v-if="hasCompletedPack(entry, pack)" :style="{ borderLeft: '4px solid ' + pack.color }" style="background: #18191c; padding: 8px 14px; border-radius: 6px; font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                                        <span :style="{ color: pack.color }">{{ pack.name }}</span>
                                        <span style="color: #00ffcc; background: #202225; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">+{{ pack.points }} pts</span>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length }})</h2>
                        <table class="table" v-if="entry.verified.length > 0">
                            <tr v-for="score in entry.verified">
                                <td class="class-rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="class-level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="class-score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table" v-if="entry.completed.length > 0">
                            <tr v-for="score in entry.completed">
                                <td class="class-rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="class-level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="class-score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{ entry.progressed.length }})</h2>
                        <table class="table" v-if="entry.progressed.length > 0">
                            <tr v-for="score in entry.progressed">
                                <td class="class-rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="class-level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }} ({{ score.percent }}%)</a>
                                </td>
                                <td class="class-score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    methods: {
        localize,
        hasCompletedPack(entry, pack) {
            return checkPackCompletion(entry, pack);
        },
        hasAnyPack(entry) {
            return this.packsConfig.some(pack => this.hasCompletedPack(entry, pack));
        }
    }
};
