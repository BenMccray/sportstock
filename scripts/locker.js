function removeNoLockerNotif() {
  const notif = document.querySelector("#no-locker-notif");
  if (notif) {
    notif.remove();
  }
  let options = document.querySelector("#options")
  options.classList.remove("hidden");
  options.classList.add("flex");
}

function populateLocker(locker) {
  const lockerList = document.querySelector("#locker-list");
  locker.forEach((lockerItem) => {
    const li = document.createElement("li");
    const link = document.createElement('a');
    const exportBtn = document.createElement("button");
    const exportImg = document.createElement("img");
    const editBtn = document.createElement("button")
    const editImg = document.createElement("img");
    const deleteBtn = document.createElement("button");
    const deleteImg = document.createElement("img");
    const itemImage = document.createElement("img");
    const itemTextContainer = document.createElement("p");
    const itemName = document.createElement("h2");
    const itemDescription = document.createElement("span");
    const btnContainer = document.createElement("div");
    const listItemClasses = ["border-2", "border-green-500", "h-80", "w-full", "flex", "lg:flex-row", "flex-col", "rounded-xl", "items-center", "justify-between", "my-8", "mx-16"];
    const linkClasses = ["flex", "lg:flex-row", "flex-col", "items-center", "cursor-pointer", "h-full", "w-full", "grow"]
    const imgClasses = ["lg:max-h-full", "max-h-40", "p-2"]
    const btnClasses = ["h-12", "w-12", "my-2", "btncss"]
    const textContainerClasses = ["relative", "text-white", "flex", "flex-col", "lg:gap-4"]
    const nameClasses = ["text-2xl", "font-semibold"]
    const recordClasses = ["text-lg"]
    const btnContainerClasses = ["flex","lg:flex-col", "justify-evenly", "mb-6", "lg:mb-0", "gap-8", "gap-0", "mx-7"]

    let teamData, rosterData, playerData;
    if (lockerItem.type === "team") {

      teamData = lockerItem.teamData;
      rosterData = lockerItem.rosterData;
      itemImage.src = teamData.teamLogo;
      itemImage.alt = teamData.teamName;

      itemName.textContent = teamData.teamName;
      itemDescription.textContent = teamData.teamRecord;
      link.addEventListener("click", () => {
          sessionStorage.setItem("searchQuery", JSON.stringify({name: teamData.teamName, teamId: teamData.teamId}));
      });

      exportBtn.addEventListener("click", (e) =>   {
        e.preventDefault(); // Prevent default button behavior

        // Create a JSON object based on the locker item
        let jsonData;

        jsonData = {
            type: "team",
            teamName: lockerItem.teamData.teamName,
            teamId: lockerItem.teamData.teamId,
            teamLogo: lockerItem.teamData.teamLogo,
            teamRecord: lockerItem.teamData.teamRecord,
        };
        

        // Convert the JSON object to a string
        const jsonString = JSON.stringify(jsonData, null, 2);

        // Create a blob from the JSON string
        const blob = new Blob([jsonString], { type: "application/json" });

        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${jsonData.teamName.replaceAll(' ', '_')}.json`;
        link.click();

      });

      deleteBtn.addEventListener("click", (e) => {
        let newLocker = locker.filter((item) => {
          return (item.type === "team" && item.teamData.teamName !== teamData.teamName) || item.type === "player"
        })
        localStorage.setItem("locker", JSON.stringify(newLocker))
        window.location.reload()
      });

      li.id = teamData.teamId;
    } 
    else 
    {
      playerData = lockerItem.data
    
      itemImage.src = playerData.playerIconURL;
      itemImage.alt = playerData.displayName;

      itemName.textContent = playerData.displayName;
      itemDescription.textContent = playerData.playerTeam ? `${playerData.playerLeague.toUpperCase()}  |  ${playerData.playerTeam}  |  ${playerData.playerPosition}` : playerData.playerLeague;
      link.addEventListener("click", () => 
      {
        sessionStorage.setItem("searchQuery", JSON.stringify({name: playerData.displayName, playerId: playerData.playerId}));
      });

      exportBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default button behavior

        // Create a JSON object based on the locker item
        let jsonData;
        jsonData = {
          type: "player",
          displayName: lockerItem.data.displayName,
          playerId: lockerItem.data.playerId,
          playerIconURL: lockerItem.data.playerIconURL,
          playerLeague: lockerItem.data.playerLeague,
          playerTeam: lockerItem.data.playerTeam,
          playerPosition: lockerItem.data.playerPosition,
        };
        console.log(jsonData)

        // Convert the JSON object to a string
        const jsonString = JSON.stringify(jsonData, null, 2);

        // Create a blob from the JSON string
        const blob = new Blob([jsonString], { type: "application/json" });

        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${jsonData.displayName.replaceAll(' ', '_')}.json`;
        link.click();
      });
      
      deleteBtn.addEventListener("click", (e) => {
        let newLocker = locker.filter((item) => {
          return (item.type === "player" && item.data.playerId !== playerData.playerId) || item.type === "team"
        })
        localStorage.setItem("locker", JSON.stringify(newLocker))
        window.location.reload()
      })
      li.id = playerData.id
    }
    itemTextContainer.appendChild(itemName);
    itemTextContainer.appendChild(itemDescription);

    exportImg.src = "../images/export.png";
    exportImg.alt = "export";

    editImg.src = "../images/edit.png";
    editImg.alt = "edit"

    deleteImg.src = "../images/delete.png";
    deleteImg.alt = "delete";
    link.href = "../team/news/index.html";

    editBtn.addEventListener("click", () => {
      document.getElementById('edit-modal').classList.toggle('show')
    });
    document.getElementById("cancel-edit").addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("edit-modal").classList.remove("show");
    });
    document.getElementById("confirm-edit").addEventListener("click", (e) => {
      e.preventDefault();
      let newName = document.getElementById("change-name").value;
      let newDescription = document.getElementById("change-description").value;
      
      console.log(newName);
      locker.find(item => {
          let ref;
          if (item.teamData && item.teamData.teamName === itemName.textContent) {
            ref = item.teamData.teamName;
            item.teamData.teamName = newName !== "" ? newName : itemName.textContent;
            item.teamData.teamRecord = newDescription !== "" ? newName : itemDescription.textContent;
          } else if (item.data && item.data.displayName === itemName.textContent) {
            ref = item.data.displayName;
            item.data.displayName = newName !== "" ? newName : itemName.textContent;
            item.data.playerLeague = newDescription !== "" ? newDescription : item.data.playerLeague;
            if (newDescription) {
              item.data.playerPosition = "";
              item.data.playerTeam = "";
            }
          }
          locker.map(outOfNames => {
            if (outOfNames.data) {
              outOfNames.data.displayName === ref ? item.data.displayName : outOfNames.data.displayName
            } else if (outOfNames.teamData) {
              outOfNames.teamData.teamName === ref ? item.teamData.teamName : outOfNames.teamData.teamName
            }
          });
          localStorage.setItem("locker", JSON.stringify(locker));
        });

      itemName.textContent = newName || itemName.textContent;
      itemDescription.textContent = newDescription || itemDescription.textContent;
      document.getElementById("edit-modal").classList.remove("show");
    });

    li.classList.add(...listItemClasses);
    link.classList.add(...linkClasses);
    exportBtn.classList.add(...btnClasses);
    deleteBtn.classList.add(...btnClasses);
    editBtn.classList.add(...btnClasses);
    itemTextContainer.classList.add(...textContainerClasses);
    itemName.classList.add(...nameClasses);
    itemDescription.classList.add(...recordClasses);
    itemImage.classList.add(...imgClasses)
    btnContainer.classList.add(...btnContainerClasses)

    exportBtn.appendChild(exportImg);
    editBtn.appendChild(editImg);
    deleteBtn.appendChild(deleteImg);
    link.appendChild(itemImage);
    link.appendChild(itemTextContainer);
    li.appendChild(link);
    btnContainer.appendChild(exportBtn);
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    li.appendChild(btnContainer);
    
    lockerList.appendChild(li);
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

  document.querySelector("#delete-all").addEventListener("click", () => {
    document.getElementById('confirm-modal').classList.toggle('show')
  });
  document.querySelector('#confirm-delete').addEventListener("click", (e) => {
    localStorage.setItem('locker', JSON.stringify([]))
    let options = document.querySelector("#options")
    options.classList.add("hidden")
    options.classList.remove("flex")
    window.location.reload();
  });
  document.querySelector("#cancel-delete").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('confirm-modal').classList.toggle('show')
  });
  document.querySelector("#export-all").addEventListener("click", (e) => {
    e.preventDefault();

    // Create a JSON object based on the locker item
    let jsonData;
    let jsonArr = [];
    let locker = JSON.parse(localStorage.getItem("locker"));
    locker.forEach(lockerItem => {
      if (lockerItem.type === "team") {
        jsonData = {
          type: "team",
          teamName: lockerItem.teamData.teamName,
          teamId: lockerItem.teamData.teamId,
          teamLogo: lockerItem.teamData.teamLogo,
          teamRecord: lockerItem.teamData.teamRecord,
        };
      } else {
        jsonData = {
          type: "player",
          displayName: lockerItem.data.displayName,
          playerId: lockerItem.data.playerId,
          playerIconURL: lockerItem.data.playerIconURL,
          playerLeague: lockerItem.data.playerLeague,
          playerTeam: lockerItem.data.playerTeam,
          playerPosition: lockerItem.data.playerPosition,
        };
      }
      jsonArr.push(jsonData)
    });
    

    // Convert the JSON object to a string
    const jsonString = JSON.stringify(jsonArr, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Full_List.json`;
    link.click();
  });
})();

/**
 * TODO Check to see if lockerItem is a team or player, maybe use a flag or string variable and check that
 * TODO if it's a team, make a list item with a link to team page
 * TODO it it's a player, make a list item with a link to player page
 * TODO Add functionality to remove items from locker
 * TODO Add functionality to clear all items from locker, add an 'are you sure?' popup
 */
