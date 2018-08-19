'use strict';

interface Formatter {
  formatBold(text: string): string;
  formatSelection(text: string): string;
}

class JiraFormatter implements Formatter {
  formatBold(text: string) { return `*${text}*`; }
  formatSelection(text: string) { return `{noformat}\n${text}\n{noformat}`; }
}

class SlackFormatter implements Formatter {
  formatBold(text: string) { return `*${text}*`; }
  formatSelection(text: string) { return '```\n' + text + '\n```'; }
}

const SITES: { [index: string]: Formatter } = {
  jira: new JiraFormatter(),
  slack: new SlackFormatter(),
};

export default SITES;
