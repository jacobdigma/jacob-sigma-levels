import Spinner from '../components/Spinner.js';
import { embed } from '../util.js';

export default {
    components: { Spinner },
    template: `
        <main style="background: #f4f2f5; padding: 10px; min-height: 100vh; display: flex; gap: 20px; align-items: flex-start; font-family: Arial, sans-serif; box-sizing: border-box;">
            
            <!-- LEVÝ PANEL: Kompletně předělaný seznam úrovní -->
            <div style="background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 15px; width: 240px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); box-sizing: border-box; flex-shrink: 0; text-align: left;">
                <div style="margin-bottom: 15px;">
                    <input type="text" v-model="search" placeholder="Search level..." style="width: 100%; padding: 10px; border: 1px solid #ccd1d9; border-radius: 4px; background: #FFF; color: #000; font-size: 0.95rem; box-sizing: border-box;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <template v-for="(level, idx) in filteredList" :key="idx">
                        
                        <!-- ODSTAVCE: EXTENDED LIST -->
                        <div v-if="level.isDivider" style="text-align: center; color: #8b8e9f; font-weight: bold; font-size: 0.85rem; padding: 15px 0 10px 0; letter-spacing: 1px; border-bottom: 1px dashed #e1e4e8; margin-bottom: 5px;">
                            {{ level.dividerText }}
                        </div>

                        <!-- KLASICKÝ ŘÁDEK LEVELU -->
                        <div v-else @click="selected = list.indexOf(level)"
                             :style="{
                                 cursor: 'pointer',
                                 background: list[selected] === level ? '#eef3ff' : 'transparent',
                                 borderRadius: '4px',
                                 display: 'flex',
                                 alignItems: 'center',
                                 padding: '10px 12px',
                                 transition: 'background 0.2s'
                             }">
                            
                            <!-- ČÍSLOVÁNÍ: Fixní číslo, pro legacy '-' -->
                            <span :style="{
                                width: level.type === 'legacy' ? '0px' : '45px',
                                fontWeight: 'bold',
                                color: list[selected] === level ? '#3b82f6' : '#a1a1a1',
                                fontSize: level.type === 'legacy' ? '0.01rem' : '1rem'
                            }">
                                {{ level.type === 'legacy' ? '' : '#' + level.rank }}
                            </span>

                            <!-- NÁZEV LEVELU SE SPECIFICKOU BARVOU PODLE TYPU -->
                            <span :style="{
                                fontWeight: level.type === 'main' ? 'bold' : 'normal',
                                color: list[selected] === level ? '#3b82f6' : getListTextColor(level.type),
                                fontSize: '1rem',
                                flex: 1
                            }">
                                {{ level.name }}
                            </span>
                        </div>

                    </template>
                </div>
            </div>

            <!-- PROSTŘEDNÍ PANEL: Dynamická videa a rekordy -->
            <div style="flex: 1; background: #ffffff; border: 1px solid #e1e4e8; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: left; color: #000000; box-sizing: border-box;">
                <div v-if="entry">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h1 style="color: #000000; font-size: 2.5rem; margin: 0 0 5px 0; font-weight: 800;">{{ entry.name }}</h1>
                        <p style="color: #65676b; margin: 0; font-size: 1.1rem; font-weight: bold;">by {{ entry.author }}</p>
                    </div>

                    <!-- PŘEHRÁVAČ VIDEA -->
                    <div v-if="entry.verification" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000; border-radius: 8px; margin-bottom: 25px;">
                        <iframe :src="getEmbedUrl(entry.verification)" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
                    </div>

                    <!-- TYP LISTU A BODY -->
                    <div style="display: flex; gap: 48px; justify-content: center; text-align: center; border-bottom: 1px solid #e1e4e8; padding-bottom: 20px; margin-bottom: 20px;">
                        <div>
                            <p style="color: #65676b; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">List Tier</p>
                            <h3 style="color: #2563eb; margin: 0; font-size: 1.6rem; font-weight: 800; text-transform: uppercase;">{{ entry.type }} List</h3>
                        </div>
                        <div>
                            <p style="color: #65676b; font-size: 0.85rem; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Points</p>
                            <h3 style="color: #10b981; margin: 0; font-size: 1.6rem; font-weight: 800;">{{ entry.points }}</h3>
                        </div>
                    </div>

                    <!-- REKORDY -->
                    <h2 style="color: #000000; font-size: 1.6rem; margin: 0 0 15px 0; font-weight: 700;">Records</h2>
                    <div v-if="!entry.records || entry.records.length === 0" style="color: #65676b; font-style: italic;">None</div>
                    <div v-else style="display: flex; flex-direction: column; gap: 10px;">
                        <div v-for="record in entry.records" :key="record.player" style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f8f9fa; border-radius: 4px;">
                            <span style="font-weight: 600;">{{ record.player }}</span>
                            <span style="color: #2563eb; font-weight: bold;">{{ record.percent }}%</span>
                        </div>
                    </div>

                </div>
                <div v-else style="display: flex; justify-content: center; align-items: center; min-height: 200px;">
                    <spinner v-if="loading"></spinner>
                    <p v-else style="color: #65676b; font-style: italic;">Select a level to view details</p>
                </div>
            </div>

        </main>
    `,
    data() {
        return {
            list: [],
            selected: 0,
            search: '',
            loading: true
        };
    },
    computed: {
        entry() {
            return this.filteredList[this.selected] || this.list[this.selected] || null;
        },
        filteredList() {
            if (!this.search) return this.list;
            return this.list.filter(level => 
                level.name && level.name.toLowerCase().includes(this.search.toLowerCase())
            );
        }
    },
    async mounted() {
        // Tady se v tvém projektu načítají data, předpokládám že z nějakého API nebo externího listu
        this.loading = false;
    },
    methods: {
        getListTextColor(type) {
            if (type === 'main') return '#000000';
            if (type === 'extended') return '#4b5563';
            if (type === 'legacy') return '#9ca3af';
            return '#000000';
        },
        getEmbedUrl(url) {
            if (!url) return '';
            
            // Pokud už odkaz obsahuje embed, vrátíme ho
            if (url.includes('/embed/')) {
                return url;
            }
            
            // Bezpečné vytažení ID videa z jakéhokoliv formátu YouTube odkazu
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            
            if (match && match[2].length === 11) {
                return 'https://youtube.com' + match[2];
            }
            
            return url;
        }
    }
};
