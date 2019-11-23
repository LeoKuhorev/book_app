'use strict';

const $divEls = $('.book');
const $formEls = $('.edit-form');

function testHandler(event) {
  let $target = $(event.target);
  if($target.is('button')) {
    let $form = $(this).find('form');
    $form.toggle(200);
    let $button = $(this).find('button');
    $button.text() === 'Select This Book' ? $button.text('Add to Database') : $button.text('Select This Book');
  }
}


$divEls.on('click', testHandler);



$(() => {
  $formEls.hide()
});