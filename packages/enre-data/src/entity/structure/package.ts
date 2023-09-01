import ENREName from '@enre/naming';
import {id, recordEntity} from '../../utils/wrapper';
import {ENREEntityFile, ENREEntityUnknown} from '@enre/data';

export interface ENREEntityPackage {
  name: ENREName<'Norm'>,
  parent: undefined,
  children: id<ENREEntityFile>[] | id<ENREEntityUnknown>[],
  type: 'package',
  pkgJson?: any,

  getQualifiedName: () => string,
}

export const createEntityPackage = (name: ENREName<'Norm'>, pkgJson?: any): ENREEntityPackage => {
  const children: id<ENREEntityFile>[] = [];

  return {
    type: 'package' as const,

    name,

    parent: undefined,

    pkgJson,

    children,

    getQualifiedName() {
      return name.string;
    },
  };
};

export const recordEntityPackage = recordEntity(createEntityPackage);
export const recordThirdPartyEntityPackage = recordEntity(createEntityPackage, 'third');
