export default {
    template: `
        <div id="updatelog-ui" class="surface" style="max-width: 940px; margin: 40px auto; padding: 30px; border-radius: 8px;">
            <div id="title-div" style="margin-bottom: 40px; text-align: center; border-bottom: 1px solid var(--border-color); padding-bottom: 20px;">
                <h1 class="main-title" style="font-size: 2.5rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Update Log</h1>
                <p style="color: var(--text-color); opacity: 0.6;">Sledujte nejnovější změny na našem Demonlistu</p>
            </div>
            
            <div class="rules-div" style="display: flex; flex-direction: column; gap: 30px;">
                <!-- Verze 1.4.0 -->
                <div class="update-entry" style="border-left: 4px solid #4ba3ff; padding-left: 20px; margin-bottom: 10px;">
                    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
                        <h2 style="font-size: 1.6rem; font-weight: bold; margin: 0; color: var(--text-color);">Verze 1.4.0</h2>
                        <span style="font-size: 0.9rem; color: var(--text-color); opacity: 0.5;">30. 06. 2026</span>
                    </div>
                    <ul style="list-style-type: square; padding-left: 20px; line-height: 1.8; color: var(--text-color); opacity: 0.9; font-size: 1.05rem;">
                        <li style="margin-bottom: 8px;">Přidána nová záložka <strong style="color: #4ba3ff;">Updatelog</strong> pro přehled aktualizací webu.</li>
                        <li style="margin-bottom: 8px;">Úroveň <strong style="color: #4ba3ff;">Verity</strong> byla úspěšně zařazena na pozici #1 v žebříčku.</li>
                        <li>Optimalizována navigace a opraveny drobné vizuální nedostatky.</li>
                    </ul>
                </div>

                <!-- Verze 1.3.0 -->
                <div class="update-entry" style="border-left: 4px solid var(--border-color); padding-left: 20px;">
                    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
                        <h2 style="font-size: 1.6rem; font-weight: bold; margin: 0; color: var(--text-color); opacity: 0.8;">Verze 1.3.0</h2>
                        <span style="font-size: 0.9rem; color: var(--text-color); opacity: 0.5;">15. 05. 2026</span>
                    </div>
                    <ul style="list-style-type: square; padding-left: 20px; line-height: 1.8; color: var(--text-color); opacity: 0.8; font-size: 1.05rem;">
                        <li style="margin-bottom: 8px;">Oficiální spuštění nové verze JDL Demonlistu.</li>
                        <li style="margin-bottom: 8px;">Implementovány sekce <strong style="color: #4ba3ff;">Packs</strong> a <strong style="color: #4ba3ff;">Roulette</strong>.</li>
                        <li>Přidán plně funkční tmavý a světlý režim webu.</li>
                    </ul>
                </div>
            </div>
        </div>
    `
};
