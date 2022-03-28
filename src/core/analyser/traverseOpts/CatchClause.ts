/**
 * CatchClause
 *
 * Extractable entity:
 *   * Parameter
 */

import {ENREEntityCollectionScoping, ENRELocation} from '../entities';
import {NodePath} from '@babel/traverse';
import {CatchClause} from '@babel/types';
import {verbose} from '../../utils/cliRender';
import {buildENRECodeName, ENRENameBuildOption} from '../../utils/nameHelper';
import {ENREEntityParameter, recordEntityParameter} from '../entities/eParameter';
import handleBindingPatternRecursively from './common/handleBindingPatternRecursively';

const onRecord = (name: string, location: ENRELocation, scope: Array<ENREEntityCollectionScoping>) => {
  return recordEntityParameter(
    buildENRECodeName(ENRENameBuildOption.value, name),
    location,
    scope[scope.length - 1],
  );
};

const onLog = (entity: ENREEntityParameter) => {
  verbose('Record Entity Parameter (catch): ' + entity.name.printableName);
};

export default (scope: Array<ENREEntityCollectionScoping>) => {
  return {
    enter: (path: NodePath<CatchClause>) => {
      if (path.node.param) {
        handleBindingPatternRecursively<ENREEntityParameter>(
          path.node.param,
          scope,
          onRecord,
          onLog,
        );
      }
    },

    exit: () => {
      // scope.pop();
    }
  };
};