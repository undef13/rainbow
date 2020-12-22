window.addEventListener('scroll', addUserCards);
const userContainer = document.getElementById("usersContainer");

function addUserCards() {
	let docBottom = Math.max(
document.body.scrollHeight, document.documentElement.scrollHeight,
document.body.offsetHeight, document.documentElement.offsetHeight,
document.body.clientHeight, document.documentElement.clientHeight
	) - 100;

	console.log(`Doc: ${docBottom}`);

	let clientBottom = document.documentElement.clientHeight + window.pageYOffset;

	console.log(`Client: ${clientBottom}`);

	if ( docBottom < clientBottom ) {
		let div = document.createElement('div');
		div.innerHTML = `asd`
		userContainer.appendChild(div);
	}
}