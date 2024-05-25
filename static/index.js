let toprow = document.getElementsByClassName("toprow");
function pressed(id) {
	change_center_product(id);
}
function change_center_product(id){
	let container = toprow[0];
	let children = Array.from(container.children);
	let middleIndex = 1;
	let middleElement = children[middleIndex];
	let clickedElement = document.getElementById(id);
	let index = children.indexOf(clickedElement)
	if (index !== middleIndex) {
		let clickedElement = children[index];

		let oldsearchbarrow = document.getElementsByClassName("searchbarrow");
		middleElement.removeChild(oldsearchbarrow[0]);
		// Create a reference for the next sibling of the clicked element
		let clickedNextSibling = clickedElement.nextElementSibling;

		// Remove the clicked element from its position
		container.removeChild(clickedElement);

		// Insert the middle element at the position of the clicked element
		container.insertBefore(middleElement, clickedNextSibling);

		// Insert the clicked element at the middle position
		if (index == 0){
			container.insertBefore(clickedElement, children[2]);
		} else {
			container.insertBefore(clickedElement, children[middleIndex]);
		}

		// Ensure the container structure is correct
		container.insertBefore(container.children[middleIndex], container.children[index > middleIndex ? index :index + 1]);

		let searchbarrow = document.createElement("div");
		searchbarrow.className = "searchbarrow";

		let searchbar = document.createElement("div");
		searchbar.className = "searchbar";
		let textnode = document.createTextNode("enter ...");
		searchbar.appendChild(textnode);

		let searchfilter = document.createElement("div");
		searchfilter.className = "searchfilter";
		searchfilter.onclick = get_search;
		let textnode2 = document.createTextNode("search");
		searchfilter.appendChild(textnode2);

		searchbarrow.appendChild(searchbar);
		searchbarrow.appendChild(searchfilter);
		
		clickedElement.appendChild(searchbarrow);
	}
}

function get_products(amount){
	fetch("/get_product_types")
	.then((res) => res.json())
	.then((json) => {
		Object.keys(json).forEach((key) => {
			if (key == 0){
				toprow[0].innerHTML = "";
			}
			data = json[key];
			let centercard = document.createElement("div");
			centercard.className = "centercard";

			let centertop = document.createElement("div");
			centertop.className = "centertop";
			centertop.value = data.name;
			centercard.id = key;
			centercard.onclick = function(){
				pressed(this.id);
			};

			let maincardtitle = document.createElement("div");
			maincardtitle.className = "maincardtitle";
			maincardtitle.style = "color: " + data.color + ";";
			let textnode = document.createTextNode(data.name);
			maincardtitle.appendChild(textnode);
			centertop.appendChild(maincardtitle);
			centercard.appendChild(centertop);

			if (key == 1){
			let searchbarrow = document.createElement("div");
			searchbarrow.className = "searchbarrow";

			let searchbar = document.createElement("div");
			searchbar.className = "searchbar";
			let textnode = document.createTextNode("enter ...");
			searchbar.appendChild(textnode);

			let searchfilter = document.createElement("div");
			searchfilter.className = "searchfilter";
			searchfilter.onclick = get_search;
			let textnode2 = document.createTextNode("search");
			searchfilter.appendChild(textnode2);

			searchbarrow.appendChild(searchbar);
			searchbarrow.appendChild(searchfilter);
			centercard.appendChild(searchbarrow);
			}


			toprow[0].appendChild(centercard);
		});
	})
}

function get_search(){
	// fetches the beverage with the search
	fetch("/get_search")
	.then((res) => res.json())
	.then((json) => {
		Object.keys(json).forEach((key) => {
			data = json[key];
			console.log(data.product_name);
		});
	});
}

// standard homepage only shows three products at a time
get_products(3);

