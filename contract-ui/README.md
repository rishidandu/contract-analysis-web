# Contract Analysis Web - Service Agreement UI

## Overview

This project renders a Service Agreement contract UI in React, closely matching a provided screenshot, by parsing and displaying data from an `input.json` file. The UI supports clause numbering, colored mentions, and text formatting (bold, italic, underline) as specified in the requirements.

---

## Features & Requirements

- **Matches the provided Service Agreement screenshot**
- **Parses and renders `input.json`** (mock contract data)
- **Supports any styling framework** (uses inline styles for simplicity)
- **Easy to test and extend** (recursive renderer, modular code)
- **Renders numbered "clause" blocks** (global, continuous numbering)
- **Renders colored mentions** (type: `mention` in JSON)
- **Supports marks** (bold, italic, underline) with inheritance

---

## How It Works

### 1. Loading the Data
- On mount, the app fetches `/input.json` from the public directory.
- The JSON is parsed and stored in React state.

### 2. Recursive Rendering Engine
- The main function, `renderNode`, walks the deeply nested JSON structure and renders the correct React elements for each node.
- If a node has children, it recursively calls itself for each child.

### 3. Handling Marks (bold, italic, underline)
- The `renderMarks` function merges the current node's marks with any marks inherited from its parent.
- Content is wrapped in `<strong>`, `<em>`, and/or `<u>` tags as needed.
- If a parent is bold, all its children (and their children) are also bold.

### 4. Rendering Mentions
- Nodes with `type: "mention"` are rendered as `<span>` with a colored background.
- Mention children are rendered with inherited marks.
- Color, title, and value are taken from the JSON.

### 5. Rendering Clauses
- Nodes with `type: "clause"` are rendered as numbered blocks.
- A global `clauseCounter` ensures numbering is continuous across the document.
- Clause numbers increment for each clause, regardless of nesting.

### 6. Rendering Other Block Types
- Headings (`h1`, `h4`), paragraphs (`p`), lists (`ul`, `li`), and generic blocks are rendered with appropriate HTML tags and styles.
- Children are always rendered recursively, inheriting marks as needed.

### 7. Extensibility
- The renderer is modular: to add new block or inline types, add a new case in `renderNode`.
- The mention system is ready for future features (like editing values).

### 8. Styling
- Inline styles are used for simplicity, but you can easily switch to CSS modules, Tailwind, or another framework.

---

## Example: Mark Inheritance

If a block or clause has `"bold": true`, all its nested text will be bold:

```json
{
  "bold": true,
  "type": "clause",
  "children": [
    { "text": "the " },
    { "text": "Agreement" }
  ]
}
```

---

## How to Run

1. Place your `input.json` in the `public` directory.
2. Start the app:
   ```bash
   npm start
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## File Structure

- `src/App.tsx` (or `ContractViewer.jsx`): Main recursive renderer and UI logic
- `public/input.json`: The contract data source

---

## Extending the App
- To add new block or inline types, add a new case in `renderNode`.
- To change styling, update inline styles or switch to a CSS framework.
- The mention system is ready for future editing features.

---
## License
MIT
