# Analizador Léxico y Sintáctico con ANTLR4 y JavaScript

Este proyecto implementa un analizador léxico y sintáctico para un subconjunto reducido del lenguaje JavaScript (Tema 39568_19), desarrollado como trabajo práctico universitario. Utiliza **ANTLR4** con **JavaScript (Node.js)**.

## Características
El analizador cumple con las siguientes tareas sobre un archivo de código fuente de entrada:
1. **Análisis léxico y sintáctico:** Informa si la entrada es correcta o contiene errores (detallando línea y causa).
2. **Tabla de lexemas-tokens:** Genera una tabla con los lexemas reconocidos y sus respectivos tokens.
3. **Árbol de análisis sintáctico (AST):** Construye y muestra el árbol sintáctico en formato de texto.
4. **Interpretación y Transpilación:** Transforma el código fuente analizado a JavaScript nativo y lo ejecuta utilizando un intérprete básico.

---

## Estructura del Repositorio

Para mantener el orden y la claridad, el proyecto está dividido de la siguiente manera:

* **`/` (Raíz):** Contiene este `README.md`, el archivo con la definición formal (`gramatica.txt`) y todos los casos de prueba provistos (`input_correcto_X.txt` e `input_incorrecto_X.txt`).
* **`/analizador`:** Contiene todo el código fuente del motor del analizador (archivos `.js`, dependencias de Node, la gramática `.g4` y las clases generadas por ANTLR4).

---

## Requisitos Previos
Para ejecutar este proyecto, es necesario tener instalado [Node.js](https://nodejs.org/) en el sistema.

## Instalación y Configuración

1. Clonar este repositorio en tu máquina local:
   ```bash
   git clone <URL_DEL_REPOSITORIO>

```

2. Navegar hacia la carpeta del motor del analizador:
```bash
cd analizador

```


3. Instalar las dependencias necesarias (ANTLR4):
```bash
npm install

```


4. Volver a la raíz del proyecto para la ejecución:
```bash
cd ..

```



---

## Ejecución del Analizador

El analizador está preparado para leer archivos de texto pasados como argumento por consola. Las ejecuciones siempre deben realizarse **estando ubicado en la carpeta raíz del proyecto**.

**Sintaxis de ejecución:**

```bash
node analizador/index.js <nombre_del_archivo.txt>

```

**Ejemplos de uso:**

Para probar un caso correcto:

```bash
node analizador/index.js input_correcto_1.txt

```

Para probar un caso con errores léxicos/sintácticos:

```bash
node analizador/index.js input_incorrecto_1.txt

```

> **Nota:** Si se ejecuta `node analizador/index.js` sin pasar un archivo como argumento, el programa intentará buscar y procesar el archivo `input_correcto_1.txt` por defecto.

---

## Autor

Desarrollado por Mauro.

```

```
