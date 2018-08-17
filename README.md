# share-selection-and-path README

This VSCode extension helps you share your code to sites like JIRA and Slack.
It formats the selected code in accordance with the selected site.

Here is an example for JIRA (without comments):

```
*share-selection-and-path/src/extension.ts*:   # bold the path; relative to repo

{noformat}
43 function getSelectionLines(selection: vscode.Selection) { # add line numbers
44     let start = selection.start.line + 1;
45     let end = selection.end.line + 1;
46     if (start > end) {
47         [start, end] = [end, start];
48     }
49     return [start, end];
50 }
{noformat}
```

## Features

* Currently supports: JIRA and Slack
* Includes line numbers
* Handles multiple selections correctly

## Requirements

This has been tested on Visual Studio Code 1.26.0.

## Extension Settings

There are currently two commands:

*extension.shareSelectionAndPath.slack*

*extension.shareSelectionAndPath.jira*

**Enjoy!!**
