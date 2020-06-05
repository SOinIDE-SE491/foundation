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
      const input = vscode.window.showInputBox({
        prompt: "What is your question?",
        placeHolder: "Enter question here:",
      });
        input.then((query) => {
          const panel = vscode.window.createWebviewPanel(
            "StackOverflow",
            "StackOverflow IDE",
            vscode.ViewColumn.Beside,
            { enableScripts: true }
          );
          panel.webview.html = getTemplate(context.extensionPath, query);
          // Can't seem to get this working, so set query in data attribute as work around atm
          //panel.webview.postMessage(JSON.stringify({"query": query}));

          // declare text editor
          let textEditor = vscode.window.activeTextEditor;
          vscode.window.onDidChangeActiveTextEditor(event => {
            console.log('----- On change text editor -----');
            console.log('* Event...');
            console.log(event);
            if (event !== undefined) {
                textEditor = event;
            }
            console.log('* Change to...');
            console.log(textEditor);
            console.log('--------------------------------');
          });

          // Handle messages from the webview
          panel.webview.onDidReceiveMessage(message => {
            console.log('----- Received MSG from WebView -----');
            console.log(message);
              switch (message.type) {
                case 'insert':                  
                  // Ignore if no active TextEditor
                  if (!textEditor) {
                    vscode.window.showErrorMessage('NOT FOUND editor');
                    return false;
                  } else {
                    // vscode.window.showInformationMessage(message.text);
                    // Create an edit to insert into the document
                    let edits = [ vscode.TextEdit.insert(textEditor.selection.active, message.text) ];
                    // Insert the text
                    let uri = textEditor.document.uri;
                    let edit = new vscode.WorkspaceEdit();
                    edit.set(uri, edits);
                    vscode.workspace.applyEdit(edit);
                  }
                  console.log('--------------------------------');
                  return;
              }
            },
            undefined,
            context.subscriptions
            );
        });
    });

  context.subscriptions.push(disposable);
};

export function deactivate() {};

function getTemplate(extensionPath: string, query: any) {
  const script = vscode.Uri.file(
    path.join(extensionPath, "dist", "js", "app.js")
  );
  const css = vscode.Uri.file(
    path.join(extensionPath, "dist", "style", "app.css")
  );

  const scriptPath = script.with({scheme: 'vscode-resource'});
  const cssPath = css.with({scheme: 'vscode-resource'});

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
  <div id="app" data-query="${query}"></div>
  <script src="${scriptPath}"></script>
</body>
</html>`;

//TODO: Load source html from file instead of inline
//const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'src', 'html', 'index.html'));
//panel.webview.html = fs.readFileSync(filePath.fsPath, 'utf8');
};

function getNonce() {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};