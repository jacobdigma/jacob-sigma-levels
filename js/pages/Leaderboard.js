import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },
    template: `
        <main style="background: #f0f2f5; padding: 20px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start; font-family: Arial, sans-serif; box-sizing: border-box;">
            
            <!-- LEVÝ PANEL: Seznam hráčů -->
            <div style="background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; width: 320px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); box-sizing: border-box; flex-shrink: 0;">
                <div style="margin-bottom: 15px;">
                    <input type="text" v-model="search" placeholder="Search player..." style="width: 100%; padding: 10px; border: 1px solid #ccd1d9; border-radius: 4px; background: #fff; color: #000; font-size: 0.95rem; box-sizing: border-box;">
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr v-for="(player, idx) in filteredLeaderboard" :key="idx" @click="selected = leaderboard.indexOf(player)"
                        :style="{ cursor: 'pointer', background: leaderboard[selected] === player ? '#e6f0ff' : 'transparent', borderBottom: '1px solid #f0f0f0' }">
                        <td style="padding: 12px 8px; width: 40px; color: #65676b; font-weight: bold;">#{{ leaderboard.indexOf(player) + 1 }}</td>
                        <td style="padding: 12px 8px; text-align: left; color: #000000; font-weight: 600;">{{ player.name }}</td>
                        <td style="padding: 12px 8px; text-align: right; color: #0070ff; font-weight: bold;">{{ player.total.toLocaleString() }}</td>
                    </tr>
                </table>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail hráče -->
            <div style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left; color: #000000; box-sizing: border-box;">
                <div v-if="entry">
                    <h1 style="color: #000000; font-size: 2.2rem; margin: 0 0 20px 0; font-weight: 800; text-align: center;">{{ entry.name }}</h1>
                    
                    <div style="display: flex; gap: 40px; padding-bottom: 20px; border-bottom: 1px solid #e1e4e8; justify-content: center; text-align: center;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist rank</p>
                            <h3 style="color: #000000; margin: 0; font-size: 1.8rem; font-weight: 700;">{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist score</p>
                            <h3 style="color: #000000; margin: 0; font-size: 1.8rem; font-weight: 700;">{{ entry.total.toLocaleString() }}</h3>
                        </div>
                    </div>

                    <div style="display: flex; gap: 40px; padding: 20px 0; border-bottom: 1px solid #e1e4e8; justify-content: center; text-align: center;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist stats</p>
                            <h4 style="color: #000000; font-size: 1.1rem; font-weight: 600; margin: 0;">{{ entry.stats }}</h4>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Hardest demon</p>
                            <h4 style="color: #000000; font-size: 1.1rem; font-weight: 700; margin: 0;">{{ entry.hardest }}</h4>
                        </div>
                    </div>

                    <!-- SLOUČENÉ SEKCE COMPLETED & VERIFIED PODLE FOTKY -->
                    <h2 style="color: #000000; font-size: 1.6rem; margin: 25px 0 15px 0; text-align: center; font-weight: 700;">Demons completed</h2>
                    <div v-if="entry.demons.length === 0" style="color: #65676b; font-style: italic; text-align: center;">None</div>
                    <div v-else style="line-height: 2.2; text-align: center; color: #000000; word-wrap: break-word; padding: 0 10px;">
                        <template v-for="(demon, idx) in entry.demons">
                            <span style="display: inline-block;">
                                <a :href="demon.link" target="_blank" :style="getLevelStyle(demon.type)">{{ demon.level }}</a> 
                                <span v-if="demon.isVerified" style="color: #2bba74; font-size: 0.85rem; font-weight: bold; margin-left: 5px; background: #eafaf1; padding: 2px 6px; border-radius: 4px; vertical-align: middle;">Verified</span>
                            </span>
                            <span v-if="idx < entry.demons.length - 1" style="color: #333; margin: 0 6px;"> - </span>
                        </template>
                    </div>

                    <!-- PROGRESS SEKCE -->
                    <h2 style="color: #000000; font-size: 1.6rem; margin: 35px 0 15px 0; text-align: center; font-weight: 700;">Progress on</h2>
                    <div v-if="entry.progress.length === 0" style="color: #65676b; font-style: italic; text-align: center;">None</div>
                    <div v-else style="line-height: 2.2; text-align: center; color: #000000; word-wrap: break-word; padding: 0 10px;">
                        <template v-for="(p, idx) in entry.progress">
                            <span style="display: inline-block;">
                                <a :href="p.link" target="_blank" :style="getLevelStyle(p.type)">{{ p.level }} ({{ p.percent }}%)</a> 
                            </span>
                            <span v-if="idx < entry.progress.length - 1" style="color: #333; margin: 0 6px;"> - </span>
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
                    total: 2130,
                    stats: "8 Main, 6 Extended, 6 Legacy",
                    hardest: "Verity",
                    demons: [
                        { level: "B", link: "#", type: "main", isVerified: false },
                        { level: "Blackfire Backfire", link: "#", type: "main", isVerified: false },
                        { level: "Clubstep", link: "#", type: "main", isVerified: false },
                        { level: "Clutterfunk V2", link: "#", type: "extended", isVerified: false },
                        { level: "Crescendo", link: "#", type: "extended", isVerified: false },
                        { level: "Darkstep", link: "#", type: "main", isVerified: false },
                        { level: "Deadlocked", link: "#", type: "main", isVerified: false },
                        { level: "Demon Forest", link: "#", type: "legacy", isVerified: false },
                        { level: "Electrodynamix", link: "#", type: "extended", isVerified: false },
                        { level: "Electroman Adventures V2", link: "#", type: "extended", isVerified: false },
                        { level: "iSpyWithMyLittleEye", link: "#", type: "extended", isVerified: false },
                        { level: "Phjork", link: "#", type: "legacy", isVerified: false },
                        { level: "Platinum Adventure", link: "#", type: "legacy", isVerified: false },
                        { level: "Shiver", link: "#", type: "legacy", isVerified: false },
                        { level: "Speed Racer", link: "#", type: "main", isVerified: false },
                        { level: "Theory of Everything 2", link: "#", type: "main", isVerified: false },
                        { level: "The Lightning Road", link: "#", type: "legacy", isVerified: false },
                        { level: "The Nightmare", link: "#", type: "legacy", isVerified: false },
                        { level: "Verity ", link: "#", type: "main", isVerified: false },
                        { level: "xStep V2 ", link: "#", type: "extended", isVerified: false }
                    ],
                    progress: [
                        
                    ]
                },
                // HRÁČ 2: stetkos
                {
                    name: "stetkos",
                    total: 1825,
                    stats: "2 Main, 5 Extended, 7 Legacy",
                    hardest: "nouement",
                    demons: [
                        { level: "Clutterfunk V2", link: "#", type: "extended", isVerified: false },
                        { level: "Crescendo", link: "#", type: "extended", isVerified: false },
                        { level: "Demon Forest", link: "#", type: "legacy", isVerified: false },
                        { level: "Demon Mixed", link: "#", type: "legacy", isVerified: false },
                        { level: "m tolot", link: "#", type: "extended", isVerified: false },
                        { level: "Maymory", link: "#", type: "main", isVerified: false },
                        { level: "nouement", link: "#", type: "main", isVerified: false },
                        { level: "Phjork", link: "#", type: "legacy", isVerified: false },
                        { level: "Platinum Adventure", link: "#", type: "legacy", isVerified: false },
                        { level: "Shiver", link: "#", type: "legacy", isVerified: false },
                        { level: "The Lightning Road", link: "#", type: "legacy", isVerified: false },
                        { level: "The Nightmare", link: "#", type: "legacy", isVerified: false },
                        { level: "Theory of Every V2", link: "#", type: "extended", isVerified: false },
                        { level: "xStep V2", link: "#", type: "extended", isVerified: false }
                        
                    ],
                    progress: [
                        { level: "Deadlocked", percent: 79, link: "#", type: "extended" }
                    ]
                },
                 {
                    name: "Krystof",
                    total: 0,
                    stats: "0 Main, 0 Extended, 1 Legacy",
                    hardest: "Platinum Adventure",
                    demons: [

                        { level: "Platinum Adventure", link: "#", type: "legacy", isVerified: false }
                        
                    ],
                    progress: [
                        
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
    },
    methods: {
        getLevelStyle(type) {
            if (type === 'main') {
                return { 
                    color: '#000000', 
                    fontWeight: 'bold', 
                    fontSize: '1.15rem', 
                    textDecoration: 'none' 
                };
            }
            if (type === 'legacy') {
                return { 
                    color: '#9ba3af', 
                    fontWeight: 'normal', 
                    fontSize: '0.9rem', 
                    fontStyle: 'italic', 
                    textDecoration: 'none' 
                };
            }
            // default extended (normal velikost, normal tloušťka, černý)
            return { 
                color: '#000000', 
                fontWeight: 'normal', 
                fontSize: '1rem', 
                textDecoration: 'none' 
            };
        }
    }
};

