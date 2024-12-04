(function () {
  // JavaScript to toggle the collapsible content
  const collapseButton = document.getElementById("nav-sm-btn");
  const collapseContent = document.getElementById("nav-sm");

  collapseButton.addEventListener("click", () => {
    const isExpanded = collapseButton.getAttribute("aria-expanded") === "true";

    // Toggle aria-expanded on button
    collapseButton.setAttribute("aria-expanded", !isExpanded);

    // Toggle aria-hidden on content
    collapseContent.setAttribute("aria-hidden", isExpanded);

    // Toggle the .show class to reveal or hide content
    collapseContent.classList.toggle("h-96");
    collapseContent.classList.toggle("h-0");
    // collapseContent.classList.contains("h-0") ? setTimeout(() => collapseContent.classList.toggle("pt-20"), 499) : collapseContent.classList.toggle("pt-20");
    
    // collapseContent.classList.toggle("max-h-96");
    // collapseContent.querySelectorAll("a").forEach((a) => {
    //   a.classList.toggle("content-hidden" && "content-show");
    // });
  });
})();
