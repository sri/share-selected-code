# Share Selected Code

This VSCode extension helps you share your code to sites like JIRA and Slack.
It formats the selected code according to the site's style.

Here is an example for JIRA:

## 1) If this is the code that you have selected in your VSCode window

```
    selectByWholeLines(selection: vscode.Selection) {
        const newStart = new vscode.Position(selection.start.line, 0);
        const newEnd = (selection.end.character === 0) ?
            selection.end :
            new vscode.Position(selection.end.line + 1, 0);

        return new vscode.Selection(newStart, newEnd);
    }
```

## 2) And you invoke "Share Selected Code for JIRA" command, this will what be copied to your clipboard:

```
*share-selected-code/src/selection.ts*:

{noformat}
17     selectByWholeLines(selection: vscode.Selection) {
18         const newStart = new vscode.Position(selection.start.line, 0);
19         const newEnd = (selection.end.character === 0) ?
20             selection.end :
21             new vscode.Position(selection.end.line + 1, 0);
22
23         return new vscode.Selection(newStart, newEnd);
24     }
{noformat}
```

## 3) And here is how it'll look when posted to JIRA:

Screenshot of the above in JIRA:

![JIRA Screenshot](screenshots/jira-screenshot.png "JIRA Screenshot")

## Features

* Currently supports: JIRA and Slack
* Includes line numbers
* Include the path to the file, relative to the repo path
* Handles multiple selections correctly

## Requirements

This has been tested on Visual Studio Code 1.26.0.

## Extension Settings

There are currently two commands:

*extension.shareSelectedCode.slack*

*extension.shareSelectedCode.jira*

**Enjoy!!**
