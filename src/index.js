import ts from "typescript";
import {TranslationKeyGatherer} from "./translationKeyGatherer.js";

const tsconfigPath = 'tsconfig.json';
const content = ts.readJsonConfigFile(tsconfigPath, ts.sys.readFile);
const projectDirectory = process.cwd();
const config = ts.parseJsonSourceFileConfigFileContent(
    content, {
        useCaseSensitiveFileNames: true,
        readDirectory: ts.sys.readDirectory,
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
    },
    projectDirectory,
    {
        noEmit: true
    });
const program = ts.createProgram({
    rootNames: config.fileNames,
    options: config.options,
});

const keys = new TranslationKeyGatherer(program).gatherTranslationKeys();
console.log(keys);