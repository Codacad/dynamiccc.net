window.addEventListener("load", function () {
  document.getElementById("loader").style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  const oponMobileMenu = document.querySelector(".open-mobile-menu");
  const closeMobileMenu = document.querySelector(".close-mobile-menu");
  oponMobileMenu.addEventListener("click", () => {
    console.log("clicked");
    document.querySelector(".mobile-menu").classList.toggle("show-mobile-menu");
  });
  closeMobileMenu.addEventListener("click", () => {
    console.log("clicked");
    document.querySelector(".mobile-menu").classList.toggle("show-mobile-menu");
  });
});
