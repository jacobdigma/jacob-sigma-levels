export default {
    template: `
        <div class="packs-container" style="padding: 40px 20px; max-width: 1200px; margin: 0 auto; color: white; font-family: 'Lexend Deca', sans-serif;">
            <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 10px;">Level Packs</h1>
            <p style="color: #8a8e94; margin-bottom: 40px; font-size: 1.1rem;">Dokončete balíčky úrovní a získejte bonusové body do žebříčku!</p>
            
            <div class="packs-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px;">
                <div v-for="pack in packs" :key="pack.name" class="pack-card" :style="{ borderLeft: '6px solid ' + pack.color }" style="background: #18191c; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: transform 0.2s;">
                    <h2 :style="{ color: pack.color }" style="font-size: 1.6rem; font-weight: 700; margin-top: 0; margin-bottom: 15px;">{{ pack.name }}</h2>
                    
                    <div style="margin-bottom: 20px;">
                        <span style="color: #8a8e94; font-size: 0.9rem; uppercase; letter-spacing: 0.5px;">Odměna</span>
                        <p style="font-size: 1.3rem; font-weight: 600; color: #00ffcc; margin: 2px 0 0 0;">+{{ pack.points }} bodů</p>
                    </div>
                    
                    <div>
                        <span style="color: #8a8e94; font-size: 0.9rem; uppercase; letter-spacing: 0.5px;">Úrovně v balíčku</span>
                        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                            <div v-for="level in pack.levels" :key="level" style="background: #202225; padding: 8px 12px; border-radius: 6px; font-size: 0.95rem; display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #e3e5e8; font-weight: 500;">ID: {{ level }}</span>
                                <span style="color: #4f545c; font-size: 0.8rem;">Demon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            // Zde jsou přímo vaše data balíčků, která můžete kdykoliv upravit nebo přidat další
            packs: [
                {
                    name: "Sapphire Pack",
                    color: "#0070ff",
                    points: 15,
                    levels: [12345678, 23456789, 34567890]
                },
                {
                    name: "Ruby Pack",
                    color: "#ff0000",
                    points: 25,
                    levels: [45678901, 56789012]
                },
                {
                    name: "Quantum Pack",
                    color: "#00ffcc",
                    points: 50,
                    levels: [67890123, 78901234, 89012345, 90123456]
                }
            ]
        };
    }
};
