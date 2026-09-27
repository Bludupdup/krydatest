"use strict";


document.addEventListener(
    "DOMContentLoaded",
    () => {


/* =========================================================
   REFERENCES
========================================================= */

const hamburger =
    document.getElementById(
        "hamburger"
    );


const navMenu =
    document.getElementById(
        "navMenu"
    );


const navLinks =
    [
        ...document.querySelectorAll(
            ".nav-link"
        )
    ];


const filterButtons =
    [
        ...document.querySelectorAll(
            ".filter-chip"
        )
    ];


const activityCards =
    [
        ...document.querySelectorAll(
            ".activity-card"
        )
    ];


const emptyState =
    document.getElementById(
        "emptyState"
    );


const activityModal =
    document.getElementById(
        "activityModal"
    );


const modalClose =
    document.getElementById(
        "modalClose"
    );


const modalArt =
    document.getElementById(
        "modalArt"
    );


const modalCategory =
    document.getElementById(
        "modalCategory"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const modalDescription =
    document.getElementById(
        "modalDescription"
    );


const modalPlay =
    document.getElementById(
        "modalPlay"
    );


const loadingMessage =
    document.getElementById(
        "loadingMessage"
    );


const backTop =
    document.getElementById(
        "backTop"
    );


const heroVideo =
    document.getElementById(
        "heroVideo"
    );


const bandSection =
    document.getElementById(
        "band"
    );


const bandVideo =
    document.getElementById(
        "bandVideo"
    );


let activeFilter =
    "all";


let bandHasPlayed =
    false;


/* =========================================================
   HERO VIDEO
========================================================= */

if (
    heroVideo
) {

    heroVideo.loop =
        false;


    heroVideo.addEventListener(
        "ended",
        () => {

            heroVideo.pause();


            if (
                Number.isFinite(
                    heroVideo.duration
                ) &&
                heroVideo.duration > 0.1
            ) {

                heroVideo.currentTime =
                    Math.max(
                        0,
                        heroVideo.duration -
                        0.04
                    );

            }

        }
    );

}


/* =========================================================
   KRYDA BAND VIDEO
========================================================= */

if (
    bandSection &&
    bandVideo
) {

    bandVideo.loop =
        false;


    bandVideo.pause();


    bandVideo.addEventListener(
        "loadedmetadata",
        () => {

            if (
                !bandHasPlayed
            ) {

                bandVideo.currentTime =
                    0;

            }

        }
    );


    bandVideo.addEventListener(
        "ended",
        () => {

            bandVideo.pause();


            if (
                Number.isFinite(
                    bandVideo.duration
                ) &&
                bandVideo.duration > 0.1
            ) {

                bandVideo.currentTime =
                    Math.max(
                        0,
                        bandVideo.duration -
                        0.035
                    );

            }

        }
    );


    if (
        "IntersectionObserver" in
        window
    ) {

        const bandObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting ||
                                bandHasPlayed
                            ) {

                                return;

                            }


                            bandHasPlayed =
                                true;


                            bandVideo
                                .play()
                                .catch(
                                    () => {}
                                );


                            bandObserver.unobserve(
                                bandSection
                            );

                        }
                    );

                },
                {
                    threshold: 0.25
                }
            );


        bandObserver.observe(
            bandSection
        );

    }

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

if (
    hamburger &&
    navMenu
) {

    hamburger.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();


            const open =
                navMenu.classList.toggle(
                    "open"
                );


            hamburger.classList.toggle(
                "open",
                open
            );


            hamburger.setAttribute(
                "aria-expanded",
                String(open)
            );

        }
    );


    navLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove(
                        "open"
                    );


                    hamburger.classList.remove(
                        "open"
                    );


                    hamburger.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );


    document.addEventListener(
        "click",
        (event) => {

            const clickedMenu =
                navMenu.contains(
                    event.target
                );


            const clickedHamburger =
                hamburger.contains(
                    event.target
                );


            if (
                navMenu.classList.contains(
                    "open"
                ) &&
                !clickedMenu &&
                !clickedHamburger
            ) {

                navMenu.classList.remove(
                    "open"
                );


                hamburger.classList.remove(
                    "open"
                );


                hamburger.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   ACTIVE HEADER NAVIGATION
========================================================= */

const observedSections =
    navLinks
        .map(
            (link) => {

                const id =
                    link.dataset.section;


                return document.getElementById(
                    id
                );

            }
        )
        .filter(Boolean);



function activateNavigation(
    sectionId
) {

    navLinks.forEach(
        (link) => {

            const active =
                link.dataset.section ===
                sectionId;


            link.classList.toggle(
                "active",
                active
            );

        }
    );

}



if (
    "IntersectionObserver" in
    window
) {

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                const visibleSections =
                    entries
                        .filter(
                            (entry) =>
                                entry.isIntersecting
                        )
                        .sort(
                            (
                                first,
                                second
                            ) =>
                                second.intersectionRatio -
                                first.intersectionRatio
                        );


                if (
                    visibleSections.length >
                    0
                ) {

                    activateNavigation(
                        visibleSections[0]
                            .target
                            .id
                    );

                }

            },
            {

                rootMargin:
                    "-30% 0px -45% 0px",

                threshold:
                    [
                        0,
                        0.1,
                        0.25,
                        0.5
                    ]

            }
        );


    observedSections.forEach(
        (section) => {

            sectionObserver.observe(
                section
            );

        }
    );

}


navLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            () => {

                activateNavigation(
                    link.dataset.section
                );

            }
        );

    }
);


