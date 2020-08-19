// מערך המשפטים
var sentences = [{
    first: 'זאת דוגמה', // החלק הראשון של המשפט
    missingWord: 'למשפט', // המילה החסרה
    last: 'לתרגול זה.', // החלק האחרון של המילה (לא לשכוח לשים נקודה בסוף משפט)
    id: 'sen1', // לכתוב כך לפי סדר המיקומים המסודרים במערך זה. חשוב לא לטעות בסדר   
    mistake: false
},
{
    first: 'בקריית ההדרכה ישנם 7',
    missingWord: 'בהדים',
    last: '.',
    id: 'sen2',
    mistake: false
},
{
    first: 'כדי להקפיד על הנחיות הקורונה יש ',
    missingWord: 'לשמור',
    last: 'על 2 מטר',
    id: 'sen3',
    mistake: false
}
// {
//     first: 'פיל פילון',
//     missingWord: 'אפו',
//     last: 'ארוך.',
//     id: 'sen4',
//     mistake: false
// },
// {
//     first: 'אין לי עוד',
//     missingWord: 'רעיונות',
//     last: 'למשפטים מגניבים.',
//     id: 'sen5',
//     mistake: false
// },
// {
//     first: '',
//     missingWord: 'מדור',
//     last: 'טי"ל הכי שווה שיש',
//     id: 'sen6',
//     mistake: false
// },
// {
//     first: 'לומדה גנרית זה',
//     missingWord: 'הכי',
//     last: 'טוב בעולם.',
//     id: 'sen7',
//     mistake: false
// },
// {
//     first: 'התפקיד הכי טוב',
//     missingWord: 'בצהל',
//     last: 'הוא מפתח לומדה!',
//     id: 'sen8',
//     mistake: false
// }
];

var elTryAgain;
var elExplanation;
var elGameButtons;
var elCheckButton;
var elSentencesContainer;
var elWordBankContainer;
var elTitleWordBank;

const AMOUN_OF_SENTENCES = sentences.length; // כמות משפטים

var nCountSentences = 0;
var nMistakes = 0;
var isFirstTime = true;

/*
                load page
              =============
Description: load all elements
Parameters: none
---------------------------------------
Programer: Hila Tsivion
Date: 5/4/2020
---------------------------------------
*/
$(function () {
    // מטפל במצב שבו השחקן לחץ על ריפרש
    handleRefresh();

    $(".black").fadeOut();
    $(".darked").fadeIn();

    // כפתור עזרה (X)
    $(".exit").on("click", function () {
        $(".help-explanation").slideUp(800);
        $(".exit").hide();
        $(".exit").off("click");
        $(".darked").fadeOut();

        // בודק אם זאת הפעם הראשונה שנטען העמוד
        if (isFirstTime) {
            isFirstTime = false;
            setTimeout(function () {
                addElements();
            }, 1000);
        }
    });

    // כפתור עזרה
    $(".help").on("click", function () {
        $(".help-explanation").slideToggle(800);
        $(".exit").fadeToggle();
        $(".darked").fadeToggle();

        // בודק אם זאת הפעם הראשונה שנטען העמוד
        if (isFirstTime) {
            isFirstTime = false;
            setTimeout(function () {
                addElements();
            }, 1000);
        }
        $(".exit").on("click", function () {
            $(".help-explanation").slideUp(800);
            $(".exit").hide();
            $(".exit").off("click");
            $(".darked").fadeOut();
        });
    });

});

