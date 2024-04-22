/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Loads available services from database.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @file services.js
* @version 0.0.2
*/

// Attributes.
window.svc_keys = ["Reference", "ID", "Expiration date", "Type", "Provider", "Provider address", "Equipment", "Assignment date"];
window.svc_tc = new TabControl ("div.services-manager", "svc-tabctrl");
window.svc_sec_idx = get_cookie ("it_svc_tab_sec");
window.svc_sec_idx = parseInt (!is_empty (window.svc_sec_idx) ? window.svc_sec_idx : 0);

// Draws a service data.
function draw_service (item, toolbar, index, length) {
	// The passed elements is it an object ?
	if (typeof item === "object" && toolbar instanceof CrudView) {
		// Creating a new data card.
		let scard = new DataCard (toolbar.get_content_id (), new Object ({}), (item.ID + '-' + index)); scard.set_index (index + 1);
		// Sets data card icon.
		scard.set_icon ("<svg viewBox = '0 0 496 512' width = '140px' height = '140px' fill = 'grey'>\
       		<path d = 'M88 216c81.7 10.2 273.7 102.3 304 232H0c99.5-8.1 184.5-137 88-232zm32-152c32.3 35.6 47.7 83.9 46.4 133.6C249.3 \
       		231.3 373.7 321.3 400 448h96C455.3 231.9 222.8 79.5 120 64z'/>\
         </svg>"); scard.set_radius (0, 0, 5, 5); scard.override_data (item);
		// Overrides arrows action.
		toolbar.override_up_down_action (length, index, scard); scard.set_title (item.Provider);
		// Changes the default size of the created card.
		$ (scard.get_id ()).css ("border", "1px solid silver").css ("box-shadow", "none").hover (function () {
			$ (this).css ("background-image", "linear-gradient(rgb(203, 226, 243), #fff, rgb(203, 226, 243)")
				.css ("box-shadow", "0 0 8px gray");
		}, function () {$ (this).css ("background-image", "none").css ("box-shadow", "0 0 0 transparent");});
		// For availables services.
		if (window.svc_tc.get_active_section () === 0) scard.override_options ([{text: "Assign equipment",
			title: "Assign this service to a piece of equipment.", click: () => generic_task ("assignment", "Assignment of equipment", () => {
				// Loads all allowed equipments for this service.
				make_request ("/eq-sv-availables", "POST", scard.get_data (), server => {
					// Contains all options that will be shown.
					let options = []; for (let opt of server.data) options.push ({left: opt.model, right: opt.brand, id: opt._id});
					// Overrides dropdown options.
					override_dropdown_options ("div.dropdown > select", options);
					// Binds data and runs commun tasks.
					window.elmt_slt = _.extend (scard.get_data (), new Object ({ref: "service"}));
				});
			})
		// For running services.
		}]); else if (window.svc_tc.get_active_section () === 1) scard.override_options ([{text: "Remove equipment",
		title: "Remove this service from targeted equipment.", click: () => {
			// Generates "unassignment" data needed.
			window.unassignment = _.extend (scard.get_data (), new Object ({ref: "service"}));
			// Opens a widget popup about equipment unassignment.
			commum_task ("unassignment", "Remove an equipment", scard, true, toolbar);
		// Shows the card.
		}}]); window.setTimeout (() => scard.visibility (true), window.DELAY); window.DELAY += 150;
		// Contains all data that will be shown.
		toolbar.get_data ().push (_.extend (scard.get_data (), new Object ({ID: scard.get_id (), ref: scard})));
	}
}

// Loads availables services crud web page view.
function load_availables_services () {
	// Loads availables services web page.
	load_view ("../views/availables_services.html", window.svc_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["exp_svc_crud", "run_svc_crud"]); set_cookie ("it_svc_tab_sec", 0, 365); window.svc_sec_idx = 0;
}

// Loads running services crud web page view.
function load_running_services () {
	// Loads running services web page.
	load_view ("../views/running_services.html", window.svc_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["exp_svc_crud", "avb_svc_crud"]); set_cookie ("it_svc_tab_sec", 1, 365); window.svc_sec_idx = 1;
}

// Loads expired services crud web page view.
function load_expired_services () {
	// Loads expired services web page.
	load_view ("../views/expired_services.html", window.svc_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["run_svc_crud", "avb_svc_crud"]); set_cookie ("it_svc_tab_sec", 2, 365); window.svc_sec_idx = 2;
}

// Called when this web page is fulled loaded.
$ (() => {
	// Changes the dashboard text title.
	animate_text (__ ("div.big-title > label"), "Services", 35); window.draw_service = draw_service;
	// Fixing tabcontrol sections behavior.
	window.svc_tc.override_sections ([
		{text: "Available", title: "Consult available services at the park.", click: () => load_availables_services ()},
		{text: "In progress", title: "View running services.", click: () => load_running_services ()},
		{text: "Finished", title: "View expired services.", click: () => load_expired_services ()}
	], window.svc_sec_idx); $ ("script").remove ();
});
