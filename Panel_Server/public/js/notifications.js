

function showNotif(response) {

  let showTime = 3000;

  if (response.success == true) {
    $.notify({
      icon: "add_alert",
      message: response.data.message
    }, {
      type: response.data.notifType,
      timer: showTime,
      placement: {
        from: "top",
        align: "right"
      }
    });
  } else {
    $.notify({
      icon: "add_alert",
      message: response.data.error
    }, {
      type: "warning",
      timer: showTime,
      placement: {
        from: "top",
        align: "right"
      }
    });
  }
}