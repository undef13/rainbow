// Send friend request
const addFriend = async (userId) => {
  const response = await fetch("/friends/add-friend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  if (data.isSuccessful) {
    socket.emit("friend-request", {
      userId,
      requestsCounter: data.data.requestsCounter,
      notificationHtml: data.data.notificationHtml,
    });
		cancelRequestDOMManipulation(userId, data.message);
  } else {
    alert(false, data.message);
  }
};

// Accept friend request
const acceptRequest = async (userId, whereAccepted = "Cards") => {
  const response = await fetch("/friends/accept-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  if (data.isSuccessful) {
    switch (whereAccepted) {
      case "Cards":
        removeUserCard(data.data.requestId);
        updateRequestCounter(data.data.requestsCounter);
        break;
      case "Profile":
        acceptRequestDOMManipulation(data.data.user);
        updateRequestCounter(data.data.requestsCounter);
        break;
    }
    alert(true, data.message);
  } else {
    alert(false, data.message);
  }
};

// Cancel request
const cancelRequest = async (userId) => {
  const response = await fetch("/friends/cancel-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  if (data.isSuccessful) {
    socket.emit("friend-request-canceled", {
      userId,
      requestsCounter: data.data.requestsCounter,
		});

		const button = document.getElementById("friendActionButton");
		button.textContent = `Send friend request`;
		button.setAttribute("onclick", `addFriend('${userId}')`);

    alert(true, data.message);
  } else {
    alert(false, data.message);
  }
};

// Decline friend request
const declineRequest = async (userId, whereDeclined = "Cards") => {
  const response = await fetch("/friends/decline-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  if (data.isSuccessful) {
    switch (whereDeclined) {
      case "Cards":
        removeUserCard(data.data.requestId);
        updateRequestCounter(data.data.requestsCounter);
        break;
      case "Profile":
				declineRequestDOMManipulation();
        updateRequestCounter(data.data.requestsCounter);
        break;
    }
    alert(true, data.message);
  } else {
    alert(false, data.message);
  }
};

// Remove from friends
const removeFriend = async (userId) => {
  const response = await fetch("/friends/remove-friend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  if (data.isSuccessful) {
		removeUserCard(data.data.cardId);
    alert(true, data.message);
  } else {
    alert(false, data.message);
  }
};

// DOM Manipulation => Decline request
const declineRequestDOMManipulation = () => {
	document.getElementById("acceptActions").hidden = true;
	const button = document.getElementById("friendActionButton");
	button.hidden = false;
}

// Alert
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

// DOM Manipulation => Remove user card
const removeUserCard = (requestId) => {
  document.getElementById(requestId).remove();
  if (document.querySelectorAll(".card").length <= 0) {
    document.getElementById("haveNoFriendsBlock").hidden = false;
  }
};

// DOM Manipulation => Update requests counter
const updateRequestCounter = (requestsCounter) => {
  if (requestsCounter == 0) {
    document
      .querySelectorAll(".counter")
      .forEach((item) => (item.hidden = true));
  } else {
    document
      .querySelectorAll(".counter")
      .forEach((item) => (item.textContent = requestsCounter));
    document
      .querySelectorAll(".counter")
      .forEach((item) => (item.hidden = false));
  }
};

// DOM Manipulation => Accept request
const acceptRequestDOMManipulation = (user) => {
  if (document.querySelectorAll(".friend-link").length < 3) {
    document.getElementById("friendLinksContainer").insertAdjacentHTML(
      "afterbegin",
      `
			<div class="col-4 text-center friend-link">
				<a href="/${user.profileId}">
					<img
						style="width: 35px; border-radius: 50%"
						src="${user.imageUrl}"
						alt=""
					/>
					<span>${user.givenName}</span>
				</a>
			</div>
		`
    );
    document.getElementById("noFriendsBlock").hidden = true;
  }
	document.getElementById("acceptActions").hidden = true;
  const button = document.getElementById("friendActionButton");
  button.textContent = "Write a message";
  button.disabled = true;
  button.hidden = false;
};

// DOM Manipulation => Cancel request
const cancelRequestDOMManipulation = (userId, message) => {
  const button = document.getElementById("friendActionButton");
  button.textContent = `Cancel request`;
  button.setAttribute("onclick", `cancelRequest('${userId}')`);
  alert(true, message);
};