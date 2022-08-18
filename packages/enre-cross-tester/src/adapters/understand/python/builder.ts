import {e, r} from '../../../slim-container';
import {warn} from '@enre/logging';
import {buildENREName, ENRENameAnonymous} from '@enre/naming';

export default (content: string) => {
  const raw = JSON.parse(content);

  switch (raw['script_ver']) {
    case 100: {
      for (const ent of raw['entities']) {
        if (ent['type'] === 'File') {
          let name = ent['name'] as string;
          name = name.substring(name.lastIndexOf('\\') + 1, name.lastIndexOf('.'));

          e.add({
            id: ent['id'] as number,
            type: 'module',
            name,
            fullname: name,
          });
        } else {
          const extra = {} as any;
          let type = ent['type'] as string;

          /**
           * Map Understand schema to ENRE schema as possible
           */
          // Package
          if (/Package/.test(type)) {
            type = 'package';
          }
          // Variable
          else if (/Variable/.test(type)) {
            type = 'variable';
          }
          // Function
          else if (/Function/.test(type) && !/Anonymous/.test(type)) {
            type = 'function';
          }
          // Parameter
          else if (/Parameter/.test(type)) {
            type = 'parameter';
          }
          // Class
          else if (/Class/.test(type)) {
            type = 'class';
          }
          // Attribute
          else if (/Attribute/.test(type)) {
            type = 'attribute';
          }
          // Alias
          else if (/Alias/.test(type)) {
            type = 'alias';
          }
          // AnonymousFunction
          else if (/AnonymousFunction/.test(type)) {
            type = 'anonymousfunction';
          }
          // Unmatched
          else {
            warn(`Unmapped type understand/python/entity/${type}`);
            continue;
          }

          /**
           * Handle anonymous entity
           */
          let name = ent['name'];
          const testAnonymity = /\(unnamed_(class|function)_\d+\)/.exec(ent['name']);
          if (testAnonymity) {
            if (testAnonymity[1] === 'class') {
              name = buildENREName<ENRENameAnonymous>({as: 'Class'});
            } else {
              name = buildENREName<ENRENameAnonymous>({as: 'Function'});
            }
          } else {
            name = buildENREName(name);
          }

          e.add({
            id: ent['id'] as number,
            type: type,
            name: name,
            fullname: ent['qualified_name'],
            sourceFile: e.getById(ent['belongs_to']),
            location: {
              start: {
                line: ent['line'],
                column: ent['start_column'],
              },
              end: {
                line: ent['line'],
                column: ent['end_column'],
              },
            },
            ...extra,
          });
        }
      }

      for (const rel of raw['relations']) {
        const extra = {} as any;
        let fromId = rel['from'];
        let type = rel['type'];
        let toId = rel['to'];

        // Define
        if (/Define/.test(type)) {
          type = 'define';
        }
        // Use
        else if (/Use/.test(type)) {
          type = 'use';
        }
        // Set
        else if (/Set/.test(type)) {
          type = 'set';
        }
        // Import
        else if (/Import/.test(type)) {
          type = 'import';
        }
        // Call
        else if (/Call/.test(type)) {
          type = 'call';
        }
        // Inherit
        else if (/Inherit/.test(type)) {
          type = 'inherit';
        }
        // Contain
        else if (/Contain/.test(type)) {
          type = 'contain';
        }
        // Annotate
        else if (/Annotate/.test(type)) {
          type = 'annotate';
        }
        // Alias
        else if (/Alias/.test(type)) {
          type = 'alias';
        }
        // Others
        else if (/(Typed|Couple|Raise|Overrides)/.test(type)) {
          // ...
        }
        // Unmapped
        else {
          warn(`Unmapped type understand/python/relation/${type}`);
          continue;
        }

        const from = e.getById(fromId);
        const to = e.getById(toId);
        if (from && to) {
          r.add({
            from,
            to,
            type,
            location: {
              file: e.getById(rel['inFile']),
              start: {
                line: rel['line'],
                column: rel['column'],
              },
            },
            ...extra,
          });
        } else {
          warn(`Cannot find from/to entity that relation ${rel['from']}--${rel['type']}->${rel['to']} depends.`);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled script version ${raw['script_ver']}`);
      return undefined;
  }
};
