'use babel';

import SourceTraverseView from './source-traverse-view';
import { CompositeDisposable } from 'atom';
import recast from 'recast';

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
    var code = [
        "function add(a, b) {",
        "  return a +",
        "    // Weird formatting, huh?",
        "    b;",
        "}"
    ].join("\n");

    var ast = recast.parse(editor.getText(), {
        parser: require("recast/parsers/flow")
      });

    var out = recast.print(ast);

    var container = document.createElement("div");
    container.textContent = out;
    this.view.addContent(container);
  }

};
