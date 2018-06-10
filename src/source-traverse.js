import SourceTraverseView from './source-traverse-view';
import { CompositeDisposable } from 'atom';
import recast from 'recast';

function foo () {}
function bar () {}
function baz () {}
class Biz {}

const nodesToVisit = [
  'ClassDeclaration',
  'FunctionDeclaration',
];

let editorSubscriptions = [];

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
    if (!editor) {
      this.view.update({
        error: 'No file to parse.',
      });
      return;
    }
    while(editorSubscriptions.length > 0){
      const sub = editorSubscriptions.pop();
      sub.dispose();
    }
    const fn = this.getNodeInAstAtCursor.bind(this, editor);
    const sub = editor.onDidChangeCursorPosition(fn);
    editorSubscriptions.push(sub);
    const isJavaScript = /^.*\.js$/.test(editor.getFileName());
    if (!isJavaScript) {
      this.view.update({
        error: 'This is not a JavaScript file.',
      });
      return;
    }
    const source = editor.getText();
    const data = {};
    try {
      const visitor = this.visit.bind(null, data);
      const ast = recast.parse(source, {
        parser: require("recast/parsers/flow"),
      });
      recast.visit(ast, nodesToVisit.reduce((acc, name) => {
        acc[`visit${name}`] = visitor;
        return acc;
      }, Object.create(null)));
    } catch (error) {
      this.view.update({
        error: error.message,
      });
      return;
    }

    this.view.update(data);
    // this.view.update(data, activeAstNode);  //TODO give reference to an AST Node
  },

  visit(data, path) {
    const node = path.value;
    if (!data[node.type]) {
      data[node.type] = [];
    }
    data[node.type].push(node);
    return false;
  },

  getNodeInAstAtCursor(editor, event) {
    let astText = this.getAstTreeText(editor.getText(editor));
    let pos = event.newBufferPosition;
    //binary search using pos to get to the appropriate point in tree
    let node = this.getNodeAtPosition(pos.row, pos.column, astText);
    console.log(node);
  },


  getAstTreeText(functionText){
    return recast.parse(functionText, {
      parser: require("recast/parsers/flow")
    })
  },

  getNodeAtPosition(row, column, AstTree){
    // debugger;
    var walk = require( 'esprima-walk' );
    // walk,
    return "wow";
  }

};
