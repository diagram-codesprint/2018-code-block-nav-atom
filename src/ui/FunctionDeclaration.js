import React, {Component} from 'react';

export default class FunctionDeclaration extends Component {
  constructor(props) {
    super(props);
    this._click = this._click.bind(this);
  }
  render() {
    return <div onClick={this._click}>{this.props.name}</div>;
  }

  _click() {
    console.log(this.props.name);
  }
}
