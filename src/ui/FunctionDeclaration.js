import React, {Component} from 'react';

export default class FunctionDeclaration extends Component {
  render() {
    const {
      node,
    } = this.props;
    let className;
    if (
      this.props.activeNode
      && this.props.activeNode.loc
      && this.props.activeNode.loc.start.line === node.loc.start.line
      && this.props.activeNode.loc.start.column === node.loc.start.column
      && this.props.activeNode.loc.end.line === node.loc.end.line
      && this.props.activeNode.loc.end.column === node.loc.end.column
    ) {
      className = 'source-traverse-active';
    }
    return <li className={className}><button onClick={this._click}>{node.id.name}</button></li>;
  }

  _click = () => {
    this.props.onItemActivate(this.props.node);
  };
}
