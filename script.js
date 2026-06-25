if (typeof AOS !== "undefined") {
    AOS.init({
        duration: 1000,
        once: false
    });
}

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

const menuItems = document.querySelectorAll(".menu a, .contact_btn, .tag_wrap span, .core_card");

menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });

    item.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });
});