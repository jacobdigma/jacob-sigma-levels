export default {
    template: `
        <div id="updatelog-ui" style="padding: 20px 0; max-width: 940px; margin: 0 auto;">
            <div id="title-div" style="margin-bottom: 40px; text-align: center;">
                <h1 class="main-title" style="font-size: 2.5rem; font-weight: 800; text-transform: uppercase; margin-bottom: 10px;">Update Log</h1>
                <p style="color: var(--text-color); opacity: 0.6; font-size: 1.1rem;">Sledujte nejnovější změny na našem Demonlistu</p>
            </div>
            
            <div class="rules-div" style="background-color: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                <!-- Verze 1.4.0 -->
                <div class="update-entry" style="margin-bottom: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 20px;">
                    <h2 style="color: #4ba3ff; font-size: 1.6rem; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                        <span>Verze 1.4.0</span>
                        <span style="font-size: 0.9rem; color: #888; font-weight: 400;">30. 06. 2026</span>
                    </h2>
                    <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.8; color: var(--text-color);">
                        <li>Přidána nová záložka <strong style="color: #fff;">Updatelog</strong> pro přehled aktualizací webu.</li>
                        <li>Úroveň <strong style="color: #fff;">Verity</strong> byla úspěšně zařazena na pozici #1 v žebříčku.</li>
                        <li>Optimalizována navigace a opraveny drobné vizuální nedostatky.</li>
                    </ul>
                </div>

                <!-- Verze 1.3.0 -->
                <div class="update-entry" style="padding-bottom: 10px;">
                    <h2 style="color: #4ba3ff; font-size: 1.6rem; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                        <span>Verze 1.3.0</span>
                        <span style="font-size: 0.9rem; color: #888; font-weight: 400;">15. 05. 2026</span>
                    </h2>
                    <ul style="list-style-type: disc; padding-left: 20px; line-height: 1.8; color: var(--text-color);">
                        <li>Oficiální spuštění nové verze JDL Demonlistu.</li>
                        <li>Implementovány sekce <strong style="color: #fff;">Packs</strong> a <strong style="color: #fff;">Roulette</strong>.</li>
                        <li>Přidán plně funktionální tmavý a světlý režim webu.</li>
                    </ul>
                </div>
            </div>
        </div>
    `
};
