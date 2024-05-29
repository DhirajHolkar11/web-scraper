// sidebar 

let menu_icon_box = document.querySelector(".menu_icon_box");
let box = document.querySelector(".box");

menu_icon_box.onclick = function () {
    menu_icon_box.classList.toggle("active");
    box.classList.toggle("active");




    // Disable scrolling when sidebar is active
    if (box.classList.contains("active")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }


}

document.onclick = function (e) {
    if (!menu_icon_box.contains(e.target) && !box.contains(e.target)) {
        menu_icon_box.classList.remove("active");
        box.classList.remove("active");




        // Enable scrolling when sidebar is inactive
        document.body.style.overflow = "auto";
    }
}



