import { fetchLeaderboard } from '../content.js';
import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },
    template: `
        <main v-if="loading" style="display: flex; justify-content: center; padding: 50px; background: #fff;"><Spinner /></main>
        
        <main v-else style="background: #f0f2f5; padding: 20px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start; font-family: sans-serif; box-sizing: border-box;">
            
            <!-- LEVÝ PANEL: Seznam hráčů -->
            <div style="background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; width: 320px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); box-sizing: border-box; flex-shrink: 0;">
                <div style="margin-bottom: 15px;">
                    <input type="text" v-model="search" placeholder="Enter to search..." style="width: 100%; padding: 10px; border: 1px solid #ccd1d9; border-radius: 4px; color: #000; background: #fff; box-sizing: border-box;">
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr v-for="(player, idx) in paginatedLeaderboard" :key="idx" @click="selectPlayer(idx)"
                        :style="{ cursor: 'pointer', background: selected === idx ? '#e6f0ff' : 'transparent', borderBottom: '1px solid #f0f0f0' }">
                        <td style="padding: 12px 8px; width: 40px; color: #65676b; font-weight: bold;">#{{ (page - 1) * pageSize + idx + 1 }}</td>
                        <td style="padding: 12px 8px; text-align: left; color: #000; font-weight: 600;">{{ getPlayerName(player) }}</td>
                        <td style="padding: 12px 8px; text-align: right; color: #0070ff; font-weight: bold;">{{ formatScore(player) }}</td>
                    </tr>
                </table>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #f0f0f0;">
                    <button @click="prevPage" :disabled="page === 1" style="padding: 6px 12px; background: #f0f2f5; color: #000; border: 1px solid #ccd1d9; border-radius: 4px; cursor: pointer;">PREV</button>
                    <span style="color: #4f5d73; font-weight: 600;">Page {{ page }}</span>
                    <button @click="nextPage" :disabled="page * pageSize >= filteredLeaderboard.length" style="padding: 6px 12px; background: #f0f2f5; color: #000; border: 1px solid #ccd1d9; border-radius: 4px; cursor: pointer;">NEXT</button>
                </div>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail hráče -->
            <div style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left; color: #000000; box-sizing: border-box;">
                <div v-if="entry">
                    <h1 style="color: #000000; font-size: 2.2rem; margin: 0 0 20px 0; font-weight: 800;">{{ getPlayerName(entry) }}</h1>
                    
                    <div style="display: flex; gap: 40px; padding-bottom: 20px; border-bottom: 1px solid #e1e4e8;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist rank</p>
                            <h3 style="color: #000000; margin: 0; font-size: 1.8rem; font-weight: 700;">#{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist score</p>
                            <h3 style="color: #0070ff; margin: 0; font-size: 1.8rem; font-weight: 700;">{{ formatScore(entry) }}</h3>
                        </div>
                    </div>

                    <div style="display: flex; gap: 40px; padding: 20px 0; border-bottom: 1px solid #e1e4e8;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist stats</p>
                            <h4 style="color: #000000; font-size: 1.1rem; font-weight: 600; margin: 0;">{{ stats.main }} Main, {{ stats.extended }} Extended, {{ stats.legacy }} Legacy</h4>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Hardest demon</p>
                            <h4 style="color: #2bba74; font-size: 1.1rem; font-weight: 700; margin: 0;">{{ hardestDemon }}</h4>
                        </div>
                    </div>

                    <!-- ODSTAVEC PRO DÉMONY S JMÉNY -->
                    <h2 style="color: #000000; font-size: 1.4rem; margin: 25px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #0070ff; font-weight: 700;">Demons completed & verified</h2>
                    <div v-if="allDemons.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="line-height: 2; font-size: 1.05rem; color: #333; word-wrap: break-word;">
                        <template v-for="(demon, idx) in allDemons">
                            <span>
                                <a :href="demon.link" target="_blank" style="color: #0070ff; font-weight: 600; text-decoration: none;">{{ demon.level }}</a> 
                                <span style="color: #65676b; font-size: 0.95rem;"> by {{ getPlayerName(entry) }}</span>
                            </span>
                            <span v-if="idx < allDemons.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>

                    <h2 style="color: #000000; font-size: 1.4rem; margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #ff9000; font-weight: 700;">Progress on</h2>
                    <div v-if="progressDemons.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="line-height: 2; font-size: 1.05rem; color: #333; word-wrap: break-word;">
                        <template v-for="(score, idx) in progressDemons">
                            <span>
                                <a :href="score.link" target="_blank" style="color: #ff9000; font-weight: 600; text-decoration: none;">{{ score.level }} ({{ score.percent }}%)</a> 
                                <span style="color: #65676b; font-size: 0.95rem;"> by {{ getPlayerName(entry) }}</span>
                            </span>
                            <span v-if="idx < progressDemons.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>
                </div>
            </div>
        </main>
    `,
    data() {
        return {
            leaderboard: [],
            packs: packsConfig,
            loading: true,
            selected: 0,
            err: [],
            page: 1,
            pageSize: 20,
            search: '',
        };
    },
    computed: {
        filteredLeaderboard() {
            if (!this.search) return this.leaderboard;
            const query = this.search.toLowerCase();
            return this.leaderboard.filter(player => {
                const name = player && typeof player === 'object' ? (player.user || player.name || '') : String(player);
                return name.toLowerCase().includes(query);
            });
        },
        paginatedLeaderboard() {
            const start = (this.page - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredLeaderboard.slice(start, end);
        },
        entry() {
            if (!this.paginatedLeaderboard || this.paginatedLeaderboard.length === 0) return null;
            return this.paginatedLeaderboard[this.selected];
        },
        allDemons() {
            if (!this.entry || !this.entry.verified) return [];
            return this.entry.verified
                .filter(d => d.percent === 100 || d.percent === undefined)
                .map(d => ({
                    level: d.level || "Unknown Level",
                    link: d.link || "#"
                }))
                .sort((a, b) => a.level.localeCompare(b.level));
        },
        progressDemons() {
            if (!this.entry || !this.entry.verified) return [];
            return this.entry.verified
                .filter(d => d.percent && d.percent < 100)
                .map(d => ({
                    level: d.level || "Unknown Level",
                    link: d.link || "#",
                    percent: d.percent
                }))
                .sort((a, b) => a.level.localeCompare(b.level));
        },
        hardestDemon() {
            if (!this.allDemons || this.allDemons.length === 0) return 'None';
            return this.allDemons[0].level;
        },
        stats() {
            if (!this.entry || !this.entry.verified) return { main: 0, extended: 0, legacy: 0 };
            const verified = this.entry.verified || [];
            return {
                main: verified.filter(d => d.listRank === 'Main' || (d.rank && d.rank <= 50)).length,
                extended: verified.filter(d => d.listRank === 'Extended' || (d.rank && d.rank > 50 && d.rank <= 100)).length,
                legacy: verified.filter(d => d.listRank === 'Legacy' || (d.rank && d.rank > 100)).length,
            };
        }
    },
    async mounted() {
        try {
            this.leaderboard = await fetchLeaderboard();
            this.loading = false;
        } catch (e) {
            this.err.push(e.toString());
            this.loading = false;
        }
    },
    methods: {
        getPlayerName(player) {
            if (!player) return 'Unknown';
            return player.user || player.name || (typeof player === 'string' ? player : 'Unknown');
        },
        formatScore(player) {
            if (!player) return '0';
            let score = 0;
            if (typeof player === 'object') {
                score = player.total !== undefined ? player.total : (player.score !== undefined ? player.score : 0);
            } else if (typeof player === 'number' || typeof player === 'string') {
                score = player;
            }
            return Number(score).toLocaleString();
        },
        selectPlayer(index) {
            this.selected = index;
        },
        prevPage() {
            if (this.page > 1) { this.page--; this.selected = 0; }
        },
        nextPage() {
            if (this.page * this.pageSize < this.filteredLeaderboard.length) { this.page++; this.selected = 0; }
        },
        hasAnyPack(player) {
            return this.packs.some(pack => checkPackCompletion(player, pack));
        },
        hasCompletedPack(player, pack) {
            return checkPackCompletion(player, pack);
        }
    }
};
