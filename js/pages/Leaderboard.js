import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

// Globální konfigurace balíčků
const packsConfig = [
    { name: "Sapphire Pack", color: "#0070ff", points: 15, levels: ["Verity", "B", "Deadlocked"] },
    { name: "Ruby Pack", color: "#ff0000", points: 25, levels: ["Theory of Everything 2", "Blackfire Backfire"] },
    { name: "Quantum Pack", color: "#00ffcc", points: 50, levels: ["Speed Racer", "Clubstep"] }
];

// Pomocná funkce pro ověření, zda hráč splnil konkrétní balíček
function checkPackCompletion(entry, pack) {
    if (!entry) return false;
    
    const playerLevels = [];
    if (entry.completed) {
        entry.completed.forEach(score => playerLevels.push(score.level));
    }
    if (entry.verified) {
        entry.verified.forEach(score => playerLevels.push(score.level));
    }
    
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
        packsConfig: packsConfig
    }),
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        
        // Automatický přepočet bodů za balíčky
        if (leaderboard) {
            leaderboard.forEach(player => {
                let bonusPoints = 0;
                packsConfig.forEach(pack => {
                    if (checkPackCompletion(player, pack)) {
                        bonusPoints += pack.points;
                    }
                });
                player.total += bonusPoints;
            });
            
            // Seřazení žebříčku podle bodů
            leaderboard.sort((a, b) => b.total - a.total);
        }

        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(entry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(entry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected === i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ entry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div class="player-container">
                    <div class="player" v-if="entry">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>
                        
                        <!-- DYNAMICKÉ BALÍČKY (Čistý styl bez rozbití okolního CSS) -->
                        <div v-if="hasAnyPack(entry)" style="margin-top: 15px; margin-bottom: 25px;">
                            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 10px;">Completed Packs</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                <template v-for="pack in packsConfig">
                                    <div v-if="hasCompletedPack(entry, pack)" :style="{ borderLeft: '4px solid ' + pack.color }" style="background: rgba(255,255,255,0.03); padding: 8px 14px; border-radius: 6px; font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                                        <span :style="{ color: pack.color }">{{ pack.name }}</span>
                                        <span style="color: #00ffcc; font-size: 0.85rem;">+{{ pack.points }} pts</span>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length }})</h2>
                        <table class="table" v-if="entry.verified.length > 0">
                            <tr v-for="score in entry.verified">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        
                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table" v-if="entry.completed.length > 0">
                            <tr v-for="score in entry.completed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                        
                        <h2 v-if="entry.progressed.length > 0">Progressed ({{ entry.progressed.length }})</h2>
                        <table class="table" v-if="entry.progressed.length > 0">
                            <tr v-for="score in entry.progressed">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }} ({{ score.percent }}%)</a>
                                </td>
                                <td class="score">
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
