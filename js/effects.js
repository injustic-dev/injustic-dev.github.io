/* =========================================================
   AR DETALLES
   EFECTOS Y ANIMACIONES INTERACTIVAS
   ========================================================= */


/* ---------------------------------------------------------
   ELEMENTOS
   --------------------------------------------------------- */

const navigationButtons = document.querySelectorAll(
    ".main-button"
);


/* ---------------------------------------------------------
   ESTRELLAS AL PULSAR BOTONES
   --------------------------------------------------------- */

navigationButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.preventDefault();

        const destination = button.href;

        createClickFlash(
            event.clientX,
            event.clientY
        );

        createStars(
            event.clientX,
            event.clientY
        );

        document.body.classList.add("page-leaving");

        setTimeout(() => {

            window.location.href = destination;

        }, 450);

    });

});


/* ---------------------------------------------------------
   CREAR ESTRELLAS
   --------------------------------------------------------- */

function createStars(x, y) {

    const amount = 22;

    for (let i = 0; i < amount; i++) {

        const star = document.createElement("span");

        star.className = "click-star";
        star.textContent =
            Math.random() > 0.5 ? "✦" : "✧";

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            45 + Math.random() * 130;

        const moveX =
            Math.cos(angle) * distance;

        const moveY =
            Math.sin(angle) * distance;

        star.style.setProperty(
            "--x",
            `${moveX}px`
        );

        star.style.setProperty(
            "--y",
            `${moveY}px`
        );

        star.style.fontSize =
            `${8 + Math.random() * 14}px`;

        star.style.animationDelay =
            `${Math.random() * 0.12}s`;

        document.body.appendChild(star);

        setTimeout(() => {

            star.remove();

        }, 1100);

    }

}


/* ---------------------------------------------------------
   DESTELLO CENTRAL
   --------------------------------------------------------- */

function createClickFlash(x, y) {

    const flash =
        document.createElement("span");

    flash.className = "click-flash";

    flash.style.left = `${x}px`;
    flash.style.top = `${y}px`;

    document.body.appendChild(flash);

    setTimeout(() => {

        flash.remove();

    }, 600);

}


/* ---------------------------------------------------------
   ESTRELLAS AL TOCAR LA PÁGINA
   --------------------------------------------------------- */

document.addEventListener(
    "pointerdown",
    (event) => {

        const button =
            event.target.closest(".main-button");

        const brand =
            event.target.closest(".brand");

        if (button || brand) {
            return;
        }

        createSmallStars(
            event.clientX,
            event.clientY
        );

    }
);


/* ---------------------------------------------------------
   PEQUEÑO EFECTO DE ESTRELLAS
   --------------------------------------------------------- */

function createSmallStars(x, y) {

    const amount = 5;

    for (let i = 0; i < amount; i++) {

        const star =
            document.createElement("span");

        star.className = "click-star";
        star.textContent = "✦";

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            20 + Math.random() * 45;

        star.style.setProperty(
            "--x",
            `${Math.cos(angle) * distance}px`
        );

        star.style.setProperty(
            "--y",
            `${Math.sin(angle) * distance}px`
        );

        star.style.fontSize =
            `${6 + Math.random() * 8}px`;

        document.body.appendChild(star);

        setTimeout(() => {

            star.remove();

        }, 1000);

    }

}


/* ---------------------------------------------------------
   MOVIMIENTO SUAVE DEL FONDO CON EL MOUSE
   --------------------------------------------------------- */

document.addEventListener(
    "mousemove",
    (event) => {

        const x =
            (event.clientX / window.innerWidth - 0.5);

        const y =
            (event.clientY / window.innerHeight - 0.5);

        const glows =
            document.querySelectorAll(".glow");

        glows.forEach((glow, index) => {

            const intensity =
                (index + 1) * 8;

            glow.style.transform =
                `translate(
                    ${x * intensity}px,
                    ${y * intensity}px
                )`;

        });

    }
);
