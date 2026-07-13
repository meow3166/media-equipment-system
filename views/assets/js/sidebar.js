const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {

    const toggle = item.querySelector(".menu-toggle");

    if (!toggle) return;

    toggle.addEventListener("click", () => {

        // 다른 메뉴는 닫기 (아코디언)
        menuItems.forEach(other => {
            if (other !== item) {
                other.classList.remove("active");
            }
        });

        // 현재 메뉴 열기/닫기
        item.classList.toggle("active");

    });

});