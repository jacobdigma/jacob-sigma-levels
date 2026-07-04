import { fetchList } from '../content.js';
import { embed } from '../util.js';
import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },
    template: `
        <main v-if="loading" style="display: flex; justify-content: center; padding: 50px; background: #fff;"><Spinner /></main>
        
        <main v-else style="background: #f0f2f5; padding: 20px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start; font-family: Arial, sans-serif; box-sizing: border-box;">
            
            <!-- LEVÝ PANEL: Dynamický seznam úrovní s předěly -->
            <div style="background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; width: 340px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); box-sizing: border-box; flex-shrink: 0; text-align: left; max-height: calc(100vh - 40px); overflow-y: auto;">
                <div style="margin-bottom: 15px;">
                    <input type="text" v-model="search" placeholder="Search level..." style="width: 100%; padding: 10px; border: 1px solid #ccd1d9; border-radius: 4px; background: #fff; color: #000; font-size: 0.95rem; box-sizing: border-box;">
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <template v-for="(level, idx) in filteredList" :key="idx">
                        
                        <!-- NADPISY PRO SEKCE EXTENDED / LEGACY -->
                        <div v-if="level.isDivider" style="text-align: center; color: #9ba3af; font-weight: bold; font-size: 0.85rem; padding: 15px 0 10px 0; letter-spacing: 1px; border-bottom: 1px dashed #e1e4e8; margin-bottom: 5px;">
                            {{ level.dividerText }}
                        </div>

                        <!-- ŘÁDEK ÚROVNĚ -->
                        <div v-else @click="selected = list.indexOf(level)"
                            :style="{ 
                                cursor: 'pointer', 
                                background: list[selected] === level ? '#0070ff' : 'transparent',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px 12px'
                            }">
                            
                            <!-- ČÍSLOVÁNÍ: Buď #číslo pro Main/Extended, nebo slovo "Legacy" -->
                            <span :style="{ 
                                width: getLevelTier(level.rank) === 'legacy' ? '65px' : '45px', 
                                fontWeight: 'bold', 
                                color: list[selected] === level ? '#ffffff' : '#65676b',
                                fontSize: getLevelTier(level.rank) === 'legacy' ? '0.85rem' : '1rem'
                            }">
                                {{ getLevelTier(level.rank) === 'legacy' ? 'Legacy' : '#' + level.rank }}
                            </span>

                            <!-- NÁZEV ÚROVNĚ SE STYLINGEM PODLE SEKCE -->
                            <span :style="{ 
                                fontWeight: getLevelTier(level.rank) === 'main' ? 'bold' : 'normal', 
                                color: list[selected] === level ? '#ffffff' : getListTextColor(getLevelTier(level.rank)),
                                fontSize: getLevelTier(level.rank) === 'main' ? '1.1rem' : (getLevelTier(level.rank) === 'legacy' ? '0.9rem' : '1rem'),
                                fontStyle: getLevelTier(level.rank) === 'legacy' ? 'italic' : 'normal',
                                flex: 1
                            }">
                                {{ level.name }}
                            </span>
                        </div>

                    </template>
                </div>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Detail levelu + EMBEDOVANÉ VIDEO Z TVÝCH SOUBORŮ -->
            <div style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left; color: #000000; box-sizing: border-box;">
                <div v-if="entry">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h1 style="color: #000000; font-size: 2.5rem; margin: 0 0 5px 0; font-weight: 800;">{{ entry.name }}</h1>
                        <p style="color: #65676b; font-size: 1.1rem; margin: 0;">by <span style="font-weight: bold; color: #000;">{{ entry.author || 'Unknown' }}</span></p>
                    </div>

                    <!-- EMBEDOVANÉ YOUTUBE VIDEO Z TVÉHO JSON SOUBORU -->
                    <div v-if="entry.verification" style="width: 100%; max-width: 800px; margin: 0 auto 25px auto; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <iframe style="width: 100%; height: 100%; border: none;" :src="embed(entry.verification)" allowfullscreen></iframe>
                    </div>

                    <div style="display: flex; gap: 40px; justify-content: center; padding: 20px 0; border-top: 1px solid #e1e4e8; border-bottom: 1px solid #e1e4e8; margin-bottom: 25px; text-align: center;">
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">List Tier</p>
                            <h3 style="color: #0070ff; margin: 0; font-size: 1.5rem; font-weight: 700; text-transform: uppercase;">{{ getLevelTier(entry.rank) }} list</h3>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.9rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Verification</p>
                            <h3 style="color: #2bba74; margin: 0; font-size: 1.5rem; font-weight: 700;">{{ entry.verifier || 'None' }}</h3>
                        </div>
                    </div>

                    <!-- ZÁZNAMY/REKORDY HRÁČŮ PRO DANÝ LEVEL -->
                    <h2 style="color: #000000; font-size: 1.4rem; margin: 25px 0 15px 0; font-weight: 700; border-bottom: 2px solid #0070ff; padding-bottom: 5px;">Records</h2>
                    <div v-if="!entry.records || entry.records.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="display: flex; flex-direction: column; gap: 10px;">
                        <div v-for="record in entry.records" style="background: #f8f9fa; border: 1px solid #e1e4e8; padding: 12px 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="font-weight: bold; color: #000;">{{ record.user }}</span>
                                <span style="color: #65676b; margin-left: 10px;">{{ record.percent }}%</span>
                                <span v-if="record.mobile" style="color: #0070ff; font-size: 0.8rem; font-weight: bold; margin-left: 10px; background: #e6f0ff; padding: 2px 6px; border-radius: 4px;">Mobile</span>
                            </div>
                            <a v-if="record.link" :href="record.link" target="_blank" style="color: #0070ff; font-weight: bold; text-decoration: none;">Watch Video</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `,
    data() {
        return {
            list: [],
            loading: true,
            selected: 0,
            search: '',
        };
    },
    computed: {
        filteredList() {
            // Filtrování podle vyhledávacího políčka
            if (this.search) {
                const query = this.search.toLowerCase();
                return this.list.filter(lvl => lvl.name.toLowerCase().includes(query));
            }

            // Automatické rozdělení do sekcí podle ranku (Main < 50, Extended < 100, Legacy 100+)
            let displayList = [];
            let hasExtendedDivider = false;
            let hasLegacyDivider = false;

            this.list.forEach((level) => {
                const tier = this.getLevelTier(level.rank);
                
                if (tier === 'extended' && !hasExtendedDivider) {
                    displayList.push({ isDivider: true, dividerText: "-- EXTENDED LIST --" });
                    hasExtendedDivider = true;
                }
                if (tier === 'legacy' && !hasLegacyDivider) {
                    displayList.push({ isDivider: true, dividerText: "-- LEGACY LIST --" });
                    hasLegacyDivider = true;
                }
                displayList.push(level);
            });

            return displayList;
        },
        entry() {
            return this.list[this.selected] || null;
        }
    },
    async mounted() {
        try {
            // Načte surová data z tvých json souborů na GitHubu
            this.list = await fetchList();
            this.loading = false;
        } catch (e) {
            console.error(e);
            this.loading = false;
        }
    },
    methods: {
        embed,
        getLevelTier(rank) {
            if (rank <= 49) return 'main';
            if (rank <= 99) return 'extended';
            return 'legacy';
        },
        getListTextColor(tier) {
            if (tier === 'main') return '#000000';         // Čistě černá
            if (tier === 'extended') return '#4b5563';     // Jemnější, světlejší tmavě šedá
            if (tier === 'legacy') return '#9ca3af';       // Světle šedá do bíla
            return '#000000';
        }
    }
};
