const base = "https://site.api.espn.com/apis/site/v2";
function loadTeams(query) {
  // fetch the data from the API
  fetch(`${base}${query}`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      // get the teams from the nested objects in json
      // console.log(data.sports[0].leagues[0].teams)
      // console.log(typeof data.sports[0].leagues[0].teams[0].team.id)
      return data.sports[0].leagues[0].teams;
    })
    .then((list) => {
      // get the leagues list, remove old league's teams, add newly
      // fetched teams to the list
      const leaguesList = document.querySelector("#leagues-list");
      while (leaguesList.firstChild) {
        leaguesList.removeChild(leaguesList.firstChild);
      }
      list.forEach((team) => {
        leaguesList.appendChild(buildCard(team.team));
      });
      addEventListeners();
    });
}

function addEventListeners() {
  const items = document.querySelectorAll("#leagues-list .team-link");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const teamId = item.id; // Get the team ID from the link's ID

      const activeLeague = document.querySelector(
        "#league-selectors .selector-active"
      );
      sessionStorage.setItem("teamId", teamId);
      sessionStorage.setItem("sport", activeLeague.getAttribute("data-sport"));
      sessionStorage.setItem(
        "league",
        activeLeague.getAttribute("data-league")
      );

      window.location.href = `../team/index.html?team=${item.getAttribute(
        "data-team-name"
      )}`; // Redirect to the team pageleague page
      console.log(document.cookie); // Log the team ID to the console
    });
  });
}

/** Create the image element for the list item */
const buildImg = (teamData) => {
  const img = document.createElement("img");
  img.src = teamData.logos[0].href;
  img.classList.add("team-logo");
  img.alt = teamData.displayName;
  return img;
};

/** Create the link to team page based on team id
 * @param {Object} teamData - team object
 * @param img - image element
 * @param span - span element
 */
const buildLink = (name, img, span, id) => {
  const link = document.createElement("a");
  link.href = "#";
  link.appendChild(img);
  link.appendChild(span);
  link.classList.add("team-link");
  link.id = id;
  name = name.split(" ").join("");
  link.setAttribute("data-team-name", name);
  return link;
};

/** Create the list item card for display
 * @param {*} teamData the team data object
 */
function buildCard(teamData) {
  const li = document.createElement("li");
  const img = buildImg(teamData);
  const span = document.createElement("span");
  span.textContent = teamData.displayName;

  const link = buildLink(teamData.displayName, img, span, teamData.id);
  li.appendChild(link);
  li.classList.add("team-card");
  return li;
}

/** Initial anonymous function to update the active league
 *  in the selector items and re-display the teams list
 */
(function () {
  loadTeams(document.querySelector(".selector-active").value);

  let selectors = document.querySelectorAll("#league-selectors button");
  selectors.forEach((select) => {
    select.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelector(".selector-active")
        .classList.remove("selector-active");
      e.target.classList.add("selector-active");

      loadTeams(e.target.value);
    });
  });
  // Now that teams are loaded, add a listener to get team info for a query to display team info
})();
