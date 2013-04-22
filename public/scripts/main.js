(function($) {

  var keysDown = {
    16: false, // shift
    13: false // enter
  };

  $(function() {

    // Open input for user to add to story
    $story = $('.story');
    $story.on('click', function(event) {
      var $storyEl = $(this);
      $storyEl.find('textarea').val('').show().focus();
      $storyEl.find('.enter-hint').show();
    });

    $story
      .find('textarea')
      .keydown(addParagraphHandler)
      .keyup(addParagraphHandler)
      .click(function(event) {
        // stop click handler on parent
        event.stopPropagation();
      });
  });

  function addParagraphHandler(event) {
    if (keysDown[event.which] == null) return;
    event.stopPropagation();

    // determine whether shift or enter key are held down
    keysDown[event.which] = event.type == 'keydown' ? true : event.type == 'keyup' ? false : keysDown[event.which];
    // when held down together append user's paragraph to the story
    if (keysDown['16'] && keysDown['13']) {
      $this = $(this);
      // extract the text and hide the input
      var additionText = $this.val();
      $(this.nextSibling).fadeOut();
      $this.fadeOut(function() {
        var additionParagraph = document.createElement('p');
        additionParagraph.appendChild(document.createTextNode(additionText));
        $(additionParagraph).hide();
        this.parentNode.insertBefore(additionParagraph, this);
        $(additionParagraph).fadeIn();
      });
    }
  }


}(jQuery));