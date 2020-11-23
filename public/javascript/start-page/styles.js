/* Settings for small screens */
$(document).ready(() => {
  let windowWidth = $(window).width();
  if (windowWidth > 991) {
    $("#containerRow").addClass("align-items-center h-100");
    $("#containerRow").removeClass("text-center");
  } else {
    $("#containerRow").removeClass("align-items-center h-100");
    $("#containerRow").addClass("text-center");
  }

  $(window).resize(() => {
    let windowWidth = $(window).width();
    if (windowWidth > 991) {
      $("#containerRow").addClass("align-items-center h-100");
      $("#containerRow").removeClass("text-center");
    } else {
      $("#containerRow").removeClass("align-items-center h-100");
      $("#containerRow").addClass("text-center");
    }
  });
});
