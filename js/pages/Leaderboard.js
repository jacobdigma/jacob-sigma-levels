import Spinner from '../components/Spinner.js';
import list from './List.js'; // <-- TENTO ŘÁDEK SEM PŘIDEJ!

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
                        <template v-for="(demon, idx) in [...entry.demons].sort((a, b) => a.level.localeCompare(b.level))">
                            <span style="display: inline-block;">
                                <a :href="demon.link" target="_blank" :style="getLevelStyle(demon.type)">{{ demon.level }}</a> 
                                <span v-if="demon.isVerified" style="color: #2bba74; font-size: 0.85rem; font-weight: bold; margin-left: 5px; background: #eafaf1; padding: 2px 6px; border-radius: 4px; vertical-align: middle;">Verified</span>
                            </span>
                            <span v-if="idx < entry.demons.length - 1" style="color: #333; margin: 0 6px;"> - </span>
                        </template>
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
        // Naimportujeme si živý seznam levelů z List.js komponenty
        const levels = list.data().list;
        
        // Spustíme ten stejný bodový výpočet jako v List.js, abychom měli přesná a aktuální data
        const activeLevels = levels.filter(l => l.type === 'main' || l.type === 'extended');
        const totalActive = activeLevels.length;
        levels.forEach(level => {
            if (level.type === 'legacy') {
                level.points = 0;
            } else {
                const position = activeLevels.indexOf(level);
                const finalProgressPoints = Math.max(0, currentPercent - gap);
                level.points = Math.round(calculatedPoints);
            }
        });

        // Vytvoříme si mapu pro shromažďování dat o hráčích
        const playersMap = {};

        // Funkce, která bezpečně přidá nebo najde hráče v mapě
        const getOrCreatePlayer = (name) => {
            const lowerName = name.toLowerCase();
            if (!playersMap[lowerName]) {
                playersMap[lowerName] = {
                    name: name, // Zachováme původní velikost písmen
                    total: 0,
                    mainCount: 0,
                    extendedCount: 0,
                    legacyCount: 0,
                    hardest: "None",
                    hardestRank: 9999, // Pomocná hodnota pro výpočet nejtěžšího démona
                    demons: [],
                    progress: []
                };
            }
            return playersMap[lowerName];
        };

        // Projdeme všechny levely z List.js a rozdělíme body, verifikace a splnění
               // Projdeme všechny levely z List.js a rozdělíme body, verifikace a splnění
        levels.forEach(level => {
            // Seznam povolených reálných hráčů pro žebříček
            const allowedPlayers = ['trumandigma', 'stetkos', 'earl12'];

            // 1. KONTROLA VERIFIKÁTORA
            if (level.verifier && level.verifier.trim() !== "") {
                if (allowedPlayers.includes(level.verifier.toLowerCase())) {
                    const player = getOrCreatePlayer(level.verifier);
                    
                    // Přičteme body za verifikaci
                    player.total += level.points;
                    
                    if (level.type === 'main') player.mainCount++;
                    if (level.type === 'extended') player.extendedCount++;
                    if (level.type === 'legacy') player.legacyCount++;

                    if (level.type !== 'legacy' && level.rank < player.hardestRank) {
                        player.hardest = level.name;
                        player.hardestRank = level.rank;
                    }

                    // Přidáme do seznamu dokončených
                    const alreadyAdded = player.demons.some(d => d.level === level.name);
                    if (!alreadyAdded) {
                        player.demons.push({
                            level: level.name,
                            link: level.verification || "#",
                            type: level.type,
                            isVerified: false
                        });
                    }
                }
            }


            // 2. KONTROLA REKORDŮ
            if (level.records && level.records.length > 0) {
                level.records.forEach(record => {
                    if (!record.user) return;
                    if (allowedPlayers.includes(record.user.toLowerCase())) {
                        const player = getOrCreatePlayer(record.user);

                        if (parseInt(record.percent) === 100) {
                            player.total += level.points;
                            
                            if (level.type === 'main') player.mainCount++;
                            if (level.type === 'extended') player.extendedCount++;
                            if (level.type === 'legacy') player.legacyCount++;

                            if (level.type !== 'legacy' && level.rank < player.hardestRank) {
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
                            const gap = 200 - level.points;
                            
                            // Se závorkou ) na správném místě!
                            const finalProgressPoints = Math.max(0, currentPercent - gap);
                            
                            player.total += finalProgressPoints;

                            player.progress.push({
                                level: level.name,
                                percent: currentPercent,
                                link: record.link || "#"
                            });
                        }
                    }
                });
            }
        });

        this.rawLeaderboard = Object.values(playersMap).map(player => {
            player.stats = `${player.mainCount} Main, ${player.extendedCount} Extended, ${player.legacyCount} Legacy`;
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
