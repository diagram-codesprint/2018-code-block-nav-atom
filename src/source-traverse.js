import SourceTraverseView from './source-traverse-view';
import { CompositeDisposable } from 'atom';
import recast from 'recast';
import walk from 'esprima-walk';

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

let a = [], b, c;

export default {
  view: null,
  subscriptions: null,
  _activeEditor: null,

  activate(state) {
    this.view = new SourceTraverseView(state.sourceTraverseViewState);
    this._onItemActivate = this._onItemActivate.bind(this);
    this.view.onItemActivate(this._onItemActivate);
    this._ast = null;

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this._editorSubscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'source-traverse:toggle': () => this.toggle()
    }));

    let fn = this.onNewEditor.bind(this);
    this.subscriptions.add(atom.workspace.observeActiveTextEditor(fn));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this._editorSubscriptions.dispose();
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

  onNewEditor(editor) {
    this._editorSubscriptions.dispose();
    this._activeEditor = editor;
    this._editorSubscriptions.add(
      this._activeEditor.onDidChangeCursorPosition(
        this.getNodeInAstAtCursor.bind(this, this._activeEditor),
      ),
    );
    this._editorSubscriptions.add(
      this._activeEditor.onDidStopChanging(
        this.update.bind(this),
      ),
    );
    this.update();
  },

  update(activeNode){
    if (!this._activeEditor) {
      this.view.update({
        error: 'No file to parse.',
      });
      return;
    }
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
      this._ast = recast.parse(source, {
        parser: require("recast/parsers/flow"),
      });
      recast.visit(this._ast, nodesToVisit.reduce((acc, name) => {
        acc[`visit${name}`] = visitor;
        return acc;
      }, Object.create(null)));
    } catch (error) {
      this.view.update({
        error: error.message,
      });
      return;
    }

    this.view.update(data, activeNode);
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
    let pos = event.newBufferPosition;
    //binary search using pos to get to the appropriate point in tree
    let node = this.getNodeAtPosition(pos.row, pos.column);
    if (node) {
      this.update(node);
    }
  },

  getNodeAtPosition(row, column){
    let data = {};
    try {
      const visitor = this.cursorAtNode.bind(null, row, column, data);
      recast.visit(this._ast, nodesToVisit.reduce((acc, name) => {
        acc[`visit${name}`] = visitor;
        return acc;
      }, Object.create(null)));
    } catch (_) {}
    return data.node;
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

  cursorAtNode(row, column, data, path){
    const node = path.value;
    let start = node.loc.start;
    let end = node.loc.end;
    if (start.line-1 >= row && end.line-1 <= row){
      if (end.line-1 == row){
        if (start.line - 1 == row){
          if (column <= end.column && column >= start.column){
            data.node = node;
          }
        }
        else{
          if (column <= end.column){
            data.node = node;
          }
        }
      }
      else if (start.line-1 == row){
        if (column >= start.column){
          data.node = node;
        }
      }
    }
    return false;
  }
};
