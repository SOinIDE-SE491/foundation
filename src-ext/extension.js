"use strict";
exports.__esModule = true;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");
var path = require("path");
function activate(context) {
    console.log('Congratulations, your extension "stackoverflow-ide" is now active!');
    var disposable = vscode.commands.registerCommand("stackoverflow-ide.run", function () {
        var input = vscode.window.showInputBox({
            prompt: "What is your question?",
            placeHolder: "Enter question here:"
        });
        input.then(function (query) {
            var panel = vscode.window.createWebviewPanel("StackOverflow", "StackOverflow IDE", vscode.ViewColumn.Beside, { enableScripts: true });
            panel.webview.html = getTemplate(context.extensionPath, query);
            // Can't seem to get this working, so set query in data attribute as work around atm
            //panel.webview.postMessage(JSON.stringify({"query": query}));
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
;
function deactivate() { }
exports.deactivate = deactivate;
;
function getTemplate(extensionPath, query) {
    var script = vscode.Uri.file(path.join(extensionPath, "dist", "js", "app.js"));
    var css = vscode.Uri.file(path.join(extensionPath, "dist", "style", "app.css"));
    var scriptPath = script["with"]({ scheme: 'vscode-resource' });
    var cssPath = css["with"]({ scheme: 'vscode-resource' });
    // Use a nonce to whitelist which scripts can be run
    //const nonce = getNonce(); //TODO
    return "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>StackoverflowIDE</title>\n<link href=\"https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900\" rel=\"stylesheet\">\n<link href=\"https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css\" rel=\"stylesheet\">\n<link href=\"https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css\" rel=\"stylesheet\">\n<!--<link rel=\"stylesheet\" type=\"text/css\" href=\"" + cssPath + "\">-->\n</head>\n<body>\n  <noscript>You need to enable JavaScript to run this app.</noscript>\n  <div id=\"app\" data-query=\"" + query + "\"></div>\n  <script src=\"" + scriptPath + "\"></script>\n</body>\n</html>";
    //TODO: Load source html from file instead of inline
    //const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'src', 'html', 'index.html'));
    //panel.webview.html = fs.readFileSync(filePath.fsPath, 'utf8');
}
;
function getNonce() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
;
