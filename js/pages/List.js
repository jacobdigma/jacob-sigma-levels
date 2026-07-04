import Spinner from '../components/Spinner.js';

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

            <!-- PROSTŘEDNÍ PANEL: Detail vybraného levelu -->
            <div style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left; color: #000000; box-sizing: border-box;">
                <div v-if="entry" style="text-align: center;">
                    <h1 style="color: #000000; font-size: 2.5rem; margin: 0 0 10px 0; font-weight: 800;">{{ entry.name }}</h1>
                    <p style="color: #65676b; font-size: 1.1rem; margin: 0 0 25px 0;">by <span style="font-weight: bold; color: #000;">{{ entry.author }}</span></p>
                    
                    <div style="display: flex; gap: 40px; justify-content: center; padding-bottom: 20px; border-bottom: 1px solid #e1e4e8; margin-bottom: 25px;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">List Tier</p>
                            <h3 style="color: #0070ff; margin: 0; font-size: 1.6rem; font-weight: 700; text-transform: capitalize;">{{ entry.type }} list</h3>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Points</p>
                            <h3 style="color: #2bba74; margin: 0; font-size: 1.6rem; font-weight: 700;">{{ entry.points }}</h3>
                        </div>
                    </div>
                    <p style="color: #65676b; font-style: italic;">Records and video verification would be loaded here.</p>
                </div>
                <div v-else style="color: #65676b; text-align: center; padding: 40px 0;"><p>Select a level to view details.</p></div>
            </div>
        </main>
    `,
    data() {
        return {
            selected: 0,
            search: '',
            list: [
// --- MAIN LIST (Tučné a černé) ---
                { rank: 1, name: "Verity", author: "Serponge", points: 850, type: "main" },
                { rank: 2, name: "B", author: "MotleyOrc", points: 800, type: "main" },
                { rank: 3, name: "Deadlocked", author: "RobTop", points: 750, type: "main" },
                { rank: 4, name: "Theory of Everything 2", author: "RobTop", points: 700, type: "main" },
                { rank: 5, name: "Blackfire Backfire", author: "kira9999", points: 650, type: "main" },
                { rank: 6, name: "Darkstep", author: "Alex", points: 600, type: "main" },
                { rank: 7, name: "Clubstep", author: "RobTop", points: 575, type: "main" },
                { rank: 8, name: "Speed Racer", author: "ZenthicAlpha", points: 550, type: "main" },
                { rank: 9, name: "Electrodynamix", author: "RobTop", points: 525, type: "main" },
                { rank: 9, name: "Theory of Every V2", author: "Neptune", points: 525, type: "main" },
                { rank: 10, name: "Electroman Adventures V2", author: "Neptune", points: 500, type: "main" },
                
                // --- EXTENDED LIST (Normální písmo a o něco světlejší černo/šedá) ---
                { rank: 11, name: "Clutterfunk V2", author: "Neptune", points: 300, type: "extended" },
                { rank: 12, name: "iSpyWithMyLittleEye", author: "Vidx", points: 275, type: "extended" },
                { rank: 13, name: "Crescendo", author: "Serponge", points: 250, type: "extended" },
                { rank: 14, name: "xStep V2", author: "Neptune", points: 225, type: "extended" },
                { rank: 15, name: "m tolot", author: "Stetkos", points: 200, type: "extended" },
                
                // --- LEGACY LIST (Bez čísel, nápis Legacy a text do šeda) ---
                  { rank: 16, name: "Shiver", author: "SpKale", points: 0, type: "legacy" },
                  { rank: 17, name: "Phjork", author: "Cerufiffy", points: 0, type: "legacy" },
                  { rank: 18, name: "Demon Forest", author: "Ketis", points: 0, type: "legacy" },
                  { rank: 19, name: "Demon Mixed", author: "RealOggy", points: 0, type: "legacy" },
                  { rank: 20, name: "Platinum Adventure", author: "Jerry4", points: 0, type: "legacy" },
                  { rank: 21, name: "The Nightmare", author: "Jax", points: 0, type: "legacy" },
                  { rank: 22, name: "The Lightning Road", author: "Timeless Real", points: 0, type: "legacy" }

            ]
        };
    },
    computed: {
        filteredList() {
            // Filtrování podle vyhledávání
            let result = this.list;
            if (this.search) {
                const query = this.search.toLowerCase();
                return result.filter(lvl => lvl.name.toLowerCase().includes(query));
            }

            // Pokud nevyhledáváme, sestavíme seznam s oddělovači
            let displayList = [];
            let hasExtendedDivider = false;
            let hasLegacyDivider = false;

            result.forEach((level) => {
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
            if (type === 'main') {
                return '#000000'; // Čistě černá pro Main list
            }
            if (type === 'extended') {
                return '#4b5563'; // Světlejší černo/šedá (CoolGray) pro Extended
            }
            if (type === 'legacy') {
                return '#9ca3af'; // Šedá pro Legacy list
            }
            return '#000000';
        }
    }
};
