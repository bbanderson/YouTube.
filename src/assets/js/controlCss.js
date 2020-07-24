const hamburgerMenu = document.getElementById("hamburger");
const asideBar = document.querySelector(".sidebar");
let isHide = false;

const hiding = () => {
    asideBar.classList.add("hide-aside");
    asideBar.classList.remove("show-aside");
    isHide = true;
}

const showing = () => {
    asideBar.classList.add("show-aside");
    asideBar.classList.remove("hide-aside");
    isHide = false;
}

const handleHamburger = () => {
    if (isHide) {
        showing();
    } else {
        hiding();
    }
}

hamburgerMenu.addEventListener("click", handleHamburger);