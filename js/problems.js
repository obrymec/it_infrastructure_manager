/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Loads registered problems about equipments.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @file problems.js
* @version 0.0.2
*/

// Attributes.
window.bgs_crud = new CrudView ("div.problems-manager", ["Date", "Description", "Equipment", "ID"], "bgs-crud");

// Draws a bug data.
function draw_bug (item, toolbar, index, length) {
	// The passed elements is it an object ?
	if (typeof item === "object" && toolbar instanceof CrudView) {
		// Creating a new data card.
		let bscard = new DataCard (toolbar.get_content_id (), new Object ({}), item.ID); bscard.set_index (index + 1);
		// Sets data card icon.
		bscard.set_icon ("<svg viewBox = '0 0 512 512' width = '80px' height = '80px' fill = 'grey'>\
       		<path d = 'M480 256h-64V205.3l54.63-54.63c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0L370.8 160h-229.5L86.63 \
       		105.4c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L96 205.3V256H32C14.31 256 0 270.3 0 288s14.31 32 32 32h64v32c0 \
       		15.11 3.088 29.4 7.895 42.86l-62.52 62.52c-12.5 12.5-12.5 \
       		32.75 0 45.25C47.63 508.9 55.81 512 64 512s16.38-3.125 22.62-9.375l54.13-54.13C163.2 \
       		467.9 192 480 224 480h16.1V239.9C240.1 231.2 247.2 224 256 224S272 \
       		231.2 272 239.9V480H288c31.96 0 60.82-12.13 83.25-31.5l54.13 54.13C431.6 \
       		508.9 439.8 512 448 512s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 \
       		0-45.25l-62.52-62.52C412.9 381.4 416 367.1 416 352v-32h64c17.69 0 \
       		32-14.33 32-32S497.7 256 480 256zM352 96c0-53.02-42.98-96-96-96S160 42.98 160 96v32h192V96z'/>\
       	</svg>"); bscard.set_radius (5, 0, 0, 5); bscard.override_data (item);
		// Overrides arrows action.
		window.bgs_crud.override_up_down_action (length, index, bscard);
		// Changes the default size of the created card.
		$ (bscard.get_id ()).css ("border", "1px solid silver").css ("box-shadow", "none").hover (function () {
			$ (this).css ("background-image", "linear-gradient(rgb(203, 226, 243), #fff, rgb(203, 226, 243)")
			.css ("box-shadow", "0 0 8px gray");
		}, function () {$ (this).css ("background-image", "none").css ("box-shadow", "0 0 0 transparent");});
		// Overrides data card options.
		bscard.override_options ([{text: "Solve", title: "I found a solution to this problem.",
			click: () => commum_task ("add-solve", "Repair of equipment", bscard, true, toolbar)
		// Shows the card.
		}]); window.setTimeout (() => bscard.visibility (true), window.DELAY); window.DELAY += 150;
		// Contains all data that will be shown.
		toolbar.get_data ().push (_.extend (bscard.get_data (), new Object ({ID: bscard.get_id (), ref: bscard})));
	}
}

// Loads all availables problems data from the database.
function load_bugs_data () {
	// Empty the crud content.
	$ (window.bgs_crud.get_content_id () + " > div.data-card").remove (); $ (window.bgs_crud.get_input_id ()).val ('');
	// Changes the crud view content css.
	$ (window.bgs_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Empty the crud data by clearing it.
	window.bgs_crud.get_data ().length = 0; $ (window.bgs_crud.get_item_count_id ()).text ('0');
	// Loading all availables bugs from the database.
	make_request ("/pb-availables", "GET", new Object ({}), server => {
		// Loading bugs on the it manager.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Contains the filtered problem date.
			let pdate = element.date.split ('-');
			// Draws all availables bugs.
			draw_bug (new Object ({ID: element._id, Brand: element.brand, Model: element.model,
				Date: parse_date (parseInt (pdate [2]), parseInt (pdate [1]), parseInt (pdate [0])),
				Description: element.description, Equipment: (element.model + " - " + element.brand),
				disabled: ["ID", "Model", "Brand"]
			}), window.bgs_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.bgs_crud);
	});
}

// Called when this web page is fulled loaded.
$ (() => {
	// Changes the dashboard text title and overrides the current crud buttons title.
	animate_text (__ ("div.big-title > label"), "Problems", 35); sets_crud_btns_title ("problem", window.bgs_crud);
	// Fixing "click" event on crud add button.
	$ (window.bgs_crud.get_add_button_id ()).click (() => generic_task ("add-bug", "Reporting a problem", () => {
		// Loads all availables equipments.
		make_request ("/eq-service", "GET", new Object ({}), server => {
			// Contains all options that will be shown.
			let options = []; server.data = (!Array.isArray (server.data) ? [server.data] : server.data);
			// Generating all loaded options.
			for (let opt of server.data) options.push ({left: opt.model, right: opt.brand, id: opt._id});
			// Overrides dropdown options.
			override_dropdown_options ("div.dropdown > select", options);
		});
	// Fixing "click" event on refresh button and loads all bugs data from the database.
	})); $ (window.bgs_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_bugs_data ();}); load_bugs_data ();
	// Instanciates draw bug function.
	window.draw_bug = draw_bug; $ ("script").remove ();
});
