'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _NodeGroup = require('./ui/NodeGroup');

var _NodeGroup2 = _interopRequireDefault(_NodeGroup);

var _FunctionDeclaration = require('./ui/FunctionDeclaration');

var _FunctionDeclaration2 = _interopRequireDefault(_FunctionDeclaration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SourceTraverseView = function () {
  function SourceTraverseView(serializedState) {
    _classCallCheck(this, SourceTraverseView);

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('source-traverse');
    var placeholder = document.createElement('div');
    this.element.appendChild(placeholder);
  }

  _createClass(SourceTraverseView, [{
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return atom.config.get('source-traverse.defaultSide');
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'AST Outline';
    }
  }, {
    key: 'getAllowedLocations',
    value: function getAllowedLocations() {
      return ['right', 'left'];
    }
  }, {
    key: 'getPreferredWidth',
    value: function getPreferredWidth() {
      return 200;
    }

    // Returns an object that can be retrieved when package is activated

  }, {
    key: 'serialize',
    value: function serialize() {}

    // Tear down any state and detach

  }, {
    key: 'destroy',
    value: function destroy() {
      this.element.remove();
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }, {
    key: 'update',
    value: function update(data) {
      var container = document.createElement("div");
      var fnsGroup = this._renderFunctionDeclaration(data.FunctionDeclaration);
      _reactDom2.default.render(fnsGroup, container);

      this.element.replaceChild(container, this.element.firstChild);
    }
  }, {
    key: '_renderFunctionDeclaration',
    value: function _renderFunctionDeclaration(items) {
      return _react2.default.createElement(
        _NodeGroup2.default,
        { heading: 'Functions' },
        items.map(function (name) {
          return _react2.default.createElement(_FunctionDeclaration2.default, { name: name });
        })
      );
    }
  }]);

  return SourceTraverseView;
}();

exports.default = SourceTraverseView;
module.exports = exports['default'];