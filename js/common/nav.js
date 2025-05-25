// toggle menu
function toggleMenu(button) {
  button_id = button.id;
  document.querySelector(`.menu-content#${button_id}`).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.closest(".menu-button")) {
    let dropdowns = document.getElementsByClassName("menu-content");

    Array.from(dropdowns).forEach((dropdown) => {
      if (dropdown.classList.contains("show"))
        dropdown.classList.remove("show");
    });
  }
};

//dark theme toggle
document.querySelector(".theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  document.querySelector(".theme-toggle").classList.toggle("dark-theme");
});