import React, {Component} from 'react';

export default class FunctionDeclaration extends Component {
  render() {
    const {
      node,
    } = this.props;
    return <li><button onClick={this._click}>{node.id.name}</button></li>;
  }

  _click = () => {
    this.props.onItemActivate(this.props.node);
  };
}
