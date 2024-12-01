function removeNoLockerNotif() {
  const notif = document.querySelector("#no-locker-notif");
  if (notif) {
    notif.remove();
  }
}

function populateLocker(locker) {
  const lockerList = document.querySelector("#locker-list");
  locker.forEach((lockerItem) => {
    const { teamData, rosterData } = lockerItem;
    const li = document.createElement("li");
    console.log(teamData);
  });
}

(function () {
  let locker = JSON.parse(localStorage.getItem("locker"));
  console.log(locker);

  if (locker) {
    removeNoLockerNotif();
    populateLocker(locker);
  }
})();

/**
 * TODO Check to see if lockerItem is a team or player, maybe use a flag or string variable and check that
 * TODO if it's a team, make a list item with a link to team page
 * TODO it it's a player, make a list item with a link to player page
 * TODO Add functionality to remove items from locker
 * TODO Add functionality to clear all items from locker, add an 'are you sure?' popup
 */
