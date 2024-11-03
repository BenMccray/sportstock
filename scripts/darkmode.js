
let darkBtns = document.querySelectorAll("#dark-mode");
darkBtns.forEach((btn) => { 
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
})
});