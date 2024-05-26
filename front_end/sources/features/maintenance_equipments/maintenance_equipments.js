/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Loads equipment in maintenance.
* @author Obrymec - obrymecsprinces@gmail.com
* @file maintenance_equipment.js
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @version 0.0.2
*/

// Attributes.
window.mtn_eq_crud = new CrudView ("div.maintenance-equipments", window.eq_keys, "mtn-eq");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button and overrides the current crud buttons title.
	$ (window.mtn_eq_crud.get_add_button_id ()).click (() => add_equipment ()); sets_crud_btns_title ("equipment", window.mtn_eq_crud);
	// Fixing "click" event on refresh button.
	$ (window.mtn_eq_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_bug_equipments ();});
	// Changes the crud view content css.
	$ (window.mtn_eq_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Loads maintenance equipments.
	make_request ("/eq-maintenance", "GET", new Object ({}), server => {
		// Loading maintenance equipments.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Contains the filtered buy date.
			let bdate = element.buy_date.split ('-'); bdate = [parseInt (bdate [2]), parseInt (bdate [1]), parseInt (bdate [0])];
			// Contains the filtered problem date.
			let pdate = element.problem.date.split ('-'); pdate = [parseInt (pdate [2]), parseInt (pdate [1]), parseInt (pdate [0])];
			// Draws all logged maintenance equipments.
			draw_equipment (new Object ({
				Model: element.model, ID: element._id, "Provider address": element.provider.address,
				"Technical characters": element.description, "Purchase date": parse_date (bdate [0], bdate [1], bdate [2]),
				"Problem date": parse_date (pdate [0], pdate [1], pdate [2]),
				"Problem description": element.problem.description,
				"Purchase status": element.buy_state, "Usage status": element.using_state,
				Provider: (element.provider.surname + ' ' + element.provider.name.toUpperCase ()),
				Brand: element.brand, Price: (parse_float (element.price, 2) + " XOF"),
				Reference: ((typeof element.reference === "string") ? element.reference : null),
				"Provider phone": get_better_phone_display (element.provider.phone_number, "+229"),
				disabled: ["Model", "ID"]
			}), window.mtn_eq_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.mtn_eq_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
