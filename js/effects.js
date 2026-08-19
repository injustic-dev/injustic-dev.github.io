/* =========================================================
   AR DETALLES — EFFECTS.JS
   Fondo + partículas + luz + parallax + navegación
   Optimizado para evitar parpadeos y sobrecarga
   ========================================================= */

(() => {

    "use strict";


    /* =====================================================
       CONFIGURACIÓN JSON
       ===================================================== */

    const configElement =
        document.getElementById("animation-config");


    let config = {
        particles: {
            count: 70,
            minSize: 1,
            maxSize: 3,
            minDuration: 5,
            maxDuration: 11
        },

        cursor: {
            enabled: true,
            lightFollow: true,
            parallax: true,
            strength: 7
        },

        navigation: {
            duration: 500
        }
    };


    if (configElement) {

        try {

            const json =
                JSON.parse(
                    configElement.textContent
                );


            config = {

                ...config,
                ...json,

                particles: {
                    ...config.particles,
                    ...(json.particles || {})
                },

                cursor: {
                    ...config.cursor,
                    ...(json.cursor || {})
                },

                navigation: {
                    ...config.navigation,
                    ...(json.navigation || {})
                }

            };

        } catch (error) {

            console.warn(
                "AR Detalles: configuración JSON inválida."
            );

        }

    }


    /* =====================================================
       ELEMENTOS
       ===================================================== */

    const scene =
        document.getElementById("scene");


    const particlesContainer =
        document.getElementById("particles");


    const lightEffects =
        document.getElementById("light-effects");


    /* =====================================================
       ESTADO
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    const isMobile =
        window.innerWidth <= 700;


    /* =====================================================
       UTILIDADES
       ===================================================== */

    function random(min, max) {

        return Math.random() *
            (max - min) +
            min;

    }


    function choose(array) {

        return array[
            Math.floor(
                Math.random() *
                array.length
            )
        ];

    }


    /* =====================================================
       PARTÍCULAS
       ===================================================== */

    function createParticles() {

        if (
            !particlesContainer ||
            reducedMotion
        ) {

            return;

        }


        particlesContainer.innerHTML =
            "";


        /*
         * Menos partículas en móvil.
         * Visualmente el fondo sigue lleno,
         * pero el navegador trabaja mucho menos.
         */

        let count;


        if (window.innerWidth <= 420) {

            count = 28;

        } else if (window.innerWidth <= 700) {

            count = 38;

        } else {

            count =
                Math.min(
                    config.particles.count,
                    75
                );

        }


        const colors = [
            "#f3d9a2",
            "#d8a6e9",
            "#efb5bf",
            "#ffffff"
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
                    config.particles.minSize,
                    config.particles.maxSize
                );


            const duration =
                random(
                    config.particles.minDuration,
                    config.particles.maxDuration
                );


            const delay =
                random(
                    0,
                    duration
                );


            const moveX =
                random(
                    -100,
                    100
                );


            particle.style.left =
                `${random(0, 100)}%`;


            particle.style.bottom =
                `${random(0, 100)}%`;


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
                choose(colors)
            );


            fragment.appendChild(
                particle
            );

        }


        particlesContainer.appendChild(
            fragment
        );

    }


    /* =====================================================
       ESTRELLAS DEL FONDO
       ===================================================== */

    function createBackgroundStars() {

        if (
            !lightEffects ||
            reducedMotion
        ) {

            return;

        }


        lightEffects.innerHTML =
            "";


        let count;


        if (window.innerWidth <= 420) {

            count = 18;

        } else if (window.innerWidth <= 700) {

            count = 25;

        } else {

            count = 55;

        }


        const colors = [
            "#f3d9a2",
            "#ffffff",
            "#d8a6e9",
            "#efb5bf"
        ];


        const fragment =
            document.createDocumentFragment();


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const star =
                document.createElement("span");


            star.className =
                "background-star";


            const size =
                random(1.5, 4);


            const duration =
                random(3, 7);


            const delay =
                random(-7, 0);


            star.style.left =
                `${random(2, 98)}%`;


            star.style.top =
                `${random(4, 96)}%`;


            star.style.setProperty(
                "--star-size",
                `${size}px`
            );


            star.style.setProperty(
                "--star-duration",
                `${duration}s`
            );


            star.style.setProperty(
                "--star-delay",
                `${delay}s`
            );


            star.style.setProperty(
                "--star-opacity",
                random(.3, .85)
            );


            star.style.setProperty(
                "--star-color",
                choose(colors)
            );


            fragment.appendChild(
                star
            );

        }


        lightEffects.appendChild(
            fragment
        );

    }


    /* =====================================================
       LUZ DEL CURSOR
       ===================================================== */

    let cursorLight = null;


    function createCursorLight() {

        /*
         * En móvil se desactiva porque no existe
         * un cursor real y solo consumiría recursos.
         */

        if (
            !config.cursor.enabled ||
            !config.cursor.lightFollow ||
            reducedMotion ||
            isMobile
        ) {

            return;

        }


        cursorLight =
            document.createElement("div");


        cursorLight.className =
            "cursor-light";


        document.body.appendChild(
            cursorLight
        );


        let mouseX =
            window.innerWidth / 2;


        let mouseY =
            window.innerHeight / 2;


        let currentX =
            mouseX;


        let currentY =
            mouseY;


        window.addEventListener(
            "mousemove",
            event => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;

            },
            {
                passive: true
            }
        );


        function animateCursor() {

            if (!cursorLight) {

                return;

            }


            currentX +=
                (
                    mouseX -
                    currentX
                ) * .08;


            currentY +=
                (
                    mouseY -
                    currentY
                ) * .08;


            cursorLight.style.transform =
                `translate3d(
                    ${currentX}px,
                    ${currentY}px,
                    0
                ) translate(-50%, -50%)`;


            requestAnimationFrame(
                animateCursor
            );

        }


        animateCursor();

    }


    /* =====================================================
       PARALLAX
       ===================================================== */

    function enableParallax() {

        /*
         * El parallax queda únicamente para PC.
         * En teléfonos se elimina para mejorar FPS.
         */

        if (
            !config.cursor.parallax ||
            reducedMotion ||
            isMobile
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


        window.addEventListener(
            "mousemove",
            event => {

                targetX =
                    (
                        event.clientX /
                        window.innerWidth -
                        .5
                    ) *
                    config.cursor.strength;


                targetY =
                    (
                        event.clientY /
                        window.innerHeight -
                        .5
                    ) *
                    config.cursor.strength;

            },
            {
                passive: true
            }
        );


        function animateParallax() {

            currentX +=
                (
                    targetX -
                    currentX
                ) * .06;


            currentY +=
                (
                    targetY -
                    currentY
                ) * .06;


            hero.style.transform =
                `translate3d(
                    ${currentX}px,
                    ${currentY}px,
                    0
                )`;


            requestAnimationFrame(
                animateParallax
            );

        }


        animateParallax();

    }


    /* =====================================================
       NAVEGACIÓN
       ===================================================== */

    function setupNavigation() {

        const links =
            document.querySelectorAll(
                "a.main-button"
            );


        links.forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        /*
                         * Los botones tienen target="_blank".
                         *
                         * No aplicamos animación de salida
                         * porque podría dejar la página principal
                         * oculta cuando el usuario vuelva.
                         */

                        if (
                            link.target === "_blank"
                        ) {

                            return;

                        }


                        const destination =
                            link.href;


                        if (
                            !destination
                        ) {

                            return;

                        }


                        if (
                            link.origin !==
                            window.location.origin
                        ) {

                            return;

                        }


                        event.preventDefault();


                        if (scene) {

                            scene.classList.add(
                                "page-leaving"
                            );

                        }


                        setTimeout(
                            () => {

                                window.location.href =
                                    destination;

                            },
                            config.navigation.duration
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       RESTAURAR PÁGINA
       ===================================================== */

    function restorePage() {

        if (!scene) {

            return;

        }


        scene.classList.remove(
            "page-leaving"
        );


        scene.classList.add(
            "loaded"
        );


        scene.style.opacity =
            "1";


        scene.style.visibility =
            "visible";


        scene.style.transform =
            "none";


        const hero =
            document.querySelector(
                ".hero-content"
            );


        if (hero) {

            hero.style.opacity =
                "";

            hero.style.visibility =
                "";

            /*
             * Solo eliminamos el transform
             * si no estamos usando parallax.
             */

            if (isMobile) {

                hero.style.transform =
                    "";

            }

        }

    }


    /* =====================================================
       SOLUCIÓN PARA BOTÓN ATRÁS
       ===================================================== */

    window.addEventListener(
        "pageshow",
        event => {

            restorePage();


            /*
             * Si la página fue recuperada
             * desde el historial móvil,
             * reconstruimos únicamente las partículas.
             */

            if (event.persisted) {

                requestAnimationFrame(
                    () => {

                        createParticles();

                        createBackgroundStars();

                    }
                );

            }

        }
    );


    /* =====================================================
       VISIBILIDAD
       ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                restorePage();

            }

        }
    );


    /* =====================================================
       INICIALIZACIÓN
       ===================================================== */

    function initialize() {

        restorePage();


        createParticles();


        createBackgroundStars();


        createCursorLight();


        enableParallax();


        setupNavigation();


        /*
         * Esperamos dos frames para permitir
         * que el navegador pinte primero el fondo.
         */

        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        if (scene) {

                            scene.classList.add(
                                "loaded"
                            );

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       ARRANQUE
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();

    }


    /* =====================================================
       RESIZE OPTIMIZADO
       ===================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        createParticles();

                        createBackgroundStars();

                    },
                    350
                );

        },
        {
            passive: true
        }
    );


})();