/* =========================================================
   FILTER ACTIVITIES
========================================================= */

function filterActivities() {

    let visibleCount =
        0;


    activityCards.forEach(
        (card) => {

            const category =
                (
                    card.dataset.category ||
                    ""
                ).toLowerCase();


            const categoryMatches =
                activeFilter ===
                    "all" ||

                category ===
                    activeFilter;


            card.classList.toggle(
                "hidden",
                !categoryMatches
            );


            if (
                categoryMatches
            ) {

                visibleCount++;

            }

        }
    );


    emptyState?.classList.toggle(
        "show",
        visibleCount === 0
    );

}


/* =========================================================
   FILTER BUTTONS
========================================================= */

filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                activeFilter =
                    (
                        button.dataset.filter ||
                        "all"
                    ).toLowerCase();


                filterActivities();

            }
        );

    }
);


/* =========================================================
   OPEN ACTIVITY
========================================================= */

function openActivity(
    card
) {

    if (
        !activityModal
    ) {
        return;
    }


    const category =
        card.dataset.category ||
        "activity";


    if (
        modalCategory
    ) {

        modalCategory.textContent =
            category
                .charAt(0)
                .toUpperCase() +

            category.slice(1);

    }


    if (
        modalTitle
    ) {

        modalTitle.textContent =
            card.dataset.title ||
            "Kryda Activity";

    }


    if (
        modalDescription
    ) {

        modalDescription.textContent =
            card.dataset.description ||
            "A fun Kryda activity.";

    }


    if (
        modalArt
    ) {
        modalArt.textContent =
            "✨";
    }


    if (
        loadingMessage
    ) {

        loadingMessage.classList.remove(
            "show"
        );


        loadingMessage.textContent =
            "Preparing your activity...";

    }


    if (
        modalPlay
    ) {
        modalPlay.textContent =
            "▶ Start Activity";
    }


    activityModal.classList.add(
        "open"
    );


    activityModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   ACTIVITY CARD CLICK
========================================================= */

activityCards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            () => {

                openActivity(
                    card
                );

            }
        );

    }
);


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    if (
        !activityModal
    ) {
        return;
    }


    activityModal.classList.remove(
        "open"
    );


    activityModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


modalClose?.addEventListener(
    "click",
    closeModal
);


activityModal?.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            activityModal
        ) {

            closeModal();

        }

    }
);


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   START ACTIVITY
========================================================= */

modalPlay?.addEventListener(
    "click",
    () => {

        modalPlay.textContent =
            "Loading...";


        loadingMessage?.classList.add(
            "show"
        );


        if (
            loadingMessage
        ) {

            loadingMessage.textContent =
                "Preparing your activity...";

        }


        setTimeout(
            () => {

                if (
                    loadingMessage
                ) {

                    loadingMessage.textContent =
                        "✨ Activity prototype coming soon!";

                }


                modalPlay.textContent =
                    "▶ Start Activity";

            },
            700
        );

    }
);


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document
    .querySelectorAll(
        "[data-scroll]"
    )
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    const selector =
                        button.dataset.scroll;


                    if (
                        !selector
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            selector
                        );


                    target?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );


/* =========================================================
   BACK TO TOP
========================================================= */

backTop?.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal-left, .reveal-right"
    );


if (
    "IntersectionObserver" in
    window
) {

    const revealObserver =
        new IntersectionObserver(
            (
                entries,
                observer
            ) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.classList.add(
                            "visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    revealElements.forEach(
        (
            element,
            index
        ) => {

            element.style.transitionDelay =
                `${Math.min(
                    (index % 4) * 60,
                    180
                )}ms`;


            revealObserver.observe(
                element
            );

        }
    );

}

else {

    revealElements.forEach(
        (element) => {

            element.classList.add(
                "visible"
            );

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

filterActivities();


});