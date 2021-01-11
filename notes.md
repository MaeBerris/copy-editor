## Changes:

1. In final [if statement](https://github.com/MaeBerris/copy-editor/blob/543a58f405ea0b1984f4b9b77fc400e2fb480eac/app.jsx#L64) check if node has name instead of checking if node is span. That way, we check for other types of elements like h1 for example or p. I used html that I wrote to test this and also copy pasted content from pages where I inspected elements to find p tags and h1 tags and copied those.

2. Check if style [isn't null](https://github.com/MaeBerris/copy-editor/blob/543a58f405ea0b1984f4b9b77fc400e2fb480eac/app.jsx#L22) (like for a br), that saves the app from crashes when style isn't defined. To check, copy paste a p tag with no style defined.

3. Instead of string matching for font-weight, look for [font-weight attribute](https://github.com/MaeBerris/copy-editor/blob/543a58f405ea0b1984f4b9b77fc400e2fb480eac/app.jsx#L37) in style and check if value is superior to 400 or if set to bold. Tested with various custom html and also from copy pasted content from google docs.

4. Check for [strong or em](https://github.com/MaeBerris/copy-editor/blob/543a58f405ea0b1984f4b9b77fc400e2fb480eac/app.jsx#L55), these can be indications of bold or italics (TODO: would have to check if they aren't styled. We can't assume strong is equal to bold. But by checking if font-weight is specifically NOT bold, then we could mark the content as being bold because of the default styling.) The what is Lorem Ipsum paragraph from [Lorem Ipsum](https://www.lipsum.com/) is a good example of this. It didn't parse correctly before because of the starting strong tag and would parse it as normal instead of bold.

5. Modified the onChange so that the html is [ALWAYS between a starting DIV](https://github.com/MaeBerris/copy-editor/blob/543a58f405ea0b1984f4b9b77fc400e2fb480eac/app.jsx#L129), this allows user to delete 'EDIT HERE' string and type in the field. What the user types will be parsed appropriately. This also solves the bug where you delete the 'EDIT HERE' text then paste in text and but the parsing ignores the first node or gets it wrong. In a case like below:

```
<b>This is bold</b><span>this is a sibling</span>
```

In this case, the parseNodes function would start by parsing the children of the first node. However, that child is the content (IE, the string 'This is bold'). Since that string has no name in the parseNodes function, it would default to the first if statement, and falsely assume that it was bold content. Therefore, always wrapping the content in a div solves that problem.To test this, you can now write in the field and edit your text and will be parsed correctly.

6.  Added [checks for inherit](https://github.com/MaeBerris/copy-editor/blob/543a58f405ea0b1984f4b9b77fc400e2fb480eac/app.jsx#L75) value for font-weight and font-style. If either is inherit, it will now be influence by the closest parent (caught by the baseStyle variable) and will be parsed correctly. To test this, I input custom html. N.B: Copy and paste is NOT our friend in this case as it sometimes changes the parent/child relations, breaking the inherit. That is why I tested it with my [own html tags ](https://github.com/MaeBerris/copy-editor/blob/543a58f405ea0b1984f4b9b77fc400e2fb480eac/app.jsx#L119).

All of the above cases where tested in multiple ways : By copy pasting content from a google doc containing multiple paragraphs of text displayed in all styles. By copy pasting content from external websites like Lorem Ipsum and by copy pasting html that I had written on my own.

TODO if more time:

1. put 'magic strings' in constants and import them
2. clean up and refactor (can we simplify nested if else for example)
3. implement the checks for style on strong and em. If they don't have style, then assume bold/italic, otherwise, do as style (either normal, bold,Italic, bold-Italic,)
4. Look into tests. Have multiple tests to test consistency.
