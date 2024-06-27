<template>
    <div class="grid" v-if="competitionData">
        <div class="col-12">
            <div className="card">
                <Button class="mb-4" label="Back" severity="secondary" @click="router.back()" />
                <div class="">
                    <h3 class="text-center mb-0">
                        {{ competitionData.name }}
                    </h3>
                    <div class="flex justify-content-center mb-1">
                        <small>
                            {{ competitionData.code }} - {{ competitionData.date }}
                        </small>
                    </div>
                    <h5 class="text-center mb-0 mt-0">
                        {{ competitionData.organizer }}
                    </h5>
                    <h6 class="text-center mb-0 mt-0">
                        {{ competitionData.location }}
                    </h6>
                    <div class="flex justify-content-center">
                        <a :href="competitionData.url" target="_blank" rel="noopener">
                            Link to Ianseo
                        </a>
                    </div>

                </div>
            </div>
            <div class="card">
                <DataTable ref="dt" :value="competitionAthletes" dataKey="id">
                    <Column field="name" header="Name">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.athlete.name }}
                        </template>
                    </Column>
                    <Column field="result1" header="Result 1">
                        <template #body="slotProps">
                            <span class="p-column-title">Result 1</span>
                            {{ slotProps.data.result1 }}
                        </template>
                    </Column>
                    <Column field="result2" header="Result 2">
                        <template #body="slotProps">
                            <span class="p-column-title">Result 2</span>
                            {{ slotProps.data.result2 }}
                        </template>
                    </Column>
                    <Column field="total9s" header="Total 9">
                        <template #body="slotProps">
                            <span class="p-column-title">Total 9</span>
                            {{ slotProps.data.total9s }}
                        </template>
                    </Column>
                    <Column field="total10s" header="Total 10">
                        <template #body="slotProps">
                            <span class="p-column-title">Total 10</span>
                            {{ slotProps.data.total10s }}
                        </template>
                    </Column>
                    <Column field="total" header="Total">
                        <template #body="slotProps">
                            <span class="p-column-title">Total</span>
                            {{ slotProps.data.total }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <router-link
                                :to="{ name: 'competitionAthleteDetails', params: { competitionId: competitionData.id, athleteId: slotProps.data.athlete.id } }">
                                <Button label="Graphs" />
                            </router-link>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { CompetitionService } from '../../service/CompetitionService';
import { useRoute, useRouter } from 'vue-router';
import { ResultService } from '../../service/ResultService';

const router = useRouter();
const route = useRoute();

const competitionId = ref(route.params.id);

const competitionData = ref(null);
const competitionAthletes = ref([])

const dt = ref(null); // Data table ref
const competitionService = new CompetitionService();
const resultService = new ResultService();

onMounted(() => {
    competitionService.getCompetitionById(competitionId.value).then((data) => (competitionData.value = data));
    resultService.getResultsByCompetitionId(competitionId.value).then((data) => (competitionAthletes.value = data));
});
</script>