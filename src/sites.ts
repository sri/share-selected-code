'use strict';

interface Format {
  formatBold(text: string): string;
  formatSelection(text: string): string;
}

class JiraFormat implements Format {
  formatBold(text: string) { return `*${text}*`; }
  formatSelection(text: string) { return `{noformat}\n${text}\n{noformat}`; }
}

class SlackFormat implements Format {
  formatBold(text: string) { return `*${text}*`; }
  formatSelection(text: string) { return '```\n' + text + '\n```'; }
}

const SITES: { [index: string]: Format } = {
  jira: new JiraFormat(),
  slack: new SlackFormat(),
};

export default SITES;
