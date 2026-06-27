import { fetchList } from '../content.js';

export default {
    template: `
        <div class="packs-container" style="padding: 40px 20px; max-width: 1200px; margin: 0 auto; color: white; font-family: 'Lexend Deca', sans-serif;">
            <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 10px;">Level Packs</h1>
            <p style="color: #8a8e94; margin-bottom: 40px; font-size: 1.1rem;">Complete level packs to earn bonus points for the leaderboard!</p>
            
            <div class="packs-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px;">
                <div v-for="pack in packs" :key="pack.name" class="pack-card" :style="{ borderLeft: '6px solid ' + pack.color }" style="background: #18191c; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <h2 :style="{ color: pack.color }" style="font-size: 1.6rem; font-weight: 700; margin-top: 0; margin-bottom: 15px;">{{ pack.name }}</h2>
                    
                    <div style="margin-bottom: 20px;">
                        <span style="color: #8a8e94; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Reward</span>
                        <p style="font-size: 1.3rem; font-weight: 600; color: #00ffcc; margin: 2px 0 0 0;">+{{ pack.points }} points</p>
                    </div>
                    
                    <div>
                        <span style="color: #8a8e94; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Levels in Pack</span>
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                            <div v-for="(levelName, i) in pack.levels" :key="i" style="background: #202225; padding: 10px 14px; border-radius: 6px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                                <!-- Spočítá a zobrazí pozici automaticky -->
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
            listData: [], // Sem bezpečně uložíme načtené úrovně
            packs: [
                {
                    name: "Neptune Pack 1",
                    color: "#0070ff",
                    points: 50,
                    levels: ["xStep V2", "Clutterfunk V2", "Electroman Adventures V2"]
                },
                {
                    name: "Digma Pack",
                    color: "#ff0000",
                    points: 75,
                    levels: ["m tolot", "Speed Racer", "Blackfire Backfire"]
                },
                {
                    name: "RobTop Pack",
                    color: "#00ffcc",
                    points: 100,
                    levels: ["Deadlocked", "Theory of Everything 2", "Clubstep"]
                }
            ]
        };
    },
    async mounted() {
        try {
            // Správné ošetření asynchronního požadavku z content.js
            const res = await fetchList();
            if (Array.isArray(res)) {
                this.listData = res;
            } else if (res && Array.isArray(res[0])) {
                this.listData = res[0];
            }
        } catch (e) {
            console.error("Nepodařilo se automaticky načíst pozice úrovní:", e);
        }
    },
    methods: {
        // Funkce se podívá do listData a zjistí přesný index úrovně podle jména
        getLevelRank(levelName) {
            if (!this.listData || this.listData.length === 0) return "...";
            
            // Vyhledá shodu jména úrovně (ignoruje mezery na začátku/konci)
            const index = this.listData.findIndex(l => l.level && l.level.toLowerCase().trim() === levelName.toLowerCase().trim());
            
            // Pokud najde, vrátí pozici (index + 1), jinak vrátí otazník
            return index !== -1 ? index + 1 : "?";
        }
    }
};
