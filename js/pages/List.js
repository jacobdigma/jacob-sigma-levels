import Spinner from '../components/Spinner.js';
import { embed } from '../util.js';

export default {
    components: { Spinner },
            template: `
        <main style="background: #f4f2f5; padding: 20px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start; font-family: Arial, sans-serif; box-sizing: border-box;">

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
                        <!-- PROSTŘEDNÍ PANEL: Videa, tvůrci a rekordy -->
            <div style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left; color: #000000; box-sizing: border-box;">
                <div v-if="entry">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h1 style="color: #000000; font-size: 2.5rem; margin: 0 0 5px 0; font-weight: 800;">{{ entry.name }}</h1>
                        <p style="color: #65676b; margin: 0; font-size: 1.1rem; font-weight: bold;">by {{ entry.author }}</p>
                        <p v-if="entry.verifier" style="color: #16a34a; margin: 3px 0 0 0; font-size: 1rem; font-weight: 700; text-transform: lowercase; font-style: italic;">verified by {{ entry.verifier }}</p>
                    </div>

                    <!-- PŘEHRÁVAČ VIDEA -->
                    <div v-if="entry.verification && entry.verification !== '#'" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; border-radius: 8px; margin-bottom: 25px;">
                                            <!-- PŘEHRÁVAČ VIDEA POMOCÍ OBJECT (SKRIPT HO NEPŘEPIŠE) -->
                    <div v-if="entry.verification && entry.verification !== '#'" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; border-radius: 8px; margin-bottom: 25px;">
                        <object style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" :data="entry.verification.includes('youtube.com') || entry.verification.includes('youtu.be') ? entry.verification.replace('watch?v=', 'embed/').replace('youtu.be/', '://youtube.com') : 'https://www.://youtube.com' + entry.verification" type="text/html"></object>
                    </div>

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
                    <h2 style="color: #000000; font-size: 1.6rem; margin: 25px 0 15px 0; font-weight: 700;">Records {{ entry.type === 'main' && entry.minimum ? '(' + entry.minimum + '%)' : '' }}</h2>
                    <div v-if="!entry.records || entry.records.filter(r => entry.type === 'main' && entry.minimum ? parseInt(r.percent) >= entry.minimum : true).length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="display: flex; flex-direction: column; gap: 10px;">
                        <div v-for="record in (entry.type === 'main' && entry.minimum ? entry.records.filter(r => parseInt(r.percent) >= entry.minimum) : entry.records)" :key="record.user" style="display: flex; justify-content: space-between; padding: 12px 15px; background: #f8f9fa; border: 1px solid #e1e4e8; border-radius: 4px; align-items: center;">
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

        </main>
    `,
    data() {
        return {
            selected: 0,
            search: '',
            list: [
                // --- MAIN LIST ---
                
                { name: "Clubstep", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 155, type: "main", minimum: 78, verification: "https://www.youtube.com/watch?v=gok5ShDXxg4", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" } ] },
                { name: "Noument", author: "🇨🇿 Earl12", verifier: "🇨🇿 Earl12", points: 145, type: "main", minimum: 75, verification: "https://www.youtube.com/watch?v=W_rqtk3cipE", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "https://www.youtube.com/watch?v=PA_5LXPnBMc" }] },
                { name: "Electro Rand", author: "GmwadBoy", verifier: "🇨🇿 Earl12", points: 140, type: "main", verification: "https://www.youtube.com/watch?v=MZYw7jL9BnQ", records: [] },
                { name: "Clutterfunk V2", author: "Neptune", verifier: "🇨🇿 Earl12", points: 130, type: "main", verification: "https://www.youtube.com/watch?v=Kkrp9G-vYeE", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "https://www.youtube.com/watch?v=2kE93FgLRcs" } ] },
                { name: "Maymory", author: "ItsKiba", verifier: "🇨🇿 Earl12", points: 140, type: "main", verification: "https://www.youtube.com/watch?v=EKP5rGdOf_o", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "#" } ] },
                { name: "Theory of Every V2", author: "Neptune", verifier: "🇨🇿 Earl12", points: 135, type: "main", verification: "https://www.youtube.com/watch?v=d39W_TzuGLs", records: [] },
                { name: "Electroman Adventures V2", author: "Neptune", verifier: "🇻🇳 trumandigma", points: 125, type: "main", verification: "https://www.youtube.com/watch?v=-LJ3Q-pWZdo", records: [] },
                { name: "Electrodynamix", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 120, type: "main", verification: "https://www.youtube.com/watch?v=fGjDZgluC60", records: [{ user: "🇲🇾 Cylio", percent: 100, link: "#" }] },
                { name: "iSpyWithMyLittleEye", author: "Voxicat", verifier: "🇻🇳 trumandigma", points: 115, type: "main", verification: "https://www.youtube.com/watch?v=Ow7nDnZTbDw", records: [] },
                { name: "Crescendo", author: "MasK463", verifier: "🇨🇿 Earl12", points: 110, type: "main", verification: "https://www.youtube.com/watch?v=ndx5WJv-P3E", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "#" } ] },
                { name: "m tolot", author: "🇨🇿 Earl12", verifier: "🇨🇿 Earl12", points: 105, type: "main", verification: "#", records: [] },
                { name: "Insane Club", author: "5Duck", verifier: "🇨🇿 Earl12", points: 105, type: "main", verification: "#", records: [] },
                { name: "Microphone", author: "Masterthecube5", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 0, verification: "", records: [] },
                { name: "xStep V2", author: "Neptune", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "https://www.youtube.com/watch?v=K9rBb0HVvMg", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "#" } ] },
                { name: "Shiver", author: "SpKale", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "", records: [{ user: "🇻🇳 trumandigma", percent: 100, link: "#" }] },
                { name: "Phjork", author: "Cerufiffy", verifier: "🇻🇳 trumandigma", points: 0, type: "main", verification: "", records: [{ user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" }] }] },
                { name: "Demon Forest", author: "Ketis", verifier: "🇻🇳 trumandigma", points: 0, type: "main", verification: "", records: [{ user: "🇨🇿 Earl12", percent: 100, link: "#" }] },
                { name: "Demon Mixed", author: "RealOggy", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "", records: [] },
                { name: "Hexagon Force", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 0, type: "main", verification: "", records: [{ user: "🇲🇾 Cylio", percent: 100, link: "#" }] },
                { name: "Platinum Adventure", author: "Jerry4", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "", records: [{ user: "🇻🇳 trumandigma", percent: 100, link: "#" },{ user: "🇨🇿 Krystof", percent: 100, link: "#" }] },
                { name: "Blast Processing V2", author: "Neptune", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "", records: [] },
                { name: "yStep", author: "TherealDarnoc", verifier: "🇨🇿 Earl12", points: 180, type: "main", minimum: 80, verification: "https://youtu.be/xO2j6OMTiLo?si=2OkvfRSOYy08VZ1f", records: [] },
                { name: "Noobaman Adventures", author: "noobas", verifier: "🇨🇿 Earl12", points: 180, type: "main", minimum: 80, verification: "https://youtu.be/xO2j6OMTiLo?si=2OkvfRSOYy08VZ1f", records: [] },
                { name: "ice cave", author: "Ketis", verifier: "🇨🇿 Earl12", points: 180, type: "main", minimum: 0, verification: "", records: [] },
                { name: "iS", author: "Grenate", verifier: "🇻🇳 trumandigma", points: 0, type: "main", verification: "", records: [{ user: "🇲🇾 Cylio", percent: 100, link: "#" },{ user: "🇨🇿 Earl12", percent: 100, link: "#" }] },
                { name: "The Nightmare", author: "Jax", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "", records: [{ user: "🇻🇳 trumandigma", percent: 100, link: "#" }] },
                { name: "The Lightning Road", author: "Timeless Real", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "", records: [{ user: "🇻🇳 trumandigma", percent: 100, link: "#" },{ user: "🇨🇿 Thomas", percent: 100, link: "#" }] },
                { name: "Justice for Julinka", author: "🇨🇿 Earl12", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "https://www.youtube.com/watch?v=Ppe3l-HoBLs", records: [] },
                { name: "Clutterfunk", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 80, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Theory of Everything", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 80, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Dash", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 80, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇨🇿 Thomas", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Fingerdash", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 80, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Xstep", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 80, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇨🇿 Thomas", percent: 100, link: "#" },{ user: "🇨🇿 zubnikartacka", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" }] },
                { name: "Bloodbath but No", author: "Texic", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "", records: [] },
                { name: "Electroman Adventures", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 73, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇨🇿 Thomas", percent: 100, link: "#" },{ user: "🇨🇿 zubnikartacka", percent: 83, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Flappy Bird", author: "TherealDarnoc", verifier: "🇨🇿 Earl12", points: 180, type: "main", minimum: 80, verification: "", records: [] },
                { name: "Geometrical Dominator", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 80, verification: "", records: [ { user: "🇨🇿 Krystof", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Time Machine", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 80, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" }, { user: "🇲🇾 Cylio", percent: 86, link: "#" } ] },
// --- EXTENDED LIST ---
// --- LEGACY LIST ---
            ]
        };
    },
       mounted() {
        // Vyfiltrujeme POUZE reálné levely (přeskočíme případné prázdné řádky)
        const activeLevels = this.list.filter(l => l.name && (l.type === 'main' || l.type === 'extended'));
        const totalActive = activeLevels.length;

        let currentRank = 1;

        this.list.forEach(level => {
            // Pokud řádek nemá jméno, přeskočíme ho
            if (!level.name) return;

            if (level.type === 'legacy') {
                level.points = 0;
                level.rank = 0; // Legacy levely nemají číselnou pozici
            } else {
                // AUTOMATICKÝ RANK: Kód sám přiřadí aktuální číslo pozice
                level.rank = currentRank;
                currentRank++;

                // AUTOMATICKÝ VÝPOČET BODŮ (Férové plynulé bodování)
                const position = activeLevels.indexOf(level);
                const calculatedPoints = totalActive > 1 
                    ? 200 - (position * (100 / (totalActive - 1))) 
                    : 200;
                level.points = Math.round(calculatedPoints);
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
            return this.list[this.selected] || null;
        }
    },
    methods: {
                embed(url) {
            if (!url || url === '#') return '';
            
            // Pokud už odkaz obsahuje správnou embed strukturu, rovnou ho pustíme dál
            if (url.includes('/embed/')) return url;
            
            // Pojistka pro případ, že odkaz obsahuje watch?v= (včetně variant bez https)
            if (url.includes('watch?v=')) {
                const parts = url.split('watch?v=')[1];
                const id = parts.split('&')[0];
                return 'https://youtube.com' + id;
            }
            
            // Pojistka pro případ, že odkaz obsahuje youtu.be/ (včetně variant bez https)
            if (url.includes('youtu.be/')) {
                const parts = url.split('youtu.be/')[1];
                const id = parts.split('?')[0];
                return 'https://youtube.com' + id;
            }
            
            // Pokud v datech zůstalo jen samotné čisté ID, složíme ho natvrdo
           return 'https://youtube.com' + url.trim();
        },

        getListTextColor(type) {
            if (type === 'main') return '#000000';
            if (type === 'extended') return '#4b5563';
            if (type === 'legacy') return '#9ca3af';
            return '#000000';
        }
    }
};
