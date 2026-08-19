"use strict";

/* =========================================================
   AR DETALLES — EFECTOS PRINCIPALES
   ========================================================= */

const scene = document.getElementById("scene");
const particlesContainer = document.getElementById("particles");
const lightEffects = document.getElementById("light-effects");
const interactionLayer = document.getElementById("interaction-layer");


/* =========================================================
   CONFIGURACIÓN JSON
   ========================================================= */

const configElement =
    document.getElementById("animation-config");

let animationConfig = {};

try {

    animationConfig =
        JSON.parse(
            configElement?.textContent || "{}"
        );

} catch (error) {

    console.warn(
        "AR Detalles: error leyendo animation-config.",
        error
    );

}


/* =========================================================
   CONFIGURACIÓN POR DEFECTO
   ========================================================= */

const config = {

    particles: {
        count: 100,
        minSize: 1,
        maxSize: 4,
        minDuration: 4,
        maxDuration: 10
    },

    stars: {
        clickCount: 28,
        minDistance: 45,
        maxDistance: 150,
        symbols: [
            "✦",
            "✧",
            "⋆",
            "✶",
            "·"
        ]
    },

    cursor: {
        enabled: true,
        lightFollow: true,
        parallax: true,
        strength: 10
    },

    navigation: {
        duration: 650
    }

};


animationConfig = {

    ...config,

    ...animationConfig,

    particles: {
        ...config.particles,
        ...(animationConfig.particles || {})
    },

    stars: {
        ...config.stars,
        ...(animationConfig.stars || {})
    },

    cursor: {
        ...config.cursor,
        ...(animationConfig.cursor || {})
    },

    navigation: {
        ...config.navigation,
        ...(animationConfig.navigation || {})
    }

};


/* =========================================================
   UTILIDADES
   ========================================================= */

function random(min, max) {

    return Math.random() *
        (max - min) +
        min;

}


function randomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


/* =========================================================
   FINALIZAR CARGA
   ========================================================= */

function finishLoading() {

    if (!scene) {
        return;
    }

    /*
     * Elimina la capa negra inmediatamente
     * después de que el documento esté listo.
     */

    scene.classList.add("loaded");

}


/* =========================================================
   PARTÍCULAS
   ========================================================= */

function createParticles() {

    if (!particlesContainer) {
        return;
    }

    const {
        count,
        minSize,
        maxSize,
        minDuration,
        maxDuration
    } = animationConfig.particles;

    const colors = [
        "#d4af6a",
        "#f3d9a2",
        "#fff8e7",
        "#d98c9a"
    ];

    const fragment =
        document.createDocumentFragment();

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement("span");

        particle.className =
            "particle";

        const size =
            random(
                minSize,
                maxSize
            );

        const duration =
            random(
                minDuration,
                maxDuration
            );

        const delay =
            random(
                -duration,
                0
            );

        particle.style.left =
            `${random(0, 100)}%`;

        particle.style.top =
            `${random(40, 110)}%`;

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
            `${random(-100, 100)}px`
        );

        particle.style.setProperty(
            "--particle-color",
            randomItem(colors)
        );

        fragment.appendChild(
            particle
        );

    }

    particlesContainer.appendChild(
        fragment
    );

}


/* =========================================================
   ESTRELLAS DE FONDO
   ========================================================= */

function createBackgroundStars() {

    if (!lightEffects) {
        return;
    }

    const fragment =
        document.createDocumentFragment();

    const colors = [
        "#f3d9a2",
        "#fff8e7",
        "#d4af6a",
        "#efb5bf"
    ];

    const amount =
        window.innerWidth < 600
            ? 35
            : 70;

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const star =
            document.createElement("span");

        star.className =
            "background-star";

        star.style.left =
            `${random(2, 98)}%`;

        star.style.top =
            `${random(2, 98)}%`;

        star.style.setProperty(
            "--star-size",
            `${random(2, 7)}px`
        );

        star.style.setProperty(
            "--star-color",
            randomItem(colors)
        );

        star.style.setProperty(
            "--star-opacity",
            random(.25, .9)
        );

        star.style.setProperty(
            "--star-duration",
            `${random(2, 6)}s`
        );

        star.style.setProperty(
            "--star-delay",
            `${random(-6, 0)}s`
        );

        fragment.appendChild(
            star
        );

    }

    lightEffects.appendChild(
        fragment
    );

}


/* =========================================================
   LUZ DEL CURSOR
   ========================================================= */

let cursorLight = null;

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;

let lightX =
    mouseX;

let lightY =
    mouseY;


function createCursorLight() {

    if (
        !animationConfig.cursor.enabled ||
        !animationConfig.cursor.lightFollow
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


document.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;

    }
);


