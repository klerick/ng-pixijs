import {NgDocPage} from '@ng-doc/core';
import {SceneComponent} from '../../../src/app/example-doc/'

const AddDefaultPixijsPrimitivePage: NgDocPage = {
	title: `Add default PixiJS primitive`,
	mdFile: './index.md',
  demos: {SceneComponent},
  order: 4,
};

export default AddDefaultPixijsPrimitivePage;
