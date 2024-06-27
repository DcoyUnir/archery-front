export class CompetitionService {
    getCompetitions() {
        return fetch(import.meta.env.VITE_BASE_URL + '/competition')
            .then((res) => res.json())
            .then((d) => d);
    }

    getCompetitionById(competitionId) {
        return fetch(import.meta.env.VITE_BASE_URL + '/competition/' + competitionId)
            .then((res) => res.json())
            .then((d) => d);
    }
}
