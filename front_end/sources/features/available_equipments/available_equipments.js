/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Loads registered equipments from database.
* @author Obrymec - obrymecsprinces@gmail.com
* @file available_equipments.js
* @created 2021-12-17
* @updated 2024-05-19
* @supported DESKTOP
* @version 0.0.2
*/

// Attributes.
window.srv_eq_crud = new CrudView ("div.availables-equipments", window.eq_keys, "avb-eq");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button and after, greet the logged user.
	$ (window.srv_eq_crud.get_add_button_id ()).click (() => add_equipment ());
	// Fixing "click" event on refresh button.
	$ (window.srv_eq_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_availables_equipments ();});
	// Changes the crud view content css.
	$ (window.srv_eq_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Overrides the current crud buttons title.
	sets_crud_btns_title ("equipment", window.srv_eq_crud); make_request ("/eq-availables", "GET", new Object ({}), server => {
		// Loading availables equipments.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Contains the filtered buy date.
			let date = element.buy_date.split ('-'); date = [parseInt (date [2]), parseInt (date [1]), parseInt (date [0])];
			// Draws all logged equipments.
			draw_equipment (new Object ({
				Model: element.model, ID: element._id, "Provider address": element.provider.address,
				"Technical characters": element.description, "Purchase date": parse_date (date [0], date [1], date [2]),
				"Purchase status": element.buy_state, "Usage status": element.using_state,
				Provider: (element.provider.surname + ' ' + element.provider.name.toUpperCase ()),
				Brand: element.brand, Price: (parse_float (element.price, 2) + " XOF"),
				Reference: ((typeof element.reference === "string") ? element.reference : null),
				"Provider phone": get_better_phone_display (element.provider.phone_number, "+229"), disabled: ["Model", "ID"]
			}), window.srv_eq_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.srv_eq_crud); greet_user ();
	// Removes this script.
	}); $ ("script").remove ();
});
