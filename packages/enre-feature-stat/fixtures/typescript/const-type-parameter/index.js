import {toFixed} from '../../_utils/post-process.js';

export default {
  dependencies: ['all-type-parameters', 'const-type-parameter'],
  process: (all, feated) => {
    const
      allTPs = all.length,
      constTPs = feated.length;

    return {
      'all-type-parameters': allTPs,
      'const-type-parameters': constTPs,
      'feature-usage-against-type-parameter': toFixed(constTPs / allTPs),
    };
  }
};
