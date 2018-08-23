import * as assert from 'assert';
import * as path from 'path';

import * as vscode from 'vscode';

import { shareSelectedCodeFor } from '../selection';
import Git from '../git';

describe("Selection Tests", () => {
  let editor: vscode.TextEditor;
  let initialSelection: vscode.Selection;

  const getEditor = async (path: any) => {
    const document = await vscode.workspace.openTextDocument(path);
    editor = await vscode.window.showTextDocument(document);
    initialSelection = editor.selection;
  };

  const parentDir = path.resolve(path.join(__dirname, '..', '..'));

  before(() => {
    Git.getRoot = (path: string) => parentDir;
  });

  afterEach(() => {
    if (editor) {
      editor.selection = initialSelection;
    }
  });

  describe("Without a file on disk (new tab that hasn't been saved yet)", () => {
    before(async () => {
      await getEditor(vscode.Uri.parse('untitled:Foo-1'));
    });

    describe('without any selections', () => {
      describe('JIRA', () => {
        it('should return null', async () => {
          const result = shareSelectedCodeFor(editor, 'jira');
          assert.equal(result, null);
        });
      });

      describe('Slack', () => {
        it('should return null', async () => {
          const result = shareSelectedCodeFor(editor, 'slack');
          assert.equal(result, null);
        });
      });
    });
  });

  describe('With a file on disk', () => {

    before(async () => {
      const testFilePath = path.join(parentDir, 'src', 'test', 'fixtures', 'test.txt');
      await getEditor(testFilePath);
    });

    describe('Without any selections', () => {
      it('should return null', () => {
        assert.equal(shareSelectedCodeFor(editor, 'jira'), null);
      });
    });

    describe('With multiple selections and whose lines are not fully selected', () => {
      beforeEach(() => {
        // For selection, lines are zero-based within VSCode.
        const selections = [
          new vscode.Selection(0, 0, 1, 1),
          // Line 4 (actual line is 5) starts with empty line
          // which should not be returned.
          new vscode.Selection(4, 0, 7, 5)
        ];
        editor.selection = selections[0];
        editor.selections = selections;
      });

      describe('JIRA', () => {
        it('should return whole lines, correctly formatted (skipping leading & trailing newlines)', async () => {
          const result = shareSelectedCodeFor(editor, 'jira');
          const expected = `*share-selected-code/src/test/fixtures/test.txt*:

{noformat}
1 this is line 1
2 this is line 2
{noformat}

{noformat}
6 this is line 6
7
8 this is the final line and is line 8
{noformat}
`;
          assert.equal(result, expected);
        });
      });

      describe('Slack', () => {
        it('should return in the correct format', async () => {
          const result = shareSelectedCodeFor(editor, 'slack');
          const expected = `*share-selected-code/src/test/fixtures/test.txt*:

\`\`\`
1 this is line 1
2 this is line 2
\`\`\`

\`\`\`
6 this is line 6
7
8 this is the final line and is line 8
\`\`\`
`;
          assert.equal(result, expected);
        });
      });
    });
  });
});
