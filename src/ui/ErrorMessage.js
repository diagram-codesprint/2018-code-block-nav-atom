import React, {Component} from 'react';

export default class ErrorMessage extends Component {
  render() {
    return <div>
      <div>{this.props.message}</div>
    </div>;
  }
}
