/* Settings for small screens */
document.addEventListener("DOMContentLoaded", () => {
	let windowWidth = window.innerWidth;
	if (windowWidth > 991) {
		document.getElementById("containerRow").classList.add("align-items-center", "h-100");
		document.getElementById("containerRow").classList.remove("text-center");
	} else {
		document.getElementById("containerRow").classList.remove("align-items-center", "h-100");
		document.getElementById("containerRow").classList.add("text-center");
	}

	window.addEventListener("resize", () => {
		let windowWidth = window.innerWidth;
		if (windowWidth > 991) {
			document.getElementById("containerRow").classList.add("align-items-center", "h-100");
			document.getElementById("containerRow").classList.remove("text-center");
		} else {
			document.getElementById("containerRow").classList.remove("align-items-center", "h-100");
			document.getElementById("containerRow").classList.add("text-center");
		}
	});
});