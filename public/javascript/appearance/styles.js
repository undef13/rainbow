// Scroll Shadow
$(window).scroll(function () {
  $(".navigation").toggleClass("shadow", $(this).scrollTop() > 1);
});

// Automatic textarea
$("#postTextArea").on("input", function() {
	this.style.height = "1px";
	this.style.height = (this.scrollHeight + 1) + "px";
});