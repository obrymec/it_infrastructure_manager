// Attributes.
window.usg_eq_crud = new CrudView ("div.service-equipments", window.eq_keys, "usg-eq");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button and overrides the current crud buttons title.
	$ (window.usg_eq_crud.get_add_button_id ()).click (() => add_equipment ()); sets_crud_btns_title ("équipement", window.usg_eq_crud);
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
			draw_equipment (new Object ({Model: element.model, ID: element._id, "Adresse du fournisseur": element.provider.address,
				"Adresse de l'utilisateur": element.affected_user.address, "Caractères technique": element.description,
				"Date d'achat": parse_date (bdate [0], bdate [1], bdate [2]),
				"Etat d'achat": element.buy_state, "Etat d'utilisation": element.using_state,
				Fournisseur: (element.provider.surname + ' ' + element.provider.name.toUpperCase ()),
				Marque: element.marque, Prix: (parse_float (element.price, 2) + " XOF"),
				"Référence": ((typeof element.reference === "string") ? element.reference : null),
				"Téléphone du fournisseur": get_better_phone_display (element.provider.phone_number, "+229"),
				"Utilisateur actuel": (element.affected_user.surname + ' ' + element.affected_user.name.toUpperCase ()),
				disabled: ["Model", "ID"]
			}), window.usg_eq_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.usg_eq_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
