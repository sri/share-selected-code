'use strict';

import * as vscode from 'vscode';

import { copyToClipboard } from './clipboard';
import { getSelectionAndPathForSharing } from './selection';

function shareSelectionAndPathFor(site: string) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showInformationMessage('No file in current tab');
        return;
    }

    const result = getSelectionAndPathForSharing(editor, site);
    const error = copyToClipboard(result);
    const message =
        error ?
            `Error copying to clipboard: ${error}` :
            'Copied to clipboard!';

    vscode.window.showInformationMessage(message);
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Starting up Share Selection and Path extension...');

    const disposables = [
        vscode.commands.registerCommand('extension.shareSelectionAndPath.slack', () => {
            shareSelectionAndPathFor('slack');
        }),
        vscode.commands.registerCommand('extension.shareSelectionAndPath.jira', () => {
            shareSelectionAndPathFor('jira');
        })
    ];

    disposables.forEach(disposable => context.subscriptions.push(disposable));
}

export function deactivate() {
}
