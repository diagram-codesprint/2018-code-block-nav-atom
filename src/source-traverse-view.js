import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import NodeGroup from './ui/NodeGroup';
import FunctionDeclaration from './ui/FunctionDeclaration';

export default class SourceTraverseView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('source-traverse');
    const placeholder = document.createElement('div');
    this.element.appendChild(placeholder);
  }

  getDefaultLocation() {
    return atom.config.get('source-traverse.defaultSide');
  }

  getTitle() {
    return 'AST Outline';
  }

  getAllowedLocations() {
    return ['right', 'left'];
  }

  getPreferredWidth() {
    return 200;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  update(data) {
    var container = document.createElement("div");
    const fnsGroup = this._renderFunctionDeclaration(data.FunctionDeclaration);
    ReactDOM.render(fnsGroup, container);

    this.element.replaceChild(container, this.element.firstChild);
  }

  _renderFunctionDeclaration(items) {
    return <NodeGroup heading="Functions">
        {items.map(name => <FunctionDeclaration name={name} />)}
      </NodeGroup>;
  }
}
