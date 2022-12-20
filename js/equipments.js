// Attributes.
window.eq_keys = ["Caractères technique", "Date d'achat", "Etat d'achat", "Etat d'utilisation", "Marque", "Prix", "Model", "Référence",
	"Fournisseur", "Adresse du fournisseur", "Téléphone du fournisseur", "Utilisateur actuel", "Adresse de l'utilisateur",
	"Date du problème", "Description du problème", "ID"
];
window.eq_tc = new TabControl ("div.equipments-manager", "eq-tabctrl");
window.eq_sec_idx = get_cookie ("it_eq_tab_sec");
window.eq_sec_idx = parseInt (!is_empty (window.eq_sec_idx) ? window.eq_sec_idx : 0);
window.eq_wdm = null;

// Creates a widget popup to contains service or user select.
function sup_popup (path, width, height, max_width, max_height, title, props_to_destroyed, widget_id) {
	// Draws a widget to display any equipment service or user association.
	if (network_manager ()) {window.eq_wdm = draw_widget (path, new Object ({width: width, height: height, max_width: max_width,
		max_height: max_height, zindex: 0, title: ("Affectation " + title), destroy: () => {
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
			{text: "Historique", title: "Consulter l'historique de ce équipement.", click: () => {
				// Shows history window for loading his data.
				window.selected_equipment = eq_card; show_history (eq_card);
			}}, {text: "Associer service", title: "Associer un service à ce équipement.", click: () => {
				// Draws a widget to display any equipment services association.
				sup_popup ("../views/service_select.html", 820, 480, 1024, 600, "de service", ["svc_slt_crud", "selected_equipment"],
				widget_id); window.selected_equipment = eq_card;
			}}, {text: "Associer utilisateur", title: "Associer un utilisateur à ce équipement.", click: () => {
				// Draws a widget to display any equipment users association.
				sup_popup ("../views/user_select.html", 680, 480, 1024, 600, "d'un utilisateur",
				["usr_slt_crud", "selected_equipment"], widget_id); window.selected_equipment = eq_card;
			}}
		// For maintenance equipments.
		]); else if (window.eq_tc.get_active_section () === 1) eq_card.override_options ([
			{text: "Historique", title: "Consulter l'historique de ce équipement.", click: () => {
				// Shows history window for loading his data.
				window.selected_equipment = eq_card; show_history (eq_card);
			}}, {text: "Réparer", title: "Résoudre le problème lié à ce équipement.", click: () => {
				// Runs task for solve operation.
				commum_task ("add-solve", "Réparation d'un équipement", eq_card, true, toolbar);
			}}, {text: "Sortir", title: "Sortir ce équipement du parc.", click: () => {
				// Runs process for get out of the current equipment.
				let cdata = eq_card.get_data (); let data = new Object ({id: eq_card.get_id ().replace ("div#cd-", ''),
					marque: cdata.Marque, model: cdata.Model
				// Lauches an ajax request.
				}); make_request ("/get-out", "POST", data, server => {
					// No errors found.
					if (!server.errors) {
						// Displays a message.
						let msg = new MessageBox ("div.other-views", new Object ({title: "Méssage serveur", zindex: 1, color: "green",
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
			{text: "Historique", title: "Consulter l'historique de ce équipement.", click: () => {
				// Shows history window for loading his data.
				window.selected_equipment = eq_card; show_history (eq_card);
			}}, {text: "Problème", title: "Signaler un problème lié à ce équipement.", click: () => {
				// Runs task for problem declaration.
				commum_task ("add-bug", "Signalement d'un problème", eq_card, true, toolbar);
			}}, {text: "Associer service", title: "Associer un service à l'équipement.", click: () => {
				// Draws a widget to display any equipment services association.
				sup_popup ("../views/service_select.html", 820, 480, 1024, 600, "de service", ["svc_slt_crud", "selected_equipment"],
				widget_id); window.selected_equipment = eq_card;
			}}, {text: "Retirer l'utilisateur", title: "Retirer l'utilisateur de ce équipement.", click: () => {
				// Opens a widget popup about user unassignment.
				window.unassignment = {ref: "user"}; commum_task ("unassignment", "Retrait d'utilisateur", eq_card, true, toolbar);
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
	animate_text (__ ("div.big-title > label"), "Equipements", 35); window.draw_equipment = draw_equipment;
	// Fixing tabcontrol sections behavior.
	window.eq_tc.override_sections ([
		{text: "Disponible(s)", title: "Consulter les équipement(s) disponible(s) sur le parc.", click: () => load_availables_equipments ()},
		{text: "En maintenance", title: "Consulter le(s) équipement(s) en cours de maintenance.", click: () => load_bug_equipments ()},
		{text: "En service", title: "Consulter le(s) équipement(s) affecté(s) à un utilisateur.", click: () => load_service_equipments ()}
	], window.eq_sec_idx); $ ("script").remove ();
});
