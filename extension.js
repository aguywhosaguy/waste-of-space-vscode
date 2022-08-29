// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const hastebin = require("hastebin-generator");
const { PasteClient, Publicity, ExpireDate } = require("pastebin-api");
const functions = require("./functions.json")
const axios = require("axios").default

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "waste-of-space" is now active!');
	async function paste() {
		const config = vscode.workspace.getConfiguration("waste-of-space.pastebin")
		let key = config.get("pastebinKey")
		let text = vscode.window.activeTextEditor.document.getText()
		if (key == "") {
			key = await vscode.window.showInputBox({"password": true, "placeHolder": "Key", "title": "Enter your Pastebin dev key here", "prompt": "You can get your dev key by signing up to Pastebin and going to https://pastebin.com/doc_api#1."})
		}
		let title
		if (config.get("useFilenameasTitle")) {
			title = vscode.window.activeTextEditor.document.fileName
		} else {
			title = await vscode.window.showInputBox({"title": "Enter your title for the paste here", "placeHolder": "Title"}) + ".lua"
		}
		const client = new PasteClient(key);
		let pub
		switch (config.get("pastePublicity")) {
			case "Public":
				pub = Publicity.Public
				break
			case "Unlisted":
				pub = Publicity.Unlisted
				break
			case "Private":
				pub = Publicity.Private
				break
			default:
				pub = Publicity.Public
				break
		}
		const response = await client.createPaste({
			code: text,
			format: "lua",
			name: title,
			publicity: pub
		})
		console.log(response)
		await vscode.env.clipboard.writeText(response)
		vscode.window.showInformationMessage("Copied link (" + response + ") to clipboard.")
	}
	async function haste() {
		const text = vscode.window.activeTextEditor.document.getText()
		const url = await hastebin(text, "lua")
		await vscode.env.clipboard.writeText(url)
		vscode.window.showInformationMessage("Copied link (" + url + ") to clipboard.")
	}
	/* vscode.languages.registerHoverProvider('lua', {
		provideHover(document, position, token) {
			console.log(position)
			return new vscode.Hover(document.getText(document.getWordRangeAtPosition(position)));
		}
	  });
	vscode.languages.registerSignatureHelpProvider('lua', {
		provideSignatureHelp(document, position, token, context) {
			const help = new vscode.SignatureHelp()				
			for (const funct of functions) {
				const ehof = position.character - 1
				const sof = ehof - funct.length
				if (sof >= 0) {
					const line = document.getText().split("\n")[position.line]
					const sub = line.substring(sof, ehof)
					if (funct == sub) {
						const info = new vscode.SignatureInformation(funct, "I THINK IT WORKS")
						info.parameters = [new vscode.ParameterInformation("label", "doc")]
						help.signatures.push(info)
					}
				}
			}
			return help
		}
	},
	"("
	)
	*/
	let pTHCMD = vscode.commands.registerCommand('waste-of-space.publishToHastebinCMD', haste)
	let pTPCMD = vscode.commands.registerCommand("waste-of-space.publishToPastebinCMD", paste)
	let compile = vscode.commands.registerCommand("waste-of-space.compile", async function() {
		let text = vscode.window.activeTextEditor.document.getText()
		const doc = vscode.window.activeTextEditor.document.getText()
		const lines = doc.split("\n")
		if (lines[0] == "--COMPILE\r") {
			for (const line of lines) {
				if (line.substring(0, 9) === "--IMPORT ") {
					text = text.replace("--COMPILE\r", "")
					try {
						const data = await axios.get(line.substring(9))
						text = text.replace(line, data.data)
					} catch {
						text = "--COMPILE FAILED. CHECK COMPILE.TXT FOR INFO.\r" + text
					}
				} 	
			}
		}
		console.log(text)
	}) 
	context.subscriptions.push(pTHCMD, pTPCMD, compile);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
