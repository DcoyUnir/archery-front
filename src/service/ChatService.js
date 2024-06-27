export class ChatService {
    getPerformanceReview(competitionsData) {
        return fetch(import.meta.env.VITE_CHAT_BASE_URL + '/chat/review', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                performanceData: competitionsData
            })
        })
            .then((res) => res.json())
            .then((d) => d.response);
    }

    getQuestionAnswered(competitionsData, message) {
        return fetch(import.meta.env.VITE_CHAT_BASE_URL + '/chat/ask', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                performanceData: competitionsData,
                message
            }),
        })
            .then((res) => res.json())
            .then((d) => d.response);
    }
}
