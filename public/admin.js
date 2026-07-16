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
