// מערך המשפטים
const SENTENCES_TO_SORT = [
    {
        sen: "קבוצה 1", // המשפט
        group: "top" // לאיזה קבוצה הוא משתייך :top/bot
    },
    {
        sen: "קבוצה 2",
        group: "bot"
    },
    {
        sen: "קבוצה 1",
        group: "top"
    },
    {
        sen: "קבוצה 2",
        group: "bot"
    },
    {
        sen: "קבוצה 1",
        group: "top"
    },
    {
        sen: "קבוצה 2",
        group: "bot"
    },
    {
        sen: "קבוצה 1",
        group: "top"
    },
    {
        sen: "קבוצה 2",
        group: "bot"
    },
    
];

const AMOUNT_OF_SENTENCES = SENTENCES_TO_SORT.length; // לשנות בתהאם לכמות המשפטים

var isFirstTime = true;
var isEnd  = true;
var nCountDropped = 0;
var nCountTrys = 0;
var nSumMistakes = 0;

/*
                load page
              =============
Description: load all elements
Parameters: none
---------------------------------------
Programer: Hila Tsivion
Date: 3/5/2020
---------------------------------------
*/
$(function() {
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
    // שינוי הרקע לרגיל, הוספת כותרות
    $(".container-all").css("background-image", "url('../assets/images/bgorganise.svg')");
    $(".sort1-place").slideToggle(1000);
    $(".sort2-place").slideToggle(1000);
    $(".titles").css("display", "flex");

    // מערבל את סדר הגייסון
    shuffle(SENTENCES_TO_SORT);

    // 
    for (let nCount = 0; nCount < AMOUNT_OF_SENTENCES; nCount++) {
        $(".sentences").append("<div class='drag-sentences' id='sen" + (nCount + 1) +"' >" + SENTENCES_TO_SORT[nCount].sen + "</div>");
        
        //
        if (SENTENCES_TO_SORT[nCount].group === "top") {
            $("#sen" + (nCount + 1)).data("whichGroup", "upperGroup");
        }
        //
        else {
            $("#sen" + (nCount + 1)).data("whichGroup", "lowerGroup");
        }
    }

    $('.drag-sentences').draggable({
        drag: transformDrag, 
        revert: "invalid"
        // containment: ".container-all"
    });
    
    // מאפיין את שני הדרופ-ספוטים ככאלה
    $(".top").droppable({
        drop: drop
    });
    $(".bot").droppable({
        drop: drop
    });
}

function drop(event, ui) {
    nCountDropped++;

    // הוספת מאזין לחיצה על בדיקה ומאפייניו
    if (nCountDropped === AMOUNT_OF_SENTENCES) {
        $(".check-button-sorting-into-groups").css({
            "cursor": "pointer",
            "opacity": "1",
            "filter": "unset"
        });
        $(".check-button-sorting-into-groups").on("click", check);
    }

    let dragged = ui.draggable;

    dragged.css({
        top: 'unset', 
        left: 'unset',
        width: '29%',
        height: '45%',
        margin: '2%'
    });
    $(dragged).appendTo(this);
}

function check(event) {
    $(".transparent-div").fadeIn();

    let nMistakes  = 0;
    // עובר על כל האלמנטים הנגררים
    for (let nCount = 1; nCount <= AMOUNT_OF_SENTENCES; nCount++) {
        $("#sen" + nCount).css({
            "color": "white",
            "box-shadow": "rgba(41, 41, 41, 0.63) 5px 8px 10px"
        });
        // זה נכון
        if (($("#sen" + nCount).data("whichGroup") === "upperGroup" && $("#sen" + nCount).parent().hasClass("top")) || 
            $("#sen" + nCount).data("whichGroup") === "lowerGroup" && $("#sen" + nCount).parent().hasClass("bot")) {    
            $("#sen" + nCount).css("background-color", "#5BBF90");
        }
        // זה לא נכון
        else {
            nMistakes++;
            nSumMistakes++;
            $("#sen" + nCount).css("background-color", "#F37371");
        }
    }

    // לא היה למשתמש טעויות 
    if (nMistakes === 0) {
        setTimeout(function() {
            finished();
        }, 1500);
    }
    // היו לו טעויות 
    else {
        setTimeout(function() {
            $(".check-button-sorting-into-groups").css({
               cursor: "auto",
               opacity: "0.2" 
            });
            $(".check-button-sorting-into-groups").off("click");
            startOver()
        }, 3000);
    }

}

// הפונקציה תחזיר את האלמנטים הנגררים למיקומם ההתחלתי
function startOver() {
    nCountDropped = 0;
    $(".transparent-div").fadeOut();
    // 
    for (let nCount = 1; nCount <= AMOUNT_OF_SENTENCES; nCount++) {
        $(("#sen" + nCount)).appendTo($(".sentences"));
        $("#sen" + nCount).css({
            "height": "16%",
            "width": "38%",
            "background-color": " rgba(255, 255, 255, 0.9)",
            "color": "#569aec"
        });
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
    $(".check-button-sorting-into-groups").off("click");
    $(".drop-spot").remove();
    $(".titles").remove();
    $(".check-button-sorting-into-groups").remove();
    $(".sentences").remove();
    $(".help").remove();
    $(".transparent-div").remove();
    
    // שינוי רקע
    $(".container-all").css("background-image", "url('../assets/images/bgorganisefaded.svg')");
    
    // הצגת המסך על הדף
    $(".end-game").fadeIn();
    $(".end-game").css("display", "flex");

    // הוספת כפתור המשך
    $(".button-end").css("background-image", "url('../assets/images/continue.svg')");

    
    // הוספת ציון לתרגול
    if (nSumMistakes > AMOUNT_OF_SENTENCES) {
        nSumMistakes = AMOUNT_OF_SENTENCES;
    }
    let precentLostPoints = nSumMistakes / SENTENCES_TO_SORT.length * 100;
    var arrScore = [];
    arrScore = JSON.parse(sessionStorage.getItem("arrScore")); 
    arrScore.push(precentLostPoints);
    sessionStorage.setItem("arrScore", JSON.stringify(arrScore));
    
    // הוספת מאזין לחיצה לחזרה למסלול
    $(".button-end").on("click", function(event) {
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

    // מערבלללל
    for (let i = 0; i < arr.length; i++) {
      let index = Math.floor(Math.random() * tmp.length);
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