// Automatic textarea
const elements = document.querySelectorAll("textarea");
for(let element of elements) {
	element.addEventListener("input", () => {
		element.style.height = "1px";
		element.style.height = (element.scrollHeight + 1) + "px";
	});
}