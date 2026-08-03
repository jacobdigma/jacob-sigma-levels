import { fetchList } from '../content.js';

export default {
    template: `
        <div class="packs-container" style="padding: 40px 20px; max-width: 1200px; margin: 0 auto; color: white; font-family: 'Lexend Deca', sans-serif;">
            <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 10px;">Level Packs</h1>
            <p style="color: #8a8e94; margin-bottom: 40px; font-size: 1.1rem;">Complete level packs to earn bonus points for the leaderboard!</p>
            
            <div class="packs-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px;">
                <div v-for="pack in packs" :key="pack.name" class="pack-card" :style="{ borderLeft: '6px solid ' + pack.color }" style="background: #18191c; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <h2 :style="{ color: pack.color }" style="font-size: 1.6rem; font-weight: 700; margin-top: 0; margin-bottom: 15px;">{{ pack.name }}</h2>
                    
                    <div>
                        <span style="color: #8a8e94; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Levels in Pack</span>
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                            <div v-for="(levelName, i) in pack.levels" :key="i" style="background: #202225; padding: 10px 14px; border-radius: 6px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                                <span style="color: #8a8e94; font-weight: 600; min-width: 35px;">#{{ getLevelRank(levelName) }}</span>
                                <span style="color: #e3e5e8; font-weight: 500;">{{ levelName }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            listData: [],
            packs: [
                {
                    name: "Neptune pack 1",
                    color: "#CD7F32",
                    levels: ["xStep V2", "Clutterfunk V2", "Electroman Adventures V2"]
                },
                {
                    name: "Digma Pack",
                    color: "#C0C0C0",
                    levels: ["m tolot", "Speed Racer", "Blackfire Backfire"]
                },
                {
                    name: "Noument Pack",
                    color: "#FFD700",
                    levels: ["Noument", "Unnerfed noument", "Hellishment"]
                },
                {
                    name: "RobTop Pack",
                    color: "#0096FF",
                    levels: ["Deadlocked", "Theory of Everything 2", "Clubstep"]
                }
            ]
        };
    },
    async mounted() {
        try {
            // Správný a bezpečný import přímo uvnitř mounted, aby list nebyl undefined
            const listModule = await import('./List.js');
            if (listModule && listModule.default) {
                const mainList = listModule.default.data().list;
                
                // Přepočítáme ranky natvrdo přímo tady, ať máme absolutní jistotu
                const activeLevels = mainList.filter(l => l.name && (l.type === 'main' || l.type === 'extended'));
                let currentRank = 1;
                
                mainList.forEach(level => {
                    if (!level.name) return;
                    if (level.type === 'legacy') {
                        level.rank = 0;
                    } else {
                        level.rank = currentRank;
                        currentRank++;
                    }
                });
                
                this.listData = mainList;
            }
        } catch (e) {
            console.error("Chyba při načítání Listu v Packs:", e);
        }
    },
    methods: {
        getLevelRank(levelName) {
            if (!this.listData || this.listData.length === 0 || !levelName) {
                return "?";
            }
            
            // Najdeme level v seznamu a kompletně ignorujeme skryté mezery a velká/malá písmena
            const foundLevel = this.listData.find(l => 
                l.name && l.name.toLowerCase().trim() === levelName.toLowerCase().trim()
            );

            if (foundLevel) {
                // Pokud má level v List.js natvrdo typ 'legacy', vrátíme Legacy
                if (foundLevel.type === 'legacy') {
                    return 'Legacy';
                }
                // Pokud má rank a je to Main/Extended, vrátíme jeho pozici se znakem #
                if (foundLevel.rank) {
                    return '' + foundLevel.rank;
                }
            }

            return "Legacy";
        }
    }
};
