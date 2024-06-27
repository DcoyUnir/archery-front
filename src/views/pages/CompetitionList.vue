<template>
    <div class="grid">
        <div class="col-12">
            <div className="card">
                <div class="">
                    <h5 class="text-center">List of Competitions</h5>
                    <p class="text-center mb-0">
                        Competitions from 2023-2024 indoor season
                    </p>
                    <div class="flex justify-content-center">
                        <small class="text-center">
                            * Not every competition was loaded
                        </small>
                    </div>

                </div>
            </div>
            <div class="card">
                <DataTable ref="dt" :value="competitions" dataKey="id">
                    <!-- <Column field="id" header="Id" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Id</span>
                            {{ slotProps.data.competitionId }}
                        </template>
</Column> -->
                    <Column field="code" header="Code" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Code</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="name" header="Name" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="url" header="Url" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Url</span>
                            <a :href="slotProps.data.url" target="_blank" rel="noopener">
                                Link to Ianseo
                            </a>
                        </template>
                    </Column>
                    <Column field="organizer" header="Organizer" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Organizer</span>
                            <div>
                                {{ slotProps.data.organizer }}
                            </div>
                        </template>
                    </Column>
                    <Column field="location" header="Location" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Location</span>
                            <div>
                                {{ slotProps.data.location }}
                            </div>
                        </template>
                    </Column>
                    <Column field="date" header="Date" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date</span>
                            <div>
                                {{ slotProps.data.date }}
                            </div>
                        </template>
                    </Column>
                    <Column field="updated" header="Updated" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Updated</span>
                            <div>
                                {{ slotProps.data.updated }}
                            </div>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <router-link :to="{ name: 'competitionDetails', params: { id: slotProps.data.id } }">
                                <Button label="Details" />
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

const competitions = ref(null);
const dt = ref(null); // Data table ref
const competitionService = new CompetitionService();

onMounted(() => {
    competitionService.getCompetitions().then((data) => (competitions.value = data));
});
</script>