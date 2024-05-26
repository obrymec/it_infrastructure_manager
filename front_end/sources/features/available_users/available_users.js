/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Loads registered users from database.
* @author Obrymec - obrymecsprinces@gmail.com
* @file available_users.js
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @version 0.0.2
*/

// Attributes.
window.avb_usr_crud = new CrudView ("div.availables-users", window.usrs_keys, "avb-usr");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button.
	$ (window.avb_usr_crud.get_add_button_id ()).click (() => generic_task ("add-user", "Registering a user"));
	// Fixing "click" event on refresh button.
	$ (window.avb_usr_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_availables_users ();});
	// Changes the crud view content css.
	$ (window.avb_usr_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Overrides the current crud buttons title.
	sets_crud_btns_title ("user", window.avb_usr_crud); make_request ("/users-availables", "GET", new Object ({}), server => {
		// Loading availables users.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Draws all logged users.
			draw_user (new Object ({ID: element._id, Name: element.name.toUpperCase (), "Surname(s)": str_capitalize (element.surname),
				Address: element.address, disabled: ["ID"]
			}), window.avb_usr_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.avb_usr_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
