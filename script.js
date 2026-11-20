const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

function closeMenu() {
    navigation.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Відкрити меню");
}

menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Закрити меню" : "Відкрити меню"
    );
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});

// Плавна прокрутка до всіх внутрішніх секцій.
const SCROLL_DURATION = 1000; // мс: збільш для повільнішої прокрутки
const SCROLL_OFFSET = -60;     // px: більше значення — секція нижче на екрані
let activeScroll = null;

function animateScroll(targetY, duration) {
    if (activeScroll !== null) cancelAnimationFrame(activeScroll);

    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function frame(time) {
        if (startTime === null) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        // easeInOutCubic: плавно починається та плавно зупиняється.
        const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) {
            activeScroll = requestAnimationFrame(frame);
        } else {
            activeScroll = null;
        }
    }

    activeScroll = requestAnimationFrame(frame);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const id = link.getAttribute("href");
        if (!id || id === "#") {
            if (id !== "#") return;
        }
        const target = id === "#"
            ? document.getElementById("home")
            : document.getElementById(id.slice(1));
        if (!target) return;

        event.preventDefault();
        closeMenu();

        // Спершу даємо мобільному меню сховатися: тоді позиція секції точна.
        requestAnimationFrame(() => {
            const targetY = Math.max(0,
                window.scrollY + target.getBoundingClientRect().top - SCROLL_OFFSET
            );
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (reduceMotion) {
                window.scrollTo(0, targetY);
            } else {
                animateScroll(targetY, SCROLL_DURATION);
            }
            history.replaceState(null, "", id === "#" ? "#home" : id);
        });
    });
});
