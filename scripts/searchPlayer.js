(function() {
    const searchInput = document.getElementById('player-search');
    const playerList = document.getElementById('player-list');

    searchInput.addEventListener('keyup', (event) => {
        const searchValue = event.target.value.toLowerCase();
        const playerItems = playerList.querySelectorAll('li');
        console.log("kepress");
        playerItems.forEach(item => {
            const playerName = item.getAttribute('data-player-name').toLowerCase();
            if (playerName.includes(searchValue)) {
                item.style.display = 'inherit';
            } else {
                item.style.display = 'none';
            }
        });
    });
})();

