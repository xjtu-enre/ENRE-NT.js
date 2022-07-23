import {ENREEntityClass} from './Class';
import {ENREEntityEnum} from './Enum';
import {ENREEntityEnumMember} from './EnumMember';
import {ENREEntityField} from './Field';
import {ENREEntityFile} from './File';
import {ENREEntityFunction} from './Function';
import {ENREEntityInterface} from './Interface';
import {ENREEntityMethod} from './Method';
import {ENREEntityParameter} from './Parameter';
import {ENREEntityTypeParameter} from './TypeParameter';
import {ENREEntityVariable} from './Variable';

export type ENREEntityCollectionInFile =
  ENREEntityVariable
  | ENREEntityFunction
  | ENREEntityParameter
  | ENREEntityClass
  | ENREEntityField
  | ENREEntityMethod
  | ENREEntityEnum
  | ENREEntityEnumMember
  | ENREEntityInterface
  | ENREEntityTypeParameter;

export type ENREEntityCollectionAll = ENREEntityFile | ENREEntityCollectionInFile;

export type ENREEntityCollectionScoping =
  ENREEntityFile
  | ENREEntityFunction
  | ENREEntityClass
  | ENREEntityMethod
  | ENREEntityEnum
  | ENREEntityInterface;

export type ENREEntityTypes = ENREEntityCollectionAll['type'];
