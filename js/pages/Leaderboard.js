import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';
import Spinner from '../components/Spinner.js';

const packsConfig = [
    { name: "Neptune Pack 1", color: "#0070ff", points: 50, levels: ["xStep V2", "Clutterfunk V2", "Electroman Adventures V2"] },
    { name: "Digna Pack", color: "#ff0000", points: 75, levels: ["n tolot", "Speed Racer", "Blackfire Backfire"] },
    { name: "RobTop Pack", color: "#00ffcc", points: 100, levels: ["Deadlocked", "Theory of Everything 2", "Clubstep"] }
];

function checkPackCompletion(entry, pack) {
    if (!entry) return false;
    const playerLevels = [];
    if (entry.completed) entry.completed.forEach(s => playerLevels.push(s.level));
    if (entry.verified) entry.verified.forEach(s => playerLevels.push(s.level));
    return pack.levels.every(lvl => playerLevels.includes(lvl));
}

export default {
    components: { Spinner },
    template: `
        <main v-if="loading" style="display: flex; justify-content: center; padding: 50px; background: #fff;"><Spinner /></main>
        <main v-else class="page-leaderboard-container" style="background: #f0f2f5; padding: 20px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start;">
            
            <!-- LEVÝ PANEL -->
            <div class="board-container" style="background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; width: 300px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <div style="margin-bottom: 15px;"><input type="text" v-model="search" placeholder="Enter to search..." class="type-body" style="width: 100%; padding: 10px; border: 1px solid #ccd1d9; border-radius: 4px; color: #000;"></div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr v-for="(player, idx) in paginatedLeaderboard" :key="idx" @click="selectPlayer(idx)" :style="{ cursor: 'pointer', background: selected === idx ? '#e6f0ff' : 'transparent', borderBottom: '1px solid #f0f0f0' }">
                        <td style="padding: 12px 8px; width: 40px;"><p class="type-label-lg" style="color: #65676b; margin: 0;">#{{ (page - 1) * pageSize + idx + 1 }}</p></td>
                        <td style="padding: 12px 8px; text-align: left;"><span class="type-label-lg" style="color: #000; font-weight: 600;">{{ player.name || player.player || player }}</span></td>
                        <td style="padding: 12px 8px; text-align: right;"><p class="type-label-lg" style="color: #0070ff; font-weight: bold; margin: 0;">{{ localize(player.total || player) }}</p></td>
                    </tr>
                </table>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #f0f0f0;">
                    <button @click="prevPage" :disabled="page === 1" style="padding: 6px 12px; background: #f0f2f5; color: #000; border: 1px solid #ccd1d9; border-radius: 4px; cursor: pointer;">PREV</button>
                    <span class="type-body" style="color: #4f5d73; font-weight: 600;">Page {{ page }}</span>
                    <button @click="nextPage" :disabled="page * pageSize >= filteredLeaderboard.length" style="padding: 6px 12px; background: #f0f2f5; color: #000; border: 1px solid #ccd1d9; border-radius: 4px; cursor: pointer;">NEXT</button>
                </div>
            </div>

            <!-- PROSTŘEDNÍ PANEL -->
            <div class="player-container" style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left;">
                <div v-if="entry">
                    <h1 class="type-title" style="color: #000000; font-size: 2.2rem; margin-bottom: 20px; font-weight: 800;">{{ entry.name || entry.player || entry }}</h1>
                    <div style="display: flex; gap: 40px; padding-bottom: 20px; border-bottom: 1px solid #e1e4e8;">
                        <div><p style="color: #65676b; font-size: 0.9rem; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">Demonlist rank</p><h3 class="type-title" style="color: #000; margin: 0; font-size: 1.8rem;">#{{ leaderboard.indexOf(entry) + 1 }}</h3></div>
                        <div><p style="color: #65676b; font-size: 0.9rem; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">Demonlist score</p><h3 class="type-title" style="color: #0070ff; margin: 0; font-size: 1.8rem;">{{ localize(entry.total || entry) }}</h3></div>
                    </div>
                    <div style="display: flex; gap: 40px; padding: 20px 0; border-bottom: 1px solid #e1e4e8;">
                        <div><p style="color: #65676b; font-size: 0.9rem; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">Demonlist stats</p><h4 class="type-body" style="color: #000; font-size: 1.1rem; margin: 0;">{{ stats.main }} Main, {{ stats.extended }} Extended, {{ stats.legacy }} Legacy</h4></div>
                        <div><p style="color: #65676b; font-size: 0.9rem; margin-bottom: 5px; text-transform: uppercase; font-weight: 600;">Hardest demon</p><h4 class="type-body" style="color: #2bba74; font-size: 1.1rem; font-weight: 700; margin: 0;">{{ hardestDemon }}</h4></div>
                    </div>
                    <h2 class="type-title" style="color: #000; font-size: 1.4rem; margin: 25px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #0070ff;">Demons completed</h2>
                    <div v-if="sortedDemons.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="line-height: 2; font-size: 1.05rem; color: #333;">
                        <template v-for="(demon, idx) in sortedDemons">
                            <span><a :href="demon.link" target="_blank" style="color: #0070ff; font-weight: 600; text-decoration: none;">{{ demon.level }}</a><span style="color: #65676b; font-size: 0.9rem;"> by {{ entry.name || entry }}</span></span>
                            <span v-if="idx < sortedDemons.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>
                    <h2 class="type-title" style="color: #000; font-size: 1.4rem; margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #2bba74;">Demons verified</h2>
                    <div v-if="verifiedDemons.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="line-height: 2; font-size: 1.05rem; color: #333;">
                        <template v-for="(demon, idx) in verifiedDemons">
                            <span><a :href="demon.link" target="_blank" style="color: #2bba74; font-weight: 600; text-decoration: none;">{{ demon.level }}</a><span style="color: #65676b; font-size: 0.9rem;"> by {{ entry.name || entry }}</span></span>
                            <span v-if="idx < verifiedDemons.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>
                    <h2 class="type-title" style="color: #000; font-size: 1.4rem; margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #ff9000;">Progress on</h2>
                    <div v-if="!entry.progressed || entry.progressed.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="line-height: 2; font-size: 1.05rem; color: #333;">
                        <template v-for="(score, idx) in entry.progressed">
                            <span><a :href="score.link" target="_blank" style="color: #ff9000; font-weight: 600; text-decoration: none;">{{ score.level }} ({{ score.percent }}%)</a><span style="color: #65676b; font-size: 0.9rem;"> by {{ entry.name || entry }}</span></span>
                            <span v-if="idx < entry.progressed.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>
                </div>
                <div v-else style="color: #65676b; text-align: center; padding: 40px 0;"><p>Select a player to view stats.</p></div>
            </div>

            <!-- PRAVÝ PANEL -->
            <div class="packs-container" style="width: 260px; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left;">
                <div style="margin-bottom: 25px; border-bottom: 1px solid #e1e4e8; padding-bottom: 15px;">
                    <p style="text-align: center; color: #65676b; font-size: 0.85rem; text-transform: uppercase; font-weight: 600; margin-bottom: 10px;">Order completed demons</p>
                    <div style="background: #f0f2f5; padding: 10px; border-radius: 4px; text-align: center; color: #000; font-weight: bold; border: 1px solid #ccd1d9;">Alphabetical</div>
                </div>
                <h3 class="type-title" style="color: #000; font-size: 1.2rem; margin-bottom: 15px;">Completed Packs</h3>
                <div v-if="entry && hasAnyPack(entry)" style="display: flex; flex-direction: column; gap: 10px;">
                    <div v-for="pack in packs" :key="pack.name" v-show="hasCompletedPack(entry, pack)" :style="{ borderLeft: '4px solid ' + pack.color }" style="background: #f8f9fa; border: 1px solid #e1e4e8; padding: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold;" :style="{ color: pack.color }">{{ pack.name }}</span>
                        <span style="color: #000; font-weight: bold; font-size: 0.9rem;">+{{ pack.points }} pts</span>
                    </div>
                </div>
                <div v-else style="color: #65676b; font-style: italic;">No packs completed.</div>
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
                const name = player.name || player.player || player || '';
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
    methods: {
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
    },
};
