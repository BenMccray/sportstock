function populateList() {
    let list = document.getElementById("saved-list");
    let items = document.querySelectorAll("#saved-list li");
    items.forEach(item => item.remove());
    let savedItems = JSON.parse(sessionStorage.getItem("saves"));
    if (savedItems) {
        document.querySelector("#no-saved-notif").style.display = "none";
        savedItems.forEach(item => {
            let li = document.createElement("li");
            let title = document.createElement("span");
            let description = document.createElement("span");
            let deleteButton = document.createElement("button");
            title.textContent = item.name;
            description.textContent = item.description;
            deleteButton.textContent = "x";
            deleteButton.onclick = function() {
                let index = savedItems.indexOf(item);
                savedItems.splice(index, 1);
            }
            li.appendChild(title);
            li.appendChild(description);
            li.appendChild(deleteButton);
            list.appendChild(li);
        });
    }
}
(function () {
    let submitButton = document.querySelector("#submit-btn");

    submitButton.addEventListener("click", (ev) =>
    {
        ev.preventDefault();
        let name = document.getElementById("name-input");
        let description = document.getElementById("description-input");
        let saves = JSON.parse(sessionStorage.getItem("saves")) || [];
        if (name.value.length > 0) {
            let newSave = {
                name: name.value,
                description: description.value
            }
            // Add the new save to the saves array
            saves.push(newSave);
            sessionStorage.setItem("saves", JSON.stringify(saves));
            console.log(sessionStorage.getItem("saves"))
            // Clear the input fields
            name.value = "";
            description.value = "";

            document.querySelector("#add-new-modal").style.visibility = "collapse";

            populateList(); // Call the function to populate the list


        }
    });
})();