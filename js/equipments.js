/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Equipments displaying section.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2021-12-17
* @updated 2024-05-19
* @file equipments.js
* @supported DESKTOP
* @version 0.0.2
*/

// Attributes.
window.eq_keys = ["Technical characters", "Purchase date", "Purchase status", "Usage status", "Brand", "Price", "Model", "Reference",
	"Provider", "Provider address", "Provider phone", "Current user", "User address",
	"Problem date", "Problem description", "ID"
];
window.eq_tc = new TabControl ("div.equipments-manager", "eq-tabctrl");
window.eq_sec_idx = get_cookie ("it_eq_tab_sec");
window.eq_sec_idx = parseInt (!is_empty (window.eq_sec_idx) ? window.eq_sec_idx : 0);
window.eq_wdm = null;

// Creates a widget popup to contains service or user select.
function sup_popup (path, width, height, max_width, max_height, title, props_to_destroyed, widget_id) {
	// Draws a widget to display any equipment service or user association.
	if (network_manager ()) {window.eq_wdm = draw_widget (path, new Object ({width: width, height: height, max_width: max_width,
		max_height: max_height, zindex: 0, title: ("Assignment " + title), destroy: () => {
			// Clears all background tasks.
			destroy_props (props_to_destroyed); window.clearTimeout (window.eq_wdm.get_load_pid ()); window.DISCONNECT = true;
		}
	}), null, widget_id);}
}

// Draws an equipement with the given data.
function draw_equipment (item, toolbar, index, length) {
	// The passed elements is an object.
	if (typeof item === "object" && toolbar instanceof CrudView) {
		// Creating a new data card.
		let eq_card = new DataCard (toolbar.get_content_id (), new Object ({}), item.ID); eq_card.set_radius (5, 5);
		// Overrides arrows action and changes the default size of the created card.
		toolbar.override_up_down_action (length, index, eq_card); eq_card.set_title (item.Model);
		// Overrides card header.
		eq_card.set_index (index + 1); $ (eq_card.get_id ()).css ("border", "1px solid silver").css ("box-shadow", "none")
		.hover (function () {$ (this).css ("background-image", "linear-gradient(rgb(203, 226, 243), #fff, rgb(203, 226, 243)")
				.css ("box-shadow", "0 0 8px gray");
		}, function () {$ (this).css ("background-image", "none").css ("box-shadow", "0 0 0 transparent");});
		// Contains the sub widget id and draws availables data.
		eq_card.override_data (item); let widget_id = eq_card.get_id ().replace ("div#", '');
		// For service equipments.
		if (window.eq_tc.get_active_section () === 0) eq_card.override_options ([
			{text: "Historical", title: "Consult the history of this equipment.", click: () => {
				// Shows history window for loading his data.
				window.selected_equipment = eq_card; show_history (eq_card);
			}}, {text: "Associate service", title: "Associate a service to this equipment.", click: () => {
				// Draws a widget to display any equipment services association.
				sup_popup ("../views/service_select.html", 820, 480, 1024, 600, "de service", ["svc_slt_crud", "selected_equipment"],
				widget_id); window.selected_equipment = eq_card;
			}}, {text: "Associate user", title: "Associate a user to this equipment.", click: () => {
				// Draws a widget to display any equipment users association.
				sup_popup ("../views/user_select.html", 680, 480, 1024, 600, "of a user",
				["usr_slt_crud", "selected_equipment"], widget_id); window.selected_equipment = eq_card;
			}}
		// For maintenance equipments.
		]); else if (window.eq_tc.get_active_section () === 1) eq_card.override_options ([
			{text: "Historical", title: "Consult the history of this equipment.", click: () => {
				// Shows history window for loading his data.
				window.selected_equipment = eq_card; show_history (eq_card);
			}}, {text: "Fix", title: "Fix the problem to this equipment.", click: () => {
				// Runs task for solve operation.
				commum_task ("add-solve", "Repair of equipment", eq_card, true, toolbar);
			}}, {text: "Get out", title: "Take this gear out of the park.", click: () => {
				// Runs process for get out of the current equipment.
				let cdata = eq_card.get_data (); let data = new Object ({id: eq_card.get_id ().replace ("div#cd-", ''),
					brand: cdata.Brand, model: cdata.Model
				// Lauches an ajax request.
				}); make_request ("/get-out", "POST", data, server => {
					// No errors found.
					if (!server.errors) {
						// Displays a message.
						let msg = new MessageBox ("div.other-views", new Object ({title: "Server message", zindex: 1, color: "green",
							text: server.message, options: [{text: "OK", title: "Ok.", click: () => msg.visibility (false, () => {
								// Destroys the associated data card.
								destroy_data_card (eq_card, toolbar);
							})}]
						// Shows the message box.
						})); msg.visibility (true);
					}
				});
			}}
		// For using equipments.
		]); else if (window.eq_tc.get_active_section () === 2) eq_card.override_options ([
			{text: "Historical", title: "Consult the history of this equipment.", click: () => {
				// Shows history window for loading his data.
				window.selected_equipment = eq_card; show_history (eq_card);
			}}, {text: "Problem", title: "Report a problem with this equipment.", click: () => {
				// Runs task for problem declaration.
				commum_task ("add-bug", "Reporting a problem", eq_card, true, toolbar);
			}}, {text: "Associate service", title: "Associate a service to this equipment.", click: () => {
				// Draws a widget to display any equipment services association.
				sup_popup ("../views/service_select.html", 820, 480, 1024, 600, "of service", ["svc_slt_crud", "selected_equipment"],
				widget_id); window.selected_equipment = eq_card;
			}}, {text: "Remove user", title: "Remove user from this equipment.", click: () => {
				// Opens a widget popup about user unassignment.
				window.unassignment = {ref: "user"}; commum_task ("unassignment", "User removing", eq_card, true, toolbar);
			}}
		// Contains all data that will be shown.
		]); window.setTimeout (() => eq_card.visibility (true), window.DELAY); window.DELAY += 150;
		// Shows the card.
		toolbar.get_data ().push (_.extend (eq_card.get_data (), new Object ({ID: eq_card.get_id (), ref: eq_card})));
	}
}

