const userContainer = document.getElementById("usersContainer");

let makeAjax = true;
let page = 2;

const addUserCards = async () => {
  let docBottom =
    Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    ) - 400;

  let clientBottom = document.documentElement.clientHeight + window.pageYOffset;

  if (makeAjax && docBottom < clientBottom) {
		makeAjax = false;
		document.querySelector(".show-spinner").hidden = false;
		const response = await fetch(`/friends?page=${page}&ajax=true`, {
			method: "GET",
		});
		const data = await response.json();
		if (!data.data.newUsers) {
			makeAjax = false;
			document.querySelector(".show-spinner").hidden = true;
		} else {
			let div = document.createElement("div");
			div.innerHTML = data.data.newUsers;
			document.querySelector(".show-spinner").hidden = true;
			userContainer.appendChild(div);
			makeAjax = true;
			page += 1;
		}
  }
}
window.addEventListener("scroll", addUserCards);