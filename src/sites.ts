'use strict';

const THIRD_PARTY_SITES: { [index: string]: any } = {
  jira: {
    formatBold: (text: string) => `*${text}*`,
    formatSelection: (text: string) => `{noformat}\n${text}\n{noformat}`
  },
  slack: {
    formatBold: (text: string) => `*${text}*`,
    formatSelection: (text: string) => '```\n' + text + '\n```'
  }
};

export default THIRD_PARTY_SITES;
