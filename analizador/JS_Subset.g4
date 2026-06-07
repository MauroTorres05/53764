grammar JS_Subset;

// --- Reglas Sintácticas (Parser) ---
program : simpleStatement* EOF ;

simpleStatement
    : switchStatement
    | assignmentStatement
    | outputStatement
    ;

switchStatement : SWITCH LPAREN Identifier RPAREN LBRACE caseSection* defaultSection? RBRACE ;
caseSection : CASE constant COLON simpleStatement* ;
defaultSection : DEFAULT COLON simpleStatement* ;
assignmentStatement : Identifier ASSIGN constant SEMI ;
outputStatement : OUTPUT LPAREN TextLiteral RPAREN SEMI ;

constant : Number | TextLiteral ;

// --- Reglas Léxicas (Lexer) ---
SWITCH  : 'switch' ;
CASE    : 'case' ;
DEFAULT : 'default' ;
OUTPUT  : 'output' ;
ASSIGN  : '=' ;
SEMI    : ';' ;
COLON   : ':' ;
LPAREN  : '(' ;
RPAREN  : ')' ;
LBRACE  : '{' ;
RBRACE  : '}' ;

Number      : [0-9]+ ;
Identifier  : [a-zA-Z] [a-zA-Z0-9_]* ;
TextLiteral : '"' ~'"'* '"' ;

WS : [ \t\r\n]+ -> skip ;