/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Loads users that are an equipment.
* @author Obrymec - obrymecsprinces@gmail.com
* @file affected_users.js
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @version 0.0.2
*/

// Attributes.
window.afd_usr_crud = new CrudView ("div.affected-users", window.usrs_keys, "afd-usr");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button.
	$ (window.afd_usr_crud.get_add_button_id ()).click (() => generic_task ("add-user", "Registering a user"));
	// Fixing "click" event on refresh button.
	$ (window.afd_usr_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_affected_users ();});
	// Changes the crud view content css.
	$ (window.afd_usr_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Overrides the current crud buttons title.
	sets_crud_btns_title ("user", window.afd_usr_crud); make_request ("/users-affected", "GET", new Object ({}), server => {
		// Loading affected users.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Contains the filtered assign and expired date.
			let adate = element.assign_date.split ('-'); let edate = element.expired_date.split ('-');
			// Draws all affected users.
			draw_user (new Object ({ID: element._id, Name: element.name.toUpperCase (), "Surname(s)": str_capitalize (element.surname),
				Brand: element.brand, Model: element.model, Address: element.address,
				"Assignment date": parse_date (parseInt (adate [2]), parseInt (adate [1]), parseInt (adate [0])),
				"End date": parse_date (parseInt (edate [2]), parseInt (edate [1]), parseInt (edate [0])),
				"Equipment": (element.model + " - " + element.brand), disabled: ["ID", "Brand", "Model", "Name", "Surname(s)"]
			}), window.afd_usr_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.afd_usr_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
