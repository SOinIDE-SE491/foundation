window.addEventListener("message", event => {
    var messageString = event.data;
    var messageJSON = JSON.parse(messageString);
    console.log(messageString);

    // if message from extenstion is questions json
    if ("questions" in messageJSON) {
        receivedQuestions(messageString);

    } else if ("answers" in messageJSON) {
        console.log("answers");
    }

}, false);

// Always call cssStyle function()
function cssStyle() {
    console.log('hello from extention.ts to script.js');
    $("body").css("background-color", "lightgray");
    $("#container").css("background-color", "white");
};

function receivedQuestions(questions) {
    console.log(questions);
    /* INCOMPLETE */
    // Handlebars.registerHelper("addOne", function (index) {
    //     return index + 1
    // });
    // var questionInfo = document.getElementById("questionsTemplate").innerHTML;
    // var template = Handlebars.compile(questionInfo);
    // var questionData = template(questions);
    // console.log(questionData);
    // document.getElementById("questionsContainer").innerHTML += questionData;
}