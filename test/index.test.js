const { describe, it } = require("mocha")
const { expect } = require("chai")
const jsdom = require("jsdom-global");
const { diff } = require("atlas-relax");

const initHTML = "<!DOCTYPE html><head></head><body><div id='root'></div></body>";
const getRoot = () => document.getElementById("root");

describe("renderer", function(){
  // before each test, reset the dom.
  beforeEach(function(){
    this.cleanup = jsdom(initHTML);
  })
  afterEach(function(){
    this.cleanup();
  })
  describe("mounting", function(){
    it("should mount an irreducible tree", function(){
      
    })
    it("should mount a reducible tree with a custom element", function(){

    })
    it("should apply attributes to irreducible nodes", function(){

    })
    it("should apply data attributes to custom elements", function(){

    })
    it("should mount root text nodes", function(){

    })
    it("should mount nested text nodes", function(){

    })
    it("should mount root array return values", function(){

    })
    it("should mount nested array return values", function(){

    })
    it("should apply event listener attributes to irreducible nodes", function(){

    })
  })
  describe("updating", function(){
    it("should properly update changed attributes on irreducible nodes", function(){

    })
    it("should properly update changed data attributes on custom elements", function(){

    })
    it("should properly change event listener attributes", function(){

    })
    it("should properly reorder irreducible nodes", function(){

    })
    it("should properly reorder reducible nodes", function(){

    })
  })
  describe("unmounting", function(){
    it("should unmount an irreducible tree", function(){

    })
    it("should unmount a reducible tree", function(){

    })
    it("should unmount root text nodes", function(){

    })
    it("should unmount nested text nodes", function(){

    })
    it("should unmount root array return values", function(){

    })
    it("should unmount nested array return values", function(){

    })
    it("should remove event listener attributes from irreducible nodes", function(){

    })
  })
})
