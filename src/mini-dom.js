const isFn = f => typeof f === "function";

// all props on custom elements are data attributes, prob change this
const attrName = (k, isHTML) => `${isHTML ? "" : "data-"}${k}`

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
const applyProps = (domNode, props, prevProps, isHTML) => {
  if (!prevProps) for (let k in props)
    domNode.setAttribute(attrName(k, isHTML), props[k])
  else {
    for (let k in props)
      if (prevProps[k] !== props[k]) 
        domNode.setAttribute(attrName(k, isHTML), props[k])
    for (let k in prevProps)
      if (!(k in props)) 
        domNode.removeAttribute(attrName(k, isHTML))
  }
}

const makeNode = (name, props) => name ?
  document.createElement(name) :
  document.createTextNode(props); // no name, is a text node

module.exports = class DOMRenderer {
  constructor(domRoot){
    this.domRoot = domRoot;
  }
  // adding new node to dom
  add(node, parent, prevSib, {name, data}){
    const isHost = !isFn(name);
    name = isHost ? name : name.name
    const domNode = node._domNode = makeNode(name, data);
    name && applyProps(domNode, data, {}, isHost);
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
    const isHost = !isFn(name);
    const domNode = node._domNode
    if (name) return applyProps(
      domNode,
      data,
      prevTemp.data,
      isHost
    );
    // no name, is a text node
    if (domNode.nodeValue !== data) 
      domNode.nodeValue = data;
  }
}
