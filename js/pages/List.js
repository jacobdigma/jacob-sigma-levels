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
                { name: "Verity", author: "Serponge", verifier: "trumandigma", points: 200, type: "main", minimum: 73, verification: "https://www.youtube.com/watch?v=dmD8T5zht7A", records: [{ user: "Earl12", percent: 100, link: "https://www.youtube.com/watch?v=2wWEXqaOIjQ" }] },
                { name: "Skeletal Shenanigans", author: "YoReid", verifier: "trumandigma", points: 195, type: "main", minimum: 64, verification: "https://www.youtube.com/watch?v=kO205r4sZKM", records: [] },
                { name: "Sirius", author: "FunnyGame", verifier: "trumandigma", points: 190, type: "main", minimum: 73, verification: "https://www.youtube.com/watch?v=6AxuV3e_6E4", records: [] },
                { name: "B", author: "MotleyOrc", verifier: "trumandigma", points: 190, type: "main", minimum: 61, verification: "https://www.youtube.com/watch?v=sjmc5HaGrYc", records: [] },
                { name: "Deadlocked", author: "RobTop", verifier: "trumandigma", points: 180, type: "main", minimum: 72, verification: "https://www.youtube.com/watch?v=reZj2Xbt05Q", records: [ { user: "Earl12", percent: 100, link: "#" } ] },
                { name: "Hellishment", author: "Earl12", verifier: "Earl12", points: 145, type: "main", minimum: 81, verification: "https://www.youtube.com/watch?v=8RJstOZvoUQ", records: [{ user: "trumandigma", percent: 87, link: "#" }] },
                { name: "Theory of Everything 2", author: "RobTop", verifier: "trumandigma", points: 175, type: "main", minimum: 72, verification: "https://www.youtube.com/watch?v=medoq_Znhaw", records: [{ user: "Earl12", percent: 100, link: "#" }] },
                { name: "Blackfire Backfire", author: "kira9999", verifier: "trumandigma", points: 170, type: "main", minimum: 69, verification: "https://www.youtube.com/watch?v=2h1FgtfaP1k", records: [] },
                { name: "Darkstep", author: "Alex", verifier: "trumandigma", points: 165, type: "main", minimum: 70, verification: "https://www.youtube.com/watch?v=6cFZYLraEJs", records: [] },
                { name: "Speed Racer", author: "Zenthicalpha", verifier: "trumandigma", points: 150, type: "main", minimum: 71, verification: "https://www.youtube.com/watch?v=R8RsJVKKd8w", records: [{ user: "Earl12", percent: 73, link: "#" }] },
                { name: "IceStream", author: "DarnocBlue", verifier: "Earl12", points: 160, type: "main", minimum: 74, verification: "https://www.youtube.com/watch?v=2pSl4YVCILc", records: [] },
                { name: "Unnerfed noument", author: "Earl12", verifier: "trumandigma", points: 160, type: "main", minimum: 75, verification: "#", records: [{ user: "Earl12", percent: 78, link: "" }] },
                // --- EXTENDED LIST ---
                { name: "Clubstep", author: "RobTop", verifier: "trumandigma", points: 155, type: "extended", minimum: 78, verification: "https://www.youtube.com/watch?v=gok5ShDXxg4", records: [ { user: "Earl12", percent: 100, link: "#" } ] },
                { rank: 13, name: "Noument", author: "Earl12", verifier: "Earl12", points: 145, type: "extended", minimum: 75, verification: "https://www.youtube.com/watch?v=W_rqtk3cipE", records: [ { user: "trumandigma", percent: 100, link: "#" } ] },
                { rank: 14, name: "Electro Rand", author: "GmwadBoy", verifier: "Earl12", points: 140, type: "extended", verification: "https://www.youtube.com/watch?v=MZYw7jL9BnQ", records: [] },
                { rank: 15, name: "Clutterfunk V2", author: "Neptune", verifier: "Earl12", points: 130, type: "extended", verification: "https://www.youtube.com/watch?v=Kkrp9G-vYeE", records: [ { user: "trumandigma", percent: 100, link: "https://www.youtube.com/watch?v=2kE93FgLRcs" } ] },
                { rank: 16, name: "Maymory", author: "ItsKiba", verifier: "Earl12", points: 140, type: "extended", verification: "https://www.youtube.com/watch?v=EKP5rGdOf_o", records: [ { user: "trumandigma", percent: 100, link: "#" } ] },
                { rank: 17, name: "Theory of Every V2", author: "Neptune", verifier: "Earl12", points: 135, type: "extended", verification: "https://www.youtube.com/watch?v=d39W_TzuGLs", records: [] },
                { rank: 18, name: "Electroman Adventures V2", author: "Neptune", verifier: "trumandigma", points: 125, type: "extended", verification: "https://www.youtube.com/watch?v=-LJ3Q-pWZdo", records: [] },
                { rank: 19, name: "Electrodynamix", author: "RobTop", verifier: "trumandigma", points: 120, type: "extended", verification: "https://www.youtube.com/watch?v=fGjDZgluC60", records: [] },
                { rank: 20, name: "iSpyWithMyLittleEye", author: "Voxicat", verifier: "trumandigma", points: 115, type: "extended", verification: "https://www.youtube.com/watch?v=Ow7nDnZTbDw", records: [] },
                { rank: 21, name: "Crescendo", author: "MasK463", verifier: "Earl12", points: 110, type: "extended", verification: "https://www.youtube.com/watch?v=ndx5WJv-P3E", records: [ { user: "trumandigma", percent: 100, link: "#" } ] },
                { rank: 22, name: "m tolot", author: "Earl12", verifier: "Earl12", points: 105, type: "extended", verification: "#", records: [] },
                { rank: 23, name: "Insane Club", author: "5Duck", verifier: "Earl12", points: 105, type: "extended", verification: "#", records: [] },

                // --- LEGACY LIST ---
                { rank: 24, name: "xStep V2", author: "Neptune", verifier: "Earl12", points: 0, type: "legacy", verification: "https://www.youtube.com/watch?v=K9rBb0HVvMg", records: [ { user: "trumandigma", percent: 100, link: "#" } ] },
                { rank: 25, name: "Shiver", author: "SpKale", verifier: "Earl12", points: 0, type: "legacy", verification: "", records: [{ user: "trumandigma", percent: 100, link: "#" }] },
                { rank: 26, name: "Phjork", author: "Cerufiffy", verifier: "trumandigma", points: 0, type: "legacy", verification: "", records: [{ user: "Earl12", percent: 100, link: "#" }] },
                { rank: 27, name: "Demon Forest", author: "Ketis", verifier: "trumandigma", points: 0, type: "legacy", verification: "", records: [{ user: "Earl12", percent: 100, link: "#" }] },
                { rank: 28, name: "Demon Mixed", author: "RealOggy", verifier: "Earl12", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 29, name: "Hexagon Force", author: "RobTop", verifier: "trumandigma", points: 0, type: "legacy", verification: "", records: [] },
                { rank: 30, name: "Platinum Adventure", author: "Jerry4", verifier: "Earl12", points: 0, type: "legacy", verification: "", records: [{ user: "trumandigma", percent: 100, link: "#" },{ user: "Krystof", percent: 100, link: "#" }] },
                { rank: 31, name: "The Nightmare", author: "Jax", verifier: "Earl12", points: 0, type: "legacy", verification: "", records: [{ user: "trumandigma", percent: 100, link: "#" }] },
                { rank: 32, name: "The Lightning Road", author: "Timeless Real", verifier: "Earl12", points: 0, type: "legacy", verification: "", records: [{ user: "trumandigma", percent: 100, link: "#" }] }
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

