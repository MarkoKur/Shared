function createHrefLink(link, label) {
	const element = document.createElement("a");
	element.innerHTML = label;
	element.href = "#" + link;
	element.classList.add("nowrap");
	return element;
}

function addTextWithLinks(sourceText, parentElement) {
	if (!sourceText) return;
	if (sourceText.includes('#')) {
		const sourceTextArray = sourceText.split(" ");
		let nodeText = "";
		for (const word of sourceTextArray) {
			if (word.startsWith('#')) {
				parentElement.appendChild(document.createTextNode(nodeText + " "));
				let a;
				if (word.includes(".")) {
					const linkAndText = word.split(".");
					a = createHrefLink(linkAndText[0].substr(1), linkAndText[1]);
				} else {
					a = createHrefLink(word.substr(1), "");
				}
				parentElement.appendChild(a);
				nodeText = " ";
			} else {
				nodeText += word + " ";
			}
		}
		parentElement.appendChild(document.createTextNode(nodeText));
	} else {
		parentElement.appendChild(document.createTextNode(sourceText));
	}
}

function addHtmlBlock(html, parent) {
	for (const block of html) {
		if (block.tag) {
			const tag = document.createElement(block.tag);
			if (block.href) tag.href = block.href;
			if (block.title) tag.title = block.title;
			if (block.class) tag.classList.add(block.class);
			addTextWithLinks(block.text, tag);
			parent.appendChild(tag);
		} else {
			addTextWithLinks(block.text, parent);
		}
	}
}

function createGroupTag(group, groupsTable, parentGroupMap) {
		const newRow = groupsTable.insertRow(-1);
		const th = document.createElement('th');
		th.appendChild(document.createTextNode(group));
		newRow.appendChild(th);

		const groupsCell = newRow.insertCell(1);
		groupsCell.id = group;

		const subGroupsCell = newRow.insertCell(-1);

		const parentCell = newRow.insertCell(-1);
		parentCell.classList.add("parent");
		if (parentGroupMap) {
			const parentGroup = parentGroupMap.get(group);
			if (parentGroup) addTextWithLinks("#" + parentGroup, parentCell);
		}

		return newRow;
}

function parseMap(map, groupsTable, parentGroupMap, groupAliasMap) {
	map.forEach((value, key, map) => {
		const parentTable = document.getElementById(key.charAt(0).toUpperCase());
		const newRow = parentTable.insertRow(-1);
		const th = document.createElement('th');
		th.id = key;
		if (value.classes) {
			if (Array.isArray(value.classes[0]))
				value.classes[0].forEach(css => {th.classList.add(css)})
			else
				th.classList.add(value.classes[0]);
		}
		if (value.th) {
			th.appendChild(document.createTextNode(value.th));
		}
		newRow.appendChild(th);

		let i = 1;
		let descriptionCell = newRow.insertCell(i++);
		if (value.html) {
			addHtmlBlock(value.html, descriptionCell);
		} else {
			addTextWithLinks(value.title, descriptionCell);
		}

		// Groups
		const groupsCell = newRow.insertCell(i++);
		Array.from(value.groups).forEach( group => {
			if (!group) return;
			let confirmedGroupId = group;
			if (groupAliasMap && groupAliasMap.get(group)) {
				confirmedGroupId = groupAliasMap.get(group);
			}

			const groupLink = createHrefLink(confirmedGroupId, confirmedGroupId);
			groupsCell.appendChild(groupLink);
			groupsCell.appendChild(document.createTextNode(" "));

			let groupTag = document.getElementById(confirmedGroupId);
			if (!groupTag) {
				const groupRow = createGroupTag(confirmedGroupId, groupsTable, parentGroupMap);
				groupTag = groupRow.cells[1];
			}
			if (groupTag.innerHTML.indexOf("href=\"#" + th.id + "\"") < 0) {
				groupTag.appendChild(document.createTextNode(" "));
				groupTag.appendChild(createHrefLink(th.id, th.innerHTML ? th.innerHTML : th.id));
			}
		});

		//Notes
		const notesCell = newRow.insertCell(i++);
		if (value.notes) {
			if (Array.isArray(value.notes)) {
				addHtmlBlock(value.notes, notesCell);
			} else {
				addTextWithLinks(value.notes, notesCell);
			}
		}

		// Svg Icon
		const svgCell = newRow.insertCell(i++);
		if (value.svg) {
			const img = document.createElement("img");
			img.src = "svg/" + value.svg + ".svg";
			img.classList.add("svg-logo");
			img.alt = value.svg;
			svgCell.appendChild(img);
		}

	});
}

function parseGroupMap(groupMap, groupsTable, parentGroupMap, aliasMap) {
		groupMap.forEach((value, key, map) => {
			const newRow = createGroupTag(key,groupsTable, parentGroupMap)

			addTextWithLinks(value.text, newRow.cells[1]);

			if (value.subGroups) {
				value.subGroups.forEach(subGroup => {
					parentGroupMap.set(subGroup, key);
					const subGroupsCell = newRow.cells[2];
					addTextWithLinks("#" + subGroup, subGroupsCell);
				});
			}

			if (aliasMap) {
				if (value.aliases) {
					value.aliases.forEach( alias => {
						aliasMap.set(alias, key);
					});
				}
			}
		});
}

function addContentTables(contentTag, th1, withNumbers) {
	if (withNumbers)
		for (let i = 0x30; i <= 0x39; i++) {
			addContentTable(i, th1);
		}

	for (let i = 65; i <= 90; i++) {
		addContentTable(i, th1);
	}
}

function addContentTable(symbolCode, th1) {
		const letter = String.fromCharCode(symbolCode);
		const details = document.createElement("details");
		details.setAttribute("open", "open");

		const summary = document.createElement("summary");
		summary.className = "b";
		summary.appendChild(document.createTextNode(letter));
		details.appendChild(summary);

		const table = document.createElement("table");
		table.id = letter;
		table.className = "collapse-border padding sorted";
		details.appendChild(table);

		const thsTextArray = [th1, "Transcript", "Groups", "Notes", "Icon"];
		const newRow = table.insertRow(-1);
		newRow.classList.add("table-head");
		thsTextArray.forEach( thText => {
			const th = document.createElement('th');
			th.appendChild(document.createTextNode(thText));
			th.classList.add("dim-grey");
			newRow.appendChild(th);
		});

		const indentDiv = document.createElement("div");
		indentDiv.className = "indent";
		details.appendChild(indentDiv);

		contentTag.appendChild(details);
}

function hideEmptyContent() {
	const details = document.getElementsByTagName("details");
	Array.from(details).forEach( detail => {
		const tables = detail.getElementsByTagName("table");
		if (tables.length > 0) {
			if (tables[0].rows.length < 2) {
				detail.classList.add("display-none");
			}
		}
	});
}