// פונקציית הוספת אלמנטים
function addElements() {
    
    // שינוי רקע
    $(".container-all").css("background-image", "url('../assets/images/bgCompleteSen.svg')");

    // Sentences
    elSentencesContainer = document.createElement("div");
    elSentencesContainer.className = "sentences-ans-container";
    $(".container-all").append(elSentencesContainer);

    $(".container-all").append("<div class='sentences'></div>");

    // Word bank
    elWordBankContainer = document.createElement("div");
    elWordBankContainer.className = "word-bank-container";
    $(".container-all").append(elWordBankContainer);

    //
    elTitleWordBank = document.createElement("div");

    // שכפול המערך כדי לא לפגוע בסדר המשפטים
    let copyArr = cloneArr(sentences);
    addSentence();
    shuffle(copyArr);


    // add missing words to the bank
    for (var nCount = 0; nCount < AMOUN_OF_SENTENCES; nCount++) {
        $(elWordBankContainer).append("<div class='missing-word-design' id='missingWord" + Number(copyArr[nCount].id.slice(-1)) + "'>" + copyArr[nCount].missingWord + "</div>");
    }

    $('.missing-word-design').draggable({
        revert: "invalid",
        drag: transformDrag, 
        scroll: false
    });
}
/*
                addSentence
              ================
Description: 
Parameters: 
---------------------------------------
Programer: Hila Tsivion
Date: 8/4/2020
---------------------------------------
*/
function addSentence() {
    $(".sentences").html("<p class='first-sentence inside-sentence'>" + sentences[nCountSentences].first + "</p>" + "<div class='missing-word inside-sentence' id='emptyPlace" + Number(nCountSentences + 1) + "'></div>" + "<p class='last-sentence inside-sentence'>" + sentences[nCountSentences].last + "</p>");
    nCountSentences++;

    // acccept only the correct missing word
    $('#emptyPlace' + nCountSentences).droppable({
        drop: update
    });
}

/*
                update
              ==========
Description: 
Parameters: event, ui 
---------------------------------------
Programer: Hila Tsivion
Date: 8/4/2020
---------------------------------------
*/
function update(event, ui) {
    let dragged = ui.draggable;

    // בודק האם האלמנט הנגרר הוא הלא נכון להשלמת המשפט
    if (("missingWord" + nCountSentences) !== ui.draggable.attr("id")) {
        wrongAnswer(ui.draggable);
    }
    // האלמנט הנגרר נכון
    else {
        ui.draggable.css({
            left: '6px',
            top: 'unset',
            bottom: '8px',
            transform: 'scale(1.3)',
            'padding-top': '5%',
            'background-image': 'url("../assets/images/grira-noshadow.svg")',
            'height': '100%'
        });

        dragged.remove();
        $("#emptyPlace" + nCountSentences).append(dragged);

        $(".missing-word").css("background-image", "unset");

        // check if the current amount of sentences equal to the total amount of them
        if (nCountSentences === AMOUN_OF_SENTENCES) {
            setTimeout(function () {
                finished();
            }, 2000);
        }
        // 
        else {
            setTimeout(function () {
                addSentence();
            }, 2000);
        }
    }
}

/*
                wrongAnswer
              ===============
Description: d
Parameters: dragged element
---------------------------------------
Programer: Hila Tsivion
Date: 7/6/2020
---------------------------------------
*/
function wrongAnswer(dragged) {
    dragged.animate({
        top: "0",
        left: "0"
    });
    
    if (!sentences[nCountSentences - 1].mistake) {
        sentences[nCountSentences - 1].mistake = true;
        nMistakes++;
    }
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
function finished() {
    // ניקוי המסך מאלמנטים
    $(".sentences").remove();
    $(".help").remove();

    // שינוי רקע
    $(".container-all").css("background-image", "url('../assets/images/bgdragfaded.svg')");

    // הוספת כפתור המשך
    $(".button-end").css("background-image", "url('../assets/images/continue.svg')");

    // הצגת המסך על הדף
    $(".end-game").fadeIn();
    $(".end-game").css("display", "flex");

    let precentLostPoints = nMistakes / sentences.length * 100;
    var arrScore = [];
    arrScore = JSON.parse(sessionStorage.getItem("arrScore")); 
    arrScore.push(precentLostPoints);
    sessionStorage.setItem("arrScore", JSON.stringify(arrScore));

    $(".button-end").on("click", function (event) {
        window.onbeforeunload = null;
        window.onunload = null;
        sessionStorage.setItem("nCurrentExercise", Number(sessionStorage.getItem("nCurrentExercise")) + 1);
        window.location.href = "../lessonMap.html";
    });
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
    let tmp = arr.slice();

    for (let i = 0; i < arr.length; i++) {
        let index = Math.floor(Math.random() * tmp.length);
        arr[i] = tmp[index];
        tmp = tmp.slice(0, index).concat(tmp.slice(index + 1));
    }
    return arr;
}

/*
                cloneArr
              ============
Description: הפונקציה משכפלת את המערך המתקבל
Parameters: מערך
---------------------------------------
Programer: Hila Tsivion
Date: 21/4/2020
---------------------------------------
*/
function cloneArr(arr) {
    var copy = [];

    // copy the array
    for (var i = 0; i < arr.length; i++) {
        copy[i] = arr[i];
    }
    return copy;
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