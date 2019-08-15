import { commands, window, workspace, ExtensionContext } from 'vscode';
const { registerCommand, executeCommand } = commands;
const { showInformationMessage } = window;


const parsedMappingSettings = () => {
	return workspace
		.getConfiguration('helloworld-sample')
		.get('letterCommandMapping', <any[]>[])
		.reduce(
			(mapping, letterCommandMappingString) => {
				const [letter, command] = letterCommandMappingString.split(',');
				mapping[letter] = command;
				return mapping;
			},
			{}
		);
}

export function activate(context: ExtensionContext) {
	let enabled = false;
	const letterCommandMapping = parsedMappingSettings();

	context.subscriptions.push(registerCommand('extension.kMode', () => {
		enabled = !enabled;
		executeCommand('setContext', 'kMode:enabled', enabled)
		showInformationMessage(`kMode ${enabled ? 'enabled' : 'disabled'}`);
	}));

	context.subscriptions.push(registerCommand('extension.handleKey', ({ text }) => {
		if (!enabled) return;

		const command = letterCommandMapping[text];
		return command ? executeCommand(command) : Promise.resolve();
	}));
}

export function deactivate() {}
