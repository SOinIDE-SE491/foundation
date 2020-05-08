// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from 'path';
import * as fs from 'fs';
import { pathToFileURL } from "url";
const axios = require("axios");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "stackoverflow-ide" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "stackoverflow-ide.run",
    () => {
      // The code you place here will be executed every time your command is executed

      /* SAMPLE INPUT BOX */
      var response: any;
      const input = vscode.window.showInputBox({
        prompt: "What is your question?",
        placeHolder: "Enter question here:",
      });
      input.then((res) => {
        response = res;

        // Make a request for a user with a given ID
        axios
          .get(
            "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&q=" +
              res
          )
          .then(function (response: any) {
            // handle success

            const results = response.data.items;
            
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
            const scriptPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'view', 'script.js'));
            const cssPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'view', 'style.css'));
            const scriptUri = panel.webview.asWebviewUri(scriptPath);
            const cssUri = panel.webview.asWebviewUri(cssPath);
            // Launch html page
            panel.webview.html = getWebviewContent(results, scriptUri, cssUri);
            // Send message to webview
            panel.webview.postMessage(JSON.stringify({questions: results})); 
            
            console.log(results);
          })
          .catch(function (error: any) {
            // handle error
            console.log(error);
          })
          .finally(function () {
            // always executed
          });

        //vscode.window.showInformationMessage(response);

        // 'https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&q=golang';
        const panel = vscode.window.createWebviewPanel(
          "StackOverflow",
          "StackOverflow IDE",
          vscode.ViewColumn.Beside,
          {enableScripts: true}
        );
      });

    }
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent(response: any, scriptUri: vscode.Uri, cssUri: vscode.Uri) {
  var questions = JSON.stringify(response);
  questions = `{ questions: ${questions} }`;
  return `<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>
      <script src="jquery-3.4.1.min.js"></script>
      <script src="${scriptUri}"></script>
      <script src="${cssUri}"></script>
      <title>Testing</title>
  </head>
  <body>

    <h2>Stack Overflow IDE</h2>
      <form>
        <div class="form-group form-control-sm row">
            <label class="mt-1 ml-2" for="query">Question:</label>
            <input class="form-control form-control-sm ml-2" type="text" placeholder="Enter question" style="width:25%">
            <label class="mt-1 ml-2" for="tags">Language:</label>
            <input class="form-control form-control-sm ml-2" type="text" placeholder="Enter language" style="width:25%">
            <button class="btn btn-primary btn-sm ml-2">Search</button>
        </div>
      </form>
      <hr>
      <div id="container">
          <div id="questionsContainer"></div>
      </div>

      <script id="questionsTemplate" type="text/x-handlebars-template">
          {{#each questions}}
          <div class="questionTitle ml-2 mt-2">
              <b>Question: {{addOne @index}}</b>&ensp;{{title}}
              <div class="scoreView">
                score: {{score}}  views: {{view_count}}
              </div>
          </div>
          <hr>
          {{/each}}
      </script>
  
      <script type="text/javascript">
          Handlebars.registerHelper("addOne", function (index) {
            return index + 1
          });
          var questionInfo = document.getElementById("questionsTemplate").innerHTML;
          var template = Handlebars.compile(questionInfo);
          var questionData = template(${questions});
          document.getElementById("questionsContainer").innerHTML = questionData;
          cssStyle();
      </script>
      
  </body>
  </html>`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
