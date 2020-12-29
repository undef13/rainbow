const addFriend = async (userId) => {
	const response = await fetch("/friends/add-friend", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
    body: JSON.stringify({userId}),
	});
	const data = await response.json();
	alert(data.isSuccessful, data.message);
}



const alert = (isSuccessful, message) => {
  let alert = document.createElement("div");
  alert.innerHTML = `<div style="margin:0;" class='alert alert-${
    isSuccessful ? "success" : "danger"
  } fixed-bottom alert-container text-center' role='alert'><span>${message}</span></div>`;
  document.body.appendChild(alert);

  setTimeout(() => {
    const fadeTarget = document.querySelector(".alert");
    const fadeEffect = setInterval(() => {
      if (!fadeTarget.style.opacity) {
        fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
        fadeTarget.style.opacity -= 0.1;
      } else {
        fadeTarget.remove();
        clearInterval(fadeEffect);
      }
    }, 50);
  }, 4000);
};