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
    // Formatters
    this.formatters = {
      ClassDeclaration: this._renderClassDeclaration,
      FunctionDeclaration: this._renderFunctionDeclaration,
    }
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
      for (let name of Object.keys(data)) {
        if (this.formatters[name]) {
          if (data[name].length > 0) {
            sections.push(this.formatters[name](data[name]));
          }
        } else {
          throw new Error('Missing a formatter for \`' + name + '\`.');
        }
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

  _renderClassDeclaration(nodes) {
    return <NodeGroup heading="Classes">
        {nodes.map(node => <FunctionDeclaration node={node} />)}
      </NodeGroup>;
  }
  _renderFunctionDeclaration(nodes) {
    return <NodeGroup heading="Functions">
        {nodes.map(node => <FunctionDeclaration node={node} />)}
      </NodeGroup>;
  }
}
