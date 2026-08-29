import Spinner from '../components/Spinner.js';
import { embed } from '../util.js';

export default {
    components: { Spinner },
            template: `
        <main style="background: #f4f2f5; padding: 20px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start; font-family: Arial, sans-serif; box-sizing: border-box;">

                        <!-- NOVÝ GRAFICKÝ LEVÝ PANEL (KARTY S PRÁZDNÝM ŠEDÝM BOXEM) -->
            <div style="width: 480px; flex-shrink: 0; display: flex; flex-direction: column; gap: 15px; max-height: calc(100vh - 40px); overflow-y: auto; padding-right: 5px; box-sizing: border-box;">
                
                <!-- VYHLEDÁVACÍ POLÍČKO -->
                <div style="background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
                    <input type="text" v-model="search" placeholder="Search level..." style="width: 100%; padding: 10px 12px; border: 1px solid #ccdid9; border-radius: 6px; background: #fff; color: #000; font-size: 0.95rem; box-sizing: border-box; outline: none;">
                </div>

                <!-- SMYČKA PRO GENEROVÁNÍ KARET LEVELŮ -->
                <div v-for="(level, idx) in filteredList" :key="idx">
                    
                    <!-- ODDĚLOVAČ (DIVIDER) S KONTROLOU PROTI UNDEFINED -->
                    <div v-if="level && level.isDivider" style="text-align: center; padding: 15px 0; font-weight: 800; color: #6b7280; font-size: 0.95rem; letter-spacing: 1.5px; text-transform: uppercase;">
                        {{ level.dividerText }}
                    </div>

                    <!-- REÁLNÁ KARTA LEVELU S KONTROLOU PROTI UNDEFINED -->
                    <div v-else-if="level && level.name" @click="selected = list.indexOf(level)" 
                         :style="{
                             cursor: 'pointer',
                             background: list[selected] === level ? '#f3f4f6' : '#ffffff',
                             border: list[selected] === level ? '2px solid #2563eb' : '1px solid #e1e4e8',
                             borderRadius: '8px',
                             padding: '15px',
                             boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                             display: 'flex',
                             gap: '15px',
                             alignItems: 'center',
                             marginBottom: '5px',
                             boxSizing: 'border-box'
                         }">
                        
                          <!-- GRAFICKÝ THUMBNAIL BOX (FINÁLNÍ BEZPEČNÁ VERZE) -->
                        <div style="width: 130px; height: 73px; border-radius: 6px; overflow: hidden; background: #000; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;">
                            
                            <!-- Obrázek volá chytrou JS funkci na spodku souboru -->
                            <img v-if="level && level.verification && getYouTubeThumb(level.verification)" 
                                 :src="getYouTubeThumb(level.verification)" 
                                 alt="thumb" 
                                 style="width: 100%; height: 100%; object-fit: cover;">
                            
                            <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #4b5563; font-size: 0.75rem; font-weight: bold; background: #e5e7eb;">
                                No Video
                            </div>

                        </div>

                            
                            <!-- STAV B: MŘÍŽKA, PRÁZDNÉ UVOZOVKY NEBO ŽÁDNÉ VIDEO -->
                            <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #4b5563; font-size: 0.75rem; font-weight: bold; background: #e5e7eb;">
                                No Video
                            </div>

                        </div>


                        <!-- TEXTOVÉ INFORMACE VEDLE BOXU -->
                        <div style="display: flex; flex-direction: column; text-align: left; gap: 2px; flex: 1;">
                            <h3 style="margin: 0; font-size: 1.3rem; font-weight: 800; color: #000000; line-height: 1.2;">
                                <span style="color: #65676b; font-weight: 600; font-size: 1.1rem; margin-right: 4px;">#{{ level.rank || idx + 1 }}</span> 
                                {{ level.name }}
                            </h3>
                            <p style="margin: 0; font-size: 0.9rem; color: #4b5563; font-weight: 600;">
                                published by <span style="color: #000000; font-weight: 700;">{{ level.author }}</span>
                            </p>
                            <p style="margin: 3px 0 0 0; font-size: 0.8rem; color: #6b7280; font-weight: 500;">
                                <span style="font-weight: 600;">{{ level.minimum || 100 }}%</span> 
                                — 
                                <span style="font-weight: 600; color: #10b981;">{{ level.points || 0 }} pts</span>
                            </p>
                        </div>

                    </div>
                </div>

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
                { name: "Poltergeist", author: "Andromeda", verifier: "🇲🇾 Cylio", points: 200, type: "main", minimum: 59, verification: "https://www.youtube.com/watch?v=63sr55FXqsI", records: [] },
                { name: "Veracity", author: "BlueLite", verifier: "🇻🇳 trumandigma", points: 200, type: "main", minimum: 68, verification: "https://www.youtube.com/watch?v=AvCHbKpv9m4", records: [] },
                { name: "Verity", author: "Serponge", verifier: "🇻🇳 trumandigma", points: 200, type: "main", minimum: 73, verification: "https://www.youtube.com/watch?v=dmD8T5zht7A", records: [{ user: "🇨🇿 Earl12", percent: 100, link: "https://www.youtube.com/watch?v=2wWEXqaOIjQ" }] },
                { name: "Skeletal Shenanigans", author: "YoReid", verifier: "🇻🇳 trumandigma", points: 195, type: "main", minimum: 64, verification: "https://www.youtube.com/watch?v=kO205r4sZKM", records: [] },
                { name: "Sirius", author: "FunnyGame", verifier: "🇻🇳 trumandigma", points: 190, type: "main", minimum: 73, verification: "https://www.youtube.com/watch?v=6AxuV3e_6E4", records: [] },
                { name: "B", author: "MotleyOrc", verifier: "🇻🇳 trumandigma", points: 190, type: "main", minimum: 61, verification: "https://www.youtube.com/watch?v=sjmc5HaGrYc", records: [{ user: "🇲🇾 Cylio", percent: 64, link: "#" }] },
                { name: "ZXCircleS", author: "Wintter", verifier: "🇲🇾 Cylio", points: 0, type: "main", minimum: 63, verification: "https://www.youtube.com/watch?v=J4bgGT9euJw", records: [] },
                { name: "Deadlocked", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 72, verification: "https://www.youtube.com/watch?v=reZj2Xbt05Q", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" } ] },
                { name: "Hellishment", author: "🇨🇿 Earl12", verifier: "🇨🇿 Earl12", points: 145, type: "main", minimum: 81, verification: "https://www.youtube.com/watch?v=8RJstOZvoUQ", records: [{ user: "🇻🇳 trumandigma", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "https://www.youtube.com/watch?v=pbiPSgZKpd8" }] },
                { name: "Problematic", author: "Dharfin", verifier: "🇲🇾 Cylio", points: 0, type: "main", minimum: 64, verification: "#", records: [] },
                { name: "Theory of Everything 2", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 175, type: "main", minimum: 72, verification: "https://www.youtube.com/watch?v=medoq_Znhaw", records: [{ user: "🇨🇿 Earl12", percent: 100, link: "#" }] },
                { name: "Blackfire Backfire", author: "kira9999", verifier: "🇻🇳 trumandigma", points: 170, type: "main", minimum: 69, verification: "https://www.youtube.com/watch?v=2h1FgtfaP1k", records: [] },
                { name: "Darkstep", author: "Alex", verifier: "🇻🇳 trumandigma", points: 165, type: "main", minimum: 70, verification: "https://www.youtube.com/watch?v=6cFZYLraEJs", records: [] },
                { name: "Speed Racer", author: "Zenthicalpha", verifier: "🇻🇳 trumandigma", points: 150, type: "main", minimum: 71, verification: "https://www.youtube.com/watch?v=R8RsJVKKd8w", records: [{ user: "🇨🇿 Earl12", percent: 73, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" }] },
                { name: "Clutterfunk V2", author: "Neptune", verifier: "🇨🇿 Earl12", points: 130, type: "main", verification: "https://www.youtube.com/watch?v=Kkrp9G-vYeE", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "https://www.youtube.com/watch?v=2kE93FgLRcs" } ] },
                { name: "Unnerfed noument", author: "🇨🇿 Earl12", verifier: "🇻🇳 trumandigma", points: 160, type: "main", minimum: 75, verification: "#", records: [{ user: "🇨🇿 Earl12", percent: 78, link: "" }] },
                { name: "Lights Speed", author: "Experience dihhh", verifier: "🇻🇳 trumandigma", points: 150, type: "main", minimum: 79, verification: "https://www.youtube.com/watch?v=ypvgbkVtlSM", records: [{ user: "🇨🇿 Earl12", percent: 100, link: "#" }] }, 
                { name: "Clubstep", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 155, type: "main", minimum: 78, verification: "https://www.youtube.com/watch?v=gok5ShDXxg4", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" } ] },
                { name: "IceStream", author: "DarnocBlue", verifier: "🇨🇿 Earl12", points: 160, type: "main", minimum: 74, verification: "https://www.youtube.com/watch?v=2pSl4YVCILc", records: [] },
                { name: "Noument", author: "🇨🇿 Earl12", verifier: "🇨🇿 Earl12", points: 145, type: "main", minimum: 75, verification: "https://www.youtube.com/watch?v=W_rqtk3cipE", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "https://www.youtube.com/watch?v=PA_5LXPnBMc" }] },
                { name: "Electro Rand", author: "GmwadBoy", verifier: "🇨🇿 Earl12", points: 140, type: "main", minimum: 81, verification: "https://www.youtube.com/watch?v=MZYw7jL9BnQ", records: [] },
                { name: "Space Club", author: "D0meR", verifier: "🇨🇿 Earl12", points: 140, type: "main", minimum: 81, verification: "#", records: [] },
                { name: "Maymory", author: "ItsKiba", verifier: "🇨🇿 Earl12", points: 140, type: "main", minimum: 80, verification: "https://www.youtube.com/watch?v=EKP5rGdOf_o", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "#" } ] },
                { name: "Theory of Every V2", author: "Neptune", verifier: "🇨🇿 Earl12", points: 135, type: "main", minimum: 70, verification: "https://www.youtube.com/watch?v=d39W_TzuGLs", records: [] },
                { name: "Electroman Adventures V2", author: "Neptune", verifier: "🇻🇳 trumandigma", points: 125, type: "main", minimum: 68, verification: "https://www.youtube.com/watch?v=-LJ3Q-pWZdo", records: [] },
                { name: "Electrodynamix", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 120, type: "main", minimum: 78, verification: "https://www.youtube.com/watch?v=fGjDZgluC60", records: [{ user: "🇲🇾 Cylio", percent: 100, link: "#" }] },
                { name: "iSpyWithMyLittleEye", author: "Voxicat", verifier: "🇻🇳 trumandigma", points: 115, type: "main", minimum: 67, verification: "https://www.youtube.com/watch?v=Ow7nDnZTbDw", records: [] },
                { name: "Crescendo", author: "MasK463", verifier: "🇨🇿 Earl12", points: 110, type: "main", minimum: 80, verification: "https://www.youtube.com/watch?v=ndx5WJv-P3E", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "#" } ] },
                { name: "m tolot", author: "🇨🇿 Earl12", verifier: "🇨🇿 Earl12", points: 105, type: "main", minimum: 81, verification: "#", records: [] },
                { name: "Insane Club", author: "5Duck", verifier: "🇨🇿 Earl12", points: 105, type: "main", minimum: 79, verification: "#", records: [] },
                { name: "Microphone", author: "Masterthecube5", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 81, minimum: 0, verification: "", records: [] },
                { name: "xStep V2", author: "Neptune", verifier: "🇨🇿 Earl12", points: 0, type: "main", minimum: 82, verification: "https://www.youtube.com/watch?v=K9rBb0HVvMg", records: [ { user: "🇻🇳 trumandigma", percent: 100, link: "#" } ] },
                { name: "Shiver", author: "SpKale", verifier: "🇨🇿 Earl12", points: 0, type: "main", verification: "", minimum: 76, records: [{ user: "🇻🇳 trumandigma", percent: 100, link: "#" }] },
                { name: "Justice for Julinka", author: "🇨🇿 Earl12", verifier: "🇨🇿 Earl12", points: 0, type: "main", minimum: 73, verification: "https://www.youtube.com/watch?v=Ppe3l-HoBLs", records: [] },
                { name: "Phjork", author: "Cerufiffy", verifier: "🇻🇳 trumandigma", points: 0, type: "main", minimum: 81, verification: "", records: [{ user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Demon Forest", author: "Ketis", verifier: "🇻🇳 trumandigma", points: 0, type: "main", minimum: 81, verification: "", records: [{ user: "🇨🇿 Earl12", percent: 100, link: "#" }] },
                { name: "Demon Mixed", author: "RealOggy", verifier: "🇨🇿 Earl12", points: 0, type: "main", minimum: 80, verification: "", records: [] },
                { name: "Hexagon Force", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 0, type: "main", minimum: 72, verification: "", records: [{ user: "🇲🇾 Cylio", percent: 100, link: "#" }] },
                { name: "Platinum Adventure", author: "Jerry4", verifier: "🇨🇿 Earl12", points: 0, type: "main", minimum: 81, verification: "", records: [{ user: "🇻🇳 trumandigma", percent: 100, link: "#" },{ user: "🇨🇿 Krystof", percent: 100, link: "#" }] },
                { name: "Blast Processing V2", author: "Neptune", verifier: "🇨🇿 Earl12", points: 0, type: "main",minimum: 100, verification: "", records: [] },
                { name: "yStep", author: "TherealDarnoc", verifier: "🇨🇿 Earl12", points: 180, type: "main", minimum: 80, verification: "https://www.youtube.com/watch?v=xO2j6OMTiLo", records: [] },
                { name: "Noobaman Adventures", author: "noobas", verifier: "🇨🇿 Earl12", points: 180, type: "main", minimum: 80, verification: "https://www.youtube.com/watch?v=2OkvfRSOYy08VZ1f", records: [] },
                { name: "ice cave", author: "Ketis", verifier: "🇨🇿 Earl12", points: 180, type: "main", minimum: 89, verification: "", records: [] },
                { name: "iS", author: "Grenate", verifier: "🇻🇳 trumandigma", points: 0, type: "main", minimum: 70, verification: "", records: [{ user: "🇲🇾 Cylio", percent: 100, link: "#" },{ user: "🇨🇿 Earl12", percent: 100, link: "#" }] },
                { name: "The Nightmare", author: "Jax", verifier: "🇨🇿 Earl12", points: 0, type: "main", minimum: 81, verification: "", records: [{ user: "🇻🇳 trumandigma", percent: 100, link: "#" }] },
                { name: "The Lightning Road", author: "Timeless Real", verifier: "🇨🇿 Earl12", points: 0, type: "main", minimum: 78, verification: "", records: [{ user: "🇻🇳 trumandigma", percent: 100, link: "#" },{ user: "🇨🇿 Thomas", percent: 100, link: "#" }] },
                { name: "Clutterfunk", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 69, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Theory of Everything", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 90, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Dash", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 78, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇨🇿 Thomas", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Fingerdash", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "main", minimum: 85, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Xstep", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "extended", minimum: 100, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇨🇿 Thomas", percent: 100, link: "#" },{ user: "🇨🇿 zubnikartacka", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" }] },
                { name: "Bloodbath but No", author: "Texic", verifier: "🇨🇿 Earl12", points: 0, type: "extended", minimum: 100, verification: "", records: [] },
                { name: "Electroman Adventures", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, minimum: 100, type: "extended", minimum: 100, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" },{ user: "🇨🇿 Thomas", percent: 100, link: "#" },{ user: "🇨🇿 zubnikartacka", percent: 83, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Flappy Bird", author: "TherealDarnoc", verifier: "🇨🇿 Earl12", points: 180, type: "extended", minimum: 100, verification: "", records: [] },
                { name: "Geometrical Dominator", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "extended", minimum: 100, verification: "", records: [ { user: "🇨🇿 Krystof", percent: 100, link: "#" },{ user: "🇲🇾 Cylio", percent: 100, link: "#" } ] },
                { name: "Time Machine", author: "RobTop", verifier: "🇻🇳 trumandigma", points: 180, type: "extended", minimum: 100, verification: "", records: [ { user: "🇨🇿 Earl12", percent: 100, link: "#" }, { user: "🇲🇾 Cylio", percent: 86, link: "#" } ] },
               
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
