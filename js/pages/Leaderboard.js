import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },
    template: `
        <main style="background: #f0f2f5; padding: 20px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start; font-family: sans-serif; box-sizing: border-box;">
            
            <!-- LEVÝ PANEL: Seznam hráčů (MANUÁLNÍ A 100% FUNKČNÍ) -->
            <div style="background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; width: 320px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); box-sizing: border-box; flex-shrink: 0;">
                <div style="margin-bottom: 15px;">
                    <input type="text" v-model="search" placeholder="Search player..." style="width: 100%; padding: 10px; border: 1px solid #ccd1d9; border-radius: 4px; background: #fff; color: #000; font-size: 0.95rem; box-sizing: border-box;">
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr v-for="(player, idx) in filteredLeaderboard" :key="idx" @click="selected = leaderboard.indexOf(player)"
                        :style="{ cursor: 'pointer', background: leaderboard[selected] === player ? '#e6f0ff' : 'transparent', borderBottom: '1px solid #f0f0f0' }">
                        <td style="padding: 12px 8px; width: 40px; color: #65676b; font-weight: bold;">#{{ leaderboard.indexOf(player) + 1 }}</td>
                        <td style="padding: 12px 8px; text-align: left; color: #000; font-weight: 600;">{{ player.name }}</td>
                        <td style="padding: 12px 8px; text-align: right; color: #0070ff; font-weight: bold;">{{ player.total.toLocaleString() }}</td>
                    </tr>
                </table>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail hráče -->
            <div style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left; color: #000000; box-sizing: border-box;">
                <div v-if="entry">
                    <h1 style="color: #000000; font-size: 2.2rem; margin: 0 0 20px 0; font-weight: 800;">{{ entry.name }}</h1>
                    
                    <div style="display: flex; gap: 40px; padding-bottom: 20px; border-bottom: 1px solid #e1e4e8;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist rank</p>
                            <h3 style="color: #000000; margin: 0; font-size: 1.8rem; font-weight: 700;">#{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist score</p>
                            <h3 style="color: #0070ff; margin: 0; font-size: 1.8rem; font-weight: 700;">{{ entry.total.toLocaleString() }}</h3>
                        </div>
                    </div>

                    <div style="display: flex; gap: 40px; padding: 20px 0; border-bottom: 1px solid #e1e4e8;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist stats</p>
                            <h4 style="color: #000000; font-size: 1.1rem; font-weight: 600; margin: 0;">{{ entry.stats }}</h4>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Hardest demon</p>
                            <h4 style="color: #2bba74; font-size: 1.1rem; font-weight: 700; margin: 0;">{{ entry.hardest }}</h4>
                        </div>
                    </div>

                    <!-- SLOUČENÉ SEKCE COMPLETED & VERIFIED -->
                    <h2 style="color: #000000; font-size: 1.4rem; margin: 25px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #0070ff; font-weight: 700;">Demons completed & verified</h2>
                    <div v-if="entry.demons.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="line-height: 2; font-size: 1.05rem; color: #333; word-wrap: break-word;">
                        <template v-for="(demon, idx) in entry.demons">
                            <span>
                                <a :href="demon.link" target="_blank" style="color: #0070ff; font-weight: 600; text-decoration: none;">{{ demon.level }}</a> 
                                <span style="color: #65676b; font-size: 0.95rem;"> by {{ entry.name }}</span>
                                <span v-if="demon.isVerified" style="color: #2bba74; font-size: 0.85rem; font-weight: bold; margin-left: 5px; background: #eafaf1; padding: 2px 6px; border-radius: 4px;">Verified</span>
                            </span>
                            <span v-if="idx < entry.demons.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>

                    <!-- PROGRESS SEKCE -->
                    <h2 style="color: #000000; font-size: 1.4rem; margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #ff9000; font-weight: 700;">Progress on</h2>
                    <div v-if="entry.progress.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="line-height: 2; font-size: 1.05rem; color: #333; word-wrap: break-word;">
                        <template v-for="(p, idx) in entry.progress">
                            <span>
                                <a :href="p.link" target="_blank" style="color: #ff9000; font-weight: 600; text-decoration: none;">{{ p.level }} ({{ p.percent }}%)</a> 
                                <span style="color: #65676b; font-size: 0.95rem;"> by {{ entry.name }}</span>
                            </span>
                            <span v-if="idx < entry.progress.length - 1" style="color: #ccd1d9; margin: 0 8px;"> • </span>
                        </template>
                    </div>
                </div>
            </div>
        </main>
    `,
    data() {
        return {
            selected: 0,
            search: '',
            leaderboard: [
                // HRÁČ 1: trumandigma
                {
                    name: "trumandigma",
                    total: 1580.986,
                    stats: "2 Main, 1 Extended, 0 Legacy",
                    hardest: "Crescendo",
                    demons: [
                        { level: "Crescendo", link: "https://youtube.com", isVerified: false },
                        { level: "Verity", link: "https://youtube.com", isVerified: false },
                        { level: "iSpyWithMyLittleEye", link: "#", isVerified: true }
                    ],
                    progress: [
                        { level: "Blackfire", percent: 85, link: "#" }
                    ]
                },
                // HRÁČ 2: stetkos
                {
                    name: "stetkos",
                    total: 945.120,
                    stats: "1 Main, 1 Extended, 0 Legacy",
                    hardest: "Verity",
                    demons: [
                        { level: "Verity", link: "https://youtube.com", isVerified: true },
                        { level: "Crescendo", link: "https://youtube.com", isVerified: false }
                    ],
                    progress: [
                        { level: "Deadlocked", percent: 72, link: "#" }
                    ]
                }
            ]
        };
    },
    computed: {
        filteredLeaderboard() {
            if (!this.search) return this.leaderboard;
            const query = this.search.toLowerCase();
            return this.leaderboard.filter(player => player.name.toLowerCase().includes(query));
        },
        entry() {
            return this.leaderboard[this.selected] || null;
        }
    }
};
