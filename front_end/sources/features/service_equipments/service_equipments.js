/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Loads all applied services to an equipment.
* @author Obrymec - obrymecsprinces@gmail.com
* @file service_equipments.js
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @version 0.0.2
*/

// Attributes.
window.usg_eq_crud = new CrudView ("div.service-equipments", window.eq_keys, "usg-eq");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button and overrides the current crud buttons title.
	$ (window.usg_eq_crud.get_add_button_id ()).click (() => add_equipment ()); sets_crud_btns_title ("equipment", window.usg_eq_crud);
	// Fixing "click" event on refresh button.
	$ (window.usg_eq_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_service_equipments ();});
	// Changes the crud view content css.
	$ (window.usg_eq_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Loads service equipments equipments.
	make_request ("/eq-service", "GET", new Object ({}), server => {
		// Loading service equipments.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Contains the filtered buy date.
			let bdate = element.buy_date.split ('-'); bdate = [parseInt (bdate [2]), parseInt (bdate [1]), parseInt (bdate [0])];
			// Draws all logged using equipments.
			draw_equipment (new Object ({Model: element.model, ID: element._id, "Provider address": element.provider.address,
				"User address": element.affected_user.address, "Technical characters": element.description,
				"Purchase date": parse_date (bdate [0], bdate [1], bdate [2]),
				"Purchase status": element.buy_state, "Usage status": element.using_state,
				Provider: (element.provider.surname + ' ' + element.provider.name.toUpperCase ()),
				Brand: element.brand, Price: (parse_float (element.price, 2) + " XOF"),
				Reference: ((typeof element.reference === "string") ? element.reference : null),
				"Provider phone": get_better_phone_display (element.provider.phone_number, "+229"),
				"Current user": (element.affected_user.surname + ' ' + element.affected_user.name.toUpperCase ()),
				disabled: ["Model", "ID"]
			}), window.usg_eq_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.usg_eq_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
