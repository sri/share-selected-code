import * as assert from 'assert';

import Git from '../git';

describe('Git utility', () => {
  describe('#getNameInRepo()', () => {

    describe('when not in a git repo', () => {
      before(() => {
        Git.getRoot = (path: string) => null;
      });

      it('should return the passed in argument unmodified', () => {
        const result = Git.getNameInRepo('/some/path/not-in-git-repo/test.txt');
        assert.equal(result, '/some/path/not-in-git-repo/test.txt');
      });
    });

    describe('when in a git repo', () => {
      it('should return the path to the file in the repo', () => {
        const repoPath = '/some/path/in-git-repo';
        const filePath = repoPath + '/dir1/dir2/abc.rb';
        Git.getRoot = (path: string) => repoPath;
        const result = Git.getNameInRepo(filePath);
        assert.equal(result, 'in-git-repo/dir1/dir2/abc.rb');
      });
    });

  });
});
