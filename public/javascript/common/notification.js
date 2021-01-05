const socket = io("/");

socket.on("notification", (data) => {
  document.querySelector(".toast-container").insertAdjacentHTML(
    "beforeEnd",
    `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
	<div class="toast-header">					
		<strong class="me-auto">Friend request</strong>
		<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
	</div>
	<div class="toast-body">
		<div>A new friend request</div>
		<div class="d-flex justify-content-between mt-2 pt-2 border-top">
			<div>
				<button type="button" class="btn btn-primary btn-sm">Accept</button>
				<button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Decline</button>
			</div>
			<div>
				<a type="button" class="btn btn-sm btn-secondary" href="/settings">Check profile</a>
			</div>							
		</div>
	</div>
</div>`
  );
	const toastElList = [].slice.call(document.querySelectorAll(".toast"));
  const toastList = toastElList.map(function (toastEl) {
		toastEl.addEventListener("hidden.bs.toast", () => {
			toastEl.remove();
		})
    return new bootstrap.Toast(toastEl, { delay: 10000 });
	});
	const notifySound = new Audio("../sounds/notification.mp3");

  toastList.forEach((element) => {
		notifySound.play();
		element.show();
  });
});
