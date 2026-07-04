import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';
import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    template: `
        <main v-if="loading" class="surface" style="background: #ffffff; padding: 40px;">
            <Spinner />
        </main>
        <main v-else class="page-leaderboard-container" style="background: #f0f2f5; padding: 20px; display: flex; gap: 20px; color: #000000;">
            
            <!-- LEVÝ PANEL: Seznam hráčů -->
            <div class="board-container surface" style="background: #ffffff; color: #000000; border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; width: 300px;">
                <div class="search-box">
                    <input type="text" v-model="search" placeholder="Enter to search..." class="type-body" style="background: #ffffff; color: #000000; border: 1px solid #ccd1d9; width: 100%; padding: 8px; border-radius: 4px;">
                </div>
                <div v-if="err.length > 0" class="error-container">
                    <p class="type-body-sm" style="color: #ff0000;">Leaderboard may be incorrect: {{ err.join(', ') }}</p>
                </div>
                <table class="board" style="width: 100%; margin-top: 10px;">
                    <tr v-for="(player, idx) in paginatedLeaderboard" :class="{ active: selected === idx }" @click="selected = idx" style="cursor: pointer;">
                        <td class="rank">
                            <p class="type-label-lg" style="color: #65676b;">#{{ (page - 1) * pageSize + idx + 1 }}</p>
                        </td>
                        <td class="user">
                            <span class="type-label-lg" style="color: #000000; font-weight: 600;">{{ player.name }}</span>
                        </td>
                        <td class="total">
                            <p class="type-label-lg" style="color: #0070ff; font-weight: bold;">{{ localize(player.total) }}</p>
                        </td>
                    </tr>
                </table>
                <div class="pagination" style="display: flex; justify-content: space-between; margin-top: 15px;">
                    <button @click="page--" :disabled="page === 1" class="type-body" style="padding: 5px 10px; background: #f0f2f5; color: #000; border: 1px solid #ccd1d9; border-radius: 4px;">PREV</button>
                    <span class="type-body" style="color: #000;">Page {{ page }}</span>
                    <button @click="page++" :disabled="page * pageSize >= filteredLeaderboard.length" class="type-body" style="padding: 5px 10px; background: #f0f2f5; color: #000; border: 1px solid #ccd1d9; border-radius: 4px;">NEXT</button>
                </div>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail hráče -->
            <div class="player-container surface" style="flex: 1; background: #ffffff; color: #000000; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; text-align: left;">
                <div v-if="entry" class="player">
                    <h1 class="type-title player-name" style="color: #000000; margin-bottom: 15px;">{{ entry.name }}</h1>
                    <div class="player-stats-grid" style="display: flex; gap: 30px; padding-bottom: 15px; border-bottom: 1px solid #e1e4e8;">
                        <div>
                            <p class="type-body stats-label" style="color: #65676b; margin: 0;">Demonlist rank</p>
                            <h3 class="type-title" style="color: #000000; margin: 5px 0 0 0;">#{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p class="type-body stats-label" style="color: #65676b; margin: 0;">Demonlist score</p>
                            <h3 class="type-title" style="color: #0070ff; margin: 5px 0 0 0;">{{ localize(entry.total) }}</h3>
                        </div>
                    </div>
                    <div class="player-stats-grid" style="display: flex; gap: 30px; padding: 15px 0; border-bottom: 1px solid #e1e4e8;">
                        <div>
                            <p class="type-body stats-label" style="color: #65676b; margin: 0;">Demonlist stats</p>
                            <h4 class="type-body" style="color: #000000; margin: 5px 0 0 0;">{{ stats.main }} Main, {{ stats.extended }} Extended, {{ stats.legacy }} Legacy</h4>
                        </div>
                        <div>
                            <p class="type-body stats-label" style="color: #65676b; margin: 0;">Hardest demon</p>
                            <h4 class="type-body" style="color: #2bba74; margin: 5px 0 0 0;">{{ hardestDemon }}</h4>
                        </div>
                    </div>
                    
                    <h2 class="type-title" style="color: #000000; font-size: 1.4rem; margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 2px solid #0070ff;">Demons completed</h2>
                    <div v-if="sortedDemons.length === 0" class="type-body" style="color: #65676b;">None</div>
                    <div v-else style="line-height: 1.8;">
                        <template v-for="(demon, idx) in sortedDemons">
                            <span>
                                <a :href="demon.link" target="_blank" style="color: #0070ff; font-weight: 600; text-decoration: none;">{{ demon.level }}</a>
                                <span style="color: #65676b; font-size: 0.9rem;"> by {{ demon.publisher || 'player' }}</span>
                            </span>
                            <span v-if="idx < sortedDemons.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>

                    <h2 class="type-title" style="color: #000000; font-size: 1.4rem; margin: 25px 0 10px 0; padding-bottom: 5px; border-bottom: 2px solid #2bba74;">Demons verified</h2>
                    <div v-if="verifiedDemons.length === 0" class="type-body" style="color: #65676b;">None</div>
                    <div v-else style="line-height: 1.8;">
                        <template v-for="(demon, idx) in verifiedDemons">
                            <span>
                                <a :href="demon.link" target="_blank" style="color: #2bba74; font-weight: 600; text-decoration: none;">{{ demon.level }}</a>
                                <span style="color: #65676b; font-size: 0.9rem;"> by {{ demon.publisher || 'player' }}</span>
                            </span>
                            <span v-if="idx < verifiedDemons.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>

                    <h2 class="type-title" style="color: #000000; font-size: 1.4rem; margin: 25px 0 10px 0; padding-bottom: 5px; border-bottom: 2px solid #ff9000;">Progress on</h2>
                    <div v-if="!entry.progressed || entry.progressed.length === 0" class="type-body" style="color: #65676b;">None</div>
                    <div v-else style="line-height: 1.8;">
                        <template v-for="(score, idx) in entry.progressed">
                            <span>
                                <a :href="score.link" target="_blank" style="color: #ff9000; font-weight: 600; text-decoration: none;">{{ score.level }} ({{ score.percent }}%)</a>
                                <span style="color: #65676b; font-size: 0.9rem;"> by {{ score.publisher || 'player' }}</span>
                            </span>
                            <span v-if="idx < entry.progressed.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>
                </div>
                <div v-else class="player no-data"><p class="type-body" style="color: #65676b;">Select a player to view stats.</p></div>
            </div>
        </main>
    `,
    data() {
        return {
            leaderboard: [],
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
            return this.leaderboard.filter(player => player.name.toLowerCase().includes(query));
        },
        paginatedLeaderboard() {
            const start = (this.page - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredLeaderboard.slice(start, end);
        },
        entry() {
            return this.paginatedLeaderboard[this.selected];
        },
        sortedDemons() {
            if (!this.entry || !this.entry.completed) return [];
            return [...this.entry.completed].sort((a, b) => a.level.localeCompare(b.level));
        },
        verifiedDemons() {
            if (!this.entry || !this.entry.verified) return [];
            return [...this.entry.verified].sort((a, b) => a.level.localeCompare(b.level));
        },
        hardestDemon() {
            if (!this.entry || !this.entry.completed || this.entry.completed.length === 0) return 'None';
            const sortedByRank = [...this.entry.completed].sort((a, b) => a.rank - b.rank);
            return sortedByRank.length > 0 ? sortedByRank[0].level : 'None';
        },
        stats() {
            if (!this.entry) return { main: 0, extended: 0, legacy: 0 };
            return {
                main: this.entry.completed ? this.entry.completed.filter(d => d.listRank === 'Main').length : 0,
                extended: this.entry.completed ? this.entry.completed.filter(d => d.listRank === 'Extended').length : 0,
                legacy: this.entry.completed ? this.entry.completed.filter(d => d.listRank === 'Legacy').length : 0,
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
    watch: {
        search() {
            this.selected = 0;
            this.page = 1;
        },
    },
};
