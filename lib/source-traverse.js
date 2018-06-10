'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sourceTraverseView = require('./source-traverse-view');

var _sourceTraverseView2 = _interopRequireDefault(_sourceTraverseView);

var _atom = require('atom');

var _recast = require('recast');

var _recast2 = _interopRequireDefault(_recast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function foo() {}
function bar() {}
function baz() {}

exports.default = {
  view: null,
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.view = new _sourceTraverseView2.default(state.sourceTraverseViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'source-traverse:toggle': function sourceTraverseToggle() {
        return _this.toggle();
      }
    }));

    var fn = this.update.bind(this);
    this.subscriptions.add(atom.workspace.observeActiveTextEditor(fn));
  },
  deactivate: function deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.view.destroy();
  },
  serialize: function serialize() {
    return {
      atomTraversePkgViewState: this.view.serialize()
    };
  },
  toggle: function toggle() {
    atom.workspace.toggle(this.view);
  },
  update: function update(editor) {
    var source = editor.getText();
    var data = {
      FunctionDeclaration: []
    };
    var ast = _recast2.default.parse(source, {
      parser: require("recast/parsers/flow")
    });
    _recast2.default.visit(ast, {
      visitFunctionDeclaration: function visitFunctionDeclaration(path) {
        data.FunctionDeclaration.push(path.value.id.name);
        this.traverse(path);
      }
    });

    this.view.update(data);
  }
};
module.exports = exports['default'];