'use strict';

import * as vscode from 'vscode';
import SITES from './sites';

import Git from './git';

class SelectionFormatter {
    private editor: vscode.TextEditor;
    private site: string;

    constructor(editor: vscode.TextEditor, site: string) {
        this.editor = editor;
        this.site = site;
    }

    selectByWholeLines(selection: vscode.Selection) {
        const newStart = new vscode.Position(selection.start.line, 0);
        const newEnd = (selection.end.character === 0) ?
            selection.end :
            new vscode.Position(selection.end.line + 1, 0);

        return new vscode.Selection(newStart, newEnd);
    }

    getLineNums(selection: vscode.Selection) {
        let start = selection.start.line + 1;
        let end = selection.end.line + 1;
        if (start > end) {
            [start, end] = [end, start];
        }
        return [start, end];
    }

    getTextWithLines(text: string, start: number, end: number) {
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

    format() {
        if (this.editor.selection.isEmpty || !SITES[this.site]) {
            return null;
        }

        let formatted: string[] = [];
        for (let i = 0; i < this.editor.selections.length; i++) {
            const selection = this.selectByWholeLines(this.editor.selections[i]);
            const [startLine, endLine] = this.getLineNums(selection);
            let selectedText = this.editor.document.getText(selection);
            const selectedTextWithLines = this.getTextWithLines(selectedText, startLine, endLine);
            if (!selectedTextWithLines) {
                continue;
            }
            const formattedText = SITES[this.site].formatSelection(selectedTextWithLines);
            formatted.push(formattedText);
        }
        return formatted.join('\n\n');
    }
}

export function getSelectionAndPathForSharing(editor: vscode.TextEditor, site: string): string {
    const path = Git.getNameInRepo(editor.document.fileName);
    const formattedSelection = new SelectionFormatter(editor, site).format();

    if (formattedSelection) {
        return SITES[site].formatBold(path) + ':\n\n' + formattedSelection + '\n';
    } else {
        return path;
    }
}
