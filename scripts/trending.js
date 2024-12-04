
async function getLeaders(indices, categories) {
  const [first, second] = indices;
  let firstLeadPlace = Math.min(Math.floor(Math.random() * (categories[first].leaders.length + 1)), categories[first].leaders.length - 1);
  let secondLeadPlace = Math.min(Math.floor(Math.random() * (categories[second].leaders.length + 1)), categories[second].leaders.length - 1);

  let firstLeader = categories[first].leaders[firstLeadPlace].athlete.$ref;
  let secondLeader = categories[second].leaders[secondLeadPlace].athlete.$ref;
  firstLeader = firstLeader.replace("http", 'https');

  do {
    try {
      console.log(secondLeadPlace, categories[second].leaders)

      secondLeadPlace = Math.min(Math.floor(Math.random() * (categories[second].leaders.length + 1)), categories[second].leaders.length - 1);
      secondLeader = categories[second].leaders[secondLeadPlace].athlete.$ref;
    } catch (err) {
      continue;
    }
  } while (firstLeader === secondLeader);
  secondLeader = secondLeader.replace("http", 'https');
  const firstResp = await fetch(firstLeader);
  const firstData = await firstResp.json();
  const secondResp = await fetch(secondLeader);
  const secondData = await secondResp.json();

  return [[{ stat: categories[first].displayName, data: firstData }, { stat: categories[second].displayName, data: secondData }], [firstLeadPlace, secondLeadPlace]]
}
function populateTrending(randomTrending, numbers) {
  const list = document.getElementById("trending-list");
  randomTrending.forEach((group, i) => {
    let bundle = bundleAttributes(group[0].data, `#${numbers[i][0]} in ${group[0].stat}`);

    let playerListItem = createPlayerListItem(bundle, `#${numbers[i][0]} in ${group[0].stat}`);
    list.appendChild(playerListItem);

    bundle = bundleAttributes(group[1].data, `#${numbers[i][1]} in ${group[1].stat}`);
    playerListItem = createPlayerListItem(bundle, `#${numbers[i][1]} in ${group[1].stat}`);
    list.appendChild(playerListItem);
  })
}

function bundleAttributes(athlete, stat) {
  return {
    displayName: athlete.displayName,
    playerIconURL: athlete.headshot.href,
    playerPosition: athlete.position.name,
    playerJerseyNumber: athlete.jersey,
    playerId: athlete.id,
    playerTeam: stat,
    playerLeague: "Trending"
  };
}

function createPlayerListItem(bundle, stat) {
  // Destructure the bundle
  const {
    displayName,
    playerIconURL,
    playerPosition,
    playerJerseyNumber,
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
  playerInfo.textContent = stat;
  playerInfo.classList.add("player-info");

  // Append the player name and info to the player text
  playerText.appendChild(playerName);
  playerText.appendChild(playerInfo);

  // Set the player list item attributes
  // playerListItem.setAttribute("data-player-category", playerCategory);
  playerLink.id = playerId;
  // placeholder of the espn player profile url
  playerLink.addEventListener("click", () => {
    sessionStorage.setItem("searchQuery", JSON.stringify({ name: displayName, playerId: playerId }));
  });
  playerLink.href = `../team/news/index.html`;


  // Append the player icon and text to the player list item
  playerLink.appendChild(playerIcon);
  playerLink.appendChild(playerText);
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save to Locker";
  saveBtn.id = "save-player-btn";
  saveBtn.addEventListener("click", () => {
    saveToLocker(bundle);
  });
  playerListItem.appendChild(playerLink);
  playerListItem.appendChild(saveBtn);
  return playerListItem;
}
function saveToLocker(

  playerItem = undefined
) {
  let locker = JSON.parse(localStorage.getItem("locker")) || [];

  if (playerItem) {
    console.log
    if (!locker.filter(item => item.type === "player").find((item) => item.data.playerId === playerItem.playerId)) {
      locker.push({
        type: "player",
        data: playerItem,
      });
    }
  }
  localStorage.setItem("locker", JSON.stringify(locker));
  console.log(locker)

}
(async function () {
  const sports = ["football", "basketball", "baseball", "hockey"];
  const leagues = ['nfl', 'nba', 'mlb', 'nhl'];
  let numbers = [[0, 9], [0, 4], [0, 5], [0, 6]];
  let randomTrending = []
  let groups;
  for (let i = 0; i < 4; i++) {
    const [max, min] = numbers[i]
    // Generate the first random number
    const first = Math.floor(Math.random() * (max - min + 1)) + min;

    // Generate the second random number (different from the first)
    let second;
    do {
      second = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (second === first);
    let year = new Date().getFullYear();
    const response = await fetch(`https://sports.core.api.espn.com/v2/sports/${sports[i]}/leagues/${leagues[i]}/seasons/${year}/types/2/leaders/0?lang=en@ion=us`);
    const endpoints = await response.json();
    const categories = endpoints.categories;
    console.log(first, second)
    groups = await getLeaders([first, second], categories)
    randomTrending.push(groups[0])
    numbers[i] = [groups[1][0], groups[1][1]]
  }
  console.log(randomTrending);
  populateTrending(randomTrending, numbers);
})();