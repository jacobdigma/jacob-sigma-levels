export default {
    template: `
        <div id="updatelog-ui" class="surface" style="max-width: 940px; margin: 40px auto; padding: 30px; border-radius: 8px;">
            <div id="title-div" style="margin-bottom: 40px; text-align: center; border-bottom: 1px solid var(--border-color); padding-bottom: 20px;">
                <h1 class="main-title type-title" style="font-size: 2.5rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; color: var(--text-color);">Update Log</h1>
                <p class="type-body" style="color: var(--text-color); opacity: 0.6;">JDL newest version: v2.0.0</p>
            </div>

            <div class="rules-div" style="display: flex; flex-direction: column; gap: 30px; text-align: left;">
                
                <!-- Version 2.0.0 -->
                <div class="update-entry" style="border-left: 4px solid #2bba74; padding-left: 20px; margin-bottom: 10px;">
                    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
                        <h2 class="type-title" style="font-size: 1.6rem; font-weight: bold; margin: 0; color: var(--text-color);">Version 2.0.0</h2>
                        <span class="type-body" style="font-size: 0.9rem; color: var(--text-color); opacity: 0.5;">04. 07. 2026</span>
                    </div>
                    <ul class="type-body" style="list-style-type: square; padding-left: 20px; line-height: 1.8; color: var(--text-color); opacity: 0.8; font-size: 1.05rem;">
                        <li style="margin-bottom: 8px;">Complete new style of website.</li>
                        <li style="margin-bottom: 8px;">Main, extended, legacy system.</li>
                        <li>Fixed stuck loading.</li>
                    </ul>
                </div>

                <!-- Version 1.4.0 -->
                <div class="update-entry" style="border-left: 4px solid #4ba3ff; padding-left: 20px; margin-bottom: 10px;">
                    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
                        <h2 class="type-title" style="font-size: 1.6rem; font-weight: bold; margin: 0; color: var(--text-color);">Version 1.4.0</h2>
                        <span class="type-body" style="font-size: 0.9rem; color: var(--text-color); opacity: 0.5;">30. 06. 2026</span>
                    </div>
                    <ul class="type-body" style="list-style-type: square; padding-left: 20px; line-height: 1.8; color: var(--text-color); opacity: 0.8; font-size: 1.05rem;">
                        <li style="margin-bottom: 8px;">Added Update log</li>
                        <li>Added Progressed to Profiles</li>
                    </ul>
                </div>

                <!-- Version 1.3.0 -->
                <div class="update-entry" style="border-left: 4px solid var(--border-color); padding-left: 20px;">
                    <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px;">
                        <h2 class="type-title" style="font-size: 1.6rem; font-weight: bold; margin: 0; color: var(--text-color); opacity: 0.8;">Version 1.3.0</h2>
                        <span class="type-body" style="font-size: 0.9rem; color: var(--text-color); opacity: 0.5;">27. 06. 2026</span>
                    </div>
                    <ul class="type-body" style="list-style-type: square; padding-left: 20px; line-height: 1.8; color: var(--text-color); opacity: 0.8; font-size: 1.05rem;">
                        <li style="margin-bottom: 8px;">Added Packs</li>
                        <li>Fixed some bad Placements</li>
                    </ul>
                </div>

            </div>
        </div>
    `
};
