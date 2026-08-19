/* =========================================================
   AR DETALLES
   SISTEMA DE EFECTOS E INTERACCIONES
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN JSON
   ========================================================= */

const configElement = document.getElementById("animation-config");

let animationConfig = {};

try {

    animationConfig = JSON.parse(
        configElement?.textContent || "{}"
    );

} catch (error) {

    console.warn(
        "AR Detalles: no se pudo leer la configuración JSON.",
        error
    );

}


/* =========================================================
   ELEMENTOS
   ========================================================= */

const scene = document.getElementById("scene");
const particlesContainer = document.getElementById("particles");
const lightEffects = document.getElementById("light-effects");
const interactionLayer = document.getElementById("interaction-layer");

const navigationButtons = document.querySelectorAll(
    ".main-button"
);


/* =========================================================
   UTILIDADES
   ========================================================= */

function random(min, max) {

    return Math.random() * (max - min) + min;

}


function randomItem(array) {

    return array[
        Math.floor(Math.random() * array.length)
    ];

}


function getThemeColors() {

    return (
        animationConfig.theme || {
            primary: "#d4af6a",
            secondary: "#f3d9a2",
            accent: "#fff8e7",
            pink: "#d98c9a"
        }
    );

}


/* =========================================================
   PARTÍCULAS DEL FONDO
   ========================================================= */

function createParticles() {

    if (!particlesContainer) {
        return;
    }

    const settings =
        animationConfig.particles || {};

    const count =
        settings.count ?? 100;

    const minSize =
        settings.minSize ?? 1;

    const maxSize =
        settings.maxSize ?? 4;

    const minDuration =
        settings.minDuration ?? 4;

    const maxDuration =
        settings.maxDuration ?? 10;

    const colors = [
        getThemeColors().gold ||
            getThemeColors().primary,

        getThemeColors().secondary ||
            "#f3d9a2",

        getThemeColors().pink ||
            "#d98c9a",

        "#fff8e7"
    ];

    const fragment =
        document.createDocumentFragment();

    for (let i = 0; i < count; i++) {

        const particle =
            document.createElement("span");

        particle.className = "particle";

        const size =
            random(minSize, maxSize);

        const duration =
            random(
                minDuration,
                maxDuration
            );

        const delay =
            random(-duration, 0);

        const moveX =
            random(-100, 100);

        particle.style.left =
            `${random(0, 100)}%`;

        particle.style.top =
            `${random(35, 110)}%`;

        particle.style.setProperty(
            "--size",
            `${size}px`
        );

        particle.style.setProperty(
            "--duration",
            `${duration}s`
        );

        particle.style.setProperty(
            "--delay",
            `${delay}s`
        );

        particle.style.setProperty(
            "--move-x",
            `${moveX}px`
        );

        particle.style.setProperty(
            "--particle-color",
            randomItem(colors)
        );

        fragment.appendChild(particle);

    }

    particlesContainer.appendChild(fragment);

}


/* =========================================================
   LUZ QUE SIGUE AL CURSOR
   ========================================================= */

let cursorLight = null;

function createCursorLight() {

    if (
        !animationConfig.cursor?.enabled ||
        !animationConfig.cursor?.lightFollow
    ) {
        return;
    }

    if (
        window.matchMedia(
            "(hover: none) and (pointer: coarse)"
        ).matches
    ) {
        return;
    }

    cursorLight =
        document.createElement("div");

    cursorLight.className =
        "cursor-light";

    lightEffects?.appendChild(
        cursorLight
    );

}


let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;

let lightX =
    mouseX;

let lightY =
    mouseY;


document.addEventListener(
    "mousemove",
    (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

    }
);


function animateCursorLight() {

    if (cursorLight) {

        lightX +=
            (mouseX - lightX) * 0.08;

        lightY +=
            (mouseY - lightY) * 0.08;

        cursorLight.style.left =
            `${lightX}px`;

        cursorLight.style.top =
            `${lightY}px`;

    }

    requestAnimationFrame(
        animateCursorLight
    );

}


/* =========================================================
   PARALLAX DEL HERO
   ========================================================= */

let targetRotateX = 0;
let targetRotateY = 0;

let currentRotateX = 0;
let currentRotateY = 0;


