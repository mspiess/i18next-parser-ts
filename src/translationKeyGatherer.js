import ts from "typescript";

export class TranslationKeyGatherer {
    /**
     * @type {ts.Program}
     */
    #program;
    /**
     * @type {ts.TypeChecker}
     */
    #checker;

    /**
     *
     * @param {ts.Program} program
     */
    constructor(program) {
        this.#program = program;
        this.#checker = this.#program.getTypeChecker();
    }

    /**
     * @returns {string[]}
     */
    gatherTranslationKeys() {
        return this.#program.getSourceFiles()
            .filter(sourceFile => !sourceFile.isDeclarationFile)
            .flatMap(sourceFile => {
                    return sourceFile.getChildren()
                        .flatMap((child) => this.getArgumentTypeOfTCalls(child));
                }
            )
    }

    /**
     *
     * @param {ts.Node} node
     * @returns {string[]}
     */
    getArgumentTypeOfTCalls(node) {
        if (ts.isCallExpression(node)) {
            if (node.getChildCount() === 4) {
                const [identifier, openParen, syntaxList, closeParen] = node.getChildren();
                if (
                    ts.isIdentifier(identifier) && identifier.text === 't'
                    && openParen.kind === ts.SyntaxKind.OpenParenToken
                    && syntaxList.kind === ts.SyntaxKind.SyntaxList
                    && closeParen.kind === ts.SyntaxKind.CloseParenToken
                ) {
                    const key = syntaxList.getChildAt(0);
                    const type = this.#checker.getTypeAtLocation(key);
                    return this.flattenType(type);
                }
            }
        }
        return node.getChildren().flatMap((child) => this.getArgumentTypeOfTCalls(child));
    }

    /**
     *
     * @param {ts.Type} type
     * @returns {string[]}
     */
    flattenType(type) {
        if (type.isStringLiteral()) {
            return [type.value];
        }
        if (type.isUnion()) {
            return type.types.flatMap((type) => this.flattenType(type));
        }
        throw new Error("Unexpected type " + type);
    }
}