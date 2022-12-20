// Attributes.
window.avb_usr_crud = new CrudView ("div.availables-users", window.usrs_keys, "avb-usr");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button.
	$ (window.avb_usr_crud.get_add_button_id ()).click (() => generic_task ("add-user", "Inscription d'un utilisateur"));
	// Fixing "click" event on refresh button.
	$ (window.avb_usr_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_availables_users ();});
	// Changes the crud view content css.
	$ (window.avb_usr_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Overrides the current crud buttons title.
	sets_crud_btns_title ("utilisateur", window.avb_usr_crud); make_request ("/users-availables", "GET", new Object ({}), server => {
		// Loading availables users.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Draws all logged users.
			draw_user (new Object ({ID: element._id, Nom: element.name.toUpperCase (), "Prénom(s)": str_capitalize (element.surname),
				Adresse: element.address, disabled: ["ID"]
			}), window.avb_usr_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.avb_usr_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
