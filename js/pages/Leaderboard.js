import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';
import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    template: `
        <main v-if="loading">
            <Spinner />
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="board-container surface">
                <div class="search-box">
                    <input type="text" v-model="search" placeholder="Enter to search..." class="type-body">
                </div>
                <div v-if="err.length > 0" class="error-container">
                    <p class="type-body-sm">Leaderboard may be incorrect: {{ err.join(', ') }}</p>
                </div>
                <table class="board">
                    <tr v-for="(player, idx) in paginatedLeaderboard" :class="{ active: selected === idx }" @click="selected = idx">
                        <td class="rank">
                            <p class="type-label-lg">#{{ (page - 1) * pageSize + idx + 1 }}</p>
                        </td>
                        <td class="user">
                            <span class="type-label-lg">{{ player.name }}</span>
                        </td>
                        <td class="total">
                            <p class="type-label-lg">{{ localize(player.total) }}</p>
                        </td>
                    </tr>
                </table>
                <div class="pagination">
                    <button @click="page--" :disabled="page === 1" class="type-body">PREV</button>
                    <span class="type-body">Page {{ page }}</span>
                    <button @click="page++" :disabled="page * pageSize >= filteredLeaderboard.length" class="type-body">NEXT</button>
                </div>
            </div>
            <div class="player-container surface">
                <div v-if="entry" class="player">
                    <h1 class="type-title player-name">{{ entry.name }}</h1>
                    <div class="player-stats-grid">
                        <div>
                            <p class="type-body stats-label">Demonlist rank</p>
                            <h3 class="type-title">#{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p class="type-body stats-label">Demonlist score</p>
                            <h3 class="type-title">{{ localize(entry.total) }}</h3>
                        </div>
                    </div>
                    <div class="player-stats-grid">
                        <div>
                            <p class="type-body stats-label">Demonlist stats</p>
                            <h4 class="type-body">{{ stats.main }} Main, {{ stats.extended }} Extended, {{ stats.legacy }} Legacy</h4>
                        </div>
                        <div>
                            <p class="type-body stats-label">Hardest demon</p>
                            <h4 class="type-body">{{ hardestDemon }}</h4>
                        </div>
                    </div>
                    
                    <h2 class="type-title">Demons completed</h2>
                    <div v-if="sortedDemons.length === 0" class="type-body">None</div>
                    <div v-else class="demons-list-paragraph">
                        <template v-for="(demon, idx) in sortedDemons">
                            <span :class="demon.listRank.toLowerCase()"><a :href="demon.link" target="_blank">{{ demon.level }}</a></span><span v-if="idx < sortedDemons.length - 1"> - </span>
                        </template>
                    </div>

                    <h2 class="type-title">Demons verified</h2>
                    <div v-if="verifiedDemons.length === 0" class="type-body">None</div>
                    <div v-else class="demons-list-paragraph">
                        <template v-for="(demon, idx) in verifiedDemons">
                            <span :class="demon.listRank.toLowerCase()"><a :href="demon.link" target="_blank">{{ demon.level }}</a></span><span v-if="idx < verifiedDemons.length - 1"> - </span>
                        </template>
                    </div>

                    <h2 class="type-title">Progress on</h2>
                    <div v-if="!entry.progressed || entry.progressed.length === 0" class="type-body">None</div>
                    <div v-else class="demons-list-paragraph">
                        <template v-for="(score, idx) in entry.progressed">
                            <span :class="getRankLabel(score.rank).toLowerCase()"><a :href="score.link" target="_blank">{{ score.level }} ({{ score.percent }}%)</a></span><span v-if="idx < entry.progressed.length - 1"> - </span>
                        </template>
                    </div>
                </div>
                <div v-else class="player no-data"><p class="type-body">Select a player to view stats.</p></div>
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
    methods: {
        getRankLabel(rank) {
            if (rank <= 50) return 'Main';
            if (rank <= 100) return 'Extended';
            return 'Legacy';
        }
    }
};
