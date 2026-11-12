const intro = document.querySelector("#intro");
const sky = document.querySelector("#intro-sky");
const enterButton = document.querySelector("#enter-button");

const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navItems = document.querySelectorAll(".nav-links a");

const sections = document.querySelectorAll("main section[id]");
const revealElements = document.querySelectorAll(".reveal");

const copyright = document.querySelector("#copyright");

document.body.classList.add("intro-active");
document.body.classList.add("js-ready");

copyright.textContent = `© ${new Date().getFullYear()} SAMYA GUPTA`;

// Create the stars

const stars = [];

for (let i = 0; i < 85; i++) {
    const star = document.createElement("span");

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2.5 + 1;
    const delay = Math.random() * 2.5;
    const opacity = Math.random() * 0.55 + 0.35;

    star.classList.add("star");

    if (size > 2.5) {
        star.classList.add("large");
    }

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.setProperty("--star-size", `${size}px`);
    star.style.setProperty("--appear-delay", `${delay}s`);
    star.style.setProperty("--twinkle-delay", `${Math.random() * 4}s`);
    star.style.setProperty("--star-opacity", opacity);

    sky.appendChild(star);

    stars.push({ x, y });
}

// Connect selected stars into constellations

const connections = [
    [0, 5],
    [5, 12],
    [12, 18],
    [18, 24],
    [8, 15],
    [15, 21],
    [21, 28],
    [32, 38],
    [38, 43],
    [43, 49],
    [55, 61],
    [61, 67],
    [67, 73]
];

connections.forEach((connection, index) => {
    const first = stars[connection[0]];
    const second = stars[connection[1]];

    const dx = second.x - first.x;
    const dy = second.y - first.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const line = document.createElement("span");

    line.classList.add("constellation-line");

    line.style.left = `${first.x}%`;
    line.style.top = `${first.y}%`;
    line.style.width = `${distance}%`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.setProperty("--line-delay", `${1 + index * 0.12}s`);

    sky.appendChild(line);
});

// Enter the main website

function enterWebsite() {
    if (!document.body.classList.contains("intro-active")) {
        return;
    }

    intro.classList.add("leaving");

    document.body.classList.remove("intro-active");

    setTimeout(() => {
        intro.remove();
    }, 1100);
}

enterButton.addEventListener("click", enterWebsite);

// Allow visitors to skip the intro with Escape

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        enterWebsite();
    }
});

// Mobile navigation

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation"
    );

    navLinks.classList.toggle("open", !isOpen);
});

// Close the mobile menu after selecting a section

navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    });
});

// Reveal sections as they enter the screen

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

// Highlight the navigation link for the current section

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navItems.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${entry.target.id}`;

                    link.classList.toggle("active", isActive);
                });
            }
        });
    },
    {
        rootMargin: "-35% 0px -55% 0px"
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});