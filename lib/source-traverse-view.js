'use babel';

export default class SourceTraverseView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('source-traverse');
    // Create message element
    const message = document.createElement('div');
    message.textContent = 'TBD';
    this.element.appendChild(message);
  }

  getDefaultLocation() {
    return atom.config.get('source-traverse.defaultSide');
  }

  getTitle() {
    return 'AST Outline';
  }

  getAllowedLocations() {
    return ['right', 'left'];
  }

  getPreferredWidth() {
    return 200;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  addContent(content) {
    this.element.appendChild(content);
  }
}
