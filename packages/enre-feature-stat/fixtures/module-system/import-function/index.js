import {groupCountBy, toFixed} from '../../_utils/post-process.js';

export default {
  dependencies: ['import-function-callsite', 'all-import-declarations'],
  process: (res, is) => {
    const
      allCount = is.importDeclaration.length + res.all.length,
      featedCount = res.all.length,
      notTopLeveled = res.notTopLeveled.length,
      group = groupCountBy(res.all, 'argNodeType');

    return {
      'all-import-declarations': allCount,
      'import-function-callsite': featedCount,
      'feature-usage-against-import-declaration': toFixed(featedCount / allCount),

      'types-level': {
        'InTopLevel': featedCount - notTopLeveled,
        'NotInTopLevel': notTopLeveled,
      },

      'types-arg': group,
    };
  }
};
