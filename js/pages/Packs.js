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
                    
                    <div style="margin-bottom: 20px;">
                        <span style="color: #8a8e94; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Levels in Pack</span>
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                            <!-- Odkaz směřuje na konkrétní index úrovně v hlavním listu -->
                            <router-link v-for="level in pack.levels" :key="level.name" :to="'/?level=' + level.index" style="text-decoration: none; display: block;">
                                <div style="background: #202225; padding: 8px 12px; border-radius: 6px; font-size: 0.95rem; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s;" onmouseover="this.style.background='#2f3136'" onmouseout="this.style.background='#202225'">
                                    <span style="color: #e3e5e8; font-weight: 500;">{{ level.name }}</span>
                                    <span style="color: #8a8e94; font-size: 0.8rem;">View Level</span>
                                </div>
                            </router-link>
                        </div>
                    </div>

                    <div>
                        <span style="color: #8a8e94; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Completed By</span>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
                            <span v-for="player in pack.completedBy" :key="player" style="background: #2f3136; color: #fff; padding: 4px 10px; border-radius: 15px; font-size: 0.85rem; font-weight: 500;">
                                {{ player }}
                            </span>
                            <span v-if="pack.completedBy.length === 0" style="color: #4f545c; font-size: 0.9rem; font-style: italic;">
                                None yet
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            packs: [
                {
                    name: "Sapphire Pack",
                    color: "#0070ff",
                    points: 15,
                    levels: [
                        { name: "Verity", index: 1 },    // index: 1 znamená první úroveň na vašem webu
                        { name: "B", index: 2 },         // index: 2 znamená druhou úroveň atd.
                        { name: "Deadlocked", index: 3 }
                    ],
                    completedBy: ["stetkos", "Player2"] // Sem dopíšete jména hráčů, co to kompletně dali
                },
                {
                    name: "Ruby Pack",
                    color: "#ff0000",
                    points: 25,
                    levels: [
                        { name: "Theory of Everything 2", index: 4 },
                        { name: "Blackfire Backfire", index: 5 }
                    ],
                    completedBy: ["stetkos"]
                },
                {
                    name: "Quantum Pack",
                    color: "#00ffcc",
                    points: 50,
                    levels: [
                        { name: "Speed Racer", index: 6 },
                        { name: "Clubstep", index: 7 }
                    ],
                    completedBy: []
                }
            ]
        };
    }
};

