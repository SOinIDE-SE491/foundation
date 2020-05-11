"use strict";
exports.__esModule = true;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
var path = require("path");
var axios = require("axios");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "stackoverflow-ide" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand("stackoverflow-ide.run", function () {
        // The code you place here will be executed every time your command is executed
        /* SAMPLE INPUT BOX */
        var response;
        var input = vscode.window.showInputBox({
            prompt: "What is your question?",
            placeHolder: "Enter question here:"
        });
        input.then(function (res) {
            response = res;
            // Make a request for a user with a given ID
            axios
                .get("https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&q=" +
                res)
                .then(function (response) {
                // handle success
                var results = response.data.items;
                // /* READ & LOAD: test openning html file */
                // const indexPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'view', 'index.html'));
                // const scriptPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'view', 'script.js'));
                // const scriptUri = panel.webview.asWebviewUri(scriptPath);
                // var indexHtml = fs.readFileSync(indexPath.path, 'utf8');
                // indexHtml = indexHtml.replace('script.js', `${scriptUri}`);
                // panel.webview.html = indexHtml;
                // /* SEND MESSAGES: from extention to webview */
                // if (!panel || panel) {
                //   panel.webview.html = indexHtml;
                //   panel.webview.postMessage(JSON.stringify({questions: results}));
                //   console.log("Send msg to webview");
                // }
                // /****************************/
                // Get script.js & style.css path and pass as parameters 
                var scriptPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'view', 'script.js'));
                var cssPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'view', 'style.css'));
                var scriptUri = panel.webview.asWebviewUri(scriptPath);
                var cssUri = panel.webview.asWebviewUri(cssPath);
                // Launch html page
                panel.webview.html = getWebviewContent(results, scriptUri, cssUri);
                // Send message to webview
                panel.webview.postMessage(JSON.stringify({ questions: results }));
                console.log(results);
            })["catch"](function (error) {
                // handle error
                console.log(error);
            })["finally"](function () {
                // always executed
            });
            //vscode.window.showInformationMessage(response);
            // 'https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&q=golang';
            var panel = vscode.window.createWebviewPanel("StackOverflow", "StackOverflow IDE", vscode.ViewColumn.Beside, { enableScripts: true });
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function getWebviewContent(response, scriptUri, cssUri) {
    var questions = JSON.stringify(response);
    questions = "{ questions: " + questions + " }";
    return "<html lang=\"en\">\n  <head>\n      <meta charset=\"UTF-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\">\n      <script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n      <script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\" crossorigin=\"anonymous\"></script>\n      <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\" crossorigin=\"anonymous\"></script>\n      <script src=\"https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js\"></script>\n      <script src=\"jquery-3.4.1.min.js\"></script>\n      <script src=\"" + scriptUri + "\"></script>\n      <script src=\"" + cssUri + "\"></script>\n      <title>Testing</title>\n  </head>\n  <style>\n  html {\n    font-size:14px;\n  }\n  </style>\n  <body>\n\n    <h2>Stack Overflow IDE</h2>\n      <form>\n        <div class=\"form-group form-control-sm row\">\n            <label class=\"mt-1 ml-2\" for=\"query\">Question:</label>\n            <input class=\"form-control form-control-sm ml-2 border-dark\" type=\"text\" placeholder=\"Enter question\" style=\"width:25%\">\n            <label class=\"mt-1 ml-2\" for=\"tags\">Tags:</label>\n            <input class=\"form-control form-control-sm ml-2 border-dark\" type=\"text\" placeholder=\"Enter tag\" style=\"width:25%\">\n            <button class=\"btn btn-primary btn-sm ml-2\">Search</button>\n        </div>\n      </form>\n      <div class=\"btn-group\" style=\"margin-left: 60px;\" role=\"group\" aria-label=\"Basic example\">\n        <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\">Relevance</button>\n        <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\">New</button>\n        <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\">Active</button>\n        <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\">Votes</button>\n      </div>\n      <hr>\n      <div id=\"container\">\n          <div id=\"questionsContainer\"></div>\n      </div>\n\n      <script id=\"questionsTemplate\" type=\"text/x-handlebars-template\">\n          {{#each questions}}\n          <div class=\"questionTitle pl-3 pt-3 pb-3 pr-3 m-3 rounded\" style=\" width:90%; display:flex;\">\n  \n              <div class=\"questionStats\" style=\"width:100px;\">\n                <div class=\"votes\">\n                  votes: <span style=\"float:right;\">{{score}}</span>\n                </div>\n                <div class=\"answers\">\n                  answers: <span style=\"float:right;\">{{answer_count}}</span>\n                </div>\n                <div class=\"views\">\n                  views: <span style=\"float:right;\">{{view_count}}</span>\n                </div>\n              </div>\n\n              <div class=\"qestionTag\" style=\"margin-left: 30px; display: flex; justify-content: center; align-items: top;\"><b>Question:</b></div>\n\n              <div class=\"question\">\n                <div class=\"question\" style=\"width:80%; margin-left:10px; display:flex; justify-content:center; align-items:top;\">\n                  {{title}}\n                </div>\n              </div>\n\n          </div>\n          <hr>\n          {{/each}}\n      </script>\n  \n      <script type=\"text/javascript\">\n          Handlebars.registerHelper(\"addOne\", function (index) {\n            return index + 1\n          });\n          var questionInfo = document.getElementById(\"questionsTemplate\").innerHTML;\n          var template = Handlebars.compile(questionInfo);\n          var questionData = template(" + questions + ");\n          document.getElementById(\"questionsContainer\").innerHTML = questionData;\n          cssStyle();\n      </script>\n      \n  </body>\n  </html>";
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
