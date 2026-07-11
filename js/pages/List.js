import Spinner from '../components/Spinner.js';
import { embed } from '../util.js';

export default {
    components: { Spinner },
    template: `
        <main style="background: #f0f2f5; padding: 20px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start; font-family: Arial, sans-serif; box-sizing: border-box;">
            
            <!-- LEVÝ PANEL: Kompletně předělaný seznam úrovní -->
            <div style="background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; width: 340px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); box-sizing: border-box; flex-shrink: 0; text-align: left;">
                <div style="margin-bottom: 15px;">
                    <input type="text" v-model="search" placeholder="Search level..." style="width: 100%; padding: 10px; border: 1px solid #ccd1d9; border-radius: 4px; background: #fff; color: #000; font-size: 0.95rem; box-sizing: border-box;">
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <template v-for="(level, idx) in filteredList" :key="idx">
                        
                        <!-- ODSTAVEC: -- EXTENDED LIST -- -->
                        <div v-if="level.isDivider" style="text-align: center; color: #9ba3af; font-weight: bold; font-size: 0.85rem; padding: 15px 0 10px 0; letter-spacing: 1px; border-bottom: 1px dashed #e1e4e8; margin-bottom: 5px;">
                            {{ level.dividerText }}
                        </div>

                        <!-- KLASICKÝ ŘÁDEK LEVELU (Když to není dělicí čára) -->
                        <div v-else @click="selected = list.indexOf(level)"
                            :style="{ 
                                cursor: 'pointer', 
                                background: list[selected] === level ? '#0070ff' : 'transparent',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px 12px',
                                transition: 'background 0.2s'
                            }">
                            
                            <!-- ČÍSLOVÁNÍ: Buď #číslo, nebo text "Legacy" -->
                            <span :style="{ 
                                width: level.type === 'legacy' ? '65px' : '45px', 
                                fontWeight: 'bold', 
                                color: list[selected] === level ? '#ffffff' : '#65676b',
                                fontSize: level.type === 'legacy' ? '0.85rem' : '1rem'
                            }">
                                {{ level.type === 'legacy' ? 'Legacy' : '#' + level.rank }}
                            </span>

                            <!-- NÁZEV LEVELU SE SPECIFICKOU BARVOU PODLE TYPU -->
                            <span :style="{ 
                                fontWeight: level.type === 'main' ? 'bold' : 'normal', 
                                color: list[selected] === level ? '#ffffff' : getListTextColor(level.type),
                                fontSize: '1rem',
                                flex: 1
                            }">
                                {{ level.name }}
                            </span>
                        </div>

                    </template>
                </div>
            </div>

                       <!-- PROSTŘEDNÍ PANEL: Opravený pro dynamická videa a rekordy -->
            <div style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left; color: #000000; box-sizing: border-box;">
                <div v-if="entry">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h1 style="color: #000000; font-size: 2.5rem; margin: 0 0 5px 0; font-weight: 800;">{{ entry.name }}</h1>
                        <p style="color: #65676b; font-size: 1.1rem; margin: 0;">by <span style="font-weight: bold; color: #000;">{{ entry.author || 'Unknown' }}</span></p>
                    </div>

                    <!-- REÁLNÉ YOUTUBE VIDEO ZE SOUBORU LEVELU -->
                    <div v-if="entry.verification" style="width: 100%; max-width: 800px; margin: 0 auto 25px auto; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                       <iframe style="width: 100%; height: 100%; border: none;" :src="getEmbedUrl(entry.verification)" allowfullscreen></iframe>

                    </div>

                    <div style="display: flex; gap: 40px; justify-content: center; padding: 20px 0; border-top: 1px solid #e1e4e8; border-bottom: 1px solid #e1e4e8; margin-bottom: 25px; text-align: center;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">List Tier</p>
                            <h3 style="color: #0070ff; margin: 0; font-size: 1.5rem; font-weight: 700; text-transform: uppercase;">{{ entry.type || 'Main' }} list</h3>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Points</p>
                            <h3 style="color: #2bba74; margin: 0; font-size: 1.5rem; font-weight: 700;">{{ entry.points }}</h3>
                        </div>
                    </div>

                    <!-- REÁLNÉ REKORDY HRÁČŮ Z POLÍČKA RECORDS -->
                    <h2 style="color: #000000; font-size: 1.4rem; margin: 25px 0 15px 0; font-weight: 700; border-bottom: 2px solid #0070ff; padding-bottom: 5px;">Records</h2>
                    <div v-if="!entry.records || entry.records.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="display: flex; flex-direction: column; gap: 10px;">
                        <div v-for="record in entry.records" style="background: #f8f9fa; border: 1px solid #e1e4e8; padding: 12px 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="font-weight: bold; color: #000;">{{ record.user }}</span>
                                <span style="color: #65676b; margin-left: 10px;">{{ record.percent }}%</span>
                            </div>
                            <a v-if="record.link" :href="record.link" target="_blank" style="color: #0070ff; font-weight: bold; text-decoration: none;">Watch Video</a>
                        </div>
                    </div>
                </div>
                <div v-else style="color: #65676b; text-align: center; padding: 40px 0;"><p>Select a level to view details.</p></div>
            </div>

    `,
    data() {
        return {
            selected: 0,
            search: '',
            list: [
                // --- MAIN LIST (Tučné a černé) ---
                { rank: 1, name: "Verity", author: "Serponge", points: 850, type: "main", verification: "https://www.youtube.com/watch?v=p15w9MB2eAc", records: [] },
                { rank: 2, name: "B", author: "MotleyOrc", points: 800, type: "main", verification: "https://www.youtube.com/watch?v=F2Y05OVWOc4", records: [] },
                { rank: 3, name: "Deadlocked", author: "RobTop", points: 750, type: "main", verification: "https://www.youtube.com/watch?v=Ulylhr3KJPA", records: [{ user: "Stetkos", percent: 79, link: "https://www.youtube.com/watch?v=81Iryy_Wc5o" }] },
                { rank: 4, name: "Theory of Everything 2", author: "RobTop", points: 700, type: "main", verification: "https://www.youtube.com/watch?v=1YI4oUUiV80", records: [] },
                { rank: 5, name: "Blackfire Backfire", author: "kira9999", points: 650, type: "main", verification: "https://www.youtube.com/watch?v=2h1FgtfaP1k", records: [] },
                { rank: 6, name: "Darkstep", author: "Alex", points: 600, type: "main", verification: "https://www.youtube.com/watch?v=M7h8FchVXLA", records: [] },
                { rank: 7, name: "Clubstep", author: "RobTop", points: 575, type: "main", verification: "https://www.youtube.com/watch?v=gok5ShDXxg4", records: [] },
                { rank: 8, name: "Speed Racer", author: "ZenthicAlpha", points: 550, type: "main", verification: "https://www.youtube.com/watch?v=R8RsJVKKd8w", records: [] },
                { rank: 9, name: "Electrodynamix", author: "RobTop", points: 525, type: "main", verification: "https://www.youtube.com/watch?v=bXH5zDZtb-Y", records: [] },
                { rank: 10, name: "Theory of Every V2", author: "Neptune", points: 525, type: "main", verification: "https://www.youtube.com/watch?v=EnHHIR7DX1E", records: [] },

                // --- EXTENDED LIST (Normální písmo a o něco světlejší černo/šedá) ---
                { rank: 11, name: "Electroman Adventures V2", author: "Neptune", points: 500, type: "extended", verification: "https://www.youtube.com/watch?v=s40FsZS-bec", records: [] },
                { rank: 12, name: "Clutterfunk V2", author: "Neptune", points: 475, type: "extended", verification: "https://www.youtube.com/watch?v=Kkrp9G-vYeE", records: [{ user: "trumandigma", percent: 100, link: "https://www.youtube.com/watch?v=2kE93FgLRcs" }] },
                { rank: 13, name: "iSpyWithMyLittleEye", author: "Voxicat", points: 450, type: "extended", verification: "https://www.youtube.com/watch?v=Ow7nDnZTbDw", records: [] },
                { rank: 14, name: "Crescendo", author: "Serponge", points: 350, type: "extended", verification: "https://www.youtube.com/watch?v=JSAoUfTR49Y", records: [{ user: "trumandigma", percent: 100, link: "#" }] },
                { rank: 15, name: "xStep V2", author: "Neptune", points: 250, type: "extended", verification: "https://www.youtube.com/watch?v=K9rBb0HVvMg", records: [{ user: "trumandigma", percent: 100, link: "#" }] },
                { rank: 16, name: "m tolot", author: "Stetkos", points: 150, type: "extended", verification: "#", records: [] },

                // --- LEGACY LIST (Bez čísel, nápis Legacy a text do šeda) ---
                { rank: 17, name: "Shiver", author: "SpKale", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 18, name: "Phjork", author: "Cerufiffy", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 19, name: "Demon Forest", author: "Ketis", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 20, name: "Demon Mixed", author: "RealOggy", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 21, name: "Platinum Adventure", author: "Jerry4", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 22, name: "The Nightmare", author: "Jax", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 23, name: "The Lightning Road", author: "Timeless Real", points: 0, type: "legacy", verification: "", records: [] }
            ]
        };
    },
        computed: {
        filteredList() {
            if (this.search) {
                const query = this.search.toLowerCase();
                return this.list.filter(lvl => lvl.name.toLowerCase().includes(query));
            }

            let displayList = [];
            let hasExtendedDivider = false;
            let hasLegacyDivider = false;

            this.list.forEach((level) => {
                if (level.type === 'extended' && !hasExtendedDivider) {
                    displayList.push({ isDivider: true, dividerText: "-- EXTENDED LIST --" });
                    hasExtendedDivider = true;
                }
                if (level.type === 'legacy' && !hasLegacyDivider) {
                    displayList.push({ isDivider: true, dividerText: "-- LEGACY LIST --" });
                    hasLegacyDivider = true;
                }
                displayList.push(level);
            });

            return displayList;
        },
        entry() {
            return this.list[this.selected] || null;
        }
    },
    methods: {
        getListTextColor(type) {
            if (type === 'main') return '#000000';
            if (type === 'extended') return '#4b5563';
            if (type === 'legacy') return '#9ca3af';
            return '#000000';
        },
                getEmbedUrl(url) {
            if (!url) return '';
            
            if (url.includes('/embed/')) {
                return url;
            }
            
            let videoId = '';
            try {
                if (url.includes('youtube.com')) {
                    // Tady jsou tvé správné indexy [1] a, které z odkazu vystřihnou čisté ID videa
                    videoId = url.split('v=')[1].split('&')[0];
                } else if (url.includes('youtu.be/')) {
                    videoId = url.split('youtu.be/')[1].split('?')[0];
                }
            } catch (e) {
                console.error(e);
                return url;
            }
            
            // Tímto správně složíme embed odkaz, který Firefox bezpečně povolí a přehraje
            return videoId ? 'https://youtube.com' + videoId : url;
        }
    }
};
