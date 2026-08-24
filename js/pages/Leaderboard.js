import Spinner from '../components/Spinner.js';
import list from './List.js';
import packsModule from './Packs.js';

export default {
    components: { Spinner },
    template: `
        <main style="background: #f0f2f5; padding: 20px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start; font-family: Arial, sans-serif; box-sizing: border-box;">
            
            <!-- LEVÝ PANEL: Seznam hráčů -->
            <div style="background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; width: 320px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); box-sizing: border-box; flex-shrink: 0;">
                <div style="margin-bottom: 15px;">
                    <input type="text" v-model="search" placeholder="Search player..." style="width: 100%; padding: 10px; border: 1px solid #ccd1d9; border-radius: 4px; background: #fff; color: #000; font-size: 0.95rem; box-sizing: border-box;">
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr v-for="(player, idx) in filteredLeaderboard" :key="idx" @click="selected = leaderboard.indexOf(player)"
                        :style="{ cursor: 'pointer', background: leaderboard[selected] === player ? '#e6f0ff' : 'transparent', borderBottom: '1px solid #f0f0f0' }">
                        <td style="padding: 12px 8px; width: 40px; color: #65676b; font-weight: bold;">#{{ leaderboard.indexOf(player) + 1 }}</td>
                        <td style="padding: 12px 8px; text-align: left; color: #000000; font-weight: 600;">{{ player.name }}</td>
                        <td style="padding: 12px 8px; text-align: right; color: #0070ff; font-weight: bold;">{{ player.total.toLocaleString() }}</td>
                    </tr>
                </table>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail hráče -->
            <div style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left; color: #000000; box-sizing: border-box;">
                <div v-if="entry">
                    <h1 style="color: #000000; font-size: 2.2rem; margin: 0 0 20px 0; font-weight: 800; text-align: center;">{{ entry.name }}</h1>
                    
                    <div style="display: flex; gap: 40px; padding-bottom: 20px; border-bottom: 1px solid #e1e4e8; justify-content: center; text-align: center;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist rank</p>
                            <h3 style="color: #000000; margin: 0; font-size: 1.8rem; font-weight: 700;">{{ leaderboard.indexOf(entry) + 1 }}</h3>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist score</p>
                            <h3 style="color: #000000; margin: 0; font-size: 1.8rem; font-weight: 700;">{{ entry.total.toLocaleString() }}</h3>
                        </div>
                    </div>

                    <div style="display: flex; gap: 40px; padding: 20px 0; border-bottom: 1px solid #e1e4e8; justify-content: center; text-align: center;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Demonlist stats</p>
                            <h4 style="color: #000000; font-size: 1.1rem; font-weight: 600; margin: 0;">{{ entry.stats }}</h4>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Hardest demon</p>
                            <h4 style="color: #000000; font-size: 1.1rem; font-weight: 700; margin: 0;">{{ entry.hardest }}</h4>
                        </div>
                    </div>

                    <!-- SLOUČENÉ SEKCE COMPLETED & VERIFIED PODLE FOTKY -->
                    <h2 style="color: #000000; font-size: 1.6rem; margin: 25px 0 15px 0; text-align: center; font-weight: 700;">Demons completed</h2>
                    <div v-if="entry.demons.length === 0" style="color: #65676b; font-style: italic; text-align: center;">None</div>
                    <div v-else style="line-height: 2.2; text-align: center; color: #000000; word-wrap: break-word; padding: 0 10px;">
                        <span v-for="(demon, idx) in [...entry.demons].sort((a, b) => a.level.localeCompare(b.level))" :key="idx" style="display: inline-block; margin-bottom: 5px;">
                            <a :href="demon.link" target="_blank" :style="getLevelStyle(demon.type)">{{ demon.level }}</a>
                            <!-- TENTO ŘÁDEK PŘIDÁ POMPOUČKU S MEZERAMI ZA KAŽDÝ LEVEL KROMĚ POSLEDNÍHO -->
                            <span v-if="idx < entry.demons.length - 1" style="color: #65676b; margin: 0 8px;">-</span>
                        </span>


                            </span>
                            <span v-if="idx < entry.demons.length - 1" style="color: #333; margin: 0 6px;"> - </span>
                        </template>
                    </div>
                                        <!-- DEMONS CREATED SEKCE -->
                    <h2 style="font-size: 1.6rem; font-weight: 800; margin: 30px 0 15px 0;">Demons created</h2>
                    <div v-if="!entry.created || entry.created.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-bottom: 30px; line-height: 1.6;">
                        <span v-for="(level, idx) in [...entry.created].sort((a, b) => a.name.localeCompare(b.name))" :key="idx" style="display: inline-block; margin-bottom: 5px;">
                            <a :href="level.link" target="_blank" :style="getLevelStyle(level.type)">{{ level.name }}</a>
                            <!-- Šedá pomlčka s mezerami za každý vytvořený level kromě posledního -->
                            <span v-if="idx < entry.created.length - 1" style="color: #65676b; margin: 0 8px;">-</span>
                        </span>
                    </div>


                    <!-- PROGRESS SEKCE -->
                    <h2 style="color: #000000; font-size: 1.6rem; margin: 35px 0 15px 0; text-align: center; font-weight: 700;">Progress on</h2>
                    <div v-if="entry.progress.length === 0" style="color: #65676b; font-style: italic; text-align: center;">None</div>
                    <div v-else style="line-height: 2.2; text-align: center; color: #000000; word-wrap: break-word; padding: 0 10px;">
                        <template v-for="(p, idx) in entry.progress">
                            <span style="display: inline-block;">
                            <a :href="p.link" target="_blank" :style="getLevelStyle(p.type)">{{ p.level }} ({{ p.percent }}%)</a>
 
                            </span>
                            <span v-if="idx < entry.progress.length - 1" style="color: #333; margin: 0 6px;"> - </span>
                        </template>
                    </div>
                                        <!-- PACKS COMPLETED SEKCE -->
                    <h2 style="color: #000000; font-size: 1.6rem; margin: 25px 0 15px 0; font-weight: 700; text-align: center;">Packs Completed</h2>
                    <div v-if="!entry.completedPacks || entry.completedPacks.length === 0" style="color: #65676b; font-style: italic; text-align: center;">None</div>
                    <div v-else style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                        <div v-for="pack in entry.completedPacks" :key="pack.name" :style="{ color: pack.color, fontWeight: 'bold', fontSize: '1.1rem' }">
                            {{ pack.name }}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `,
    data() {
        return {
            selected: 0,
            search: '',
            rawLeaderboard: [] // Tady budou uložena kompletně vygenerovaná data ze souboru List.js
        };
    },
    computed: {
        leaderboard() {
            // Seřadíme hráče automaticky podle nejvyššího počtu bodů od prvního po posledního
            return [...this.rawLeaderboard].sort((a, b) => b.total - a.total);
        },
        entry() {
            if (!this.leaderboard || this.selected === null) return null;
            return this.filteredLeaderboard[this.selected] || null;
        },
        filteredLeaderboard() {
            if (!this.leaderboard) return [];
            return this.leaderboard.filter(player => 
                player.name && player.name.toLowerCase().includes(this.search.toLowerCase())
            );
        }
    },
    mounted() {
        const levels = list.data().list;
        
        // Vyfiltrujeme reálné levely pro přesný výpočet
        const activeLevels = levels.filter(l => l.name && (l.type === 'main' || l.type === 'extended'));
        const totalActive = activeLevels.length;
        
        // --- TADY JE TEN AUTOMATICKÝ DOPOCET RANKŮ PRO ŽEBŘÍČEK ---
        let currentRank = 1;

        levels.forEach(level => {
            if (!level.name) return;

            if (level.type === 'legacy') {
                level.points = 0;
                level.rank = 9999; // Legacy dáme schválně vysoký rank, aby nepřebíjel Main levely v Hardestu
            } else {
                // Každému aktivnímu levelu přiřadíme pozici podle pořadí v souboru
                level.rank = currentRank;
                currentRank++;

                // Výpočet bodů zůstává stoprocentně stejný
                const position = activeLevels.indexOf(level);
                const calculatedPoints = totalActive > 1 ? 200 - (position * (100 / (totalActive - 1))) : 200;
                level.points = Math.round(calculatedPoints);
            }
        });

        const playersMap = {};


                const getOrCreatePlayer = (name) => {
            let displayName = name;
            
            // Jediná pojistka: pokud narazí na staré jméno stetkos (s vlajkou i bez), sjednotí ho na Earl12 s vlajkou
            if (name.toLowerCase().includes('stetkos')) {
                displayName = '🇨🇿 Earl12';
            }
            
            const lowerName = displayName.toLowerCase().trim();
            if (!playersMap[lowerName]) {
                playersMap[lowerName] = {
                    name: displayName, // Vezme jméno přímo z databáze (takže i s tvojí vlaječkou!)
                    total: 0,
                    mainCount: 0,
                    extendedCount: 0,
                    legacyCount: 0,
                    hardest: "None",
                    hardestRank: 9999,
                    demons: [],
                    progress: [],
                    created: []
                };
            }
            return playersMap[lowerName];
        };


        // SEM SE KÓD PODÍVÁ PŘI KONTROLE REKORDŮ - TADY TO MUSÍ BÝT ČISTÉ BEZ VLAJEČEK!
                // Přidali jsme vlaječky přímo do seznamu povolených, aby je filtr neshazoval!
        const allowedPlayers = [
            '🇻🇳 trumandigma', 
            '🇨🇿 earl12', 
            '🇨🇿 stetkos', 
            '🇨🇿 krystof',
            '🇨🇿 Thomas',
            '🇨🇿 zubnikartacka',
            '🇲🇾 Cylio'
        ];


                // AUTOMATICKÁ KONTROLA VYTVOŘENÝCH LEVELŮ (DEMONS CREATED)
        levels.forEach(level => {
            if (level.author && level.author.trim() !== "") {
                // Najdeme hráče v žebříčku podle autora levelu (ignorujeme vlaječky přes allowedPlayers)
                const authorClean = level.author.toLowerCase().trim();
                
                // Odstraníme případnou vlaječku z textu autora pro porovnání, pokud bys ji tam někdy napsal
                const matchedAllowed = allowedPlayers.find(p => authorClean.includes(p));
                
                if (matchedAllowed) {
                    const player = getOrCreatePlayer(matchedAllowed);
                    
                    // Pojistka, ať se level nepřidá dvakrát
                    const alreadyAdded = player.created.some(c => c.name === level.name);
                    if (!alreadyAdded) {
                        player.created.push({
                            name: level.name,
                            type: level.type,
                            link: level.verification || "#"
                        });
                    }
                }
            }
        });


                    const alreadyAdded = player.demons.some(d => d.level === level.name);
                    if (!alreadyAdded) {
                        player.demons.push({
                            level: level.name,
                            link: level.verification || "#",
                            type: level.type,
                            isVerified: true
                        });
                    }
                }
            }

            // 2. KONTROLA REKORDŮ
            if (level.records && level.records.length > 0) {
                level.records.forEach(record => {
                    if (!record.user) return;
                    if (allowedPlayers.includes(level.verifier.toLowerCase().trim())) {
                        const player = getOrCreatePlayer(record.user);

                        if (parseInt(record.percent) === 100) {
                            player.total += level.points;
                            
                            if (level.type === 'main') player.mainCount++;
                            if (level.type === 'extended') player.extendedCount++;
                            if (level.type === 'legacy') player.legacyCount++;
                            
                       if (level.rank < player.hardestRank || (level.type === 'legacy' && player.hardest === "None")) {
    player.hardest = level.name;
    player.hardestRank = level.rank;
}


                            const alreadyAdded = player.demons.some(d => d.level === level.name);
                            if (!alreadyAdded) {
                                player.demons.push({
                                    level: level.name,
                                    link: record.link || "#",
                                    type: level.type,
                                    isVerified: false
                                });
                            }
                                                } else {
                            // --- PROGRESS SYSTÉM PODLE TVÉHO VZORCE ---
                            const currentPercent = parseInt(record.percent) || 0;
                            let finalProgressPoints = 0;
                            
                            // Body za progress dáváme pouze pro Main List!
                            if (level.type === 'main') {
                                // Pojistka: Pokud kód zrovna nemá z Listu vypočítané body, dáme výchozí nulu, ať to nespadne
                                const levelPoints = parseInt(level.points) || 0;
                                const gap = 200 - levelPoints;
                                finalProgressPoints = Math.max(0, currentPercent - gap);
                            }
                            
                            // Bezpečně přičteme body hráči
                            player.total += finalProgressPoints;

                            // Zapíšeme progress do profilu pro zobrazení
                            player.progress.push({
                                level: level.name,
                                percent: currentPercent,
                                link: record.link || "#",
                                type: level.type
                            });
                        }
                    }
                });
            }
       

        // AUTOMATICKÁ KONTROLA COMPLETED PACKS
        if (packsModule && packsModule.data) {
            const allPacks = packsModule.data().packs;

            Object.values(playersMap).forEach(player => {
                player.completedPacks = [];
                const completedLevelNames = player.demons.map(d => d.level.toLowerCase().trim());

                allPacks.forEach(pack => {
                    const holdsAllLevels = pack.levels.every(packLevel => 
                        completedLevelNames.includes(packLevel.toLowerCase().trim())
                    );

                    if (holdsAllLevels) {
                        player.completedPacks.push({
                            name: pack.name,
                            color: pack.color || '#000000'
                        });
                    }
                });
            });
        }

        this.rawLeaderboard = Object.values(playersMap).map(player => {
            player.stats = player.mainCount + " Main, " + player.extendedCount + " Extended, " + player.legacyCount + " Legacy";
            return player;
        });
    },
    methods: {
        getLevelStyle(type) {
            if (type === 'main') {
                return {
                    color: '#000000',
                    fontWeight: 'bold',
                    fontSize: '1.18rem',
                    textDecoration: 'none'
                };
            }
            if (type === 'legacy') {
                return {
                    color: '#9ca3af',
                    fontWeight: 'normal',
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                    textDecoration: 'none'
                };
            }
            return {
                color: '#000000',
                fontWeight: 'normal',
                fontSize: '0.9rem',
                textDecoration: 'none'
            };
        }
    }
};
