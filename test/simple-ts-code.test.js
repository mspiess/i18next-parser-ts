import { expect, it } from "vitest";
import ts from "typescript";
import {TranslationKeyGatherer} from "../src/translationKeyGatherer.js";
import { resolve } from "node:path";

it('should expand unions', () => {
    const projectDirectory = resolve(__dirname, '..', 'example-code');
    const tsconfigPath = resolve(projectDirectory, 'tsconfig.json');
    const content = ts.readJsonConfigFile(tsconfigPath, ts.sys.readFile);
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

    expect(keys).toEqual([
            'someKey',
            'otherKey3',
            'otherKeya',
            'otherKeyb',
            'otherKeyaaa',
            'otherKeyaab',
            'otherKeybaa',
            'otherKeybab'
        ]
    );
});