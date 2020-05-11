// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { pathToFileURL } from "url";
const axios = require("axios");

// may be bad practice, but so is missing deadlines
let results;
let pages;

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "stackoverflow-ide" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "stackoverflow-ide.run",
    () => {
      var response: any;
      const input = vscode.window.showInputBox({
        prompt: "What is your question?",
        placeHolder: "Enter question here:",
      });
      input.then((res) => {
        response = res;
        axios
          .get(
            "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&q=" +
              res
          )
          .then(function (response: any) {
            // handle success

            results = response.data.items;

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
            const scriptPath = vscode.Uri.file(
              path.join(context.extensionPath, "src", "view", "script.js")
            );
            const cssPath = vscode.Uri.file(
              path.join(context.extensionPath, "src", "view", "style.css")
            );
            const scriptUri = panel.webview.asWebviewUri(scriptPath);
            const cssUri = panel.webview.asWebviewUri(cssPath);

            console.log(results);
            //store in the results global

            // check if results were found
            if (results.length > 0) {
              //after this is complete, number of pages can be accessed via global pages.length
              buildPages(results);

              const resultsSubset = getPage(1);

              // Launch html page
              panel.webview.html = getWebviewContent(
                resultsSubset,
                scriptUri,
                cssUri
              );
              // Send message to webview
              panel.webview.postMessage(
                JSON.stringify({ questions: resultsSubset })
              );
            } else {
              panel.webview.html = nullResults();
            }
          })
          .catch(function (error: any) {
            // handle error
            console.log(error);
          })
          .finally(function () {
            // always executed
          });
        const panel = vscode.window.createWebviewPanel(
          "StackOverflow",
          "StackOverflow IDE",
          vscode.ViewColumn.Beside,
          { enableScripts: true }
        );
      });
    }
  );

  context.subscriptions.push(disposable);
}

const buildPages = (results) => {
  pages = [];

  // calculate the number of pages required
  // standard results are 30, so this is most likely 6
  let numOfPages = Math.ceil(results.length / 5);

  // can probably do this more efficeintly with a map function
  for (let i = 1; i <= numOfPages; i++) {
    //logic for all pages except the last
    if (i != numOfPages) {
      let page = results.slice(0, 5);
      results.splice(5, results.length);
      pages.push(page);
    } else {
      //handle last page differently as it may not be a complete page
      let page = results.slice(0, results.length);
      pages.push(page);
    }
  }
};

const getPage = (pageNumber) => {
  //returns an array of five results
  /*
	Array[5]
		0:Object
			tags:Array[4]
			owner:Object
			is_answered:false
			view_count:12
			answer_count:1
			score:0
			last_activity_date:1589135775
			creation_date:1589134973
			last_edit_date:1589135775
			question_id:61716789
			link:"https://stackoverflow.com/questions/61716789/classnotfoundexception-with-kafka-connect-mqtt-connector"
			title:"ClassNotFoundException with Kafka Connect MQTT connector"
	*/
  return pages[pageNumber];
};

const nullResults = () => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
  </head>
	<body>
		<h1>No results. Please try a different question.</h1>
  </body>
  </html>`;
};

function getWebviewContent(
  response: any,
  scriptUri: vscode.Uri,
  cssUri: vscode.Uri
) {
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
  <style>
  html {
    font-size:14px;
  }
  </style>
  <body>

    <h2>Stack Overflow IDE</h2>
      <form>
        <div class="form-group form-control-sm row">
            <label class="mt-1 ml-2" for="query">Question:</label>
            <input class="form-control form-control-sm ml-2 border-dark" type="text" placeholder="Enter question" style="width:25%">
            <label class="mt-1 ml-2" for="tags">Tags:</label>
            <input class="form-control form-control-sm ml-2 border-dark" type="text" placeholder="Enter tag" style="width:25%">
            <button class="btn btn-primary btn-sm ml-2">Search</button>
        </div>
      </form>
      <div class="btn-group" style="margin-left: 60px;" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-outline-secondary btn-sm">Relevance</button>
        <button type="button" class="btn btn-outline-secondary btn-sm">New</button>
        <button type="button" class="btn btn-outline-secondary btn-sm">Active</button>
        <button type="button" class="btn btn-outline-secondary btn-sm">Votes</button>
      </div>
      <hr>
      <div id="container">
          <div id="questionsContainer"></div>
      </div>

      <script id="questionsTemplate" type="text/x-handlebars-template">
          {{#each questions}}
          <div class="questionTitle pl-3 pt-3 pb-3 pr-3 m-3 rounded" style=" width:90%; display:flex;">
  
              <div class="questionStats" style="width:100px;">
                <div class="votes">
                  votes: <span style="float:right;">{{score}}</span>
                </div>
                <div class="answers">
                  answers: <span style="float:right;">{{answer_count}}</span>
                </div>
                <div class="views">
                  views: <span style="float:right;">{{view_count}}</span>
                </div>
              </div>

              <div class="qestionTag" style="margin-left: 30px; display: flex; justify-content: center; align-items: top;"><b>Question:</b></div>

              <div class="question">
                <div class="question" style="width:80%; margin-left:10px; display:flex; justify-content:center; align-items:top;">
                  {{title}}
                </div>
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
