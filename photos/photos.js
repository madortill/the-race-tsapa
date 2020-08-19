const TITLE = "בחר את כל התמונות שמציגות התנהגות נכונה בזמן קורונה";
var LIFE_IN_START = 3;
var NUMBER_OF_IMAGES = 9; // לשנות בהתאם לכמות התמונות בגייסון
var NUMBER_OF_CORRECT = 3; // לשנות בהתאם לכמות התמונות הנכונות בגייסון

var nCountLife = LIFE_IN_START;
var nCountCorrect = 0;
var isFirstTime = true;
var nMistakes = 0;

$(function () {  
    // מטפל במצב שבו השחקן לחץ על ריפרש
    handleRefresh();

    $(".black").fadeOut();
    $(".darked").fadeIn();

    // כפתור עזרה (X)
    $(".exit").on("click", function() {
        $(".help-explanation").slideUp(800);
        $(".exit").hide();
        $(".exit").off("click");
        $(".darked").fadeOut();

        // בודק אם זאת הפעם הראשונה שנטען העמוד
        if (isFirstTime) {
            isFirstTime = false;
            setTimeout(function() {
                addElements();
            },1000);
        }
    });

    // כפתור עזרה
    $(".help").on("click", function() {
        $(".help-explanation").slideToggle(800);
        $(".exit").fadeToggle();
        $(".darked").fadeToggle();

        // בודק אם זאת הפעם הראשונה שנטען העמוד
        if (isFirstTime) { 
            isFirstTime = false;
            setTimeout(function() {
                addElements();
            },1000);
        }
        $(".exit").on("click", function() {
            $(".help-explanation").slideUp(800);
            $(".exit").hide();
            $(".exit").off("click");
            $(".darked").fadeOut();
        });
    });
});

function addElements() {
    // שינוי רקע
    $(".container-all").css("background-image", "url('../assets/images/bgpicture.svg')");
    
    // מוסיף את הגלילה לדיב התמונות
    if (NUMBER_OF_IMAGES < 6) {
        $(".div-contain-ims").css("overflow-y", "hidden");
    } 
    $(".title").fadeIn();

    // הוספת בר עליון 
    $(".bar-game").fadeIn(500);
    $(".bar-game").css("display", "flex");

    // הוספת תמונות
    $(".div-contain-ims").fadeIn(500);
    $(".div-contain-ims").css("display", "flex");

    addLife();

    // // מערבב את הרשימה
    // shuffle(images);       אם רוצים שיהיה שאפל אז צריך לתקן משהו לא ברור עם התמונות

    // מוסיף למסך את התמונות
    addImages();

    $(".points").text(NUMBER_OF_CORRECT);

    // הוספת כותרת 
    $("#GameTitle").text(TITLE);

    $("#btn-close-feedback").on("click", function (event) {

        // if player found all correct answers
        if (nCountCorrect === NUMBER_OF_CORRECT) {
            $("#div-finish").css({
                visibility: "visible"
            });
            setTimeout(function () {
                // sending if player sucseeded
                sessionStorage.setItem("succsess", true);

                // opening endScreen
                window.location.assign("../endScreen.html");
            }, 1000)
        }

        // if there are no lifes left 
        if (nCountLife === 0) {
            sessionStorage.setItem("succsess", false);
            sessionStorage.setItem("json", images);
            window.location.assign("endScreen.html");
        }
    });
}

function addLife() {
    // resetting the life bar by deleting it's content
    $(".hearts-container").html("");
    for (let i = 0; i < nCountLife; i++) {
        // adding a heart image
        $(".hearts-container").append("<img src='../assets/images/heart.svg' alt='heart' class='heart' id='heart" + i + "'/>");
    }

    // מוריד את הלבבות
    for (let i = 0; i < LIFE_IN_START - nCountLife; i++) {
        $(".hearts-container").append("<img src='../assets/images/heartspace.svg' alt='no-heart' class='heart' id='heart" + i + "'/>");
    }
}

function addImages() {
    // resetting the images div by deleting it's content
    $("#containImgs").html("");

    // 
    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
        // making divs for images
        var divImage = $("<div></div>");
        divImage.addClass("div-img");
        divImage.attr("id", "divImg_" + i);

        $("#containImgs").append(divImage);

        //adding an image
        divImage.append("<img src='" + images[i].src + "' class='img-btn' id='image_" + i + "' />");

        // מוסיף מאזין לחיצה לתמונות
        $("#image_" + i).on("click", onImgClick);
    }
}

function onImgClick(event) {
    $("#image_" + event.currentTarget.id.charAt(6)).off("click");
    $("#image_" + event.currentTarget.id.charAt(6)).css("cursor", "unset");

    $(".transparent-div").fadeIn();

    if (images[Number(event.currentTarget.id.charAt(6))].answer === "right") {
        // חיווי תשובה נכונה
        event.currentTarget.style.border = "solid";
        event.currentTarget.style.borderWidth = "0.5vw";
        event.currentTarget.style.borderColor = "#5BBF90";

        nCountCorrect++;

        $(".points").text(String(NUMBER_OF_CORRECT - nCountCorrect));

    } 
    // חיווי תשובה שגויה
    else {
        event.currentTarget.style.border = "solid";
        event.currentTarget.style.borderWidth = "0.5vw";
        event.currentTarget.style.borderColor = "#F37371";

        nCountLife--;

        addLife();
    } 

    setTimeout(function() {
        let id = event.currentTarget.id;
        addFeedback(id);
    },800);
}

