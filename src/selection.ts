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

    // Return a new selection that selects complete
    // lines. For the first selected line, it should start
    // at the 1st character of the line. For the last
    // selected line, it should end at the last character of
    // that line or the 1st character of the next line
    // (which uses the fact that `getTextWithLines` removes
    // empty lines).
    selectByWholeLines(selection: vscode.Selection) {
        const newStart = new vscode.Position(selection.start.line, 0);
        const newEnd = (selection.end.character === 0) ?
            selection.end :
            new vscode.Position(selection.end.line + 1, 0);

        return new vscode.Selection(newStart, newEnd);
    }

    // Internally, in VSCode, line numbers are 0-based.
    // We want to show line numbers to users. So adjust by 1.
    getLineNums(selection: vscode.Selection) {
        let start = selection.start.line + 1;
        let end = selection.end.line + 1;
        if (start > end) {
            [start, end] = [end, start];
        }
        return [start, end];
    }

    // Prefix lines of selected text with line numbers.
    // Remove empty lines at the beginning and
    // ending of a selection. Return null if there aren't
    // any lines after the trimming.
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
        return result.map(x => (x[1] === '') ? x[0] : `${x[0]} ${x[1]}`).join('\n');
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
            const selectedTextWithLineNums = this.getTextWithLines(selectedText, startLine, endLine);
            if (!selectedTextWithLineNums) {
                continue;
            }
            const formattedText = SITES[this.site].formatSelection(selectedTextWithLineNums);
            formatted.push(formattedText);
        }
        return formatted.join('\n\n');
    }
}

export function shareSelectedCodeFor(editor: vscode.TextEditor, site: string): string | null {
    const path = editor.document.isUntitled ? null : Git.getNameInRepo(editor.document.fileName);
    const formattedSelection = new SelectionFormatter(editor, site).format();

    if (!formattedSelection) {
        return null;
    }

    let formattedPath = '';
    if (path) {
        formattedPath = SITES[site].formatBold(path) + ':\n\n';
    }
    return formattedPath + formattedSelection + '\n';
}
