//
// Ticketless Raffle v3
//

document.addEventListener("DOMContentLoaded", () => {

    showTodaysDate();

    loadEntrantCount();
    loadWinners();

    initializeTheme();

    initializePresentationMode();

    initializeAccessibilityMode();

});


// ---------------------------
// Today's Date
// ---------------------------

function showTodaysDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById("todayDate").innerText =
        today.toLocaleDateString(undefined, options);

}


// ---------------------------
// Message Banner
// ---------------------------

function showBanner(message, type = "success") {

    const banner =
        document.getElementById("messageBanner");

    banner.style.display = "block";

    banner.innerHTML = message;

    if (type === "success") {

        banner.style.background = "#d1e7dd";
        banner.style.color = "#0f5132";

    } else {

        banner.style.background = "#f8d7da";
        banner.style.color = "#842029";

    }

    setTimeout(() => {

        banner.style.display = "none";

    }, 3500);

}

const themeButton =
    document.getElementById("themeToggle");

function initializeTheme(){

    const saved =
        localStorage.getItem("theme");

    if(saved==="dark"){

        document.body.classList.add("dark");

    }

    themeButton.onclick = toggleTheme;

}

function toggleTheme(){

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "theme",
        dark ? "dark":"light"
    );

}

const presentationButton =
    document.getElementById("presentationMode");

function initializePresentationMode(){

    if(localStorage.getItem("presentation")=="on"){

        document.body.classList.add("presentation");

    }

    presentationButton.onclick=function(){

        document.body.classList.toggle("presentation");

        localStorage.setItem(
            "presentation",
            document.body.classList.contains("presentation")
                ?"on":"off"
        );

    };

}

const accessibilityButton =
    document.getElementById("accessibilityMode");

function initializeAccessibilityMode(){

    if(localStorage.getItem("accessibility")=="on"){

        document.body.classList.add("accessibility");

    }

    accessibilityButton.onclick=function(){

        document.body.classList.toggle("accessibility");

        localStorage.setItem(
            "accessibility",
            document.body.classList.contains("accessibility")
                ?"on":"off"
        );

    };

}
