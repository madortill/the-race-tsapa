// מערך משפטים
var questions = [{
    question: "קורונה היא המגפה שהרגה הכי הרבה אנשים בהיסטוריה של כדור הארץ", // המשפט
    answer: "Wrong", // נכון או לא נכון: Right/Wrong
    clicked: "none" // להגדיר את כולם בהתחלה כ: clicked: "none"
},
{
    question: "קיים חיסון למחלת הקרונה",
    answer: "Wrong",
    clicked: "none"
},
{
    question: "תסמינים של קורונה הם לרוב קשיים נשימתיים או חום",
    answer: "Right",
    clicked: "none"
},
{
    question: "למבוגרים או אנשים עם מערכת חיסונית מדוכאת יש יותר סיכוי לפתח תסמינים חמורים",
    answer: "Right",
    clicked: "none"
},
{
    question: "כל מי שמסתובב עם כפפות יהיה מוגן לחלוטין מנגיף הקורונה",
    answer: "Wrong",
    clicked: "none"
}
];

var countArr = [0,0,0,0,0];

var NUMBER_OF_QUESTIONS = questions.length;
var nCorrectAnswers = 0;
var nCountQuestion = 0;
var nMistakes = 0;

var bIsListening = false;
var isFirstTime = true;


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

// פונקציית הוספת אלמנטים
function addElements() {   
    // שינוי הרקע לרגיל
    $(".container-all").css("background-image", "url('../assets/images/bgrightwrong.svg')");

    $(".check-button-true-or-false").fadeToggle(1000);
    $(".div-board").fadeToggle(1000);
    $(".div-board").css("display", "flex");

    for (let i = 0; i < NUMBER_OF_QUESTIONS; i++) {
        // Creating a div for the question plus answers
        $("#div-board").append("<div class='div-exer' id='div-exer_" + i + "'></div>");                    

        $("#div-exer_" + i).append("<p class='p-question' id='pQuestion_" + i + "'></p> <div class='buttons' id='buttons_" + i + "'></div>");

        // Creating the actual question
        $("#pQuestion_" + i).append(questions[i].question);

        // Creating "right btn"
        $("#buttons_" + i).append("<div class='btn-answer right-button' id='btnRight_" + i + "'> <img src='../assets/images/right.svg' class='img-answers'/></div>");

        // Creating "wrong btn"
        $("#buttons_" + i).append("<div class='btn-answer' id='btnWrong_" + i + "'>  <img src='../assets/images/wrong.svg' class='img-answers'/></div>");
    }

    // להוסיף מאזיני לחיצה
    addListeners();
}

function addListeners() {
    for (var i = 0; i < NUMBER_OF_QUESTIONS; i++) {
        $("#btnRight_" + i).on("click", onAnswerClick);
        $("#btnWrong_" + i).on("click", onAnswerClick);
    }
}

function onAnswerClick(event) {
    nCountQuestion = 0;

    // בודק אם הכפתור הנלחץ הוא כפתור "נכון"
    if (this.id.includes("Right")) {
        $(event.currentTarget).children().attr("src","../assets/images/right-selected.svg");
        questions[Number(event.currentTarget.id.charAt(9))].clicked = "Right";
        $("#btnWrong_" + this.id.charAt(9)).children().attr("src","../assets/images/wrong.svg");
    }
    // הכפתור הנלחץ הוא כפתור "לא נכון"
    else {
        $(event.currentTarget).children().attr("src","../assets/images/wrong-selected.svg");
        questions[Number(event.currentTarget.id.charAt(9))].clicked = "Wrong";
        $("#btnRight_" + this.id.charAt(9)).children().attr("src","../assets/images/right.svg");
    }
    
    countArr[this.id.substring(9)]++;

    // מוסיף לצובר בשורת השאלה שענו עליה
    for (let nCount = 0; nCount < NUMBER_OF_QUESTIONS; nCount++){
        if (countArr[nCount] > 0) {
            nCountQuestion++;
        }
    }

    // בודק אם יש תשובות לכל השאלות
    if (nCountQuestion === 5) {
        $(".check-button-true-or-false").on("click", onCheckClick);
        $(".check-button-true-or-false").css({
            "opacity": "1",
            "cursor": "pointer",
            "filter": "unset"
        }); 
    }
}

function onCheckClick(event) {
    for (var i = 0; i < NUMBER_OF_QUESTIONS; i++) {
        // if correct answer
        if (questions[i].clicked === questions[i].answer) {
            // צובע בירוק תשובה - נכונה
            if ($("#btn" + questions[i].clicked + "_" + i).attr("id").includes("Right")) {
                $("#btn" + questions[i].clicked + "_" + i).children().attr("src","../assets/images/right-right-selected.svg");   
            }
            // צובע בירוק תשובה - לא נכונה
            else {
                $("#btn" + questions[i].clicked + "_" + i).children().attr("src","../assets/images/wrong-right-selected.svg");
            }
        } 
        // התשובה לא נכונה
        else {
            nMistakes++;

            // צובע באדום תשובה - נכונה
            if ($("#btn" + questions[i].clicked + "_" + i).attr("id").includes("Right")) {
                $("#btn" + questions[i].clicked + "_" + i).children().attr("src","../assets/images/right-wrong-selected.svg");   
            }
            // צובע בירוק תשובה - לא נכונה
            else {
                $("#btn" + questions[i].clicked + "_" + i).children().attr("src","../assets/images/wrong-wrong-selected.svg");
            }
        }
    }
    finished();
}

/*
                finished
              ============
Description: פונקציית הסיום המעבירה את המשתמש לביקורת על הצלחותיו
Parameters: none
---------------------------------------
Programer: Hila Tsivion
Date: 10/5/2020
---------------------------------------
*/
function finished() {
    // ניקוי המסך מאלמנטים
    for (var i = 0; i < NUMBER_OF_QUESTIONS; i++) {
        $("#btnRight_" + i).off("click");
        $("#btnWrong_" + i).off("click");
    }

    $(".check-button-true-or-false").off("click");
    $(".check-button-true-or-false").remove();
    $(".next-btn-to-end").fadeIn(1000);

    // שומר כמות של תשובות נכונות 
    sessionStorage.setItem("score", nCorrectAnswers);

    // שומר מספר שאלות
    sessionStorage.setItem("numQuestions", NUMBER_OF_QUESTIONS);

    let precentLostPoints = nMistakes / questions.length * 100;
    var arrScore = [];
    arrScore = JSON.parse(sessionStorage.getItem("arrScore")); 
    arrScore.push(precentLostPoints);
    sessionStorage.setItem("arrScore", JSON.stringify(arrScore));
    
    // הוספת מאזין לחיצה לחזרה למסלול
    $(".next-btn-to-end").on("click", function(event) {
        window.onbeforeunload = null;
        window.onunload = null;
        sessionStorage.setItem("nCurrentExercise", Number(sessionStorage.getItem("nCurrentExercise")) + 1);
        window.location.href = "../lessonMap.html";
    });
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