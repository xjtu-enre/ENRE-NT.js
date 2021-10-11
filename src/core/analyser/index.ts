import {parse, ParseResult} from "@babel/parser";
import traverse from "@babel/traverse";
import global from "../utils/global";
import {sourceFileEntity} from './entities/jsEntities';
import {getFileContent} from '../utils/fileResolver';
import traverseOpts from "./traverseOpts"
import path from 'path';

export const analyse = async (filePath: string) => {
  const currFile = sourceFileEntity(path.basename(filePath), [path.dirname(filePath)]);
  global.eList.add(currFile);

  const content = await getFileContent(filePath);

  const ast = parse(content, {
    sourceType: "module",
    plugins: ['typescript']
  });

  traverse(ast, traverseOpts)
}
