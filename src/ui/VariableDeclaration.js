import React, {Component} from 'react';

export default class VariableDeclaration extends Component {
  render() {
    const {
      node,
    } = this.props;
    const kind = node.kind;
    return <li className="source-traverse--nodes__variable-declaration">
        <ol>
          {node.declarations.map(declaration => {
            const indentifierNode = declaration.id;
            const initNode = declaration.init;
            let nodes = [
              <span className="source-traverse--nodes__variable-declaration-kind">{kind}</span>,
              ' ',
              <button onClick={this._click.bind(this, indentifierNode)}>{declaration.id.name}</button>
            ];
            if (declaration.init) {
              nodes = nodes.concat(` = `, <button onClick={this._click.bind(this, initNode)}>{declaration.init.type}</button>);
            }
            return <li className="source-traverse--nodes__variable-declaration-item">
              {nodes}
            </li>;
          })}
        </ol>
      </li>;
  }

  _click = (node, _) => {
    this.props.onItemActivate(node);
  };
}
