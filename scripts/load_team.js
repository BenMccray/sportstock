/**
 * Load the team data from local storage and display a graph of the wins over the weeks
 * Give options of other stats the team can display
 *
 * Add list of players below to choose a player whose stats should be displayed instead
 *
 * Add functionality to save the team/player to the locker
 */

/**
 * Identify the team to display stats for
 * based on local storage of team's id and make a Promise
 */
async function identifyTeam(teamId, sport, league, currentYear) {
  // Get the team's athlete endpoints
  const teamRosterEndpoint = `https://site.api.espn.com/apis/site/v2/sports/`;
  const query = `${sport}/${league}/teams/${teamId}/roster`;

  const teamEndpoint = `https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/${currentYear}/teams/${teamId}`;

  // check to see if the last clicked team is the team we need
  // ie if page is reloaded, we go back then forward in browser history, or same team is clicked twice
  let rosterData = sessionStorage.getItem("rosterData");
  let teamData = sessionStorage.getItem("teamData");
  let cacheTeamId = sessionStorage.getItem("cacheTeamId");
  let cacheLeague = sessionStorage.getItem("cacheLeague");
  if (
    rosterData &&
    teamData &&
    cacheTeamId == teamId &&
    cacheLeague == league
  ) {
    rosterData = JSON.parse(rosterData);
    teamData = JSON.parse(teamData);
    return { teamData, rosterData };
  }
  try {
    const rosterResponse = await fetch(teamRosterEndpoint + query);
    let rosterData = await rosterResponse.json();

    const teamResponse = await fetch(teamEndpoint);
    let teamData = await teamResponse.json();
    teamData = {
      teamName: teamData.displayName,
      teamLogo: teamData.logos[0].href,
      teamRecordEndpoint: teamData.record.$ref,
    };
    rosterData = rosterData.athletes;
    return { teamData, rosterData };
  } catch (error) {
    throw new Error("Failed to fetch data on line" + error);
  }
}

/**
 * Retrieve the query bits from local storage
 *
 * @returns the query variables from local storage
 */
function retrieveStoredQueryBits() {
  const teamId = sessionStorage.getItem("teamId");
  const sport = sessionStorage.getItem("sport");
  const league = sessionStorage.getItem("league");

  return { teamId, sport, league };
}

/**
 * Load the team graph and data/stat options
 *
 * @param teamId
 */
async function loadTeamGraph(teamData) {
  const teamName = teamData.teamName;
  const teamLogo = teamData.teamLogo;
  const teamRecordEndpoint = teamData.teamRecordEndpoint;
  const teamCardCache = sessionStorage.getItem("teamCardCache");
  // if it's memoized, it's faster and easier on api to used cached info
  // memoized: last clicked team
  if (teamCardCache && JSON.parse(teamCardCache)[0] === teamName) {
    const [teamName, teamLogo, teamRecord] = JSON.parse(teamCardCache);
    buildTeamCard(teamName, teamLogo, teamRecord);
    return;
  }
  try {
    const recordResponse = await fetch(teamRecordEndpoint);
    if (!recordResponse.ok) {
      throw new Error("Failed to fetch team record data on line " + error);
    }
    const recordData = await recordResponse.json();

    const teamRecord = recordData.items[0].summary;
    sessionStorage.setItem(
      "teamCardCache",
      JSON.stringify([teamName, teamLogo, teamRecord])
    );
    buildTeamCard(teamName, teamLogo, teamRecord);
  } catch (error) {
    throw new Error("Failed to fetch team record data on line " + error);
  }
}

function buildTeamCard(teamName, teamLogo, teamRecord) {
  const teamContainer = document.querySelector("#graph");

  const h1 = document.createElement("h1");
  h1.textContent = teamName;
  h1.classList.add("team-name");

  const img = document.createElement("img");
  img.src = teamLogo;
  img.alt = teamName;
  img.classList.add("team-logo");

  const span = document.createElement("span");
  span.textContent = "Current record: " + teamRecord;
  span.classList.add("team-record");

  const div = document.createElement("div");
  div.classList.add("team-info");

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save to Locker";
  saveBtn.id = "save-btn";
  const articleBtn = document.createElement("button");
  articleBtn.textContent = "Find Articles";
  articleBtn.id = "article-btn";
  div.appendChild(h1);
  div.appendChild(span);
  div.appendChild(articleBtn);
  div.appendChild(saveBtn);

  teamContainer.appendChild(img);
  teamContainer.appendChild(div);
}
/**
 * Load the team players into a list
 * looking similar to the leagues list
 *
 * @param teamId
 */
