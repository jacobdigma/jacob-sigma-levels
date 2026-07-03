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
        <main v-if="loading" class="surface" style="display: flex; justify-content: center; padding: 50px;">
            <Spinner />
        </main>
        
        <main v-else class="page-leaderboard-container" style="display: grid; grid-template-columns: 320px 1fr 300px; gap: 30px; max-width: 1400px; margin: 40px auto; padding: 0 20px; align-items: start;">
            
            <!-- LEVÝ PANEL: Seznam hráčů -->
            <div class="board-container surface" style="display: flex; flex-direction: column; gap: 15px; width: 100%; padding: 20px; background: #1c1c24; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div>
                    <input type="text" v-model="search" placeholder="Enter to search..." class="type-body" style="width: 100%; padding: 10px 14px; background: #13131a; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #fff; box-sizing: border-box; font-size: 0.95rem;">
                </div>

                <div v-if="err.length > 0" class="error-container">
                    <p class="type-body-sm" style="color: #ff5555; padding: 0 5px;">
                        Leaderboard may be incorrect: {{ err.join(', ') }}
                    </p>
                </div>
                
                <table class="board" style="width: 100%; border-collapse: collapse;">
                    <tr v-for="player in paginatedLeaderboard" 
                        :key="player.name"
                        :style="{ background: entry && entry.name === player.name ? 'rgba(75, 163, 255, 0.15)' : 'transparent' }"
                        style="border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.2s;">
                        <td class="rank" style="padding: 12px 8px; width: 45px;">
                            <p class="type-label-lg" style="margin: 0; font-weight: bold; color: rgba(255,255,255,0.4);">#{{ leaderboard.indexOf(player) + 1 }}</p>
                        </td>
                        <td class="user" style="padding: 12px 8px;">
                            <button @click="selectPlayer(player)" style="background: transparent; border: none; color: #fff; padding: 0; text-align: left; cursor: pointer; width: 100%; font-weight: 600;">
                                <span class="type-label-lg">{{ player.name }}</span>
                            </button>
                        </td>
                        <td class="total" style="padding: 12px 8px; text-align: right; width: 90px;">
                            <p class="type-label-lg" style="margin: 0; font-weight: bold; color: #4ba3ff;">{{ localize(player.total) }}</p>
                        </td>
                    </tr>
                </table>

                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 5px 0 5px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.9rem;">
                    <button @click="prevPage" class="type-body" :disabled="page === 1" style="background: transparent; border: none; color: #fff; cursor: pointer; font-weight: bold; opacity: page === 1 ? 0.3 : 1; letter-spacing: 0.5px;">PREVIOUS</button>
                    <span class="type-body" style="opacity: 0.5; color: #fff;">Page {{ page }}</span>
                    <button @click="nextPage" class="type-body" :disabled="page * pageSize >= filteredLeaderboard.length" style="background: transparent; border: none; color: #fff; cursor: pointer; font-weight: bold; opacity: page * pageSize >= filteredLeaderboard.length ? 0.3 : 1; letter-spacing: 0.5px;">NEXT</button>
                </div>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail hráče -->
            <div class="player-container surface" style="width: 100%; padding: 30px; background: #1c1c24; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div v-if="entry" class="player">
                    <h1 class="type-title" style="font-size: 2.8rem; text-align: center; margin: 0 0 5px 0; color: #fff; font-weight: 800; letter-spacing: 0.5px;">{{ entry.name }}</h1>
                    <h2 class="type-title" style="font-size: 1.6rem; text-align: center; color: #4ba3ff; margin: 0 0 30px 0; font-weight: bold;">{{ localize(entry.total) }} p</h2>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 20px 0; text-align: center;">
                        <div>
                            <p class="type-body" style="opacity: 0.4; margin: 0 0 6px 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: #fff;">Demonlist Rank</p>
                            <h3 class="type-title" style="margin: 0; font-size: 1.8rem; color: #fff; font-weight: bold;">#{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p class="type-body" style="opacity: 0.4; margin: 0 0 6px 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: #fff;">Demonlist Stats</p>
                            <h3 class="type-body" style="margin: 0; font-size: 1.1rem; font-weight: bold; color: #fff;">
                                <span style="color: #4ba3ff;">{{ stats.main }}</span> Main, <span style="color: #ffaa00;">{{ stats.extended }}</span> Extended, <span style="color: #888;">{{ stats.legacy }}</span> Legacy
                            </h3>
                        </div>
                    </div>

                    <h2 class="type-title" style="font-size: 1.5rem; margin-top: 35px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; color: #fff; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Demons completed</h2>
                    <div v-if="combinedDemons.length === 0" class="type-body" style="text-align: center; opacity: 0.5; padding: 20px; color: #fff;">
                        No completed demons.
                    </div>
                    <table v-else class="table" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr v-for="demon in combinedDemons" :key="demon.level" style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                            <td class="rank" style="padding: 14px 10px; width: 65px; vertical-align: middle;">
                                <p class="type-body" style="font-weight: bold; margin: 0; font-size: 0.95rem;" :style="{ color: demon.listRank === 'Legacy' ? '#777' : (demon.listRank === 'Extended' ? '#ffaa00' : '#4ba3ff') }">
                                    {{ demon.listRank }}
                                </p>
                            </td>
                            <td class="level" style="padding: 14px 10px; vertical-align: middle; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                                <a class="type-label-lg" target="_blank" :href="demon.link" style="color: #fff; text-decoration: none; font-weight: bold; font-size: 1.05rem; transition: color 0.2s;">{{ demon.level }}</a>
                                <span v-if="demon.isVerified" style="font-size: 0.7rem; background: rgba(75,163,255,0.15); color: #4ba3ff; padding: 3px 8px; border-radius: 3px; font-weight: bold; letter-spacing: 0.5px; border: 1px solid rgba(75,163,255,0.3); text-transform: uppercase;">VERIFIER</span>
                            </td>
                            <td class="score" style="padding: 14px 10px; text-align: right; width: 110px; vertical-align: middle;">
                                <p class="type-body" style="margin: 0; font-weight: bold; color: rgba(255,255,255,0.8);">+{{ localize(demon.score) }}</p>
                            </td>
                        </tr>
                    </table>

                    <!-- SEKCE PROGRESS -->
                    <div v-if="entry.progressed && entry.progressed.length > 0">
                        <h2 class="type-title" style="font-size: 1.5rem; margin-top: 40px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; color: #fff; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Progress on</h2>
                        <table class="table" style="width: 100%; border-collapse: collapse;">
                            <tr v-for="score in entry.progressed" :key="score.level" style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                                <td class="rank" style="padding: 14px 10px; width: 65px; vertical-align: middle;">
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
