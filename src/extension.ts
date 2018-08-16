'use strict';

import * as vscode from 'vscode';
import * as clipboardy from 'clipboardy';
import * as path from 'path';
import * as fs from 'fs';

function copyToClipboard(text: string) {
    try {
        clipboardy.writeSync(text);
        return null;
    } catch (e) {
        return `${e}`;
    }
}

function getFilePathInRepo(filePath: string) {
    let dir = path.dirname(filePath);
    while (true) {
        const dotGit = path.join(dir, '.git');
        if (fs.existsSync(dotGit)) {
            return dir;
        }
        if (dir === '/' || dir === '.' || !fs.existsSync(dir)) {
            break;
        }
        dir = path.dirname(dir);
    }
    return null;
}

const THIRD_PARTY_SITES: { [index: string]: any } = {
    jira: {
        formatBold:      (text: string) => `*${text}*`,
        formatSelection: (text: string) => `{noformat}\n${text}\n{noformat}`
    },
    slack: {
        formatBold:      (text: string) => `*${text}*`,
        formatSelection: (text: string) => '```\n' + text + '\n```'
    }
};

function getSelectionLines(selection: vscode.Selection) {
    let start = selection.start.line + 1;
    let end = selection.end.line + 1;
    if (start > end) {
        [start, end] = [end, start];
    }
    return [start, end];
}

function getTextWithLines(text: string, start: number, end: number) {
    const endStr = `${end}`;
    const lines = text.split('\n');
    let result = [];
    for (let i = 0; i < lines.length; i++) {
        let n = `${start + i}`;
        // Left pad with spaces so they line up.
        while (n.length < endStr.length) {
            n = ' ' + n;
        }
        result.push([n, lines[i]]);
    }
    // Remove empty lines at beginning and end.
    while (result.length > 0 && result[0][1] === '') {
        result.shift();
    }
    while (result.length > 0 && result[result.length - 1][1] === '') {
        result.pop();
    }
    if (result.length === 0) {
        return null;
    }
    return result.map(x => `${x[0]} ${x[1]}`).join('\n');
}

function selectByWholeLines(selection: vscode.Selection) {
    const newStart = new vscode.Position(selection.start.line, 0);
    const newEnd = (selection.end.character === 0) ?
        selection.end :
        new vscode.Position(selection.end.line + 1, 0);

    return new vscode.Selection(newStart, newEnd);
}

function formatSelections(editor: vscode.TextEditor, site: string) {
    if (editor.selection.isEmpty || !THIRD_PARTY_SITES[site]) {
        return null;
    }

    let formatted: string[] = [];
    for (let i = 0; i < editor.selections.length; i++) {
        const selection = selectByWholeLines(editor.selections[i]);
        const [startLine, endLine] = getSelectionLines(selection);
        let selectedText = editor.document.getText(selection);
        const selectedTextWithLines = getTextWithLines(selectedText, startLine, endLine);
        if (!selectedTextWithLines) {
            continue;
        }
        const formattedText = THIRD_PARTY_SITES[site].formatSelection(selectedTextWithLines);
        formatted.push(formattedText);
    }
    return formatted.join('\n\n');
}

function formatFileName(fileName: string) {
    const gitRoot = getFilePathInRepo(fileName);
    if (!gitRoot) {
        return fileName;
    }
    if (fileName.startsWith(gitRoot)) {
        const repoName = path.basename(gitRoot);
        const relativePath = fileName.substring(gitRoot.length);
        return `${repoName}${relativePath}`;
    }
    return fileName;
}

function run(site : string) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showInformationMessage('No file in current tab');
        return;
    }

    const fullFileName = formatFileName(editor.document.fileName);
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
            run('slack');
        }),
        vscode.commands.registerCommand('extension.shareSelectionAndPath.jira', () => {
            run('jira');
        })
    ];

    disposables.forEach(disposable => context.subscriptions.push(disposable));
}

export function deactivate() {
}
