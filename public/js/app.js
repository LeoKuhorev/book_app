'use strict';

const $bookDiv = $('.book');
const $hideDivs = $('.show-hide');


function openForm(event) {
  if($(event.target).is('button')) {
    const $hideDiv = $(this).find('.show-hide');
    if($hideDiv.is(':visible') && $(this).find('[name=bookshelf]').val() !== ''
    || !$hideDiv.is(':visible')) {
      $hideDiv.toggle(200);
      let $button = $(this).find('button');
      $button.text() === ' Select This Book' ? $button.text('Add to Database') && $button.addClass('narrow') : $button.text('Select This Book') && $button.removeClass('narrow');
    }
  }
}


$( () => $bookDiv.on('click', openForm) );

