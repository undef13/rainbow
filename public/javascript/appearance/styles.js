// Scroll Shadow
$(window).scroll(function () {
  $(".navigation").toggleClass("shadow", $(this).scrollTop() > 1);
});