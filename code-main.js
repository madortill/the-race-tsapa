// ספריית אופליין, מאפשרת פתיחה של הדף ללא אינטרנט וללא מחיקה של הקאש כל פעם מחדש
if ('serviceWorker' in navigator && location.hostname !== 'localhost' && location.hostname !== "127.0.0.1") {
    let location = ""
    navigator.serviceWorker.register(location + 'sw.js');
}

$(function () {
    // מערך האוסף מכל תרגול את אחוז ההצלחה בכל שלב
    var arrScore = [];
    sessionStorage.setItem("arrScore", JSON.stringify(arrScore));

    // button start event listener
    $('.button-start').on("click", function () {
        window.location.href = "explanation.html";
    });
    $('.button-start').on("touchstart", function () {
        window.location.href = "explanation.html";
    });


    // button about event listener
    $('.button-about').on("click", function () {
        $(".black").fadeIn();
        setTimeout(function () {
            window.location.href = "about.html";
        }, 500);
    });

});