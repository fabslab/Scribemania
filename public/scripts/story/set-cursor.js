define(function (require, exports, module) {
function setCursor() {
  // skip if there is not text content
  if (!this.firstChild) return;

  var range = document.createRange();
  var sel = window.getSelection();

  range.setStartAfter(this.firstChild);
  range.collapse(true);

  sel.removeAllRanges();
  sel.addRange(range);
}

module.exports = setCursor;
});
