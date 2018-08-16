'use strict';

import * as clipboardy from 'clipboardy';

export function copyToClipboard(text: string) {
  try {
    clipboardy.writeSync(text);
    return null;
  } catch (e) {
    return `${e}`;
  }
}
