var MIN_GRADE = 60; // ציון מינימלי לעובר

$(function () {
    $(".black").fadeOut(500);

    // חישוב ציון
    var sum = 0;
    var arrScore = JSON.parse(sessionStorage.getItem("arrScore")); 
    for (let i = 0; i < arrScore.length; i++) {
        sum += Number(arrScore[i]);
    };
    avg = sum / arrScore.length;
    let score = 100 - avg;

    $(".grade").text( "ציונך הסופי: " + Math.round(score));
    
    // השחקן נכשל
    if (score <= MIN_GRADE) {
        $(".grade").css("color", "#EF6565");
        $(".title").text( "אוף... חבל");
        $(".contant").text( "לא הצלחתם להגיע לבסיס");

    }
    // השחקן עבר!!
    else {
        $(".grade").css("color", "#5ABF8F");
    }

    $(".button-try-again").on("click", function (event) {
        sessionStorage.setItem("nCurrentExercise", 1);
        sessionStorage.setItem("nCurrentX", -5);
        window.location.href = "main.html";
    });
});