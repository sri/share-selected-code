# share-selection-and-path README

This VSCode extension helps you share your code to third party sites like JIRA and Slack.
It formats the code in accordance with the selected site.

Here is an example for JIRA:

```
*share-selection-and-path/src/extension.ts*:

{noformat}
43 function getSelectionLines(selection: vscode.Selection) {
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
* It handles partial selections correctly

## Requirements


## Extension Settings

There are currently two commands:

*extension.shareSelectionAndPath.slack*

*extension.shareSelectionAndPath.jira*

**Enjoy!!**
