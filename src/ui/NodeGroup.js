import React, {Component} from 'react';

export default class NodeGroup extends Component {
  render() {
    return <div>
      <h2>{this.props.heading}</h2>
      <ol>
        {React.Children.map(this.props.children, child => {
          return React.cloneElement(
            child,
            {
              ...child.props,
              activeNode: this.props.activeNode,
              onItemActivate: this.props.onItemActivate,
            },
            child.props.children,
          );
        })}
      </ol>
    </div>;
  }
}
