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

const isEvt = name => name[0] === "o" && name[1] === "n";
const evt = name => name.substr(2).toLowerCase();
// essentially "diff" props
const applyProps = (domNode, next, prev) => {
  // remove stale prev props
  for (let k in prev) if (!(k in next)){
    if (isEvt(k)) domNode.removeEventListener(evt(k), prev[k]);
    else domNode.removeAttribute(k);
  }
  // (re)set next props
  for (let k in next) {
    const pv = prev[k], nv = next[k];
    if (isEvt(k)){
      const type = evt(k);
      if (!isFn(nv) || pv !== nv) domNode.removeEventListener(type, pv);
      if (nv) domNode.addEventListener(type, nv);
    } 
    else if (k in domNode) domNode[k] = nv == null ? "" : nv;
    else if (nv == null || nv === false) domNode.removeAttribute(k);
    else if (pv !== nv) domNode.setAttribute(k, nv);
  }
}

module.exports = class DOMRenderer {
  constructor(domRoot){
    this.domRoot = domRoot;
  }
  // adding new node to dom
  add(node, parent, prevSib, {name, data}){
    name = isFn(name) ? name.name || "r-el" : name;
    const domNode = node._domNode = name ?
      document.createElement(name) :
      document.createTextNode(data);
    name && applyProps(domNode, data || empty, empty);
    if (!parent) this.domRoot.appendChild(domNode);
    else insertAfter(domNode, parent._domNode, prevSib && prevSib._domNode);
  }
  // removing node from dom
  remove(node, parent, prevSib){
    node._domNode.parentNode.removeChild(node._domNode);
    node._domNode = null;
  }
  // moving node in dom
  move(node, parent, prevSib, nextSib){
    insertAfter(node._domNode, parent._domNode, nextSib && nextSib._domNode);
  }
  // receiving new props (data) on existing node
  temp(node, {name, data}, prevTemp){
    const domNode = node._domNode
    if (name) 
      applyProps(domNode, data || empty, prevTemp.data || empty);
    // no name, is a text node
    else if (domNode.nodeValue !== data) 
      domNode.nodeValue = data;
  }
}
