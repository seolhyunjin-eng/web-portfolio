if (typeof AOS !== "undefined") {
    AOS.init({
        duration: 1200,
        once: true,
        easing: "ease-out-cubic"
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

// 숫자 카운트업
const countEls = document.querySelectorAll(".count");

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target);
        let current = 0;
        const duration = 1600;
        const startTime = performance.now();

        function updateCount(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            current = Math.floor(target * ease);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCount);
        countObserver.unobserve(el);
    });
}, {
    threshold: 0.5
});

countEls.forEach((el) => {
    countObserver.observe(el);
});

// Sticky footer mouse light
const footer = document.querySelector(".footer");

if (footer) {
    footer.addEventListener("mousemove", (e) => {
        const rect = footer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        footer.style.setProperty("--footer-x", x + "px");
        footer.style.setProperty("--footer-y", y + "px");
    });
}

