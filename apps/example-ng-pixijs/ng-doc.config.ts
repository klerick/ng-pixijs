import { NgDocConfiguration } from '@ng-doc/builder';
import { ngKeywordsLoader } from '@ng-doc/keywords-loaders';



const config: NgDocConfiguration = {
  docsPath: 'apps/example-ng-pixijs/ng-doc',
  tsConfig: 'apps/example-ng-pixijs/tsconfig.app.json',
  routePrefix: 'docs',
  repoConfig: {
    url: 'https://github.com/klerick/ng-pixijs',
    mainBranch: 'main',
    releaseBranch: 'main',
    platform: 'github'
  },
  keywords: {
    loaders: [ngKeywordsLoader()],
    keywords: {
      pixijs: {
        url: 'https://pixijs.com/',
      }
    },
  },
};

export default config
