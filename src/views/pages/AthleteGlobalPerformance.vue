<template>
    <div class="grid" v-if="athleteData && results.length">
        <div class="col-12">
            <div class="card">
                <Button class="mb-0" label="Back" severity="secondary" @click="router.back()" />
                <h2 class="text-center  mt-0">
                    {{ athleteData.name }}
                </h2>
            </div>

            <div className="card">
                <h3>
                    AI generated review
                </h3>

                <ProgressSpinner v-if="loadingReview" />
                <template v-else-if="!loadingReview && performanceReview.length">
                    <vue-markdown :source="performanceReview" />
                    <div class="flex justify-content-end">
                        <Button class="mb-2" :label="showChat ? 'Hide' : 'Ask questions'" severity="secondary"
                            @click="showChat = !showChat" />
                    </div>

                    <div class="" style="width: 100%;" v-if="showChat">
                        <div class="chat-container" style="width: 100%;">
                            <div class="chat-messages">
                                <div v-for="(message, index) in messages" :key="index"
                                    :class="['chat-message', { 'chat-message-sent': message.sender === 'user', 'chat-message-received': message.sender !== 'user' }]">
                                    <div class="chat-message-content">
                                        <vue-markdown :source="message.text" v-if="message.sender !== 'user'" />
                                        <div class="chat-message-text" v-else>{{ message.text }}</div>
                                        <div class="chat-message-meta">
                                            <span class="chat-message-sender">{{ message.senderName }}</span>
                                            <span class="chat-message-time">{{ message.time }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="chat-input">
                                <InputText v-model="newMessage" placeholder="Type a message" @keyup.enter="sendMessage"
                                    class="chat-input-text" />
                                <Button icon="pi pi-send" @click="sendMessage" class="chat-send-button" />
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div className="card">
                <!-- <Button class="mb-0" :label="showGlobalRadarChart ? 'Show detailed' : 'Show global'"
                    severity="secondary" @click="showGlobalRadarChart = !showGlobalRadarChart" /> -->
                <h3>
                    Athlete Performance Metrics
                </h3>
                <p>
                    This radar chart summarizes the athlete's performance metrics across all competitions, including
                    total scores, total 10s, total 9s, Result 1, and Result 2 averages.
                </p>
                <!-- <div v-if="showGlobalRadarChart">
                    <canvas ref="performanceGlobalRadarChart"></canvas>
                </div> -->
                <div>
                    <canvas ref="performanceRadarChart"></canvas>
                </div>
            </div>

            <div className="card">
                <h3>
                    Total Scores per Competition
                </h3>
                <p>
                    This bar chart displays the total scores achieved by the athlete in each competition.
                </p>
                <div>
                    <canvas ref="totalScoresChart"></canvas>
                </div>
            </div>

            <div className="card">
                <h3>
                    Scores Over Competitions
                </h3>
                <p>
                    This line chart shows the scores of Result 1 and Result 2 for each competition, indicating
                    performance across different events.
                </p>
                <div>
                    <canvas ref="scoresLineChart"></canvas>
                </div>
            </div>

            <div className="card">
                <h3>
                    Distribution of Total 10s and 9s </h3>
                <p>
                    This pie chart represents the distribution of the total number of 10s and 9s scored by the
                    athlete in all competitions.
                </p>
                <div>
                    <canvas ref="distributionChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, nextTick, watchEffect, watch } from 'vue';
import VueMarkdown from 'vue-markdown-render'
import { useRoute, useRouter } from 'vue-router';
import { ResultService } from '../../service/ResultService';
import Chart from 'chart.js/auto';
import { register } from 'vue-advanced-chat'
import { ChatService } from '../../service/ChatService';
import ProgressSpinner from 'primevue/progressspinner';
register()


const route = useRoute();
const router = useRouter();
const athleteId = ref(route.params.id);
const showChat = ref(false);
const loadingReview = ref(false);

const athleteData = ref(null);
const results = ref([])
const showGlobalRadarChart = ref(false);


const resultService = new ResultService();
const chatService = new ChatService();

const performanceReview = ref('');

const totalScoresChart = ref();
const scoresLineChart = ref();
const distributionChart = ref();
const performanceGlobalRadarChart = ref();
const performanceRadarChart = ref();

const messages = ref([]);
const newMessage = ref('');




watch(() => [showGlobalRadarChart.value], async () => {
    // debugger
    await nextTick();
    buildRadarChart();
});

onMounted(() => {
    resultService.getResultsByAthleteId(athleteId.value)
        .then(async (data) => {
            results.value = data;
            athleteData.value = data[0].athlete;



            await nextTick();
            buildCharts();
            loadingReview.value = true;
            return chatService.getPerformanceReview(results.value);
        })
        .then(res => {
            performanceReview.value = res
            loadingReview.value = false;
        });

});

const sendMessage = () => {
    if (newMessage.value.trim() !== '') {
        messages.value.push({ sender: 'user', text: newMessage.value })

        chatService.getQuestionAnswered(results.value, newMessage.value)
            .then((res) => {
                messages.value.push({ sender: 'system', text: res })
            });
        newMessage.value = '';
    }
}

// Function to truncate competition names
function truncateName(name, length = 20) {
    return name.length > length ? name.substring(0, length) + '...' : name;
}

function buildCharts() {
    const labels = results.value.map(item => truncateName(item.competition.name));
    const fullLabels = results.value.map(item => item.competition.name);
    // totalScoresChart
    new Chart(totalScoresChart.value, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Scores',
                data: results.value.map(item => item.total),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Total Scores per Competition'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return 'Total: ' + context.raw;
                        },
                        afterLabel: function (context) {
                            return 'Competition: ' + fullLabels[context.dataIndex];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // scoresLineChart
    new Chart(scoresLineChart.value, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Result 1',
                    data: results.value.map(item => item.result1),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: 'Result 2',
                    data: results.value.map(item => item.result2),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Scores Over Competitions'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.raw;
                        },
                        afterLabel: function (context) {
                            return 'Competition: ' + fullLabels[context.dataIndex];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // distributionChart
    const total10s = results.value.reduce((acc, item) => acc + parseInt(item.total10s), 0);
    const total9s = results.value.reduce((acc, item) => acc + parseInt(item.total9s), 0);
    new Chart(distributionChart.value, {
        type: 'pie',
        data: {
            labels: ['Total 10s', 'Total 9s'],
            datasets: [{
                data: [total10s, total9s],
                backgroundColor: ['rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Distribution of Total 10s and 9s'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    buildRadarChart();
}

function buildRadarChart() {
    if (showGlobalRadarChart.value) {
        // Radar Chart for Athlete Performance Metrics
        new Chart(performanceGlobalRadarChart.value, {
            type: 'radar',
            data: {
                labels: ['Total Scores', 'Total 10s', 'Total 9s', 'Result 1', 'Result 2'],
                datasets: [{
                    label: 'Global Performance Metrics',
                    data: [
                        results.value.reduce((acc, item) => acc + parseInt(item.total), 0) / results.value.length,
                        results.value.reduce((acc, item) => acc + parseInt(item.total10s), 0) / results.value.length,
                        results.value.reduce((acc, item) => acc + parseInt(item.total9s), 0) / results.value.length,
                        results.value.reduce((acc, item) => acc + parseInt(item.result1), 0) / results.value.length,
                        results.value.reduce((acc, item) => acc + parseInt(item.result2), 0) / results.value.length
                    ],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Global Athlete Performance Metrics'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.raw;
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        new Chart(performanceRadarChart.value, {
            type: 'radar',
            data: {
                labels: ['Total Scores', 'Total 10s', 'Total 9s', 'Result 1st half', 'Result 2nd half'],
                datasets: results.value.map((item, index) => ({
                    label: truncateName(item.competition.name),
                    data: [
                        parseInt(item.total).toFixed(),
                        parseInt(item.total10s).toFixed(),
                        parseInt(item.total9s).toFixed(),
                        parseInt(item.result1).toFixed(),
                        parseInt(item.result2).toFixed()
                    ],
                    backgroundColor: `rgba(${index * 50 % 255}, ${index * 100 % 255}, ${index * 150 % 255}, 0.2)`,
                    borderColor: `rgba(${index * 50 % 255}, ${index * 100 % 255}, ${index * 150 % 255}, 1)`,
                    borderWidth: 1
                }))
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Competition-wise Performance Metrics'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.raw;
                            }
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
</script>
<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 400px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.chat-message {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
}

.chat-message-sent .chat-message-content {
    align-self: flex-end;
    background-color: #dcf8c6;
}

.chat-message-received .chat-message-content {
    align-self: flex-start;
    background-color: #f1f0f0;
}

.chat-message-content {
    max-width: 70%;
    padding: 10px;
    border-radius: 10px;
    position: relative;
    word-wrap: break-word;
}

.chat-message-text {
    margin-bottom: 5px;
}

.chat-message-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: #888;
}

.chat-input {
    display: flex;
    margin-top: 10px;
}

.chat-input-text {
    flex: 1;
    margin-right: 10px;
}

.chat-send-button {
    padding: 0.5rem 1rem;
}
</style>