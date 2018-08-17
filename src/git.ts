'use strict';

import * as path from 'path';
import * as fs from 'fs';

class Git {
    // Given an absolute file name, returns it path
    // relative to the Git repo it resides in.
    // Returns argument if the path doesn't sit
    // in a Git repo.
    // Example:
    //   getNameInRepo('/somedir/path/git-repo/a/b/c.txt') =>
    //     'git-repo/a/b/c.txt'
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

    // Returns the root of the Git report that this file
    // belongs to. Return null if there is no Git repo.
    // Argument can either be a file or directory path.
    public static getRoot(fileOrDirPath: string) {
        let dir = fileOrDirPath;
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
                // Safety guard: not sure how things will
                // work under Windows and other operating systems.
                // Break early if dirname returns same as its argument.
                break;
            }
            dir = parentDir;
        }
        return null;
    }
}

export default Git;
