import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';
import Spinner from '../components/Spinner.js';

// Globální konfigurace balíčků - přesně podle tvého kódu
const packsConfig = [
    {
        name: "Neptune Pack 1",
        color: "#0070ff",
        points: 50,
        levels: ["xStep V2", "Clutterfunk V2", "Electroman Adventures V2"]
    },
    {
        name: "Digna Pack",
        color: "#ff0000",
        points: 75,
        levels: ["n tolot", "Speed Racer", "Blackfire Backfire"]
    },
    {
        name: "RobTop Pack",
        color: "#00ffcc",
        points: 100,
        levels: ["Deadlocked", "Theory of Everything 2", "Clubstep"]
    }
];

// Pomocná funkce pro ověření balíčků
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
    template: `
        <main v-if="loading" class="surface" style="display: flex; justify-content: center; padding: 50px;">
            <Spinner />
        </main>
        
        <main v-else class="page-leaderboard-container" style="display: grid; grid-template-columns: 290px 1fr 290px; gap: 20px; max-width: 1400px; margin: 40px auto; padding: 0 20px; align-items: start;">
            
            <!-- LEVÝ PANEL: Seznam hráčů (board-container) -->
            <div class="board-container" style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
                <!-- Vyhledávání -->
                <div style="padding: 0 10px;">
                    <input type="text" v-model="search" placeholder="Enter to search..." class="type-body" style="width: 100%; padding: 8px 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-color); box-sizing: border-box;">
                </div>

                <div v-if="err.length > 0" class="error-container" style="padding: 0 10px;">
                    <p class="type-body-sm">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                
                <table class="board" style="width: 100%;">
                    <tr v-for="(player, index) in paginatedLeaderboard" 
                        :key="player.name"
                        :class="{ active: entry && entry.name === player.name }">
                        <td class="rank">
                            <p class="type-label-lg">#{{ leaderboard.indexOf(player) + 1 }}</p>
                        </td>
                        <td class="total">
                            <p class="type-label-lg">{{ localize(player.total) }}</p>
                        </td>
                        <td class="user">
                            <button @click="selectPlayer(player)">
                                <span class="type-label-lg">{{ player.name }}</span>
                            </button>
                        </td>
                    </tr>
                </table>

                <!-- Stránkování ve stylu Pointercrate -->
                <div style="display: flex; justify-content: space-between; padding: 10px 15px; border-top: 1px solid var(--border-color);">
                    <button @click="prevPage" class="type-body" :disabled="page === 1" style="background: transparent; border: none; color: var(--text-color); cursor: pointer; font-weight: bold;">PREVIOUS</button>
                    <span class="type-body" style="opacity: 0.6; font-size: 0.9rem;">Page {{ page }}</span>
                    <button @click="nextPage" class="type-body" :disabled="page * pageSize >= filteredLeaderboard.length" style="background: transparent; border: none; color: var(--text-color); cursor: pointer; font-weight: bold;">NEXT</button>
                </div>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail hráče (player-container) -->
            <div class="player-container" style="width: 100%;">
                <div v-if="entry" class="player">
                    <h1 class="type-title" style="font-size: 2.5rem; text-align: center; margin-bottom: 5px;">{{ entry.name }}</h1>
                    <h2 class="type-title" style="font-size: 1.5rem; text-align: center; color: #4ba3ff; margin-bottom: 25px;">{{ localize(entry.total) }}</h2>

                    <!-- Statistiky typů démonů -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 15px 0; text-align: center;">
                        <div>
                            <p class="type-body" style="opacity: 0.5; margin: 0 0 5px 0;">Demonlist Rank</p>
                            <h3 class="type-title" style="margin: 0; font-size: 1.6rem;">#{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p class="type-body" style="opacity: 0.5; margin: 0 0 5px 0;">Demonlist Stats</p>
                            <h3 class="type-body" style="margin: 0; font-size: 1.05rem; font-weight: bold;">
                                {{ stats.main }} Main, {{ stats.extended }} Extended, {{ stats.legacy }} Legacy
                            </h3>
                        </div>
                    </div>

                    <!-- SPOJENÝ SEZNAM COMPLETED A VERIFIED DÉMONŮ -->
                    <h2 class="type-title" style="font-size: 1.4rem; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Demons completed</h2>
                    <div v-if="combinedDemons.length === 0" class="type-body" style="text-align: center; opacity: 0.5; padding: 15px;">
                        No completed demons.
                    </div>
                    <table v-else class="table" style="width: 100%; margin-bottom: 30px;">
                        <tr v-for="demon in combinedDemons" :key="demon.level">
                            <td class="rank">
                                <p class="type-body" style="font-weight: bold;">
                                    {{ demon.listRank }}
                                </p>
                            </td>
                            <td class="level">
                                <a class="type-label-lg" target="_blank" :href="demon.link">{{ demon.level }}</a>
                                <span v-if="demon.isVerified" style="font-size: 0.75rem; background: rgba(75,163,255,0.2); color: #4ba3ff; padding: 2px 6px; border-radius: 3px; font-weight: bold; margin-left: 10px;">VERIFIER</span>
                            </td>
                            <td class="score">
                                <p class="type-body">+{{ localize(demon.score) }}</p>
                            </td>
                        </tr>
                    </table>

                    <!-- SEKCE PROGRESS (Pokud hráč nějaký má) -->
                    <div v-if="entry.progressed && entry.progressed.length > 0">
                        <h2 class="type-title" style="font-size: 1.4rem; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Progress on</h2>
                        <table class="table" style="width: 100%;">
                            <tr v-for="score in entry.progressed" :key="score.level">
                                <td class="rank">
                                    <p class="type-body" style="color: #aaa;">{{ getRankLabel(score.rank) }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }} ({{ score.percent }}%)</a>
                                </td>
                                <td class="score">
                                    <p class="type-body">+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div v-else class="player" style="text-align: center; opacity: 0.5; padding: 40px;">
                    <p class="type-body">Select a player to view stats.</p>
                </div>
            </div>

            <!-- PRAVÝ PANEL: Balíčky (Packs) -->
            <div class="player-container" style="width: 100%; padding: 20px; box-sizing: border-box;">
                <h3 class="type-title" style="font-size: 1.2rem; margin-top: 0; margin-bottom: 15px; text-align: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Completed Packs</h3>
                
                <div v-if="entry && hasAnyPack(entry)" style="display: flex; flex-direction: column; gap: 8px;">
                    <div v-for="pack in packsConfig" :key="pack.name" v-show="hasCompletedPack(entry, pack)" 
                         :style="{ borderLeft: '4px solid ' + pack.color }" 
                         style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                        <span class="type-label-lg" :style="{ color: pack.color }" style="font-weight: bold; font-size: 0.9rem;">{{ pack.name }}</span>
                        <span class="type-body" style="font-size: 0.8rem; opacity: 0.7;">+{{ pack.points }} pts</span>
                    </div>
                </div>