function initializeParallax() {

    if (
        !animationConfig.cursor?.enabled ||
        !animationConfig.cursor?.parallax
    ) {
        return;
    }

    if (
        window.matchMedia(
            "(hover: none) and (pointer: coarse)"
        ).matches
    ) {
        return;
    }

    const heroContent =
        document.querySelector(
            ".hero-content"
        );

    if (!heroContent) {
        return;
    }

    const strength =
        animationConfig.cursor?.strength ?? 18;

    document.addEventListener(
        "mousemove",
        (event) => {

            const x =
                event.clientX /
                window.innerWidth;

            const y =
                event.clientY /
                window.innerHeight;

            targetRotateY =
                (x - 0.5) * strength;

            targetRotateX =
                (0.5 - y) * strength;

        }
    );


    function updateParallax() {

        currentRotateX +=
            (targetRotateX - currentRotateX) *
            0.045;

        currentRotateY +=
            (targetRotateY - currentRotateY) *
            0.045;

        heroContent.style.transform =
            `perspective(1200px)
             rotateX(${currentRotateX}deg)
             rotateY(${currentRotateY}deg)`;

        requestAnimationFrame(
            updateParallax
        );

    }

    updateParallax();

}


/* =========================================================
   DESTELLO
   ========================================================= */

function createFlash(x, y) {

    const flash =
        document.createElement("span");

    flash.className =
        "click-flash";

    flash.style.left =
        `${x}px`;

    flash.style.top =
        `${y}px`;

    interactionLayer?.appendChild(
        flash
    );

    setTimeout(() => {

        flash.remove();

    }, 700);

}


/* =========================================================
   ONDA
   ========================================================= */

function createRipple(x, y) {

    const ripple =
        document.createElement("span");

    ripple.className =
        "click-ripple";

    ripple.style.left =
        `${x}px`;

    ripple.style.top =
        `${y}px`;

    interactionLayer?.appendChild(
        ripple
    );

    setTimeout(() => {

        ripple.remove();

    }, 900);

}


/* =========================================================
   ESTRELLAS
   ========================================================= */

function createStars(x, y, amount = null) {

    const settings =
        animationConfig.stars || {};

    const count =
        amount ??
        settings.clickCount ??
        28;

    const minDistance =
        settings.minDistance ??
        45;

    const maxDistance =
        settings.maxDistance ??
        150;

    const symbols =
        settings.symbols || [
            "✦",
            "✧",
            "⋆",
            "·"
        ];

    const colors = [
        "#f3d9a2",
        "#d4af6a",
        "#fff8e7",
        "#d98c9a"
    ];

    for (let i = 0; i < count; i++) {

        const star =
            document.createElement("span");

        star.className =
            "click-star";

        star.textContent =
            randomItem(symbols);

        const angle =
            random(0, Math.PI * 2);

        const distance =
            random(
                minDistance,
                maxDistance
            );

        const moveX =
            Math.cos(angle) *
            distance;

        const moveY =
            Math.sin(angle) *
            distance;

        const rotation =
            random(-360, 360);

        const size =
            random(8, 22);

        star.style.left =
            `${x}px`;

        star.style.top =
            `${y}px`;

        star.style.setProperty(
            "--x",
            `${moveX}px`
        );

        star.style.setProperty(
            "--y",
            `${moveY}px`
        );

        star.style.setProperty(
            "--rotation",
            `${rotation}deg`
        );

        star.style.setProperty(
            "--star-size",
            `${size}px`
        );

        star.style.setProperty(
            "--star-color",
            randomItem(colors)
        );

        star.style.animationDelay =
            `${random(0, 0.12)}s`;

        interactionLayer?.appendChild(
            star
        );

        setTimeout(() => {

            star.remove();

        }, 1200);

    }

}


/* =========================================================
   CHISPAS PEQUEÑAS
   ========================================================= */

