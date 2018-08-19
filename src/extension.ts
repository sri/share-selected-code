'use strict';

import * as vscode from 'vscode';

import { copyToClipboard } from './clipboard';
import { shareSelectedCodeFor } from './selection';

function shareForSite(site: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No file in current tab');
        return;
    }

    const result = shareSelectedCodeFor(editor, site);
    if (!result) {
        return;
    }

    const error = copyToClipboard(result);
    const message =
        error ?
            `Error copying to clipboard: ${error}` :
            'Copied to clipboard!';

    vscode.window.showInformationMessage(message);
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Starting up Share Selected Code extension...');

    const registerCommand = (command: string, fn: any) => {
        const disposable = vscode.commands.registerCommand(command, fn);
        context.subscriptions.push(disposable);
    };

    registerCommand('extension.shareSelectedCode.slack', () => { shareForSite('slack'); }),
    registerCommand('extension.shareSelectedCode.jira',  () => { shareForSite('jira');  })
}

export function deactivate() {
}
