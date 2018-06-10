import React, {Component} from 'react';

export default class NodeGroup extends Component {
  render() {
    return <div>
      <h2>{this.props.heading}</h2>
      <div>{this.props.children}</div>
    </div>;
  }
}
