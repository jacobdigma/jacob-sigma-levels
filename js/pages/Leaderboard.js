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
        levels: ["n tolot", "Speed Racer", "Blackfire Backfire"]
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
        <main v-if="loading" class="surface">
            <Spinner />
        </main>
        <main v-else class="page-leaderboard-container">
            <!-- LEVÝ PANEL -->
            <div class="board-container">
                <div class="search-box">
                    <input type="text" v-model="search" placeholder="Enter to search..." class="type-body">
                </div>
                <div v-if="err.length > 0" class="error-container">
                    <p class="type-body-sm">Leaderboard may be incorrect: {{ err.join(', ') }}</p>
                </div>
                <table class="board">
                    <tr v-for="player in paginatedLeaderboard" :key="player.name" :class="{ active: entry && entry.name === player.name }">
                        <td class="rank"><p class="type-label-lg">#{{ leaderboard.indexOf(player) + 1 }}</p></td>
                        <td class="user"><button @click="selectPlayer(player)"><span class="type-label-lg">{{ player.name }}</span></button></td>
                        <td class="total"><p class="type-label-lg">{{ localize(player.total) }}</p></td>
                    </tr>
                </table>
                <div class="pagination">
                    <button @click="prevPage" class="type-body" :disabled="page === 1">PREVIOUS</button>
                    <span class="type-body">Page {{ page }}</span>
                    <button @click="nextPage" class="type-body" :disabled="page * pageSize >= filteredLeaderboard.length">NEXT</button>
                </div>
            </div>
            <!-- PROSTŘEDNÍ PANEL -->
            <div class="player-container">
                <div v-if="entry" class="player">
                    <h1 class="type-title player-name">{{ entry.name }}</h1>
                    <h2 class="type-title player-total">{{ localize(entry.total) }} p</h2>
                    <div class="player-stats-grid">
                        <div>
                            <p class="type-body stats-label">Demonlist Rank</p>
                            <h3 class="type-title">#{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p class="type-body stats-label">Demonlist Stats</p>
                            <h3 class="type-body stats-value">{{ stats.main }} Main, {{ stats.extended }} Extended, {{ stats.legacy }} Legacy</h3>
                        </div>
                    </div>
                    <h2 class="type-title section-title">Demons completed</h2>
                    <div v-if="combinedDemons.length === 0" class="type-body no-data">No completed demons.</div>
                    <table v-else class="table">
                        <tr v-for="demon in combinedDemons" :key="demon.level">
                            <td class="rank-type"><p class="type-body" :class="demon.listRank.toLowerCase()">{{ demon.listRank }}</p></td>
                            <td class="level-name">
                                <a class="type-label-lg" target="_blank" :href="demon.link">{{ demon.level }}</a>
                                <span v-if="demon.isVerified" class="verifier-badge">VERIFIER</span>
                            </td>
                            <td class="score-val"><p class="type-body">+{{ localize(demon.score) }}</p></td>
                        </tr>
                    </table>
                    <div v-if="entry.progressed && entry.progressed.length > 0">
                        <h2 class="type-title section-title">Progress on</h2>
                        <table class="table">
                            <tr v-for="score in entry.progressed" :key="score.level">
                                <td class="rank-type"><p class="type-body legacy">{{ getRankLabel(score.rank) }}</p></td>
                                <td class="level-name"><a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }} ({{ score.percent }}%)</a></td>
                                <td class="score-val"><p class="type-body">+{{ localize(score.score) }}</p></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div v-else class="player no-data"><p class="type-body">Select a player to view stats.</p></div>
            </div>
            <!-- PRAVÝ PANEL -->
            <div class="packs-container">
                <h3 class="type-title">Completed Packs</h3>
                <div v-if="entry && hasAnyPack(entry)" class="packs-list">
                    <div v-for="pack in packsConfig" :key="pack.name" v-show="hasCompletedPack(entry, pack)" :style="{ borderLeft: '4px solid ' + pack.color }" class="pack-item">
                        <span class="type-label-lg" :style="{ color: pack.color }">{{ pack.name }}</span>
                        <span class="type-body">+{{ pack.points }} pts</span>
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
            
            if (this.entry.verified) {
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
            }
            
            return list.sort((a, b) => b.score - a.score);
        },
        stats() {
            const counts = { main: 0, extended: 0, legacy: 0 };
            this.combinedDemons.forEach(d => {
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
