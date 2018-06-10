import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Container from './ui/Container';
import ErrorMessage from './ui/ErrorMessage';
import EventEmitter from './util/EventEmitter';
import FunctionDeclaration from './ui/FunctionDeclaration';
import VariableDeclaration from './ui/VariableDeclaration';
import NodeGroup from './ui/NodeGroup';

class SourceTraverseView {
  constructor(serializedState) {
    this.eventEmitter = new EventEmitter();
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('source-traverse');
    const placeholder = document.createElement('div');
    this.element.appendChild(placeholder);
    // Formatters
    this.formatters = {
      ClassDeclaration: this._renderClassDeclaration,
      FunctionDeclaration: this._renderFunctionDeclaration,
      VariableDeclaration: this._renderVariableDeclaration,
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

  update(data, activeNode) {
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
    const root = <Container onItemActivate={this._onItemActivate} activeNode={activeNode}>{node}</Container>;
    ReactDOM.render(root, container);
    this.element.replaceChild(container, this.element.firstChild);
  }
  onItemActivate(callback) {
    return this.eventEmitter.on('itemactivate', callback);
  }
  _onItemActivate = (item) => {
    this.eventEmitter.emit('itemactivate', item);
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
  _renderVariableDeclaration(nodes) {
    return <NodeGroup heading="Variable Declarations">
      {nodes.map(node => <VariableDeclaration node={node} />)}
    </NodeGroup>;
  }
}

export default SourceTraverseView;
