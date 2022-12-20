// Attributes.
window.svc_slt_crud = new CrudView ("div.service-select", ["Référence", "Type", "Prestataire", "Adresse du prestataire", "ID"], "svc-slt");

// Draws all availables data from an array of objects.
function draw_svc_slt_data (item, index, length) {
	// The passed elements is it an object ?
	if (typeof item === "object") {
		// Creating a new data card.
		let scard = new DataCard (svc_slt_crud.get_content_id (), new Object ({}), item.ID);
		// Sets data card icon.
		scard.set_icon ("<svg viewBox = '0 0 496 512' width = '140px' height = '140px' fill = 'grey'>\
       		<path d = 'M88 216c81.7 10.2 273.7 102.3 304 232H0c99.5-8.1 184.5-137 88-232zm32-152c32.3 35.6 47.7 83.9 46.4 133.6C249.3 \
       		231.3 373.7 321.3 400 448h96C455.3 231.9 222.8 79.5 120 64z'/>\
       	</svg>");
		// Overrides arrows action.
		window.svc_slt_crud.override_up_down_action (length, index, scard);
		// Changes the default size of the created card.
		$ (scard.get_id ()).css ("border-bottom", "1px solid silver").css ("cursor", "pointer").css ("box-shadow", "none")
			.hover (function () {$ (this).css ("background-color", "rgb(158, 205, 243)");},
			function () {$ (this).css ("background-color", "#fff");});
		// Fix "click" event on this current card to opens a widget popup about service affectation.
		scard.override_data (item); scard.click (() => {
			// Binds data and runs commun tasks.
			window.elmt_slt = _.extend (scard.get_data (), {ref: "service"}); commum_task ("assignment", "Affectation d'un service");
		// Shows the card and then increases the current delay.
		}); window.setTimeout (() => scard.visibility (true), window.DELAY); window.DELAY += 150;
		// Contains all data that will be shown.
		window.svc_slt_crud.get_data ().push (_.extend (scard.get_data (), new Object ({ID: scard.get_id (), ref: scard})));
	}
}

// Loads services data from the data base.
function load_services_data () {
	// Empty the crud content.
	$ (window.svc_slt_crud.get_content_id () + " > div.data-card").remove (); $ (window.svc_slt_crud.get_input_id ()).val ('');
	// Empty the crud data by clearing it.
	window.svc_slt_crud.get_data ().length = 0; $ (window.svc_slt_crud.get_item_count_id ()).text ('0');
	// Loading availables services.
	make_request ("/svc-availables", "POST", new Object ({eq_id: window.selected_equipment.get_id ().replace ("div#cd-", '')}), server => {
		// Loading availables services.
		window.DELAY = 0; server.data.forEach ((element, index) => {
			// Draws all logged services.
			draw_svc_slt_data (new Object ({ID: element._id, "Adresse du prestataire": element.address, Prestataire: element.provider,
				"Référence": ((typeof element.reference === "string") ? element.reference : null), Type: element.type, disabled: ["ID"]
			}), index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.svc_slt_crud);
	});
}

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button.
	$ (window.svc_slt_crud.get_add_button_id ()).click (() => generic_task ("add-service", "Enregistrer un service"));
	// Fixing "click" event on crud refresh button.
	$ (window.svc_slt_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_services_data ();});
	// Overrides the current crud buttons title and loads all availables services from the data base.
	sets_crud_btns_title ("service", window.svc_slt_crud); load_services_data (); window.draw_svc_slt_data = draw_svc_slt_data;
	// Removes this script.
	$ ("script").remove ();
});
