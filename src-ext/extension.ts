// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { pathToFileURL } from "url";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "stackoverflow-ide" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "stackoverflow-ide.run",
    () => {
      // console.log(`history: ${context.globalState.get("history")}`);
      if (context.globalState.get("history") == undefined) {
        context.globalState.update("history", []);
      }
      const searchHistoryList: any = context.globalState.get("history");
      let searchPrompt = "";

      if (searchHistoryList === null) {
        searchPrompt = `Enter your question.`;
      } else {
        searchPrompt = `Recent searches "${searchHistoryList
          .toString()
          .split(",")
          .join('" |  "')}"`;
      }

      const input = vscode.window.showInputBox({
        prompt: searchPrompt,
        placeHolder: "Enter question here:",
      });
        input.then((query) => {
          const panel = vscode.window.createWebviewPanel(
            "StackOverflow",
            "StackOverflow IDE",
            vscode.ViewColumn.Beside,
            { enableScripts: true }
          );
          // Get list of Favorites from global state, default empty array
          let favorites = Array();
          favorites = context.globalState.get('favorites', favorites);

          panel.webview.html = getTemplate(context.extensionPath, query, favorites);

          // declare text editor
          let textEditor = vscode.window.activeTextEditor;

          // look for an active texteditor
          vscode.window.onDidChangeActiveTextEditor(event => {
            if (event !== undefined) {
                textEditor = event;
            }
          });

          // Handle messages from the webview
          panel.webview.onDidReceiveMessage(message => {
            console.log('----- Received MSG from WebView -----');
              switch (message.type) {
                case 'insert':
                  // Ignore if no active TextEditor
                  if (!textEditor) {
                    vscode.window.showErrorMessage('Not found texteditor!');
                    return false;
                  } else {
                    // Create an edit to insert into the document
                    let edits = [ vscode.TextEdit.insert(textEditor.selection.active, message.text) ];
                    // Insert the text
                    let uri = textEditor.document.uri;
                    let edit = new vscode.WorkspaceEdit();
                    edit.set(uri, edits);
                    vscode.workspace.applyEdit(edit);
                  }
                  return;
                case "query":
                  manageHistory(message.text, context);
                  return;
                case 'favorite':
                  // message.text should equal the question_id
                  if (favorites.includes(message.text)) {
                    // Remove from Favorites
                    favorites = favorites.filter(e => e !== message.text);
                  } else {
                    // Add to Favorites
                    favorites.push(message.text);
                  }

                  // Persist favorites to global state
                  context.globalState.update('favorites', favorites);
                  return;
              }
            },
            undefined,
            context.subscriptions
            );
        });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

const manageHistory = (newQuery: string, context: any) => {
  let existingHistory = context.globalState.get("history");
  if (existingHistory === null) {
    existingHistory = [];
  }
  if (existingHistory.indexOf(newQuery) === -1) {
    existingHistory.push(newQuery);
  }

  if (existingHistory.length > 10) {
    existingHistory = existingHistory.slice(
      existingHistory.length - 10,
      existingHistory.length
    );
  }

  context.globalState.update("history", existingHistory);
};

function getTemplate(extensionPath: string, query: any, favorites: any) {
  const script = vscode.Uri.file(
    path.join(extensionPath, "dist", "js", "app.js")
  );
  const css = vscode.Uri.file(
    path.join(extensionPath, "dist", "style", "app.css")
  );

  const scriptPath = script.with({ scheme: "vscode-resource" });
  const cssPath = css.with({ scheme: "vscode-resource" });

  // Use a nonce to whitelist which scripts can be run
  //const nonce = getNonce(); //TODO

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>StackoverflowIDE</title>
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">
<!--<link rel="stylesheet" type="text/css" href="${cssPath}">-->
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="app"
    data-query="${query}"
    data-favorites="${favorites}">
  </div>
  <script src="${scriptPath}"></script>
</body>
</html>`;

  //TODO: Load source html from file instead of inline
  //const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'src', 'html', 'index.html'));
  //panel.webview.html = fs.readFileSync(filePath.fsPath, 'utf8');
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
