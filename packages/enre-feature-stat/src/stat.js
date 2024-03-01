import {readdir, readFile, unlink, writeFile} from 'node:fs/promises';
import {marked} from 'marked';
import {readdirNoDS} from './utils.js';

export default async function (noSideEffect = false) {
  const fixtures = {};

  for await (const fixtureGroup of await readdirNoDS('../fixtures')) {
    if (fixtureGroup.startsWith('_'))
      continue;

    fixtures[fixtureGroup] = {
      gdls: [],
    };

    for await (const fixtureFeature of await readdirNoDS(`../fixtures/${fixtureGroup}`)) {
      if (fixtureFeature.endsWith('.gdl')) {
        fixtures[fixtureGroup].gdls.push(fixtureFeature);
        continue;
      }

      fixtures[fixtureGroup][fixtureFeature] = {
        title: undefined,
        metrics: [],
        tags: [],
        gdls: [],
        hasPostScript: false,
      };

      // Clean up old test case files
      if (!noSideEffect) {
        for await (const fName of await readdir(`../fixtures/${fixtureGroup}/${fixtureFeature}`)) {
          if (fName.startsWith('_test')) {
            await unlink(`../fixtures/${fixtureGroup}/${fixtureFeature}/${fName}`);
          }
        }
      }

      const fileContent = await readFile(`../fixtures/${fixtureGroup}/${fixtureFeature}/README.md`, 'utf8');

      const tokens = new marked.Lexer().lex(fileContent);

      let title = 'others';
      let codeBlockCount = 0;
      for await (const token of tokens) {
        if (token.type === 'heading' && token.depth === 1) {
          fixtures[fixtureGroup][fixtureFeature].title = token.text;
        }

        if (token.type === 'heading' && token.depth === 2) {
          if (token.text === 'Patterns') {
            title = 'patterns';
          } else if (token.text === 'Metrics') {
            title = 'metrics';
          } else if (token.text === 'Tags') {
            title = 'tags';
          } else {
            title = 'others';
          }
        }

        if (token.type === 'code' && !noSideEffect) {
          await writeFile(`../fixtures/${fixtureGroup}/${fixtureFeature}/_test${codeBlockCount}.${token.lang}`, token.text);
          codeBlockCount += 1;
        }

        if (token.type === 'list') {
          if (title === 'metrics') {
            token.items.forEach(item => {
              fixtures[fixtureGroup][fixtureFeature].metrics.push(item.text);
            });
          } else if (title === 'tags') {
            token.items.forEach(item => {
              fixtures[fixtureGroup][fixtureFeature].tags.push(item.text);
            });
          }
        }
      }

      for await (const fName of await readdir(`../fixtures/${fixtureGroup}/${fixtureFeature}`)) {
        if (fName.endsWith('.gdl')) {
          fixtures[fixtureGroup][fixtureFeature].gdls.push(fName);
        } else if (fName === 'index.js') {
          fixtures[fixtureGroup][fixtureFeature].hasPostScript = true;
        }
      }
    }
  }

  return fixtures;
}
