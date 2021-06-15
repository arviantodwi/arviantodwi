// For more details about these options, see https://prettier.io/docs/en/options.html
module.exports = {
  // JS rules
  semi: true,                           /* <bool> Print semicolons at the ends of statements */
  useTabs: false,                       /* <bool> Indent lines with tabs instead of spaces*/
  tabWidth: 2,                          /* <int> Specify the number of spaces per indentation-level*/
  printWidth: 80,                       /* <int> Specify the line length that the printer will wrap on. */
  quoteProps: "as-needed",              /* <"as-needed"|"consistent"|"preserve"> Change when properties in objects are quoted */
  arrowParens: "avoid",                 /* <"always"|"avoid"> Include parentheses around a sole arrow function parameter – "avoid" will omit parens when possible */
  singleQuote: true,                    /* <bool> Use single quotes instead of double quotes */
  trailingComma: "es5",                 /* <"es5"|"none"|"all"> Print trailing commas wherever possible when multi-line */
  bracketSpacing: true,                 /* <bool> Print spaces between brackets in object literals */

  // JSX rules
  jsxSingleQuote: false,                /* <bool> Use single quotes instead of double quotes in JSX */
  jsxBracketSameLine: false,            /* <bool> Put the > of a multi-line JSX element at the end of the last line */
  
  // Vue rules
  // vueIndentScriptAndStyle: false,    /* <bool> Whether or not to indent the code inside <script> and <style> tags in Vue files */

  // Miscellaneous
  endOfLine: "lf",                      /* <"lf"|"crlf"|"cr"|"auto"> Make sure that your entire git repository only contains Linux-style line endings in files covered by Prettier */
  proseWrap: "preserve",                /* <"always"|"never"|"preserve"> Specify whether Prettier should wrap prose in Markdown files if it exceeds the print width or not, or leave it as-is*/
  rangeStart: 0,                        /* <int> Format only a segment of a file, starting at a given character offset */
  // rangeEnd: null,                    /* <int> Format only a segment of a file, ending at a given character offset */
  insertPragma: false,                  /* <bool> Insert a special @format marker at the top of files specifying that the file has been formatted with Prettier */
  requirePragma: false,                 /* <bool> Restrict Prettier to only format files that contain a special comment, called a pragma, at the top of the file */
  htmlWhitespaceSensitivity: "css",     /* <"css"|"strict"|"ignore"> Specify the global whitespace sensitivity for HTML files */
  embeddedLanguageFormatting: "auto"    /* <"auto"|"off"> Control whether Prettier formats quoted code embedded in the file. */
}