// const base = 'https://site.api.espn.com/apis/site/v2';


function fetchTeamData(teamId) {
    let query = `${base}${loadTeams(document.querySelector(".league-selector.selector-active").value)}${teamId}`;
    console.log(query);
    fetch(`${query}`)
        .then(response => response.json())
        .then(data => {
            // Assume displayTeamData is a function that updates the UI with team data
        })
        .catch(error => console.error('Error fetching team data:', error));
}

(function() {
        let teams = document.querySelectorAll(".team-link");
        console.log(teams);
        teams.forEach(team => team.addEventListener("click", () => {
            let id = team.id;
            console.log(id);
            fetchTeamData(id);
        }));
        teams.forEach((team) => console.log(team.id));
})();
