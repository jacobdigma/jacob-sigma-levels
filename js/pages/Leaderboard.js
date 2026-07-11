import { fetchLeaderboard } from '../content.js';
import { localize } from '../localize.js';

export default {
    template: `
        <main v-if="leaderboard">
            <!-- LEVÝ PANEL: Seznam hráčů -->
            <div class="sidebar">
                <input v-model="search" :placeholder="localize('Search player...')" class="search-input">
                <ol class="player-list">
                    <li v-for="(entry, idx) in filteredLeaderboard" :key="entry.name">
                        <button @click="selected = leaderboard.indexOf(entry)" :class="{ active: selected === leaderboard.indexOf(entry) }">
                            <span class="rank">#{{ leaderboard.indexOf(entry) + 1 }}</span>
                            <span class="name">{{ entry.name }}</span>
                            <span class="score">{{ entry.total.toLocaleString() }}</span>
                        </button>
                    </li>
                </ol>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail hráče ve čtvercové kartě -->
            <div style="flex: 1; padding: 25px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;">
                <div v-if="entry" style="width: 100%; max-width: 440px;">
                    
                    <div class="player-profile-card" style="width: 100%; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center; box-sizing: border-box;">
                        
                        <h1 style="color: #000000; font-size: 2.2rem; margin: 0 0 20px 0; font-weight: 800; text-align: center;">{{ entry.name }}</h1>
                        
                        <!-- Hlavní statistiky -->
                        <div style="display: flex; flex-direction: column; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid #e1e4e8;">
                            <div>
                                <p style="color: #65676b; font-size: 0.8rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Demonlist rank</p>
                                <h3 style="color: #000000; margin: 0; font-size: 1.8rem; font-weight: 700;">#{{ leaderboard.indexOf(entry) + 1 }}</h3>
                            </div>
                            <div>
                                <p style="color: #65676b; font-size: 0.8rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Demonlist score</p>
                                <h3 style="color: #000000; margin: 0; font-size: 1.8rem; font-weight: 700;">{{ entry.total.toLocaleString() }}</h3>
                            </div>
                        </div>

                        <!-- Vedlejší statistiky -->
                        <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px 0; text-align: center; border-bottom: 1px solid #e1e4e8;">
                            <div>
                                <p style="color: #65676b; font-size: 0.8rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Demonlist stats</p>
                                <h4 style="color: #000000; font-size: 1.1rem; font-weight: 700; margin: 0;">{{ entry.stats }}</h4>
                            </div>
                            <div>
                                <p style="color: #65676b; font-size: 0.8rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Hardest demon</p>
                                <h4 style="color: #2563eb; font-size: 1.25rem; font-weight: 800; margin: 0;">{{ entry.hardest }}</h4>
                            </div>
                        </div>

                        <!-- SEZNAM DÉMONŮ -->
                        <h2 style="color: #000000; font-size: 1.4rem; margin: 25px 0 15px 0; text-align: center; font-weight: 700;">Demons completed</h2>
                        <div v-if="entry.demons.length === 0" style="color: #65676b; font-style: italic; text-align: center;">None</div>
                        <div v-else style="line-height: 2; text-align: center; color: #000000; word-wrap: break-word; padding: 0 10px;">
                            <template v-for="(demon, idx) in entry.demons">
                                <span style="display: inline-block;">
                                    <a :href="demon.link" target="_blank" style="color: #000000; text-decoration: none; font-weight: 600;">{{ demon.level }}</a>
                                    <span v-if="demon.isVerified" style="color: #2bba74; font-size: 0.85rem; font-weight: bold; margin-left: 5px; background: #eafa11; padding: 2px 6px; border-radius: 4px; vertical-align: middle;">Verified</span>
                                </span>
                                <span v-if="idx < entry.demons.length - 1" style="color: #a1a1a1; margin: 0 6px;">•</span>
                            </template>
                        </div>

                        <!-- PROGRESS -->
                        <h2 style="color: #000000; font-size: 1.4rem; margin: 25px 0 15px 0; text-align: center; font-weight: 700;">Progress on</h2>
                        <div v-if="entry.progress.length === 0" style="color: #65676b; font-style: italic; text-align: center;">None</div>
                        <div v-else style="line-height: 2; text-align: center; color: #000000; word-wrap: break-word; padding: 0 10px;">
                            <template v-for="(p, idx) in entry.progress">
                                <span style="display: inline-block;">
                                    <a :href="p.link" target="_blank" style="color: #000000; text-decoration: none; font-weight: 600;">{{ p.level }} ({{ p.percent }}%)</a>
                                </span>
                                <span v-if="idx < entry.progress.length - 1" style="color: #a1a1a1; margin: 0 6px;">•</span>
                            </template>
                        </div>

                    </div>
                </div>
                <div v-else style="flex: 1; display: flex; justify-content: center; align-items: center;">
                    <p style="color: #65676b; font-style: italic;">{{ localize('Select a player to view stats') }}</p>
                </div>
            </div>
        </main>
    `,
    data() {
        return {
            selected: 0,
            search: '',
            leaderboard: null,
        };
    },
    computed: {
        entry() {
            if (!this.leaderboard || this.selected === null) return null;
            return this.leaderboard[this.selected] || null;
        },
        filteredLeaderboard() {
            if (!this.leaderboard) return [];
            return this.leaderboard.filter(entry => 
                entry.name.toLowerCase().includes(this.search.toLowerCase())
            );
        }
    },
    async mounted() {
        this.leaderboard = await fetchLeaderboard();
    },
    methods: {
        localize,
    },
};

