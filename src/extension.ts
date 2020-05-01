// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { pathToFileURL } from 'url';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "stackoverflow-ide" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('stackoverflow-ide.run', () => {
		// The code you place here will be executed every time your command is executed

		/* SAMPLE: WebviewPanel (Open new tab) */
		// const panel = vscode.window.createWebviewPanel(
		// 	'StackOverflow',
		// 	'StackOverflow IDE',
		// 	vscode.ViewColumn.One,
		// 	{} 
		// );
		// panel.webview.html = getWebviewContent();

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello from StackOverflow IDE!');

		/* SAMPLE INPUT BOX */
		var response: any;
		const input = vscode.window.showInputBox({prompt: 'What is your question?', placeHolder: 'Enter question here:'});
		input.then((res) => {
			response = res;
			vscode.window.showInformationMessage(response);	
			
			// 'https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow&q=golang';
			const panel = vscode.window.createWebviewPanel(
					'StackOverflow',
					'StackOverflow IDE',
					vscode.ViewColumn.One,
					{} 
				);
			panel.webview.html = getWebviewContent(response);
		});
		
		/* SAMPLE QUICK PICK */
		// var selected: any;
		// const pick = vscode.window.showQuickPick(
		// 	[
		// 		{ label: 'C', description: '				Search for C' },
		// 		{ label: 'C++', description: '			Search for C++' },
		// 		{ label: 'C#', description: '			Search for C#' },
		// 		{ label: 'Java', description: '			Search for Java' },
		// 		{ label: 'JavaScript', description: '		Search for JavaScript' },
		// 		{ label: 'Python', description: '		Search for Python'},
		// 		{ label: 'TypeScript', description: '		Search for TypeScript' },
		// 	],
		// 	{ placeHolder: 'Select language.',}
		// ).then((res) => {
		// 	selected = res?.label;
		// 	vscode.window.showInformationMessage(selected);
		// });

		/* SAMPLE TERMINAL */
		// const terminal = vscode.window.createTerminal('StackOverflow IDE');
		// terminal.show();
		// terminal.sendText('Hello there');

	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(response: String) {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
  </head>
  <body>
		<h2>User entered: ${response}</h2>
	  <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
  </body>
  </html>`;
  }

// this method is called when your extension is deactivated
export function deactivate() {}
