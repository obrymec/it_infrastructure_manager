// Attributes.
window.exp_svc_crud = new CrudView ("div.expired-services", window.svc_keys, "exp-svc");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button.
	$ (window.exp_svc_crud.get_add_button_id ()).click (() => generic_task ("add-service", "Enregistrement d'un service"));
	// Fixing "click" event on refresh button.
	$ (window.exp_svc_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_expired_services ();});
	// Changes the crud view content css.
	$ (window.exp_svc_crud.get_content_id ()).css ("padding", "25px 25px 25px 25px").css ("gap", "25px");
	// Overrides the current crud buttons title.
	sets_crud_btns_title ("service", window.exp_svc_crud); make_request ("/svc-expired", "GET", new Object ({}), server => {
		// Loading expired service.
		window.DELAY = 0; if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Contains the filtered assign and expired date.
			let adate = element.assign_date.split ('-'); let edate = element.expired_date.split ('-');
			// Draws all expired services.
			draw_service (new Object ({ID: element._id, Prestataire: element.service_provider, "Adresse du prestataire": element.address,
				"Date d'affectation": parse_date (parseInt (adate [2]), parseInt (adate [1]), parseInt (adate [0])),
				"Date d'expiration": parse_date (parseInt (edate [2]), parseInt (edate [1]), parseInt (edate [0])),
				Equipement: (element.model + " - " + element.marque), Marque: element.marque, Model: element.model,
				"Référence": ((typeof element.reference === "string") ? element.reference : null), Type: element.type,
				disabled: ["Prestataire", "ID", "Model", "Marque"]
			}), window.exp_svc_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.exp_svc_crud);
	// Removes this script.
	}); $ ("script").remove ();
});
