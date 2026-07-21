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
                        <p style="color: #65676b; margin: 0; font-size: 1.1rem; font-weight: bold;">by {{ entry.author || 'Unknown' }}</p>
                    </div>

                    <!-- REALNÉ YOUTUBE VIDEO ZE SOUBORU LEVELŮ -->
                    <div v-if="entry.verification && entry.verification !== '#'" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; border-radius: 8px; margin-bottom: 25px;">
                        <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" :src="getEmbedUrl(entry.verification)" allowfullscreen></iframe>
                    </div>

                    <!-- TYP LISTU A BODY -->
                    <div style="display: flex; gap: 48px; justify-content: center; text-align: center; border-bottom: 1px solid #e1e4e8; padding-bottom: 20px; margin-bottom: 20px;">
                        <div>
                            <p style="color: #65676b; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">List Tier</p>
                            <h3 style="color: #2563eb; margin: 0; font-size: 1.6rem; font-weight: 800; text-transform: uppercase;">{{ entry.type || 'Main' }} list</h3>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Points</p>
                            <h3 style="color: #10b981; margin: 0; font-size: 1.6rem; font-weight: 800;">{{ entry.points }}</h3>
                        </div>
                    </div>

                    <!-- REKORDY -->
                    <h2 style="color: #000000; font-size: 1.6rem; margin: 25px 0 15px 0; font-weight: 700;">Records</h2>
                    <div v-if="!entry.records || entry.records.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="display: flex; flex-direction: column; gap: 10px;">
                        <div v-for="record in entry.records" :key="record.user" style="display: flex; justify-content: space-between; padding: 12px 15px; background: #f8f9fa; border: 1px solid #e1e4e8; border-radius: 4px; align-items: center;">
                            <div>
                                <span style="font-weight: bold; color: #000;">{{ record.user }}</span>
                                <span style="color: #65676b; margin-left: 10px;">({{ record.percent }}%)</span>
                            </div>
                            <a v-if="record.link" :href="record.link" target="_blank" style="color: #007bff; font-weight: bold; text-decoration: none;">Watch Video</a>
                        </div>
                    </div>
                </div>
                
                <div v-else style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
                    <p style="color: #65676b; font-style: italic;">Select a level to view details</p>
                </div>
            </div>


    `,
    data() {
        return {
            selected: 0,
            search: '',
            list: [
                // --- MAIN LIST ---
                { rank: 1, name: "Verity", author: "Serponge", verifier: "trumandigma", points: 200, type: "main", verification: "p15w9mb2eac", records: [] },
                { rank: 2, name: "Skeletal Shenanigans", author: "YoReid", verifier: "trumandigma", points: 195, type: "main", verification: "mgzTHUKatQo", records: [] },
                { rank: 3, name: "B", author: "MotleyOrc", verifier: "trumandigma", points: 190, type: "main", verification: "F2Y0SOVWoC4", records: [] },
                { rank: 4, name: "Deadlocked", author: "RobTop", verifier: "trumandigma", points: 180, type: "main", verification: "Uly1hr3KJPA", records: [ { user: "Earl12", percent: 79, link: "8Iryy_McSo" } ] },
                { rank: 5, name: "Theory of Everything 2", author: "RobTop", verifier: "trumandigma", points: 175, type: "main", verification: "IYI4ouUIV80", records: [] },
                { rank: 6, name: "Blackfire Backfire", author: "kira9999", verifier: "trumandigma", points: 170, type: "main", verification: "2h1fGtfap1k", records: [] },
                { rank: 7, name: "Darkstep", author: "Alex", verifier: "trumandigma", points: 165, type: "main", verification: "M7n8FchVXLA", records: [] },
                { rank: 8, name: "Unnerfed noument", author: "Stetkos", verifier: "trumandigma", points: 160, type: "main", verification: "#", records: [] },
                { rank: 9, name: "Clubstep", author: "RobTop", verifier: "trumandigma", points: 155, type: "main", verification: "Gok55hDxxg4", records: [ { user: "Earl12", percent: 100, link: "#" } ] },
                { rank: 10, name: "Speed Racer", author: "Zenthicalpha", verifier: "trumandigma", points: 150, type: "main", verification: "R8RsJVKKd8w", records: [] },
                { rank: 11, name: "Noument", author: "Earl12", verifier: "Earl12", points: 145, type: "main", verification: "w_rqtk3c1pE", records: [] },

                // --- EXTENDED LIST ---
                { rank: 12, name: "Electro Rand", author: "GmwadBoy", verifier: "Earl12", points: 140, type: "extended", verification: "H2Ya7jL9BnQ", records: [] },
                { rank: 13, name: "Maymory", author: "ItsKiba", verifier: "Earl12", points: 140, type: "extended", verification: "VIGXceGyJ_M", records: [ { user: "trumandigma", percent: 100, link: "#" } ] },
                { rank: 14, name: "Theory of Every V2", author: "Neptune", verifier: "Earl12", points: 135, type: "extended", verification: "EHHIdR7DX1E", records: [] },
                { rank: 15, name: "Clutterfunk V2", author: "Neptune", verifier: "Earl12", points: 130, type: "extended", verification: "Kkrp9G-vYEE", records: [ { user: "trumandigma", percent: 100, link: "2KE9S_FgCRs" } ] },
                { rank: 16, name: "Electroman Adventures V2", author: "Neptune", verifier: "trumandigma", points: 125, type: "extended", verification: "s4OFSZs-bec", records: [] },
                { rank: 17, name: "Electrodynamix", author: "RobTop", verifier: "trumandigma", points: 120, type: "extended", verification: "bXh5zDZb-Y", records: [] },
                { rank: 18, name: "iSpyWithMyLittleEye", author: "Voxicat", verifier: "trumandigma", points: 115, type: "extended", verification: "Qw7NDnZTDw", records: [] },
                { rank: 19, name: "Crescendo", author: "MasK463", verifier: "Earl12", points: 110, type: "extended", verification: "1SAOuFTR49Y", records: [ { user: "trumandigma", percent: 100, link: "#" } ] },
                { rank: 20, name: "m tolot", author: "Earl12", verifier: "Earl12", points: 105, type: "extended", verification: "#", records: [] },
                { rank: 21, name: "xStep V2", author: "Neptune", verifier: "Earl12", points: 100, type: "extended", verification: "k9RbBKhVMfM", records: [ { user: "trumandigma", percent: 100, link: "#" } ] },

                // --- LEGACY LIST ---
                { rank: 22, name: "Shiver", author: "SpKale", verifier: "", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 23, name: "Phjork", author: "Cerufiffy", verifier: "", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 24, name: "Demon Forest", author: "Ketis", verifier: "", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 25, name: "Demon Mixed", author: "RealOggy", verifier: "", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 26, name: "Hexagon Force", author: "RobTop", verifier: "", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 27, name: "Platinum Adventure", author: "Jerry4", verifier: "", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 28, name: "The Nightmare", author: "Jax", verifier: "", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 29, name: "The Lightning Road", author: "Timeless Real", verifier: "", points: 0, type: "legacy", verification: "", records: [] }
            ]
        };
    },
    // AUTOMATICKÝ VÝPOČET BODŮ PŘI NAČTENÍ STRÁNKY
    mounted() {
        // Vybereme pouze hlavní (main) a rozšířené (extended) úrovně z listu
        const activeLevels = this.list.filter(l => l.type === 'main' || l.type === 'extended');
        const totalActive = activeLevels.length;

        this.list.forEach(level => {
            if (level.type === 'legacy') {
                level.points = 0; // Legacy mají vždy natvrdo 0 bodů
            } else {
                const position = activeLevels.indexOf(level);
                // Vzorec pro naprosto rovnoměrné rozprostření od 200 do 100 bodů
                const calculatedPoints = totalActive > 1 
                    ? 200 - (position * (100 / (totalActive - 1))) 
                    : 200;
                
                level.points = Math.round(calculatedPoints); // Zaokrouhlíme na celá čísla
            }
        });
    },
    computed: {
        filteredList() {
            if (!this.search) {
                let displayList = [];
                let hasExtendedDivider = false;
                let hasLegacyDivider = false;

                this.list.forEach(level => {
                    if (level.type === 'extended' && !hasExtendedDivider) {
                        displayList.push({ isDivider: true, dividerText: "--- EXTENDED LIST ---" });
                        hasExtendedDivider = true;
                    }
                    if (level.type === 'legacy' && !hasLegacyDivider) {
                        displayList.push({ isDivider: true, dividerText: "--- LEGACY LIST ---" });
                        hasLegacyDivider = true;
                    }
                    displayList.push(level);
                });
                return displayList;
            }
            
            return this.list.filter(level => 
                level.name && level.name.toLowerCase().includes(this.search.toLowerCase())
            );
        },
        entry() {
            // Zajišťuje správný výběr aktivního levelu ze seznamu
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
        embed(id) {
            if (!id) return '';
            // Pokud je v ID jen obyčejný kód videa, složíme z něj perfektní odkaz s lomítkem i embedem!
            return 'https://youtube.com' + id;
        }
    }
};
