const { describe, it } = require("mocha")
const { expect } = require("chai")
const jsdom = require("jsdom-global");
const { diff } = require("atlas-relax");
const DOMRenderer = require("../");

const initHTML = "<!DOCTYPE html><head></head><body><div id='root'></div></body>";
const getRoot = () => document.getElementById("root");
const getHTML = () => getRoot().innerHTML;

// custom component, trivial -- just returns the input children
const Custom = ({data, next}) => next;
const Custom2 = ({data, next}) => next;
const elFactory = name => (data, next) => ({name, data, next});

// "hyperscript" helpers
const div = elFactory("div")
const p = elFactory("p")
const C = elFactory(Custom)
const C2 = elFactory(Custom2);

describe("renderer", function(){
  // before each test, reset the dom.
  beforeEach(function(){
    this.cleanup = jsdom(initHTML);
    this.renderer = new DOMRenderer(getRoot())
  })
  afterEach(function(){
    this.cleanup();
  })
  describe("mounting", function(){
    it("should mount an irreducible tree", function(){
      const temp = div(null, p());
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal("<div><p></p></div>")
    })
    it("should mount nested array of irreducible nodes", function(){
      const temp = div(null, [p(),p()]);
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal("<div><p></p><p></p></div>")
    })
    it("should mount a reducible tree with a custom element", function(){
      const temp = C(null, C());
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal("<custom><custom></custom></custom>")
    })
    it("should mount nested array of reducible nodes", function(){
      const temp = C(null, [C(),C()]);
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal("<custom><custom></custom><custom></custom></custom>")
    })
    it("should use a fallback name for reducible nodes without a name", function(){
      const temp = {name: (() => () => {})()};
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal("<r-el></r-el>")
    })
    it("should mount root text nodes", function(){
      const temp = "hello world!";
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal(temp);
    })
    it("should mount nested text nodes", function(){
      const text = "hello world!";
      const temp = div(null, text);
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal(`<div>${text}</div>`);
    })
    it("should mount nested array of text nodes", function(){
      const text = ["hello", "world!"]
      const temp = div(null, text);
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal(`<div>${text.join("")}</div>`);
    })
    it("should apply attributes to irreducible nodes", function(){
      const temp = div({id: "h"}, p({id: "w"}));
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal(`<div id="h"><p id="w"></p></div>`)
    })
    it("should apply data attributes to custom elements", function(){
      const temp = C({id: "h"}, C({id: "w"}));
      diff(temp, null, this.renderer);
      expect(getHTML()).to.equal(`<custom data-id="h"><custom data-id="w"></custom></custom>`)
    })
    it("should apply event listener attributes to nodes", function(){
      let clicked = 0;
      const temp = div({onclick: () => clicked++});
      diff(temp, null, this.renderer);
      getRoot().firstChild.click();
      expect(clicked).to.equal(1)
    })
  })
  describe("unmounting", function(){
    it("should unmount an irreducible tree", function(){
      const temp = div(null, p());
      diff(null, diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("")
    })
    it("should unmount nested array of irreducible nodes", function(){
      const temp = div(null, [p(),p()]);
      diff(null, diff(temp, null, this.renderer))
      expect(getHTML()).to.equal("")
    })
    it("should unmount a reducible tree with a custom element", function(){
      const temp = C(null, C());
      diff(null, diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("")
    })
    it("should unmount nested array of reducible nodes", function(){
      const temp = C(null, [C(),C()]);
      diff(null, diff(temp, null, this.renderer))
      expect(getHTML()).to.equal("")
    })
    it("should unmount root text nodes", function(){
      const temp = "hello world!";
      diff(null, diff(temp, null, this.renderer))
      expect(getHTML()).to.equal("");
    })
    it("should unmount nested text nodes", function(){
      const text = "hello world!";
      const temp = div(null, text);
      diff(null, diff(temp, null, this.renderer))
      expect(getHTML()).to.equal("");
    })
    it("should unmount nested array of text nodes", function(){
      const text = ["hello", "world!"]
      const temp = div(null, text);
      diff(null, diff(temp, null, this.renderer))
      expect(getHTML()).to.equal("");
    })
  })
  describe("updating", function(){
    it("should add nested irreducible nodes", function(){
      diff(div(null, p()), diff(div(), null, this.renderer));
      expect(getHTML()).to.equal('<div><p></p></div>')
    })
    it("should add nested array of irreducible nodes", function(){
      diff(div(null, [p(), p()]), diff(div(), null, this.renderer));
      expect(getHTML()).to.equal('<div><p></p><p></p></div>')
    })
    it("should add nested reducible nodes", function(){
      diff(div(null, C()), diff(div(), null, this.renderer));
      expect(getHTML()).to.equal('<div><custom></custom></div>')
    })
    it("should add nested array of reducible nodes", function(){
      diff(div(null, [C(), C()]), diff(div(), null, this.renderer));
      expect(getHTML()).to.equal('<div><custom></custom><custom></custom></div>')
    })
    it("should add nested text nodes", function(){
      const text = "hello";
      diff(div(null, text), diff(div(), null, this.renderer));
      expect(getHTML()).to.equal(`<div>${text}</div>`)
    })
    it("should add nested array of text nodes", function(){
      const text = ["hello", "world!"];
      diff(div(null, text), diff(div(), null, this.renderer));
      expect(getHTML()).to.equal(`<div>${text.join("")}</div>`)
    })
    it("should remove nested irreducible nodes", function(){
      const temp = div(null, p());
      diff(div(), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div></div>")
    })
    it("should remove nested array of irreducible nodes", function(){
      const temp = div(null, [p(), p()]);
      diff(div(), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div></div>")
    })
    it("should remove nested reducible nodes", function(){
      const temp = div(null, C());
      diff(div(), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div></div>")
    })
    it("should remove nested array of reducible nodes", function(){
      const temp = div(null, [C(), C()]);
      diff(div(), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div></div>")
    })
    it("should remove nested text nodes", function(){
      const temp = div(null, "hello");
      diff(div(), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div></div>")
    })
    it("should remove nested array of text nodes", function(){
      const temp = div(null, ["hello", "world!"]);
      diff(div(), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div></div>")
    })
    it("should replace reducible nodes with irreducible nodes", function(){
      const temp = div(null, C());
      diff(div(null, p()), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div><p></p></div>")
    })
    it("should replace reducible nodes with other reducible nodes", function(){
      const temp = div(null, C());
      diff(div(null, C2()), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div><custom2></custom2></div>")
    })
    it("should replace reducible nodes with text nodes", function(){
      const temp = div(null, C());
      const text = "hello";
      diff(div(null, text), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal(`<div>${text}</div>`)
    })
    it("should replace irreducible nodes with other irreducible nodes", function(){
      const temp = div(null, p());
      diff(div(null, div()), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div><div></div></div>")
    })
    it("should replace irreducible nodes with reducible nodes", function(){
      const temp = div(null, p());
      diff(div(null, C()), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div><custom></custom></div>")
    })
    it("should replace irreducible nodes with text nodes", function(){
      const temp = div(null, p());
      const text = "hello"
      diff(div(null, text), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal(`<div>${text}</div>`)
    })
    it("should replace text nodes with irreducible nodes", function(){
      const temp = div(null, "hello");
      diff(div(null, p()), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div><p></p></div>")
    })
    it("should replace text nodes with reducible nodes", function(){
      const temp = div(null, "hello");
      diff(div(null, C()), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal("<div><custom></custom></div>")
    })
    it("should update text content in text nodes", function(){
      const temp = div(null, "hello");
      const text = "world!";
      diff(div(null, text), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal(`<div>${text}</div>`)
    })
    it("should update text content in an array of text nodes", function(){
      const text = ["hello", "world!"];
      const nextText = [text[0], "mars!"];
      const temp = div(null, text);
      diff(div(null, nextText), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal(`<div>${nextText.join("")}</div>`)
    })
    it("should reorder an array of nodes", function(){
      const children = ["hello", C(), C2(), p(), div()];
      const temp = div(null, children);
      const nextChildren = [C(), p(), "hello", div(), C2()];
      diff(div(null, nextChildren), diff(temp, null, this.renderer));
      expect(getHTML()).to.equal(
        `<div><custom></custom><p></p>hello<div></div><custom2></custom2></div>`
      )
    })
    it("should remove stale attributes on irreducible nodes", function(){
      const temp = div({id: "h", class:"green"});
      const app = diff(temp, null, this.renderer);
      expect(getHTML()).to.equal(`<div id="h" class="green"></div>`)
      diff(div({id: "h"}), app)
      expect(getHTML()).to.equal(`<div id="h"></div>`)
    });
    [undefined, null, false].forEach(disabled => {
      it(`should remove attributes which are changed to "${disabled}"`, function(){
        const temp = div({id: "h", disabled: true});
        const app = diff(temp, null, this.renderer);
        expect(getHTML()).to.equal(`<div id="h" disabled="true"></div>`)
        diff(div({id: "h", disabled}), app)
        expect(getHTML()).to.equal(`<div id="h"></div>`)  
      })
    });
    [undefined, false, null, "", 0, {}, ["an array"]].forEach(onClick => {
      it(`should remove event listnerers which are changed to "${onClick}"`, function(){
        let clicked = 0;
        const temp = div({onClick: () => clicked++});
        diff(div({onClick}), diff(temp, null, this.renderer))
        getRoot().firstChild.click();
        expect(clicked).to.equal(0)
      })
    })
    it("should remove stale data attributes on reducible nodes", function(){
      const temp = C({id: "h", class:"green"});
      const app = diff(temp, null, this.renderer);
      expect(getHTML()).to.equal(`<custom data-id="h" data-class="green"></custom>`)
      diff(C({id: "h"}), app)
      expect(getHTML()).to.equal(`<custom data-id="h"></custom>`)
    })
    it("should add new attributes on irreducible nodes", function(){
      const temp = div({id: "h"});
      const app = diff(temp, null, this.renderer);
      expect(getHTML()).to.equal(`<div id="h"></div>`)
      diff(div({id: "h", class: "green"}), app)
      expect(getHTML()).to.equal(`<div id="h" class="green"></div>`)
    })
    it("should add new attributes on reducible nodes", function(){
      const temp = C({id: "h"});
      const app = diff(temp, null, this.renderer);
      expect(getHTML()).to.equal(`<custom data-id="h"></custom>`)
      diff(C({id: "h", class: "green"}), app)
      expect(getHTML()).to.equal(`<custom data-id="h" data-class="green"></custom>`)
    })
    it("should remove old event listeners from nodes", function(){
      let clicked = 0;
      const temp = div({onclick: () => clicked++});
      diff(div(), diff(temp, null, this.renderer))
      getRoot().firstChild.click();
      expect(clicked).to.equal(0)
    })
    it("should add new event listeners to nodes", function(){
      let clicked = 0;
      diff(div({onclick: () => clicked++}), diff(div(), null, this.renderer))
      getRoot().firstChild.click();
      expect(clicked).to.equal(1)
    })
    it("should update event listeners on nodes", function(){
      let clickedOld = 0, clickedNew = 0;
      const temp = div({onclick: () => clickedOld++});
      const newTemp = div({onclick: () => clickedNew++})
      diff(newTemp, diff(temp, null, this.renderer))
      getRoot().firstChild.click();
      expect(clickedOld).to.equal(0)
      expect(clickedNew).to.equal(1)
    })
  })
})
