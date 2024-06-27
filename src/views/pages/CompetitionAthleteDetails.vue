<template>
    <div class="grid" v-if="resultData">
        <div class="col-12">
            <div className="card">
                <Button class="mb-4" label="Back" severity="secondary" @click="router.back()" />
                <div class="">
                    <h3 class="text-center mb-0">
                        {{ resultData.competition.name }}
                    </h3>
                    <div class="flex justify-content-center mb-1">
                        <small>
                            {{ resultData.competition.code }} - {{ resultData.competition.date }}
                        </small>
                    </div>
                    <h5 class="text-center mb-0 mt-0">
                        {{ resultData.competition.organizer }}
                    </h5>
                    <h6 class="text-center mb-0 mt-0">
                        {{ resultData.competition.location }}
                    </h6>
                    <div class="flex justify-content-center">
                        <a :href="resultData.competition.url" target="_blank" rel="noopener">
                            Link to Ianseo
                        </a>
                    </div>

                </div>
            </div>
            <h3 class="text-center mt-0">
                Athlete
            </h3>
            <div class="card flex justify-content-center flex-column align-items-center">
                <h2 class="text-center  mt-0">
                    {{ resultData.athlete.name }}
                </h2>
                <router-link :to="{ name: 'athleteGlobalPerformance', params: { id: resultData.athlete.id } }">
                    <Button label="Global Performance" />
                </router-link>
            </div>
            <div className="card">
                <h3>
                    Position Progression
                </h3>
                <p>
                    This graph shows the athlete's ranking after each stage, which highlights the improvement or
                    decline in performance.
                </p>
                <div>
                    <canvas ref="positionProgressionChart"></canvas>
                </div>
            </div>

            <div className="card">
                <h3>
                    Score Comparison
                </h3>
                <p>
                    This graph compares the scores obtained in each stage, providing a clear view of performance
                    consistency or variation.
                </p>
                <div>
                    <canvas ref="scoreComparisonChart"></canvas>
                </div>
            </div>

            <div className="card">
                <h3>
                    Score Breakdown
                </h3>
                <p>
                    This graph breaks down the total scores into 9s and 10s, giving insight into the accuracy of the
                    shots.
                </p>
                <div>
                    <canvas ref="scoreBreakdownChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ResultService } from '../../service/ResultService';
import Chart from 'chart.js/auto';

const route = useRoute();
const router = useRouter();
const competitionId = ref(route.params.competitionId);
const athleteId = ref(route.params.athleteId);
const resultData = ref(null);

const positionProgressionChart = ref();
const scoreComparisonChart = ref();
const scoreBreakdownChart = ref();

const resultService = new ResultService();

onMounted(async () => {
    resultService.getResultsByCompetitionIdAndAthleteId(competitionId.value, athleteId.value)
        .then(async (data) => {
            resultData.value = data
            await nextTick();
            setCharts();
        });

});

function setCharts() {
    // positionProgressionChart
    new Chart(positionProgressionChart.value, {
        type: 'line',
        data: {
            labels: ['After Stage 1', 'After Stage 2'],
            datasets: [{
                label: 'Position',
                data: [resultData.value.positionAfter1, resultData.value.positionAfter2],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0
            }]
        },
        options: {
            scales: {
                y: {
                    type: 'linear',
                    reverse: true,
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Athlete Position Progression'
                }
            }
        }
    });

    // scoreComparisonChart
    new Chart(scoreComparisonChart.value, {
        type: 'bar',
        data: {
            labels: ['Stage 1', 'Stage 2'],
            datasets: [{
                label: 'Score',
                data: [245, 260],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            title: {
                display: true,
                text: 'Score Comparison by Stage'
            }
        }
    });

    // scoreBreakdownChart
    new Chart(scoreBreakdownChart.value, {
        type: 'doughnut',
        data: {
            labels: ['9s', '10s'],
            datasets: [{
                data: [20, 14],
                backgroundColor: ['rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Score Breakdown by 9s and 10s'
            }
        }
    });
}
</script>