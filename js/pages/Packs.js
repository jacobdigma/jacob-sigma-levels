import { fetchList } from '../content.js'; // Načtení hlavního seznamu pro zjištění pozic levelů

export default {
    template: `
        <div class="packs-container" style="padding: 40px 20px; max-width: 1200px; margin: 0 auto; color: white; font-family: 'Lexend Deca', sans-serif;">
            <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 10px;">Level Packs</h1>
            <p style="color: #8a8e94; margin-bottom: 40px; font-size: 1.1rem;">Complete level packs to earn bonus points for the leaderboard!</p>
            
            <!-- Načítací text, dokud se nezjistí pozice levelů -->
            <div v-if="loading" style="text-align: center; padding: 50px;">
                <h2>Loading packs and level positions...</h2>
            </div>

            <div v-else class="packs-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px;">
                <div v-for="pack in packs" :key="pack.name" class="pack-card" :style="{ borderLeft: '6px solid ' + pack.color }" style="background: #18191c; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <h2 :style="{ color: pack.color }" style="font-size: 1.6rem; font-weight: 700; margin-top: 0; margin-bottom: 15px;">{{ pack.name }}</h2>
                    
                    <div style="margin-bottom: 20px;">
                        <span style="color: #8a8e94; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Reward</span>
                        <p style="font-size: 1.3rem; font-weight: 600; color: #00ffcc; margin: 2px 0 0 0;">+{{ pack.points }} points</p>
                    </div>
                    
                    <div>
                        <span style="color: #8a8e94; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Levels in Pack</span>
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                            <div v-for="(level, i) in pack.levels" :key="i" style="background: #202225; padding: 10px 14px; border-radius: 6px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                                <!-- Dynamicky zobrazená pozice z listu -->
                                <span style="color: #8a8e94; font-weight: 600; min-width: 35px;">#{{ getLevelRank(level) }}</span>
                                <span style="color: #e3e5e8; font-weight: 500;">{{ level }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            loading: true,
            fullList: [], // Sem se uloží kompletní hlavní list úrovní
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
        // Při načtení stránky stáhneme aktuální list úrovní z webu
        const [list, err] = await fetchList();
        if (list) {
            this.fullList = list;
        }
        this.loading = false; // Vypneme načítání
    },
    methods: {
        // Pomocná metoda, která najde index levelu v hlavním seznamu a přičte 1 (aby to nezačínalo od nuly)
        getLevelRank(levelName) {
            if (!this.fullList || this.fullList.length === 0) return "?";
            const index = this.fullList.findIndex(l => l.name === levelName);
            return index !== -1 ? index + 1 : "?"; // Pokud level na listu není, ukáže otazník
        }
    }
};