function loadTeamPlayers(rosterCategories) {
  // Get the team ID from the cookie
  const playerList = document.getElementById("player-list");
  rosterCategories.forEach((category) => {
    if (category.items) {
      category.items.forEach((athlete) => {
        if (athlete.status.name === "Active" && athlete.headshot) {
          const bundle = bundleAttributes(athlete);

          const playerListItem = createPlayerListItem(bundle);
          playerList.appendChild(playerListItem);

          // TODO: Memoize the team so if we need to go back or reload,
          // we don't have to refetch the roster
        }
      });
    } else {
      let athlete = category;
      const bundle = bundleAttributes(athlete);
      const playerListItem = createPlayerListItem(bundle);

      playerList.appendChild(playerListItem);
    }
  });
}

/**
 * Bundle the attributes of the player
 *
 * @param athlete - the athlete object
 * @returns the attributes of the player
 */
function bundleAttributes(athlete) {
  return {
    displayName: athlete.displayName,
    playerIconURL: athlete.headshot.href,
    playerPosition: athlete.position.name,
    playerJerseyNumber: athlete.jersey,
    playerCategory: athlete.position,
    playerId: athlete.id,
  };
}

/**
 * Create a player list item
 *
 * @param bundle - the attributes of the player
 * @returns player list item
 */
function createPlayerListItem(bundle) {
  // Destructure the bundle
  const {
    displayName,
    playerIconURL,
    playerPosition,
    playerJerseyNumber,
    playerCategory,
    playerId,
  } = bundle;
  // Create the player list item
  const playerListItem = document.createElement("li");
  playerListItem.setAttribute("data-player-name", displayName);

  const playerLink = document.createElement("a");
  // Create the player icon image
  const playerIcon = document.createElement("img");
  playerIcon.src = playerIconURL;
  playerIcon.alt = displayName;
  playerIcon.classList.add("player-icon");

  // Create the player text
  const playerText = document.createElement("p");
  // Create the player name
  const playerName = document.createElement("span");
  playerName.textContent = displayName;
  playerName.classList.add("player-name");

  // Create the player info
  const playerInfo = document.createElement("span");
  playerInfo.textContent = `${playerPosition} ${
    playerJerseyNumber === undefined ? "" : "| #" + playerJerseyNumber
  }`;
  playerInfo.classList.add("player-info");

  // Append the player name and info to the player text
  playerText.appendChild(playerName);
  playerText.appendChild(playerInfo);

  // Set the player list item attributes
  // playerListItem.setAttribute("data-player-category", playerCategory);
  playerLink.id = playerId;
  // placeholder of the espn player profile url
  playerLink.href = `./player/index.html`;
  playerLink.addEventListener("click", () => {
    sessionStorage.setItem("searchQuery", displayName);
  });

  // Append the player icon and text to the player list item
  playerLink.appendChild(playerIcon);
  playerLink.appendChild(playerText);
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save to Locker";
  saveBtn.id = "save-player-btn";
  // saveBtn.addEventListener("click", () => {
  //   saveToLocker(undefined, undefined, bundle);
  // });
  playerListItem.appendChild(playerLink);
  playerListItem.appendChild(saveBtn);
  return playerListItem;
}

/**
 * Save the team to the locker
 * each player should have a picture,
 * name, and stat of choice
 * add edit and delete buttons
 *
 * @param teamId
 */
function saveToLocker(
  teamData = undefined,
  rosterData = undefined,
  playerItem = undefined
) {
  let locker = JSON.parse(localStorage.getItem("locker")) || [];

  if (Array.isArray(locker)) {
    if (playerItem) {
      locker.push({
        type: "player",
        data: playerItem,
      });
    } else {
      locker.push({
        type: "team",
        teamData: teamData,
        rosterData: rosterData,
      });
    }
    localStorage.setItem("locker", JSON.stringify(locker));
  } else {
    // Initialize new locker if current one is invalid
    const newItem = playerItem
      ? {
          type: "player",
          data: playerItem,
        }
      : {
          type: "team",
          teamData: teamData,
          rosterData: rosterData,
        };
    localStorage.setItem("locker", JSON.stringify([newItem]));
  }
}

(async function () {
  // Get the team from the cookie
  const { teamId, sport, league } = retrieveStoredQueryBits();
  const currentYear = new Date().getFullYear();
  const { teamData, rosterData } = await identifyTeam(
    teamId,
    sport,
    league,
    currentYear
  );

  loadTeamGraph(teamData);
  sessionStorage.setItem("teamData", JSON.stringify(teamData));
  loadTeamPlayers(rosterData);
  sessionStorage.setItem("rosterData", JSON.stringify(rosterData));
  sessionStorage.setItem("cacheTeamId", teamId);
  sessionStorage.setItem("cacheLeague", league);
  document.querySelector("#save-btn").addEventListener("click", () => {
    saveToLocker(teamData, rosterData);
  });
})();