function createSparks(
    x,
    y,
    amount = 18
) {

    const colors = [
        "#d4af6a",
        "#f3d9a2",
        "#fff8e7",
        "#d98c9a"
    ];

    for (let i = 0; i < amount; i++) {

        const spark =
            document.createElement("span");

        spark.className =
            "spark";

        const angle =
            random(0, Math.PI * 2);

        const distance =
            random(30, 115);

        spark.style.left =
            `${x}px`;

        spark.style.top =
            `${y}px`;

        spark.style.setProperty(
            "--spark-x",
            `${Math.cos(angle) * distance}px`
        );

        spark.style.setProperty(
            "--spark-y",
            `${Math.sin(angle) * distance}px`
        );

        spark.style.setProperty(
            "--spark-size",
            `${random(2, 5)}px`
        );

        spark.style.setProperty(
            "--spark-duration",
            `${random(.45, .9)}s`
        );

        spark.style.setProperty(
            "--spark-color",
            randomItem(colors)
        );

        interactionLayer?.appendChild(
            spark
        );

        setTimeout(() => {

            spark.remove();

        }, 1000);

    }

}


/* =========================================================
   EFECTO COMPLETO DE CLICK
   ========================================================= */

function createClickEffect(
    x,
    y,
    intensity = 1
) {

    createFlash(x, y);

    createRipple(x, y);

    createStars(
        x,
        y,
        Math.round(
            (animationConfig.stars?.clickCount ?? 28) *
            intensity
        )
    );

    createSparks(
        x,
        y,
        Math.round(18 * intensity)
    );

}


/* =========================================================
   BOTONES DE NAVEGACIÓN
   ========================================================= */

navigationButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                const destination =
                    button.getAttribute("href");

                if (!destination) {
                    return;
                }

                const rect =
                    button.getBoundingClientRect();

                const x =
                    event.clientX ||
                    rect.left +
                    rect.width / 2;

                const y =
                    event.clientY ||
                    rect.top +
                    rect.height / 2;

                createClickEffect(
                    x,
                    y,
                    1.5
                );

                document.body.classList.add(
                    "page-leaving"
                );

                const transitionDuration =
                    animationConfig.navigation?.duration ??
                    650;

                setTimeout(() => {

                    window.location.href =
                        destination;

                }, transitionDuration);

            }
        );


        /* -------------------------------------------------
           EFECTO AL PASAR EL CURSOR
        ------------------------------------------------- */

        button.addEventListener(
            "mouseenter",
            () => {

                if (
                    window.matchMedia(
                        "(hover: none)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    button.getBoundingClientRect();

                createSparks(
                    rect.left +
                    rect.width / 2,

                    rect.top +
                    rect.height / 2,

                    3
                );

            }
        );

    }
);


/* =========================================================
   TOQUE EN LA PÁGINA
   ========================================================= */

document.addEventListener(
    "pointerdown",
    (event) => {

        if (
            event.target.closest(
                ".main-button"
            )
        ) {
            return;
        }

        createStars(
            event.clientX,
            event.clientY,
            5
        );

    }
);


/* =========================================================
   PARALLAX DE ELEMENTOS DECORATIVOS
   ========================================================= */

function initializeDecorativeParallax() {

    if (
        window.matchMedia(
            "(hover: none) and (pointer: coarse)"
        ).matches
    ) {
        return;
    }

    const symbols =
        document.querySelectorAll(
            ".floating-symbol"
        );

    const decorations =
        document.querySelectorAll(
            ".hero-decoration"
        );

    document.addEventListener(
        "mousemove",
        (event) => {

            const x =
                event.clientX /
                window.innerWidth -
                0.5;

            const y =
                event.clientY /
                window.innerHeight -
                0.5;

            symbols.forEach(
                (symbol, index) => {

                    const strength =
                        (index + 1) * 5;

                    symbol.style.marginLeft =
                        `${x * strength}px`;

                    symbol.style.marginTop =
                        `${y * strength}px`;

                }
            );

            decorations.forEach(
                (decoration, index) => {

                    const strength =
                        (index + 1) * 3;

                    decoration.style.marginTop =
                        `${y * strength}px`;

                }
            );

        }
    );

}


/* =========================================================
   LOGO: PEQUEÑO DESTELLO
   ========================================================= */

const brand =
    document.querySelector(".brand");

if (brand) {

    brand.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            createClickEffect(
                event.clientX,
                event.clientY,
                .8
            );

            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 500);

        }
    );

}


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

function initializeEffects() {

    createParticles();

    createCursorLight();

    initializeParallax();

    initializeDecorativeParallax();

    animateCursorLight();

}


/* =========================================================
   ESPERAR DOM
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeEffects
    );

} else {

    initializeEffects();

}
