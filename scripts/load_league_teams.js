const base = 'https://site.api.espn.com/apis/site/v2';
function loadTeams(query) {
    
    fetch(`${base}${query}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        // console.log(data.sports[0]);
        console.log(data.sports[0].leagues[0].teams)
        console.log(typeof data.sports[0].leagues[0].teams[0].team.id)
        return data.sports[0].leagues[0].teams;
      })
      .then((list) => {
        const leaguesList = document.querySelector("#leagues-list");
        while(leaguesList.firstChild) {
            leaguesList.removeChild(leaguesList.firstChild)
        }
        for (team of list) {
          leaguesList.appendChild(buildCard(team.team));
        };
      });
}


function buildCard(teamData) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = teamData.logos[0].href;
    img.classList.add("team-logo");
    img.alt = teamData.displayName;

    const span = document.createElement("span");
    span.textContent = teamData.displayName;

    const link = document.createElement("a");
    link.href = "../team/index.html";
    link.appendChild(img);
    link.appendChild(span);
    link.classList.add("team-link");

    li.appendChild(link);
    li.classList.add("team-card");
    return li
}

(function() {

    
    let small = window.matchMedia("(min-width: 399px) and (max-width: 768px)");
    loadTeams(document.querySelector(`${small.matches ? ".league-selector-sm" : ".league-selector"} .selector-active`).value);

    let selectors = document.querySelectorAll(`${small.matches ? ".league-selector-sm" : ".league-selector"} button`);
    selectors.forEach((select) => {
        select.addEventListener("click",  (e) => {            
            document.querySelector(`${small.matches ? ".league-selector-sm" : ".league-selector"} .selector-active`).classList.remove("selector-active");
            e.target.classList.add("selector-active");
            loadTeams(e.target.value);

        });
    });
})();