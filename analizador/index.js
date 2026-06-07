import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import antlr4 from 'antlr4';
import JS_SubsetLexer from './JS_SubsetLexer.js';
import JS_SubsetParser from './JS_SubsetParser.js';
import JS_SubsetVisitor from './JS_SubsetVisitor.js';

// --- Recreación de __dirname para ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Toma el archivo de entrada por argumento de consola o usa uno por defecto
// Usamos path.resolve y path.join para que funcione sin importar de dónde se llame
const arg = process.argv[2];
const inputFileName = arg ? path.resolve(arg) : path.join(__dirname, '../input_correcto_1.txt');

try {
    const inputCode = fs.readFileSync(inputFileName, 'utf-8');

    // --- 1. Análisis léxico y sintáctico ---
    class CustomErrorListener extends antlr4.error.ErrorListener {
        constructor() {
            super();
            this.errors = [];
        }
        syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
            this.errors.push(`Error en línea ${line}:${column} - ${msg}`);
        }
    }

    const chars = new antlr4.InputStream(inputCode);
    const lexer = new JS_SubsetLexer(chars);
    const errorListener = new CustomErrorListener();

    lexer.removeErrorListeners();
    lexer.addErrorListener(errorListener);

    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new JS_SubsetParser(tokens);

    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);

    // Construcción del árbol sintáctico
    const tree = parser.program();

    if (errorListener.errors.length > 0) {
        console.error("\n❌ ENTRADA INCORRECTA. Se encontraron errores:");
        errorListener.errors.forEach(err => console.error(err));
        process.exit(1);
    } else {
        console.log("\n✅ ENTRADA CORRECTA. Análisis completado sin errores.\n");
    }

    // --- 2. Tabla de lexemas-tokens ---
    console.log("--- TABLA DE LEXEMAS-TOKENS ---");
    console.log("LEXEMA".padEnd(20) + "| TOKEN");
    console.log("-".repeat(45));
    tokens.fill();
    tokens.tokens.forEach(token => {
        if (token.type !== antlr4.Token.EOF) {
            // Accedemos a los nombres a través del constructor de la clase, que es donde ANTLR4 los guarda ahora
            const tokenName = lexer.constructor.symbolicNames[token.type] || lexer.constructor.literalNames[token.type] || "UNKNOWN";
            console.log(`${token.text.padEnd(20)}| ${tokenName}`);
        }
    });
    console.log("\n");

    // --- 3. Árbol de análisis sintáctico ---
    console.log("--- ÁRBOL DE ANÁLISIS SINTÁCTICO (AST) ---");
    console.log(tree.toStringTree(parser.ruleNames, parser));
    console.log("\n");

    // --- 4. Interpretación / Transpilación ---
    class JS_TranspilerVisitor extends JS_SubsetVisitor {
        visitProgram(ctx) {
            let code = "";
            const statements = ctx.simpleStatement();
            if (statements) {
                statements.forEach(stmt => code += this.visit(stmt) + "\n");
            }
            return code;
        }
        visitSimpleStatement(ctx) {
            if (ctx.switchStatement()) return this.visit(ctx.switchStatement());
            if (ctx.assignmentStatement()) return this.visit(ctx.assignmentStatement());
            if (ctx.outputStatement()) return this.visit(ctx.outputStatement());
        }
        visitSwitchStatement(ctx) {
            let id = ctx.Identifier().getText();
            let code = `switch (${id}) {\n`;
            if (ctx.caseSection()) {
                ctx.caseSection().forEach(c => code += this.visit(c));
            }
            if (ctx.defaultSection()) {
                code += this.visit(ctx.defaultSection());
            }
            code += `}\n`;
            return code;
        }
        visitCaseSection(ctx) {
            let constant = this.visit(ctx.constant());
            let code = `  case ${constant}:\n`;
            if (ctx.simpleStatement()) {
                ctx.simpleStatement().forEach(stmt => code += `    ${this.visit(stmt)}\n`);
            }
            code += `    break;\n`;
            return code;
        }
        visitDefaultSection(ctx) {
            let code = `  default:\n`;
            if (ctx.simpleStatement()) {
                ctx.simpleStatement().forEach(stmt => code += `    ${this.visit(stmt)}\n`);
            }
            return code;
        }
        visitAssignmentStatement(ctx) {
            let id = ctx.Identifier().getText();
            let constant = this.visit(ctx.constant());
            return `var ${id} = ${constant};`; 
        }
        visitOutputStatement(ctx) {
            let text = ctx.TextLiteral().getText();
            return `console.log(${text});`;
        }
        visitConstant(ctx) {
            if (ctx.Number()) return ctx.Number().getText();
            return ctx.TextLiteral().getText();
        }
    }

    console.log("--- CÓDIGO FUENTE TRANSFORMADO (JAVASCRIPT) ---");
    const transpiler = new JS_TranspilerVisitor();
    const jsCode = transpiler.visit(tree);
    console.log(jsCode);

    console.log("\n--- RESULTADO DE LA EJECUCIÓN (INTÉRPRETE) ---");
    try {
        eval(jsCode);
    } catch (e) {
        console.error("Error durante la ejecución del intérprete:", e.message);
    }

} catch (err) {
    // Si el error es de lectura de archivo, avisamos. Si no, mostramos el error real.
    if (err.code === 'ENOENT') {
        console.error(`\n❌ Error al leer el archivo de entrada. ¿La ruta es correcta?`);
        console.log("Prueba pasando el archivo como argumento: node analizador/index.js ../tu_archivo.txt\n");
    } else {
        console.error(`\n❌ Error interno de ejecución:`, err);
    }
}