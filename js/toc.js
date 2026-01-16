function onLetterClick(event) {
			let detailsTd;
			if (event.target.nodeName === 'TD') {
				detailsTd = event.target.nextSibling.nextSibling;
			} else {
				detailsTd = event.target.parentNode.nextSibling.nextSibling;
			}
			const details = detailsTd.getElementsByTagName('details');
			details[0].open = !details[0].open;
}

document.addEventListener("DOMContentLoaded", (event) => {
		const toc = document.getElementById('toc');
		const tocRows = toc.getElementsByTagName('tr');
		for (let i = 0, len = tocRows.length; i < len; i++) {
			tocRows[i].children[0].onclick = onLetterClick;
		}
});