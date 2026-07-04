import { fetchList } from '../content.js';
import { embed } from '../util.js';
import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    template: `
        <main v-if="loading">
            <Spinner />
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list">
                    <tr v-for="(level, idx) in list" :class="{ active: selected === idx }" @click="selected = idx">
                        <td class="rank">
                            <p class="type-label-lg">#{{ idx + 1 }}</p>
                        </td>
                        <td class="level">
                            <p class="type-label-lg">{{ level.name }}</p>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div v-if="entry" class="level">
                    <h1 class="type-title">{{ entry.name }}</h1>
                    <p class="type-body">By {{ entry.author }}</p>
                    <div class="video-container">
                        <iframe :src="embed(entry.verification)" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <div class="stats">
                        <p class="type-body">Verifier: {{ entry.verifier }}</p>
                    </div>
                    <div v-if="entry.records && entry.records.length > 0" class="records">
                        <h2 class="type-title">Records</h2>
                        <div v-for="record in entry.records" class="record">
                            <p class="type-body"><strong>{{ record.user }}</strong> - {{ record.percent }}%</p>
                            <a :href="record.link" target="_blank" class="type-body">Video</a>
                        </div>
                    </div>
                </div>
                <div v-else class="level no-data">
                    <p class="type-body">Select a level to view stats.</p>
                </div>
            </div>
        </main>
    `,
    data() {
        return {
            list: [],
            loading: true,
            selected: 0,
        };
    },
    computed: {
        entry() {
            return this.list[this.selected];
        },
    },
    async mounted() {
        this.list = await fetchList();
        this.loading = false;
    },
    methods: {
        embed,
    },
};
