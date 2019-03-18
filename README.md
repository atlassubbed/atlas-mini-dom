# atlas-mini-dom

Super simple DOM Renderer plugin for Relax.

[![Travis](https://img.shields.io/travis/atlassubbed/atlas-mini-dom.svg)](https://travis-ci.org/atlassubbed/atlas-mini-dom)

[<img alt="Little tree boi" align="right" width="200" src="https://user-images.githubusercontent.com/38592371/54507116-3ba09a80-4916-11e9-96c1-ba497f8ac8bb.png">](https://www.google.com/search?q=worlds+smallest+tree)


### why you need a DOM-Renderer plugin

[Relax](https://github.com/atlassubbed/atlas-relax), like other JSX-supporting<sup>[1]</sup> view frameworks lets you do stuff like:

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

Alone, this just creates an in-memory graph and updates it. It doesn't render anything to the DOM. Plugins are little listeners that can react to changes in the graph, and do stuff as a result. In this case, "stuff" means "rendering to the DOM".

### atlas-mini-dom is intentionally simple

In addition to supporting all of the non-special nodes and attributes, it supports:

  * Text nodes
  * Regular element nodes 
  * Event listeners
  * Regular attributes

It doesn't support:

  * strange things like `dangerouslySetInnerHTML`
  * "className" (just use "class" attribute)
  * special treatment for SVG/canvas elements
