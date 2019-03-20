const isFn = f => typeof f === "function";
const empty = {};

// relax mutation events are designed for LCRS trees
// where natural insertion happens *after* a node
// since the dom allows insertion *before* a node, we need this helper
const insertAfter = (domNode, parNode, prevNode) => {
  parNode.insertBefore(
    domNode, 
    prevNode ?
      prevNode.nextSibling :
      parNode.firstChild
  )
}

// essentially "diff" props
const applyProps = (domNode, next, prev, isIrreducible) => {
  // remove stale prev props
  for (let k in prev) if (!(k in next)){
    if (k[0] === "o" && k[1] === "n")
      domNode.removeEventListener(k.substr(2).toLowerCase(), prev[k]);
    else domNode.removeAttribute(`${isIrreducible ? "" : "data-"}${k}`)
  }
  // (re)set next props
  for (let k in next) if (prev[k] !== next[k]){
    if (k[0] === "o" && k[1] === "n"){
      const type = k.substr(2).toLowerCase();
      // XXX maybe optimize by using a wrapper and switching out the handler?
      if (prev[k]) domNode.removeEventListener(type, prev[k]);
      domNode.addEventListener(type, next[k])
    } else domNode.setAttribute(`${isIrreducible ? "" : "data-"}${k}`, next[k])
  }
}

module.exports = class DOMRenderer {
  constructor(domRoot){
    this.domRoot = domRoot;
  }
  // adding new node to dom
  add(node, parent, prevSib, {name, data}){
    const isIrreducible = !isFn(name);
    name = isIrreducible ? name : name.name
    const domNode = node._domNode = name ?
      document.createElement(name) :
      document.createTextNode(data);
    name && applyProps(domNode, data || empty, empty, isIrreducible);
    if (!parent)
      this.domRoot.appendChild(domNode);
    else insertAfter(
      domNode,
      parent._domNode,
      prevSib && prevSib._domNode
    );
  }
  // removing node from dom
  remove(node, parent, prevSib){
    const domNode = node._domNode;
    domNode.parentNode.removeChild(domNode);
    node._domNode = null;
  }
  // moving node in dom
  move(node, parent, prevSib, nextSib){
    insertAfter(
      node._domNode,
      parent._domNode,
      nextSib && nextSib._domNode
    );
  }
  // receiving new props (data) on existing node
  temp(node, {name, data}, prevTemp){
    const isIrreducible = !isFn(name);
    const domNode = node._domNode
    if (name) return applyProps(
      domNode,
      data || empty,
      prevTemp.data || empty,
      isIrreducible
    );
    // no name, is a text node
    if (domNode.nodeValue !== data) 
      domNode.nodeValue = data;
  }
}
