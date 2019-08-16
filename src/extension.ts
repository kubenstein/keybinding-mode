import { commands, window, workspace, ExtensionContext } from 'vscode';
const { registerCommand, executeCommand } = commands;
const { showInformationMessage } = window;


const commandForLetter = (letter: string) => (
  (workspace
    .getConfiguration('keybindingMode')
    .get('letterCommandMapping', <string[]>[])
    .find(letterCommandMappingString => letterCommandMappingString[0] === letter) || ''
  )
  .split(',')[1]
);

export function activate(context: ExtensionContext) {
  let enabled = false;

  context.subscriptions.push(registerCommand('keybindingMode.toggle', () => {
    enabled = !enabled;
    executeCommand('setContext', 'keybindingMode:enabled', enabled);
    showInformationMessage(`keybindingMode ${enabled ? 'enabled' : 'disabled'}`);
  }));

  context.subscriptions.push(registerCommand('keybindingMode.handleKey', ({ text: letter }) => {
    if (!enabled) return;

    const command = commandForLetter(letter);
    if (command) {
      executeCommand(command);
    }
  }));
}

export function deactivate() {}
