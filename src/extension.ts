'use strict';

import * as vscode from 'vscode';

import Git from './git';
import THIRD_PARTY_SITES from './sites';
import { copyToClipboard } from './clipboard';
import { formatSelections } from './selection';

function doShareFor(site: string) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showInformationMessage('No file in current tab');
        return;
    }

    const fullFileName = Git.getNameInRepo(editor.document.fileName);
    const formatted = formatSelections(editor, site);

    let result = '';
    if (formatted) {
        result = THIRD_PARTY_SITES[site].formatBold(fullFileName) + ':\n\n' + formatted + '\n';
    } else {
        result = fullFileName + '\n';
    }

    const error = copyToClipboard(result);
    if (error) {
        vscode.window.showInformationMessage(`Error copying to clipboard: ${error}`);
    } else {
        vscode.window.showInformationMessage('Copied to clipboard!');
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Starting up Share Selection and Path extension...');

    const disposables = [
        vscode.commands.registerCommand('extension.shareSelectionAndPath.slack', () => {
            doShareFor('slack');
        }),
        vscode.commands.registerCommand('extension.shareSelectionAndPath.jira', () => {
            doShareFor('jira');
        })
    ];

    disposables.forEach(disposable => context.subscriptions.push(disposable));
}

export function deactivate() {
}
