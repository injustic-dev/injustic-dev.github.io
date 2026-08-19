/* =========================================================
   AR DETALLES — EFFECTS.JS
   Partículas + estrellas + cursor + navegación
   + recuperación al volver con "Atrás"
   ========================================================= */

(() => {

    "use strict";


    /* =====================================================
       CONFIGURACIÓN
       ===================================================== */

    const configElement =
        document.getElementById("animation-config");

    let config = {
        particles: {
            count: 110,
            minSize: 1,
            maxSize: 4,
            minDuration: 4,
            maxDuration: 10
        },

        stars: {
            clickCount: 30,
            minDistance: 45,
            maxDistance: 160,

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


    if (configElement) {

        try {

            const jsonConfig =
                JSON.parse(
                    configElement.textContent
                );

            config = {
                ...config,
                ...jsonConfig,

                particles: {
                    ...config.particles,
                    ...(jsonConfig.particles || {})
                },

                stars: {
                    ...config.stars,
                    ...(jsonConfig.stars || {})
                },

                cursor: {
                    ...config.cursor,
                    ...(jsonConfig.cursor || {})
                },

                navigation: {
                    ...config.navigation,
                    ...(jsonConfig.navigation || {})
                }
            };

        } catch (error) {

            console.warn(
                "AR Detalles: configuración JSON inválida.",
                error
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

    let reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       UTILIDADES
       ===================================================== */

    const random =
        (min, max) =>
            Math.random() * (max - min) + min;


    const randomInt =
        (min, max) =>
            Math.floor(
                random(min, max + 1)
            );


    const choose =
        array =>
            array[
                Math.floor(
                    Math.random() * array.length
                )
            ];


    /* =====================================================
       PARTÍCULAS
       ===================================================== */

    function createParticle() {

        if (!particlesContainer) {
            return;
        }


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
                -120,
                120
            );


        const left =
            random(
                0,
                100
            );


        const colors = [
            "#f3d9a2",
            "#d8a6e9",
            "#efb5bf",
            "#ffffff"
        ];


        particle.style.left =
            `${left}%`;

        particle.style.bottom =
            `${random(-10, 100)}%`;


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


        particlesContainer.appendChild(
            particle
        );

    }


    function createParticles() {

        if (
            !particlesContainer ||
            reducedMotion
        ) {
            return;
        }


        particlesContainer.innerHTML =
            "";


        const count =
            Math.min(
                config.particles.count,
                window.innerWidth < 600
                    ? 65
                    : 140
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            createParticle();

        }

    }


    /* =====================================================
       ESTRELLAS DE FONDO
       ===================================================== */

    function createBackgroundStars() {

        if (
            !lightEffects ||
            reducedMotion
        ) {
            return;
        }


        const count =
            window.innerWidth < 600
                ? 35
                : 70;


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
                random(
                    2,
                    5
                );


            const duration =
                random(
                    2.5,
                    6
                );


            const delay =
                random(
                    -6,
                    0
                );


            const opacity =
                random(
                    .25,
                    .9
                );


            const colors = [
                "#f3d9a2",
                "#ffffff",
                "#d8a6e9",
                "#efb5bf"
            ];


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
                opacity
            );


            star.style.setProperty(
                "--star-color",
                choose(colors)
            );


            lightEffects.appendChild(
                star
            );

        }

    }


    /* =====================================================
       LUZ DEL CURSOR
       ===================================================== */

    let cursorLight = null;


    function createCursorLight() {

        if (
            !config.cursor.enabled ||
            !config.cursor.lightFollow ||
            reducedMotion ||
            window.innerWidth < 700
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

            currentX +=
                (mouseX - currentX) * .09;

            currentY +=
                (mouseY - currentY) * .09;


            if (cursorLight) {

                cursorLight.style.left =
                    `${currentX}px`;

                cursorLight.style.top =
                    `${currentY}px`;

            }


            requestAnimationFrame(
                animateCursor
            );

        }


        animateCursor();

    }


    /* =====================================================
       ESTRELLAS AL HACER CLICK
       ===================================================== */

    function createClickEffect(
        x,
        y
    ) {

        if (reducedMotion) {
            return;
        }


        const count =
            window.innerWidth < 600
                ? 18
                : config.stars.clickCount;


        /* -----------------------------------------------
           DESTELLO
           ----------------------------------------------- */

        const flash =
            document.createElement("span");


        flash.className =
            "click-flash";


        flash.style.left =
            `${x}px`;

        flash.style.top =
            `${y}px`;


        document.body.appendChild(
            flash
        );


        setTimeout(
            () => flash.remove(),
            800
        );


        /* -----------------------------------------------
           ONDA
           ----------------------------------------------- */

        const ripple =
            document.createElement("span");


        ripple.className =
            "click-ripple";


        ripple.style.left =
            `${x}px`;

        ripple.style.top =
            `${y}px`;


        document.body.appendChild(
            ripple
        );


        setTimeout(
            () => ripple.remove(),
            1000
        );


        /* -----------------------------------------------
           ESTRELLAS
           ----------------------------------------------- */

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const star =
                document.createElement("span");


            star.className =
                "click-star";


            star.textContent =
                choose(
                    config.stars.symbols
                );


            const angle =
                random(
                    0,
                    Math.PI * 2
                );


            const distance =
                random(
                    config.stars.minDistance,
                    config.stars.maxDistance
                );


            const moveX =
                Math.cos(angle) *
                distance;


            const moveY =
                Math.sin(angle) *
                distance;


            const size =
                random(
                    9,
                    22
                );


            const colors = [
                "#f3d9a2",
                "#ffffff",
                "#d8a6e9",
                "#efb5bf"
            ];


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
                "--star-size",
                `${size}px`
            );


            star.style.setProperty(
                "--star-color",
                choose(colors)
            );


            star.style.setProperty(
                "--rotation",
                `${randomInt(
                    90,
                    720
                )}deg`
            );


            document.body.appendChild(
                star
            );


            setTimeout(
                () => star.remove(),
                1200
            );

        }

    }


    /* =====================================================
       CHISPAS DEL CLICK
       ===================================================== */

    function createSparks(
        x,
        y
    ) {

        if (reducedMotion) {
            return;
        }


        const count =
            window.innerWidth < 600
                ? 8
                : 14;


        for (
            let i = 0;
            i < count;
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
                    40,
                    115
                );


            const moveX =
                Math.cos(angle) *
                distance;


            const moveY =
                Math.sin(angle) *
                distance;


            spark.style.left =
                `${x}px`;

            spark.style.top =
                `${y}px`;


            spark.style.setProperty(
                "--spark-x",
                `${moveX}px`
            );


            spark.style.setProperty(
                "--spark-y",
                `${moveY}px`
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
                choose([
                    "#f3d9a2",
                    "#ffffff",
                    "#d8a6e9",
                    "#efb5bf"
                ])
            );


            document.body.appendChild(
                spark
            );


            setTimeout(
                () => spark.remove(),
                1000
            );

        }

    }


    /* =====================================================
       CLICK GLOBAL
       ===================================================== */

    document.addEventListener(
        "click",
        event => {

            createClickEffect(
                event.clientX,
                event.clientY
            );

            createSparks(
                event.clientX,
                event.clientY
            );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       PARALLAX
       ===================================================== */

    function enableParallax() {

        if (
            !config.cursor.parallax ||
            reducedMotion ||
            window.innerWidth < 800
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


        window.addEventListener(
            "mousemove",
            event => {

                const x =
                    (
                        event.clientX /
                        window.innerWidth
                    ) - .5;


                const y =
                    (
                        event.clientY /
                        window.innerHeight
                    ) - .5;


                const strength =
                    config.cursor.strength;


                hero.style.transform =
                    `translate3d(
                        ${x * strength}px,
                        ${y * strength}px,
                        0
                    )`;

            },
            {
                passive: true
            }
        );

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
                         * Si el enlace abre una pestaña nueva,
                         * no hacemos transición de salida.
                         *
                         * Esto evita que la página principal
                         * quede oculta cuando el usuario vuelva
                         * usando Atrás.
                         */

                        if (
                            link.target === "_blank"
                        ) {

                            return;

                        }


                        if (
                            link.hostname !==
                            window.location.hostname
                        ) {

                            return;

                        }


                        if (
                            link.origin !==
                            window.location.origin
                        ) {

                            return;

                        }


                        const destination =
                            link.href;


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
       RESTAURAR PÁGINA AL VOLVER CON "ATRÁS"
       ===================================================== */

    function restorePage() {

        if (!scene) {
            return;
        }


        /*
         * Eliminamos cualquier estado que pudiera
         * haber dejado la animación de salida.
         */

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


        document.documentElement.style
            .overflowX = "hidden";


        document.body.style
            .overflowX = "hidden";


        /*
         * Por seguridad eliminamos estilos
         * inline que pudieran haber quedado
         * después de una transición.
         */

        const hero =
            document.querySelector(
                ".hero-content"
            );


        if (hero) {

            hero.style.opacity =
                "";

            hero.style.visibility =
                "";

            hero.style.transform =
                "";

        }

    }


    /* =====================================================
       PAGESHOW
       ===================================================== */

    window.addEventListener(
        "pageshow",
        event => {

            /*
             * event.persisted === true significa
             * normalmente que Safari/Chrome móvil
             * recuperó la página desde el historial.
             */

            if (event.persisted) {

                restorePage();

            }

        }
    );


    /* =====================================================
       VISIBILITYCHANGE
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
         * Dejamos que el navegador termine
         * de pintar la página antes de marcarla
         * como completamente cargada.
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
       INICIO
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
       RECREAR PARTÍCULAS AL CAMBIAR TAMAÑO
       ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        if (
                            !reducedMotion
                        ) {

                            createParticles();

                        }

                    },
                    250
                );

        },
        {
            passive: true
        }
    );


})();
