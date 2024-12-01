/**
 * Set the player to display stats for
 * based on cookie of player's id and team id
 *
 * @param playerId
 */
async function setPlayer(bundle, sport, league, currentYear) {
  // Destructure the bundle
  const {
    displayName,
    playerIconURL,
    playerPosition,
    playerJerseyNumber,
    playerCategory,
    playerId,
  } = bundle;
  const playerEndpoint = `https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/seasons/${currentYear}/athletes/${playerId}/eventlog`;

  const playerEventLogResponse = await fetch(playerEndpoint);
  const playerEventLogData = await playerEventLogResponse.json();

  //   console.log(statEndpoints);
}
(function () {
  const playerPackage = JSON.parse(localStorage.getItem("playerPackage"));
  const { bundle, sport, league, currentYear, teamId } = playerPackage;
  console.log(sport);
  if (playerPackage) {
    setPlayer(bundle, sport, league, currentYear);
  } else {
    // window.location.href = `../index.html?team=${playerPackage.teamId}`;
  }
})();
