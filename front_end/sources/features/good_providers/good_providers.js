/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Loads good providers from database.
* @author Obrymec - obrymecsprinces@gmail.com
* @file good_providers.js
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @version 0.0.2
*/

// Attributes.
window.god_prd_crud = new CrudView ("div.good-providers", window.prv_keys, "god-prv");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on refresh button.
	$ (window.god_prd_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_good_providers ();});
	// Disables add button usage and overrides the current crud buttons title.
	$ (window.god_prd_crud.get_add_button_id ()).remove (); sets_crud_btns_title ("provider", window.god_prd_crud);
	// Changes the crud view content css.
	$ (window.god_prd_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Loading all goods providers from the database.
	make_request ("/goods-providers", "GET", new Object ({}), server => {
		// Loading goods providers.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Draws all goods providers.
			draw_provider (new Object ({ID: element._id, Name: element.name, "Surname(s)": element.surname,
				Address: element.address, "Number of problems": element.problem_count,
				"Phone number": get_better_phone_display (element.phone_number, "+229"), disabled: ["ID", "Name", "Surname(s)"]
			}), window.god_prd_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.god_prd_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
