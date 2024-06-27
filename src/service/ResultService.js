export class ResultService {
    getResultsByCompetitionId(competitionId) {
        return fetch(import.meta.env.VITE_BASE_URL + '/result/competition/' + competitionId)
            .then((res) => res.json())
            .then((d) => d);
    }

    getResultsByAthleteId(athleteId) {
        return fetch(import.meta.env.VITE_BASE_URL + '/result/athlete/' + athleteId)
            .then((res) => res.json())
            .then((d) => d);
    }

    getResultsByCompetitionIdAndAthleteId(competitionId, athleteId) {
        return fetch(import.meta.env.VITE_BASE_URL + `/result/competition/${competitionId}/athlete/${athleteId}`)
            .then((res) => res.json())
            .then((d) => d);
    }

    getResultsByClubId(clubId) {
        return fetch(import.meta.env.VITE_BASE_URL + '/result/club/' + clubId)
            .then((res) => res.json())
            .then((d) => d);
    }
}
