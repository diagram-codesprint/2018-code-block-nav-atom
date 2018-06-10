import SourceTraverseView from './source-traverse-view';
import { CompositeDisposable } from 'atom';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import recast from 'recast';

function foo () {}
function bar () {}
function baz () {}

export default {
  view: null,
  subscriptions: null,

  activate(state) {
    this.view = new SourceTraverseView(state.sourceTraverseViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'source-traverse:toggle': () => this.toggle()
    }));

    let fn = this.update.bind(this);
    this.subscriptions.add(atom.workspace.observeActiveTextEditor(fn));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.view.destroy();
  },

  serialize() {
    return {
      atomTraversePkgViewState: this.view.serialize(),
    };
  },

  toggle() {
    atom.workspace.toggle(this.view);
  },

  update(editor){
    const source = editor.getText();
    const fns = [];
    const ast = recast.parse(source, {
      parser: require("recast/parsers/flow"),
    });
    recast.visit(ast, {
      visitFunctionDeclaration: function (path) {
        fns.push(path.value.id.name);
        this.traverse(path);
      },
    });

    var out = recast.print(ast).code;
    var container = document.createElement("div");
    const fnsGroup = <NodeGroupView
      heading="Functions">
        {fns.map(name => <FunctionDeclarationView name={name} />)}
      </NodeGroupView>;
    ReactDOM.render(fnsGroup, container)
    this.view.addContent(container);
  }
};

class NodeGroupView extends Component {
  render() {
    return <div>
      <h2>{this.props.heading}</h2>
      <div>{this.props.children}</div>
    </div>;
  }
}

class FunctionDeclarationView extends Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}
