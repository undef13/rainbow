const socket = io("/");

socket.on("notification", (data) => {
  document.querySelector(".toast-container").insertAdjacentHTML("beforeEnd", data.notificationHtml);
	const toastElList = [].slice.call(document.querySelectorAll(".toast"));
  const toastList = toastElList.map(function (toastEl) {
		toastEl.addEventListener("hidden.bs.toast", () => {
			toastEl.remove();
		});
    return new bootstrap.Toast(toastEl, { delay: 10000 });
	});
	const notifySound = new Audio("../sounds/notification.mp3");
  toastList.forEach((element) => {
		notifySound.play();
		element.show();
	});
	
	if (data.requestsCounter) {
		document
		.querySelectorAll(".counter")
		.forEach((item) => (item.textContent = data.requestsCounter));
	document
		.querySelectorAll(".counter")
		.forEach((item) => (item.hidden = false));
	}
});