'use strict';

import * as vscode from 'vscode';

import { copyToClipboard } from './clipboard';
import { shareSelectedCodeFor } from './selection';

function shareForSite(site: string) {
    const { showErrorMessage, showInformationMessage } = vscode.window;

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        showErrorMessage('No file in current tab');
        return;
    }

    const result = shareSelectedCodeFor(editor, site);
    if (!result) {
        showErrorMessage('Nothing selected.' + getGitDiffHelpMessage());
        return;
    }

    const error = copyToClipboard(result);
    if (error) {
        showErrorMessage(`Error copying to clipboard: ${error}`);
        return;
    }

    showInformationMessage('Copied to clipboard!');
}

// When viewing a Git diff -- 2 editors, left one has a Git scheme and the
// right one has a File scheme -- if user selects from the left hand side
// (ie, the previous version of the file), that editor is read-only and
// isn't really active. Try to be helpful in that case.
function getGitDiffHelpMessage() {
    const { visibleTextEditors } = vscode.window;
    if (visibleTextEditors.length === 2) {
      const schemes = visibleTextEditors.map(e => e.document.uri.scheme);
      if ((schemes[0] === "git" && schemes[1] === "file") || (schemes[0] === "file" && schemes[1] === "git")) {
        return '\nFor a Git diff, please select from the current version (that\'s on the right hand side) and not the old version.';
      }
    }
    return '';
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
