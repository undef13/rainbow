// Scroll Shadow
window.addEventListener("scroll", function () {
	const scrollTop = window.pageYOffset;
	document.querySelector(".navigation").classList.toggle("shadow", scrollTop > 1);
});