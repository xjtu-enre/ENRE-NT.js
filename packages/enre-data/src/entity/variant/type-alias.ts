import {ENRELocation} from '@enre/location';
import ENREName from '@enre/naming';
import {addAbilityBase, ENREEntityAbilityBase} from '../ability/base';
import {ENREEntityCollectionAll} from '../collections';
import {id, recordEntity} from '../../utils/wrapper';

export interface ENREEntityTypeAlias extends ENREEntityAbilityBase {
  type: 'type alias';
}

export const createEntityTypeAlias = (
  name: ENREName<any>,
  location: ENRELocation,
  parent: id<ENREEntityCollectionAll>,
): ENREEntityTypeAlias => {
  return {
    ...addAbilityBase(name, location, parent),

    type: 'type alias',
  };
};

export const recordEntityTypeAlias = recordEntity(createEntityTypeAlias);
