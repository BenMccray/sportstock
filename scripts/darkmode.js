(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Check session storage for dark mode preference
    const darkModePreference = sessionStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
        body.classList.add('dark');
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
            sessionStorage.setItem('darkMode', 'disabled');
        } else {
            body.classList.add('dark');
            sessionStorage.setItem('darkMode', 'enabled');
        }
    });

    // Set a timeout to clear the session storage after 24 hours
    setTimeout(() => {
        sessionStorage.removeItem('darkMode');
    }, 24 * 60 * 60 * 1000); 
  });
})();