// Loads availables equipments crud web page view.
function load_availables_equipments () {
	// Loads availables equipments web page.
	load_view ("../views/availables_equipments.html", window.eq_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["mtn_eq_crud", "usg_eq_crud"]); set_cookie ("it_eq_tab_sec", 0, 365); window.eq_sec_idx = 0;
}

// Loads maintenance equipments crud web page view.
function load_bug_equipments () {
	// Loads maintenance equipments web page.
	load_view ("../views/maintenance_equipments.html", window.eq_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["srv_eq_crud", "usg_eq_crud"]); set_cookie ("it_eq_tab_sec", 1, 365); window.eq_sec_idx = 1;
}

// Loads service equipments crud web page view.
function load_service_equipments () {
	// Loads service equipments web page.
	load_view ("../views/service_equipments.html", window.eq_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["mtn_eq_crud", "srv_eq_crud"]); set_cookie ("it_eq_tab_sec", 2, 365); window.window.eq_sec_idx = 2;
}

// Called when this web page is fulled loaded.
$ (() => {
	// Changes the dashboard text title.
	animate_text (__ ("div.big-title > label"), "Equipments", 35); window.draw_equipment = draw_equipment;
	// Fixing tabcontrol sections behavior.
	window.eq_tc.override_sections ([
		{text: "Available", title: "View available equipment(s) in the park.", click: () => load_availables_equipments ()},
		{text: "Under maintenance", title: "View equipment(s) currently undergoing maintenance.", click: () => load_bug_equipments ()},
		{text: "In service", title: "View equipment(s) assigned to a user.", click: () => load_service_equipments ()}
	], window.eq_sec_idx); $ ("script").remove ();
});
