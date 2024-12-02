const API_KEY = "8f5454aa84b6d4cc5968d292ac0cda25";


async function getSportsIOPlayer(sport, playerName, currentYear) {
    try {
        const sportsIOPlayer = await fetch(`https://v1.${sport}.api-sports-io/players?name=${playerName}&season=${currentYear}`, {
            method: "GET",
            headers: {
                "x-rapidapi-host": `v1.${sport}.api-sports.io`,
                "x-rapidapi-key": API_KEY
            }
        });
        return await sportsIOPlayer.json();
    } catch (error) {
        try {
            const sportsIOPlayer = await fetch(`https://v1.${sport}.api-sports-io/players?name=${playerName}&season=${currentYear-1}`, {
                method: "GET", 
                headers: {
                    "x-rapidapi-host": `v1.${sport}.api-sports.io`,
                    "x-rapidapi-key": API_KEY
                }
            });
            return await sportsIOPlayer.json();
        } catch (error) {
            console.error("No current or previous player data:", error);
            throw error;
        }
    }
}

async function getPlayedGames(sport, teamId, currentYear) {
    try {
        const playedGames = await fetch(`https://v1.${sport}.api-sports.io/games?date=${currentYear}&team=${teamId}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": `v1.${sport}.api-sports.io`,
                "x-rapidapi-key": API_KEY
            }
        });
        return await playedGames.json();
    } catch (error) {
        try {
            const playedGames = await fetch(`https://v1.${sport}.api-sports.io/games?date=${currentYear-1}&team=${teamId}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": `v1.${sport}.api-sports.io`,
                    "x-rapidapi-key": API_KEY
                }
            });
            return await playedGames.json();
        } catch (error) {
            console.error("No played games:", error);
            throw error;
        }
    }
}

async function getPlayerStatistics(sport, playerId, gameId) {
    try {
        const playerStatistics = await fetch(`https://v1.${sport}.api-sports.io/players/statistics?id=${id}&season=${currentYear}`, {
            method: "GET",
            headers: {
                "x-rapidapi-host": `v1.${sport}.api-sports.io`,
                "x-rapidapi-key": API_KEY
            }
        });
        return await playerStatistics.json();
    } catch (error) {
        try {
            const playerStatistics = await fetch(`https://v1.${sport}.api-sports.io/players/statistics?id=${id}&season=${currentYear-1}`, {
                method: "GET",
                headers: {
                    "x-rapidapi-host": `v1.${sport}.api-sports.io`,
                    "x-rapidapi-key": API_KEY
                }
            });
            return await playerStatistics.json();
        } catch (error) {
            console.error("No current or previous player statistics:", error);
            throw error;
        }
    }
}

(function() {
    const currentYear = new Date().getFullYear();
    const playerInfo = JSON.parse(sessionStorage.getItem("playerInfo"));
    let sport;
    switch(playerInfo.sport) {
        case "nfl":
            sport = "american-football";
            break;
        case "nba":
            sport = "basketball";
            break;
        case "mlb":
            sport = "baseball";
            break;
        case "nhl":
            sport = "hockey";
            break;
    }
})();