function animateCursorLight() {

    if (cursorLight) {

        lightX +=
            (mouseX - lightX) *
            .08;

        lightY +=
            (mouseY - lightY) *
            .08;

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
   PARALLAX
   ========================================================= */

function initializeParallax() {

    if (
        !animationConfig.cursor.enabled ||
        !animationConfig.cursor.parallax
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

    const hero =
        document.querySelector(
            ".hero-content"
        );

    if (!hero) {
        return;
    }

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    const strength =
        animationConfig.cursor.strength;

    document.addEventListener(
        "mousemove",
        (event) => {

            const x =
                event.clientX /
                window.innerWidth;

            const y =
                event.clientY /
                window.innerHeight;

            targetY =
                (x - .5) *
                strength;

            targetX =
                (.5 - y) *
                strength;

        }
    );


    function update() {

        currentX +=
            (targetX - currentX) *
            .04;

        currentY +=
            (targetY - currentY) *
            .04;

        hero.style.transform =
            `perspective(1400px)
             rotateX(${currentX}deg)
             rotateY(${currentY}deg)`;

        requestAnimationFrame(
            update
        );

    }

    update();

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

    setTimeout(
        () => flash.remove(),
        700
    );

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

    setTimeout(
        () => ripple.remove(),
        900
    );

}


/* =========================================================
   ESTRELLAS AL HACER CLICK
   ========================================================= */

function createStars(
    x,
    y,
    amount = animationConfig.stars.clickCount
) {

    const {
        minDistance,
        maxDistance,
        symbols
    } = animationConfig.stars;

    const colors = [
        "#f3d9a2",
        "#d4af6a",
        "#fff8e7",
        "#d98c9a"
    ];

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const star =
            document.createElement("span");

        star.className =
            "click-star";

        const angle =
            random(
                0,
                Math.PI * 2
            );

        const distance =
            random(
                minDistance,
                maxDistance
            );

        star.textContent =
            randomItem(symbols);

        star.style.left =
            `${x}px`;

        star.style.top =
            `${y}px`;

        star.style.setProperty(
            "--x",
            `${Math.cos(angle) * distance}px`
        );

        star.style.setProperty(
            "--y",
            `${Math.sin(angle) * distance}px`
        );

        star.style.setProperty(
            "--rotation",
            `${random(-360, 360)}deg`
        );

        star.style.setProperty(
            "--star-size",
            `${random(9, 23)}px`
        );

        star.style.setProperty(
            "--star-color",
            randomItem(colors)
        );

        star.style.animationDelay =
            `${random(0, .12)}s`;

        interactionLayer?.appendChild(
            star
        );

        setTimeout(
            () => star.remove(),
            1250
        );

    }

}


/* =========================================================
   CHISPAS
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

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const spark =
            document.createElement("span");

        spark.className =
            "spark";

        const angle =
            random(
                0,
                Math.PI * 2
            );

        const distance =
            random(
                30,
                115
            );

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

        setTimeout(
            () => spark.remove(),
            1000
        );

    }

}


/* =========================================================
   EFECTO COMPLETO
   ========================================================= */

function createClickEffect(
    x,
    y,
    intensity = 1
) {

    createFlash(
        x,
        y
    );

    createRipple(
        x,
        y
    );

    createStars(
        x,
        y,
        Math.round(
            animationConfig.stars.clickCount *
            intensity
        )
    );

    createSparks(
        x,
        y,
        Math.round(
            18 * intensity
        )
    );

}


/* =========================================================
   NAVEGACIÓN
   ========================================================= */

document
    .querySelectorAll(".main-button")
    .forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                const destination =
                    button.getAttribute("href");

                if (!destination) {
                    return;
                }

                createClickEffect(
                    event.clientX,
                    event.clientY,
                    1.5
                );

                document.body.classList.add(
                    "page-leaving"
                );

                setTimeout(
                    () => {

                        window.location.href =
                            destination;

                    },
                    animationConfig.navigation.duration
                );

            }
        );

    });


/* =========================================================
   LOGO
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

            setTimeout(
                () => {

                    window.location.href =
                        "index.html";

                },
                500
            );

        }
    );

}


/* =========================================================
   TOQUES EN EL FONDO
   ========================================================= */

document.addEventListener(
    "pointerdown",
    (event) => {

        if (
            event.target.closest(
                ".main-button, .brand"
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
   INICIALIZACIÓN
   ========================================================= */

function initializeEffects() {

    createParticles();

    createBackgroundStars();

    createCursorLight();

    initializeParallax();

    animateCursorLight();

    /*
     * Esperamos un frame para asegurarnos de que
     * el DOM y los estilos ya estén aplicados.
     */

    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                finishLoading
            );

        }
    );

}


/* =========================================================
   ARRANQUE SEGURO
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeEffects,
        {
            once: true
        }
    );

} else {

    initializeEffects();

}


/* =========================================================
   SEGURO EXTRA:
   SI EL NAVEGADOR TARDA DEMASIADO,
   NUNCA DEJAR LA PANTALLA NEGRA
   ========================================================= */

window.addEventListener(
    "load",
    () => {

        finishLoading();

    },
    {
        once: true
    }
);

setTimeout(
    finishLoading,
    1800
);
