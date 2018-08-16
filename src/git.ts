'use strict';

import * as path from 'path';
import * as fs from 'fs';

class Git {
    public static getNameInRepo(absoluteFilePath: string) {
        const gitRoot = Git.getRoot(absoluteFilePath);
        if (!gitRoot) {
            return absoluteFilePath;
        }
        if (absoluteFilePath.startsWith(gitRoot)) {
            const repoName = path.basename(gitRoot);
            const relativePath = absoluteFilePath.substring(gitRoot.length);
            return `${repoName}${relativePath}`;
        }
        return absoluteFilePath;
    }
    public static getRoot(filePath: string) {
        let dir = path.dirname(filePath);
        while (true) {
            const dotGit = path.join(dir, '.git');
            if (fs.existsSync(dotGit)) {
                return dir;
            }
            if (dir === '/' || dir === '.' || !fs.existsSync(dir)) {
                break;
            }
            const parentDir = path.dirname(dir);
            if (dir === parentDir) {
                // Not sure how things will work under windows.
                // Do this so that we don't infinite loop.
                break;
            }
            dir = parentDir;
        }
        return null;
    }

}

export default Git;
