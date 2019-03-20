# atlas-mini-dom

Super simple DOM Renderer plugin for Relax.

[![Travis](https://img.shields.io/travis/atlassubbed/atlas-mini-dom.svg)](https://travis-ci.org/atlassubbed/atlas-mini-dom)

[<img alt="Little tree boi" align="right" width="200" src="https://user-images.githubusercontent.com/38592371/54507116-3ba09a80-4916-11e9-96c1-ba497f8ac8bb.png">](https://www.google.com/search?q=worlds+smallest+tree)

### simple usage

```jsx
const { diff } = require("atlas-relax");
const DOMRenderer = require("atlas-mini-dom");

const App = () => (
  <div>
    Bonsly evolves into Sudowoodo after learning mimic.
  </div>
)

// create a DOMRenderer plugin
const rootEl = document.getElementById("root");
const renderingPlugin = new DOMRenderer(rootEl);

// mount <App/> and render it to the DOM.
diff(<App/>, null, renderingPlugin);

// note that your app can use many plugins:
//   diff(<App/>, null, [renderingPlugin, otherPlugin])
```

### why you need a DOM-Renderer plugin

[Relax](https://github.com/atlassubbed/atlas-relax), like other JSX-supporting<sup>[1]</sup> view libraries, lets you do stuff like:

```jsx
const { diff } = require("atlas-relax");

// define component
const App = ({data}) => {
  const { firstName, lastName } = data;
  return [
    <p>Your first name is {firstName}</p>,
    !!lastName && <p>Your last name is {lastName}</p>
  ]
}

// mount app
const mountedApp = diff(<App firstName="Atlas" lastName="Subbed"/>)

// update app with new props
diff(<App firstName="jai"/>, mountedApp)

```
<sup>[1] with an appropriate [JSX pragma](https://github.com/atlassubbed/atlas-relax-jsx-pragmas).</sup>

Alone, this just creates an in-memory graph and updates it. It doesn't render anything to the DOM. Plugins are little listeners that can react to changes in the graph (remember, your <App/> describes a graph), and do stuff as a result. In this case, "stuff" means "rendering to the DOM".

### atlas-mini-dom is intentionally simple

The goal of this little plugin library is to show you how easy it is to write plugins. You can write a plugin that "renders" your app to anything, not just the DOM. In addition to supporting all of the non-special nodes and attributes, Mini Dom supports:

  * Text nodes
  * Regular element nodes 
  * Event listeners
  * Regular attributes

It doesn't support:

  * `dangerouslySetInnerHTML`
  * `className` (just use `class` attribute)
  * Special treatment for SVG/canvas elements

### todo

  1. Style object support
  2. Make sure element focus (e.g. button, input, ...) is handled properly.
     * Default focus
     * Keeping focus
     * Refocusing
  3. DOM recycling

### contribute

Feel free to open pull requests if you want to help implement some of these features.
