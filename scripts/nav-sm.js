(function () {
  // JavaScript to toggle the collapsible content
  const collapseButton = document.getElementById("menu-btn");
  const collapseContent = document.getElementById("menu-sm");
  console.log(collapseButton);

  collapseButton.addEventListener("click", () => {
    const isExpanded = collapseButton.getAttribute("aria-expanded") === "true";

    // Toggle aria-expanded on button
    collapseButton.setAttribute("aria-expanded", !isExpanded);

    // Toggle aria-hidden on content
    collapseContent.setAttribute("aria-hidden", isExpanded);

    // Toggle the .show class to reveal or hide content
    collapseContent.classList.toggle("show");
  });
})();
