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
	sets_crud_btns_title ("équipement", window.srv_eq_crud); make_request ("/eq-availables", "GET", new Object ({}), server => {
		// Loading availables equipments.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Contains the filtered buy date.
			let date = element.buy_date.split ('-'); date = [parseInt (date [2]), parseInt (date [1]), parseInt (date [0])];
			// Draws all logged equipments.
			draw_equipment (new Object ({
				Model: element.model, ID: element._id, "Adresse du fournisseur": element.provider.address,
				"Caractères technique": element.description, "Date d'achat": parse_date (date [0], date [1], date [2]),
				"Etat d'achat": element.buy_state, "Etat d'utilisation": element.using_state,
				Fournisseur: (element.provider.surname + ' ' + element.provider.name.toUpperCase ()),
				Marque: element.marque, Prix: (parse_float (element.price, 2) + " XOF"),
				"Référence": ((typeof element.reference === "string") ? element.reference : null),
				"Téléphone du fournisseur": get_better_phone_display (element.provider.phone_number, "+229"), disabled: ["Model", "ID"]
			}), window.srv_eq_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.srv_eq_crud); greet_user ();
	// Removes this script.
	}); $ ("script").remove ();
});
