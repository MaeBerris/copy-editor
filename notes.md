## Changes:

1. In final [if statement]() check if node has name instead of checking if node is span. That way, we check for other types of elements like h1 for example or p

check if style isn't null (like for a br), that saves the app from crashes when style isn't defined.

instead of string matching for font-weight, look for font-weight attribute in style and check if value is superior to 400 or if set to bold.

check for strong or em, these can be indications of bold or italics (TODO: would have to check if they aren't styled)

Modified the onChange so that the html is ALWAYS between a starting DIV, this allows user to delete 'EDIT HERE' string and type in field and have it parsed PLUS solves bug where you delete the 'EDIT HERE' paste in text and it ignores the first node or gets it wrong. This is because, in the case of siblings, if the first node is, for example, <b>this is bold</b> it will only parse the children of that node. However, that child is the content, and it has no name. Therefore, in the parseNodes function, it defaults to first if and assumes that it's normal, which is false.

Added checks for inherit value for font-weight and font-style. If either is inherit, it will now be influence by the closest parent (caught by the baseStyle variable) and will be parsed correctly.

TODO if more time:
-put 'magic strings' in constants and import them
-clean up and refactor (can we simplify nested if else for example)
-implement the checks for style on strong and em. If they don't have style, then assume bold/italic, otherwise, do as style (either normal, bold,Italic, bold-Italic,)
-Look into tests (unit testing etc.)
