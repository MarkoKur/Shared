function mouseOverForTitle(event) {
	if (!event.target.title) {
		const withId = event.target.dataset.id ? event.target.dataset.id : '';
		const key = event.target.dataset.case == undefined ? event.target.innerHTML : event.target.innerHTML.toUpperCase();
		const value = rawMap.get(key + withId);
		if (value === undefined) {
			console.error("No value for given key: '" + key + withId + "'");
		} else if (value.title) {
			event.target.title = value.title;

		} else if (value.html) {
			let innerText = "";
			value.html.forEach( html => {
				innerText += html.text;
			});
			event.target.title = innerText;
		}
		event.target.removeEventListener("mouseover", mouseOverForTitle);
	}
}

document.addEventListener("DOMContentLoaded", (event) => {
			const glossaryElements = document.getElementsByClassName('get-title');
			Array.from(glossaryElements).forEach( glossaryElement => {
				glossaryElement.addEventListener("mouseover", mouseOverForTitle);
			});
});
