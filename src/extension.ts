import { commands, window, workspace, ExtensionContext } from 'vscode';
const { registerCommand, executeCommand } = commands;
const { showInformationMessage } = window;


const parsedMappingSettings = () => (
	workspace
		.getConfiguration('keybindingMode')
		.get('letterCommandMapping', <any[]>[])
		.reduce(
			(mapping, letterCommandMappingString) => {
				const [letter, command] = letterCommandMappingString.split(',');
				mapping[letter] = command;
				return mapping;
			},
			{}
		)
	);

export function activate(context: ExtensionContext) {
	let enabled = false;

	context.subscriptions.push(registerCommand('keybindingMode.toggle', () => {
		enabled = !enabled;
		executeCommand('setContext', 'keybindingMode:enabled', enabled);
		showInformationMessage(`keybindingMode ${enabled ? 'enabled' : 'disabled'}`);
	}));

	context.subscriptions.push(registerCommand('keybindingMode.handleKey', ({ text }) => {
		if (!enabled) return;

		const letterCommandMapping = parsedMappingSettings();
		const command = letterCommandMapping[text];
		if (command) {
			executeCommand(command);
		}
	}));
}

export function deactivate() {}
