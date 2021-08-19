

function custom_confirm(message, callback) {
  //  put message into the body of modal
  //$('#userConfirmationModal-body').innerHTML = `<p>${message}</p>`;
  $('#userConfirmationModal').on('show.bs.modal', function (event) {
    //  store current modal reference
    var modal = $(this);
    //  update modal body help text
    modal.find('.modal-body').html(message);
  });
  //  show modal ringer custom confirmation
  $('#userConfirmationModal').modal('show');

  $('#userConfirmationModal button.ok').off().on('click', function () {
    // close window
    $('#userConfirmationModal').modal('hide');
    // and callback
    callback(true);
  });

  $('#userConfirmationModal button.cancel').off().on('click', function () {
    // close window
    $('#userConfirmationModal').modal('hide');
    // callback
    callback(false);
  });
}