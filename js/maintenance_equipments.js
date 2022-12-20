// Attributes.
window.mtn_eq_crud = new CrudView ("div.maintenance-equipments", window.eq_keys, "mtn-eq");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button and overrides the current crud buttons title.
	$ (window.mtn_eq_crud.get_add_button_id ()).click (() => add_equipment ()); sets_crud_btns_title ("équipement", window.mtn_eq_crud);
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
				Model: element.model, ID: element._id, "Adresse du fournisseur": element.provider.address,
				"Caractères technique": element.description, "Date d'achat": parse_date (bdate [0], bdate [1], bdate [2]),
				"Date du problème": parse_date (pdate [0], pdate [1], pdate [2]),
				"Description du problème": element.problem.description,
				"Etat d'achat": element.buy_state, "Etat d'utilisation": element.using_state,
				Fournisseur: (element.provider.surname + ' ' + element.provider.name.toUpperCase ()),
				Marque: element.marque, Prix: (parse_float (element.price, 2) + " XOF"),
				"Référence": ((typeof element.reference === "string") ? element.reference : null),
				"Téléphone du fournisseur": get_better_phone_display (element.provider.phone_number, "+229"),
				disabled: ["Model", "ID"]
			}), window.mtn_eq_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.mtn_eq_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
