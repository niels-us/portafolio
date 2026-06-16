let translations = {};
let typedInstance = null;
let currentLang = "es";

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;

    // Textos
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.dataset.key;
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Typed
    if (translations[lang].hero_roles) {
        if (typedInstance) typedInstance.destroy();
        typedInstance = new Typed("#typed-text", {
            strings: translations[lang].hero_roles,
            typeSpeed: 60,
            backSpeed: 40,
            loop: true
        });
    }

    // CV
    const btnCV = document.getElementById("btn-cv");
    if (btnCV && translations[lang].cv_file) {
        btnCV.href = translations[lang].cv_file;
    }

    sessionStorage.setItem("lang", lang);
}

document.addEventListener("click", function (e) {
    const link = e.target.closest(".project-certificates");
    if (!link) return;

    e.preventDefault();

    const img =
        link.getAttribute(`data-img-${currentLang}`) ||
        link.getAttribute("data-img-es");

    const lightbox = GLightbox({
        elements: [
            {
                href: img,
                type: "image"
            }
        ]
    });

    lightbox.open();
});


async function detectLanguage() {
    const saved = sessionStorage.getItem("lang");
    if (saved) return saved;

    const lang = navigator.language.split("-")[0];
    return ["es", "en", "it"].includes(lang) ? lang : "es";
}

document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("./assets/language/lang.json");
    translations = await res.json();

    const lang = await detectLanguage();
    setLanguage(lang);

    document.querySelectorAll("[data-lang]").forEach(btn => {
        btn.addEventListener("click", () => {
            setLanguage(btn.dataset.lang);
        });
    });
});