// מוסיף למסך את הפידבק התאים
function addFeedback(currentPicId) {
    $(".feedback-title").text(images[Number(currentPicId.charAt(6))].feedback);
    $(".feedback-explanation").text(images[Number(currentPicId.charAt(6))].feedbackExplenation);

    $(".feedback-container").slideToggle(700);
    $(".exit-feedback").show();
    $(".darked").fadeIn();

    // בודק אם השחקן טעה
    if (images[Number(currentPicId.charAt(6))].answer === "wrong") {
        $(".feedback-title ").css("color", "#F37371");
        nMistakes++;
    }
    // השחקן צדק
    else {
        $(".feedback-title ").css("color", "#e8b04a");
    }
    // כפתור עזרה (X)
    $(".exit-feedback").on("click", function() {
        $(".feedback-container").slideUp(800);
        $(".exit-feedback").hide();
        $(".darked").fadeOut();
        $(".exit-feedback").off("click");

        // מוריד את הדיב השקוף שמבטל את לחיצת התמונות
        $(".transparent-div").fadeOut();

        // בודק שלא נגמר המשחק
        if (nCountLife === 0) {
            setTimeout(function() {
                let ifFail = true;
                finished(ifFail);
            }, 1000);
        }
        
        // בודק האם השחקן ניצח
        if (nCountCorrect === NUMBER_OF_CORRECT) {
            setTimeout(function() {
                let ifFail = false;
                finished(ifFail);
            }, 1000);
        }
    });

    
}

/*
                finished
              ============
Description: פונקציית הסיום המעבירה את המשתמש לביקורת על הצלחותיו
Parameters: none
---------------------------------------
Programer: Hila Tsivion
Date: 8/4/2020
---------------------------------------
*/
function finished(ifFail) {
    // ניקוי המסך מאלמנטים
    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
        $("#image_" + i).off("click");
    }
    $(".div-contain-ims").remove();
    $(".help").remove();
    $(".bar-game").remove();
    $(".p-title").remove();
    $(".title").remove();

    let precentLostPoints = nMistakes / NUMBER_OF_IMAGES * 100;
    var arrScore = [];
    arrScore = JSON.parse(sessionStorage.getItem("arrScore")); 
    arrScore.push(precentLostPoints);
    sessionStorage.setItem("arrScore", JSON.stringify(arrScore));

    // בודק אם השחקן ניצח
    if (!ifFail) {
        success();
    }
    else {
        // שינוי רקע
        $(".container-all").css("background-image", "url('../assets/images/bgphotosfaded.svg')");
     
        //  הוספת מסך סיום נכשל לדף
        $(".end-game-fail").fadeIn();
        $(".end-game-fail").css("display", "flex");
        $(".end-title").text("איי... כמעט");
        $(".try-again").show();
        $(".try-again").on("click", function(event) {
            window.onbeforeunload = null;
            window.onunload = null;
            location.reload();
        });
    }
}

function success() {
    
    $(".end-game-success").fadeIn();
    $(".end-title-success").fadeIn();
    $(".end-title-success").css("display", "flex");
    $(".button-end").show();
    $(".end-game-success").css("display", "flex");
    $(".button-end").on("click", function(event) {
        window.onbeforeunload = null;
        window.onunload = null;
        sessionStorage.setItem("nCurrentExercise", Number(sessionStorage.getItem("nCurrentExercise")) + 1);
        window.location.href = "../lessonMap.html";
    });
    
    // מוסיף למסך את התמונות וההסברים
    for (let i = 0; i < images.length; i++) {
        // Creating a div for the whole expleination
        var divLine = $("<div></div>");
        divLine.addClass("div-line");
        divLine.attr("id", "div-line_" + i);

        // creating the explenation
        var divexpls = $("<div></div>");
        divexpls.addClass("div-expel");
        divexpls.attr("id", "divExpel_" + i);
        divexpls.text(images[i].feedbackExplenation);

        // creating the img
        var img = $("<img />");
        img.addClass("img-expel");
        img.attr("id", "imgExpel_" + i);
        img.attr("src", images[i].src);

        $("#containAns").append(divLine);
        $("#div-line_" + i).append(img);
        $("#div-line_" + i).append(divexpls);
    }
}

/*
              shuffle
            =========
Description: take orgnaiz array and shffel it
Parameters: array.
------------------------------------------------
Programer: Gal 
Date: ?
------------------------------------------------
*/
function shuffle(arr) {
    var tmp = arr.slice();
    for (var i = 0; i < arr.length; i++) {
      var index = Math.floor(Math.random() * tmp.length);
      arr[i] = tmp[index];
      tmp = tmp.slice(0, index).concat(tmp.slice(index + 1));
    }
    return arr;
}

// מטפל בריפרש
function handleRefresh() {
    if (sessionStorage.getItem("restart")) {
        sessionStorage.removeItem("restart");
        location.assign("../main.html");
        return;
    }
    window.onbeforeunload = e => true;
    
    window.onunload = e => {
        sessionStorage.clear();
        sessionStorage.setItem("restart", true);
    }
}