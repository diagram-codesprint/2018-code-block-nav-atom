import SourceTraverseView from './source-traverse-view';
import { CompositeDisposable } from 'atom';
import recast from 'recast';

function foo () {}
 function bar () {}
function baz () {}
class Biz {
  constructor() {}
}

const nodesToVisit = [
  'ClassDeclaration',
  'FunctionDeclaration',
  'VariableDeclaration',
];

let editorSubscriptions = [], a, b, c;

export default {
  view: null,
  subscriptions: null,
  _activeEditor: null,

  activate(state) {
    this.view = new SourceTraverseView(state.sourceTraverseViewState);
    this._onItemActivate = this._onItemActivate.bind(this);
    this.view.onItemActivate(this._onItemActivate);

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
    while(editorSubscriptions.length > 0){
      editorSubscriptions.pop().dispose();
    }
    this._activeEditor = editor;
    if (!this._activeEditor) {
      this.view.update({
        error: 'No file to parse.',
      });
      return;
    }
    const fn = this.getNodeInAstAtCursor.bind(this, this._activeEditor);
    const sub = this._activeEditor.onDidChangeCursorPosition(fn);
    editorSubscriptions.push(sub);
    const isJavaScript = /^.*\.js$/.test(this._activeEditor.getFileName());
    if (!isJavaScript) {
      this.view.update({
        error: 'This is not a JavaScript file.',
      });
      return;
    }
    const source = this._activeEditor.getText();
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
    try {
      return recast.parse(functionText, {
        parser: require("recast/parsers/flow")
      });
    } catch (_) {}
  },

  getNodeAtPosition(row, column, astText){
    let walk = require( 'esprima-walk' );
    walk(astText, node => {
      //todo literals /.*Literal/.test(node.type)
      this.cursorAtNode(row, column, node);
    })
    return "wow";
  },

  _onItemActivate(node) {
    if (node.loc) {
      this._selectLoc(node.loc);
    }
  },

  _selectLoc(loc) {
    const {
      start,
      end,
    } = loc;
    if (this._activeEditor) {
      this._activeEditor.setSelectedBufferRange([
        [start.line - 1, start.column],
        [end.line - 1, end.column],
      ]);
    }
  },

  cursorAtNode(row, column, node){
    if (node.type == 'FunctionDeclaration' || node.type == 'ClassDeclaration' || node.type == 'VariableDeclaration'){  // only look at root nodes
      // console.log(node);
      let start = node.loc.start;
      let end = node.loc.end;
      if (start.line-1 >= row && end.line-1 <= row){
        if (end.line-1 == row){
          if (start.line - 1 == row){
            if (column <= end.column && column >= start.column){
              console.log(node);
            }
          }
          else{
            if (column <= end.column){
            console.log(node);
            }
          }
        }
        else if (start.line-1 == row){
          if (column >= start.column){
            console.log(node);
          }
        }
        // console.log('following node is for debug:');
        // console.log(node);
        // console.log('Current loc is:' + '(' + row + ',' + column +')');
      }
    }
  }
};
