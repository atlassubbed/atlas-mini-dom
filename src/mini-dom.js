const isFn = f => typeof f === "function";

const attrName = (k, isHTML) => `${isHTML ? "" : "data-"}${k}`

const insertAfter = (domNode, parNode, prevNode) => {
  parNode.insertBefore(
    domNode, 
    prevNode ?
      prevNode.nextSibling :
      parNode.firstChild
  )
}

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
  document.createTextNode(props);

module.exports = class DOMRenderer {
  constructor(domRoot){
    this.domRoot = domRoot;
  }
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
  remove(node, parent, prevSib){
    const domNode = node._domNode;
    domNode.parentNode.removeChild(domNode);
    node._domNode = null;
  }
  move(node, parent, prevSib, nextSib){
    insertAfter(
      node._domNode,
      parent._domNode,
      nextSib && nextSib._domNode
    );
  }
  temp(node, {name, data}, prevTemp){
    const isHost = !isFn(name);
    const domNode = node._domNode
    if (name) return applyProps(
      domNode,
      data,
      prevTemp.data,
      isHost
    );
    if (domNode.nodeValue !== data) 
      domNode.nodeValue = data;
  }
}
