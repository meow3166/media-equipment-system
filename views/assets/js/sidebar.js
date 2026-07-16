
// const menuItems = document.querySelectorAll(".menu-item");

// menuItems.forEach(item => {
//     const toggle = item.querySelector(".menu-toggle");

//     if (!toggle) return;

//     toggle.addEventListener("click", () => {

//         item.classList.toggle("active");

//         const arrow = toggle.querySelector(".arrow");

//         if (item.classList.contains("active")) {
//             arrow.src = "/assets/images/uparrow.png";
//         } else {
//             arrow.src = "/assets/images/downarrow.png";
//         }
//     });
// });

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {
    const toggle = item.querySelector(".menu-toggle");

    if (!toggle) return;

    toggle.addEventListener("click", () => {
        item.classList.toggle("active");
    });
});