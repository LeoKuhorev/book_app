'use strict';

const $menuButton = $('#ham-icon');
const $navEl = $('nav');
let isClosed = true;

function menuHandler(event) {
  if($(event.target).is('#ham-icon') && isClosed) {
    $navEl.slideDown(300);
    isClosed = false;
  } else {
    $navEl.slideUp(300);
    isClosed = true;
  }
}

$( () => {
  $navEl.hide();
  $(window).on('click', menuHandler);
});