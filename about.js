

$(function() {
    $(".black").fadeOut();

    $(".exit").on("click", function() {
        $(".black").fadeIn(700);
        setTimeout(function() {
            window.location.href = "main.html";
        }, 700);
    })
});