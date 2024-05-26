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

		let searchbar = document.createElement("input");
		searchbar.className = "searchbar";
		searchbar.placeholder = "enter here ...";
		searchbar.id = "search";
		searchbar.type = "text";

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

			let searchbar = document.createElement("input");
			searchbar.className = "searchbar";
			searchbar.placeholder = "enter here ...";
			searchbar.id = "search";
			searchbar.type = "text";

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
	let col = document.getElementById("product_item_list");
	col.innerHTML = "";

	// fetches the beverage with the search
	fetch("/get_search")
	.then((res) => res.json())
	.then((json) => {
		drawChart(json);
		
		Object.keys(json).forEach((key) => {
			data = json[key];
			console.log(data.product_name + " : " + data.company_name + " : " +data.timestamp);
			let row_item = document.createElement("div");
			row_item.className = "bottom_row_item";

			let logo = document.createElement("img");
			logo.className = "bottom_row_logo";
			logo.src = data.company_name.toLowerCase()+".png";

			let product_name = document.createElement("div");
			product_name.className = "bottom_row_product_name";
			let textnode = document.createTextNode(data.product_name);
			product_name.appendChild(textnode);

			let packaging_type = document.createElement("div");
			packaging_type.className = "bottom_row_packaging_type";
			let textnode2 = document.createTextNode(data.packaging_type);
			packaging_type.appendChild(textnode2);

			let price_per_liter = document.createElement("div");
			price_per_liter.className = "bottom_row_price_per_liter";
			let textnode3 = document.createTextNode(data.price_per_liter + "€");
			price_per_liter.appendChild(textnode3);

			row_item.appendChild(logo);
			row_item.appendChild(product_name);
			row_item.appendChild(packaging_type);
			row_item.appendChild(price_per_liter);
			col.appendChild(row_item);
		});
	});
}

google.charts.load('current', {'packages':['bar']});
function drawChart(product_data) {

	let chart_data = [["company", "price"]];
	Object.keys(product_data).forEach((key) => {
		let row = product_data[key];
		chart_data.push([row.company_name, row.price_per_liter]);
	});
	console.log(chart_data);
        var data = google.visualization.arrayToDataTable(chart_data);

        var options = {
	chart: {
		backgroundColor: "transparent",
	},
	vAxis : { 
		gridlines: { count: 0 },
		textStyle : {
			fontSize: 20 // or the number you want
		}
	},
	hAxis : { 
		gridlines: { count: 0 },
		title: "",
		textStyle : {
			fontSize: 20 // or the number you want
		}
	},
	chartArea: {
		backgroundColor: {
			fill: "transparent"
		},
	},
	backgroundColor: {
		fill: "transparent"
	},
	legend: {position: "none"},
	colors: ["#201d31"],
	bars: 'vertical' // Required for Material Bar Charts.
        };

        var chart = new google.charts.Bar(document.getElementById("myChart"));

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }

// standard homepage only shows three products at a time
get_products(3);
