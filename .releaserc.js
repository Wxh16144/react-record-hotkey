module.exports = {
  release: {
    branches: ['master', 'beta'],
  },
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    /**
     * using monorepo, use "@semrel-extra/npm" instead of the official package
     * https://github.com/dhoulb/multi-semantic-release#npm-invalid-npm-token
     */
    // '@semantic-release/npm',
    '@semrel-extra/npm',
    [
      '@semantic-release/github',
      {
        assets: [],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): ${nextRelease.gitTag} [skip ci]',
      },
    ],
  ],
};
