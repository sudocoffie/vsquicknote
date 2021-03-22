// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	let folderPath =vscode.Uri.parse("/vsquicknote");
	let openFolders = vscode.workspace.workspaceFolders;
	if (openFolders !== undefined && openFolders.length > 0) {
		let folder = openFolders[0];
		let filePath = vscode.Uri.joinPath(folderPath, `${folder.name}.txt`);
		let disposable = vscode.commands.registerCommand('vsquicknote.takeNote', async ()  => {
			let value = await vscode.window.showInputBox();
			
			let stringValue : string = value ? value : "";
			
			// Find out what project we are using
				let fileContent : string = "";
				try {
					let readData = await vscode.workspace.fs.readFile(filePath);
					fileContent = Buffer.from(readData).toString('utf8');
				} catch {}
	
				fileContent = `✔ ${stringValue} || ${new Date().toString()}` + "\n" + fileContent;
				await vscode.workspace.fs.createDirectory(folderPath);
				await vscode.workspace.fs.writeFile(filePath, Buffer.from(fileContent, 'utf8'));
				vscode.window.showInformationMessage(`${stringValue} in ${folder.name}`);
		});
	
		context.subscriptions.push(disposable);
	
		context.subscriptions.push(vscode.commands.registerCommand('vsquicknote.openNotes', async () => {
			let doc = await vscode.workspace.openTextDocument(filePath);
			vscode.window.showTextDocument(doc);
		}));
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
