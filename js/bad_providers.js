// Attributes.
window.bad_prd_crud = new CrudView ("div.bad-providers", window.prv_keys, "bad-prv");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on refresh button.
	$ (window.bad_prd_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_bad_providers ();});
	// Disables add button usage and overrides the current crud buttons title.
	$ (window.bad_prd_crud.get_add_button_id ()).remove (); sets_crud_btns_title ("fournisseur", window.bad_prd_crud);
	// Changes the crud view content css.
	$ (window.bad_prd_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Loading all bads providers from the database.
	make_request ("/bads-providers", "GET", new Object ({}), server => {
		// Loading bads providers.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Draws all bads providers.
			draw_provider (new Object ({ID: element._id, Nom: element.name, "Prénom(s)": element.surname,
				Adresse: element.address, "Nombre de problèmes": element.problem_count,
				"Numéro de téléphone": get_better_phone_display (element.phone_number, "+229"), disabled: ["ID", "Nom", "Prénom(s)"]
			}), window.bad_prd_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.bad_prd_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
