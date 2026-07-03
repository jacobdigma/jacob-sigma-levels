import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';
import Spinner from '../components/Spinner.js';

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
        levels: ["m tolot", "Speed Racer", "Blackfire Backfire"]
    },
    {
        name: "RobTop Pack",
        color: "#00ffcc",
        points: 100,
        levels: ["Deadlocked", "Theory of Everything 2", "Clubstep"]
    }
];

function checkPackCompletion(entry, pack) {
    if (!entry) return false;
    const playerLevels = [];
    if (entry.completed) entry.completed.forEach(s => playerLevels.push(s.level));
    if (entry.verified) entry.verified.forEach(s => playerLevels.push(s.level));
    return pack.levels.every(lvl => playerLevels.includes(lvl));
}

export default {
    components: {
        Spinner,
    },
    template: `
        <main v-if="loading" class="surface" style="display: flex; justify-content: center; padding: 50px;">
            <Spinner />
        </main>
        
        <main v-else class="page-leaderboard-container">
            
            <!-- LEVÝ PANEL: Seznam hráčů -->
            <div class="board-container surface">
                <div class="search-box">
                    <input type="text" v-model="search" placeholder="Enter to search..." class="type-body">
                </div>

                <div v-if="err.length > 0" class="error-container">
                    <p class="type-body-sm" style="color: #ff5555;">Leaderboard may be incorrect: {{ err.join(', ') }}</p>
                </div>
                
                <table class="board">
                    <tr v-for="player in paginatedLeaderboard" 
                        :key="player.name"
                        :class="{ active: entry && entry.name === player.name }"
                        @click="selectPlayer(player)"
                        style="cursor: pointer;">
                        <td class="rank">
                            <p class="type-label-lg">#{{ leaderboard.indexOf(player) + 1 }}</p>
                        </td>
                        <td class="user">
                            <span class="type-label-lg" style="color: #fff; font-weight: 600;">{{ player.name }}</span>
                        </td>
                        <td class="total">
                            <p class="type-label-lg">{{ localize(player.total) }}</p>
                        </td>
                    </tr>
                </table>

                <div class="pagination">
                    <button @click="prevPage" class="type-body" :disabled="page === 1">PREVIOUS</button>
                    <span class="type-body">Page {{ page }}</span>
                    <button @click="nextPage" class="type-body" :disabled="page * pageSize >= filteredLeaderboard.length">NEXT</button>
                </div>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail hráče -->
            <div class="player-container surface">
                <div v-if="entry" class="player">
                    <h1 class="type-title player-name">{{ entry.name }}</h1>
                    
                    <div class="player-stats-grid">
                        <div>
                            <p class="type-body stats-label">Demonlist rank</p>
                            <h3 class="type-title pointercrate-stat-val">#{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p class="type-body stats-label">Demonlist score</p>
                            <h3 class="type-title pointercrate-stat-val" style="color: #4ba3ff;">{{ localize(entry.total) }}</h3>
                        </div>
                    </div>

                    <div class="player-stats-grid" style="margin-top: 15px; border-top: none;">
                        <div>
                            <p class="type-body stats-label">Demonlist stats</p>
                            <h4 class="type-body" style="color: #fff; font-size: 1.05rem; font-weight: 600; margin: 0;">
                                {{ stats.main }} Main, {{ stats.extended }} Extended, {{ stats.legacy }} Legacy
                            </h4>
                        </div>
                        <div>
                            <p class="type-body stats-label">Hardest demon</p>
                            <h4 class="type-body" style="color: #fff; font-size: 1.05rem; font-weight: 600; margin: 0;">
                                {{ hardestDemon }}
                            </h4>
                        </div>
                    </div>

                    <h2 class="type-title section-title-pointercrate">Demons completed</h2>
                    <div v-if="sortedDemons.length === 0" class="type-body no-data">None</div>
                    
                    <div v-else class="pointercrate-demons-paragraph">
                        <template v-for="(demon, idx) in sortedDemons">
                            <a :href="demon.link" target="_blank" class="pointercrate-demon-inline-link" :class="demon.listRank.toLowerCase()">{{ demon.level }}</a><span v-if="idx < sortedDemons.length - 1" class="pointercrate-separator"> - </span>
                        </template>
                    </div>

                    <h2 class="type-title section-title-pointercrate" style="margin-top: 30px;">Demons verified</h2>
                    <div v-if="verifiedDemons.length === 0" class="type-body no-data">None</div>
                    <div v-else class="pointercrate-demons-paragraph">
                        <template v-for="(demon, idx) in verifiedDemons">
                            <a :href="demon.link" target="_blank" class="pointercrate-demon-inline-link" :class="demon.listRank.toLowerCase()">{{ demon.level }}</a><span v-if="idx < verifiedDemons.length - 1" class="pointercrate-separator"> - </span>
                        </template>
                    </div>

                    <h2 class="type-title section-title-pointercrate" style="margin-top: 30px;">Progress on</h2>
                    <div v-if="!entry.progressed || entry.progressed.length === 0" class="type-body no-data">None</div>
                    <div v-else class="pointercrate-demons-paragraph">
                        <template v-for="(score, idx) in entry.progressed">
                            <a :href="score.link" target="_blank" class="pointercrate-demon-inline-link" :class="getRankLabel(score.rank).toLowerCase()">{{ score.level }} ({{ score.percent }}%)</a><span v-if="idx < entry.progressed.length - 1" class="pointercrate-separator"> - </span>
                        </template>
                    </div>

                </div>
                <div v-else class="player no-data"><p class="type-body">Select a player to view stats.</p></div>
            </div>

            <!-- PRAVÝ PANEL -->
            <div class="packs-container surface">
                <div style="margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 15px;">
                    <p class="type-body stats-label" style="text-align: center;">Order completed demons</p>
                    <div style="background: #13131a; padding: 10px; border-radius: 4px; text-align: center; color: #fff; font-weight: bold; border: 1px solid rgba(255,255,255,0.1); font-size: 0.95rem;">
                        Alphabetical
                    </div>
                </div>

                <h3 class="type-title" style="color: #fff; font-size: 1.1rem;">Completed Packs</h3>
                <div v-if="entry && hasAnyPack(entry)" class="packs-list">
                    <div v-for="pack in packsConfig" :key="pack.name" v-show="hasCompletedPack(entry, pack)" :style="{ borderLeft: '4px solid ' + pack.color }" class="pack-item">
                        <span class="type-label-lg" :style="{ color: pack.color }" style="font-weight: bold;">{{ pack.name }}</span>
                        <span class="type-body" style="color: #fff; font-weight: bold;">+{{ pack.points }} pts</span>
                    </div>
                </div>
                <div v-else class="type-body no-data">No packs completed.</div>
            </div>
            
        </main>
    `,
    data() {
        return {
            leaderboard: [],
            loading: true,
            selectedPlayerName: null, 
            err: [],
            packsConfig: packsConfig,
            search: '',
            page: 1,
            pageSize: 15,
            mainListLimit: 50,      
            extendedListLimit: 100,  
        };
    },
    computed: {
        filteredLeaderboard() {
            if (!this.search) return this.leaderboard;
            return this.leaderboard.filter(player => 
                player.name.toLowerCase().includes(this.search.toLowerCase())
            );
        },
        paginatedLeaderboard() {
            const start = (this.page - 1) * this.pageSize;
            const end = this.page * this.pageSize;
            return this.filteredLeaderboard.slice(start, end);
        },
        entry() {
            if (this.filteredLeaderboard.length === 0) return null;
            if (!this.selectedPlayerName) {
                return this.filteredLeaderboard[0];
            }
            const found = this.filteredLeaderboard.find(p => p.name === this.selectedPlayerName);
            return found || this.filteredLeaderboard[0];
        },
        combinedDemons() {
            if (!this.entry) return [];
            const list = [];
            
            if (this.entry.completed) {
                this.entry.completed.forEach(s => {
                    list.push({
                        level: s.level,
                        score: s.score,
                        link: s.link,
                        rank: s.rank,
                        isVerified: false,
                        listRank: this.getRankLabel(s.rank)
                    });
                });
            }
            return list;
        },
        verifiedDemons() {
            if (!this.entry || !this.entry.verified) return [];
            const list = [];
            this.entry.verified.forEach(s => {
                list.push({
                    level: s.level,
                    score: s.score,
                    link: s.link,
                    rank: s.rank,
                    isVerified: true,
                    listRank: this.getRankLabel(s.rank)
                });
            });
            return list.sort((a, b) => a.level.localeCompare(b.level));
        },
        sortedDemons() {
            const mainList = this.combinedDemons.filter(d => d.listRank.startsWith('#')).sort((a, b) => a.level.localeCompare(b.level));
            const extendedList = this.combinedDemons.filter(d => d.listRank === 'Extended').sort((a, b) => a.level.localeCompare(b.level));
            const legacyList = this.combinedDemons.filter(d => d.listRank === 'Legacy').sort((a, b) => a.level.localeCompare(b.level));
            return [...mainList, ...extendedList, ...legacyList];
        },
        // BEZPEČNÝ VÝPOČET NEJTĚŽŠÍHO DÉMONA (Zabraňuje zaseknutí loading screenu)
        hardestDemon() {
            if (!this.combinedDemons || this.combinedDemons.length === 0) return 'None';
            const sortedByDifficulty = [...this.combinedDemons].sort((a, b) => {
                const rA = a.rank || 9999;
                const rB = b.rank || 9999;
                return rA - rB;
            });
            return sortedByDifficulty[0] ? sortedByDifficulty[0].level : 'None';
        },
        stats() {
            const counts = { main: 0, extended: 0, legacy: 0 };
            const allDemons = [...this.combinedDemons, ...this.verifiedDemons];
            const uniqueLevels = [];
            const uniqueDemons = allDemons.filter(d => {
                if (uniqueLevels.includes(d.level)) return false;
                uniqueLevels.push(d.level);
                return true;
            });
            
            uniqueDemons.forEach(d => {
                if (d.listRank.startsWith('#')) counts.main++;
                else if (d.listRank === 'Extended') counts.extended++;
                else if (d.listRank === 'Legacy') counts.legacy++;
            });
            return counts;
        }
    },
    watch: {
        search() {
            this.page = 1;
        }
    },
    methods: {
        localize,
        hasCompletedPack(entry, pack) {
            return checkPackCompletion(entry, pack);
        },
        hasAnyPack(entry) {
            return this.packsConfig.some(pack => this.hasCompletedPack(entry, pack));
        },
        selectPlayer(player) {
            this.selectedPlayerName = player.name;
        },
        prevPage() {
            if (this.page > 1) this.page--;
        },
        nextPage() {
            if (this.page * this.pageSize < this.filteredLeaderboard.length) this.page++;
        },
        getRankLabel(rank) {
            if (!rank) return 'Legacy';
            if (rank <= this.mainListLimit) {
                return '#' + rank;
            } else if (rank <= this.extendedListLimit) {
                return 'Extended';
            } else {
                return 'Legacy';
            }
        }
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        
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
            
            leaderboard.sort((a, b) => b.total - a.total);
            
            if (leaderboard.length > 0) {
                this.selectedPlayerName = leaderboard[0].name;
            }
        }
        
        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },
};
