// Send friend request
const addFriend = async (userId) => {
	const response = await fetch("/friends/add-friend", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
    body: JSON.stringify({userId}),
	});
	const data = await response.json();
	alert(data.isSuccessful, data.message);
}

// Accept friend request
const acceptRequest = async (userId) => {
	const response = await fetch("/friends/accept-request", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
    body: JSON.stringify({userId}),
	});
	const data = await response.json();
	if (data.isSuccessful) {
		document.getElementById(data.data.requestId).remove();
		if(document.querySelectorAll("card").length <= 0) {
			document.getElementById("haveNoFriendsBlock").hidden = false;
		}
		alert(true, data.message);
	} else {
		alert(false, data.message);
	}
}

// Decline friend request
const declineRequest = async (userId) => {
	const response = await fetch("/friends/decline-request", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
    body: JSON.stringify({userId}),
	});
	const data = await response.json();
	if (data.isSuccessful) {
		document.getElementById(data.data.requestId).remove();
		if(document.querySelectorAll(".card").length <= 0) {
			document.getElementById("haveNoFriendsBlock").hidden = false;
		}
		alert(true, data.message);
	} else {
		alert(false, data.message);
	}
}

// Remove from friends
const removeFriend = async (userId) => {
	const response = await fetch("/friends/remove-friend", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
    body: JSON.stringify({userId}),
	});
	const data = await response.json();
	if (data.isSuccessful) {
		document.getElementById(data.data.requestId).remove();
		if(document.querySelectorAll(".card").length <= 0) {
			document.getElementById("haveNoFriendsBlock").hidden = false;
		}
		alert(true, data.message);
	} else {
		alert(false, data.message);
	}
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