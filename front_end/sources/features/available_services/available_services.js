/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Loads registered services from database.
* @author Obrymec - obrymecsprinces@gmail.com
* @file available_services.js
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @version 0.0.2
*/

// Attributes.
window.avb_svc_crud = new CrudView ("div.availables-services", window.svc_keys, "avb-svc");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button.
	$ (window.avb_svc_crud.get_add_button_id ()).click (() => generic_task ("add-service", "Registering a service"));
	// Fixing "click" event on refresh button.
	$ (window.avb_svc_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_availables_services ();});
	// Changes the crud view content css.
	$ (window.avb_svc_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Overrides the current crud buttons title.
	sets_crud_btns_title ("service", window.avb_svc_crud); make_request ("/svc-availables", "GET", new Object ({}), server => {
		// Loading availables services.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Draws all logged services.
			draw_service (new Object ({
				ID: element._id, Provider: element.provider, "Provider address": element.address,
				Reference: ((typeof element.reference === "string") ? element.reference : null),
				Type: element.type, disabled: ["Provider", "ID"]
			}), window.avb_svc_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.avb_svc_crud); greet_user ();
	// Removes this script.
	}); $ ("script").remove ();
});
