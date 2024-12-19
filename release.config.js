module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'release',
    { name: 'beta', channel: 'beta', prerelease: true },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',

        releaseRules: [
          { breaking: true, scope: 'angular', release: 'major' },
          { breaking: true, release: 'minor' },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      './tools/semantic-plugins/publish-packages.mjs',
      {
        packages: [
          {
            pkgRoot: 'dist/libs/ng-pixijs',
          },
        ],
      },
    ],
    [
      './tools/semantic-plugins/copy-package-info.mjs',
      {
        original: 'package.json',
        keys: [
          'keywords',
          'author',
          'repository',
          'bugs',
          'homepage',
          'license',
        ],
        packages: ['dist/libs/ng-pixijs'],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        releasedLabels: ['Status: Released'],
      },
    ],
  ],
};
