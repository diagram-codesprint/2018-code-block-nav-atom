import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ErrorMessage from './ui/ErrorMessage';
import FunctionDeclaration from './ui/FunctionDeclaration';
import NodeGroup from './ui/NodeGroup';

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
    let node;
    var container = document.createElement("div");
    if (data.error) {
      node = <ErrorMessage message={data.error} />;
    } else {
      const sections = [];
      if (data.FunctionDeclaration.length > 0) {
        sections.push( this._renderFunctionDeclaration(data.FunctionDeclaration));
      }
      if (sections.length === 0) {
        node = <ErrorMessage message={"No information to show."} />;
      } else {
        node = sections;
      }
    }
    ReactDOM.render(node, container);

    this.element.replaceChild(container, this.element.firstChild);
  }

  _renderFunctionDeclaration(items) {
    return <NodeGroup heading="Functions">
        {items.map(name => <FunctionDeclaration name={name} />)}
      </NodeGroup>;
  }
}
