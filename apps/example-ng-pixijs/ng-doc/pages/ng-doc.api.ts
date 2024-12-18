import {NgDocApi} from '@ng-doc/core';

const Api: NgDocApi = {
	title: 'API References',
	scopes: [{
    name: '@klerick/ng-pixijs',
    route: 'ng-pixijs',
    include: 'libs/ng-pixijs/src/lib/types.ts'
  }],
  order: 6,
};

export default Api;
