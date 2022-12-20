// Attributes.
window.active_option = get_cookie ("it_ac_dash_opt");
window.active_option = ((typeof window.active_option === "string") ? window.active_option : "div.equipments");

// Adds/removes a class from a tag.
function toggle_class (ref, toggle) {
	// Checks parameters value.
	if (!is_empty (ref)) {
		// Checks active option presence.
		if (ref.className.endsWith ("active-option")) {if (!toggle) ref.className = ref.className.replace (" active-option", '');}
		// Otherwise.
		else if (toggle) ref.className += " active-option";
	// Error message.
	} else console.error ("Tag reference not found !");
}

// Manages any dashboard selection option.
function select_option (option_id, path, trash = [], force = false) {
	// Checks the active option.
	if (window.active_option !== option_id || force) {
		// Checks the network.
		if (window.DISCONNECT && network_manager ()) {
			// Loading graphics components.
			destroy_props (trash); load_view (path, "div.views-manager", window.MESSAGES [0], window.MESSAGES [1]);
			// Toggles class name of the given dashboard option.
			toggle_class (__ (option_id), true); $ ("div.big-title > label").html ('');
			// Hides the last active option.
			if (typeof window.active_option === "string" && !force) toggle_class (__ (window.active_option), false);
			// Updates the active option value and the browser cookies manager.
			window.active_option = option_id; set_cookie ("it_ac_dash_opt", option_id, 365);
		}
	}
}

// Animates the dashboard web page.
function dashboard_visibility (visible, finished = null) {
	// Checks visibility.
	if (visible) apply_css_animation (new Object ({name: "left_translation", duration: 800, ref: __ ("div.slider-menu"), easing: "linear",
		finish: () => apply_css_animation (new Object ({name: "translate", duration: 200, ref: __ ("div.static-title"), easing: "linear",
		finish: () => {
			// Animates equipments option.
			$ ("div.equipments").css ("visibility", "visible").animate ({opacity: 1}, 100, () => {
				// Animates services option.
				$ ("div.services").css ("visibility", "visible").animate ({opacity: 1}, 100, () => {
					// Animates users option.
					$ ("div.users").css ("visibility", "visible").animate ({opacity: 1}, 100, () => {
						// Animates problems option.
						$ ("div.problems").css ("visibility", "visible").animate ({opacity: 1}, 100, () => {
							// Animates providers option.
							$ ("div.providers").css ("visibility", "visible").animate ({opacity: 1}, 100, finished);
						});
					});
				});
			});
		}}), new Object ({transform: "translateY(0)"}))
	}), new Object ({left: 0}));
	// Otherwise.
	else apply_css_animation (new Object ({name: "translate", duration: 200, direction: "reverse", easing: "linear",
	ref: __ ("div.static-title"), finish: () => {
		// Hides the left slider menu bar.
		apply_css_animation (new Object ({name: "left_translation", duration: 800, ref: __ ("div.slider-menu"),
		direction: "reverse", easing: "linear", finish: finished}), new Object ({left: "-100%"}));
		// Hides the dashboard views manager.
		$ ("div.views-manager").animate ({opacity: 0}, 200, function () {$ (this).css ("display", "none");});
	}}), new Object ({transform: "translateY(-120%)"}));
}

// Redefined crud buttons title text.
function sets_crud_btns_title (title, toolbar) {
	// Changes add button title.
	$ ($ (toolbar.get_add_button_id ()).children () [0]).attr ("title", ("Ajouter un " + title));
	// Changes search button title.
	$ ($ (toolbar.get_search_button_id ()).children () [0]).attr ("title", ("Rechercher un " + title));
}

// Clears all unusefull process from a widget popup.
function clear_widget_process (widget, props_to_destroyed = []) {
	// Clears all background tasks.
	destroy_props (props_to_destroyed); window.clearTimeout (widget.get_load_pid ());
}

// Creates a widget popup for any external display.
function draw_widget (path, data, ready = null, id = null) {
	// Creating a new instance of a widget popup, sets widget radius and shows the generated widget popup.
	let widget = new WidgetPopup ("div.other-views", data, id); widget.set_radius (5, 5, 5, 5); widget.visibility (true, () => {
		// Loads the passed web page.
		widget.set_load_pid (load_view (path, widget.get_content_id (), window.MESSAGES [0], window.MESSAGES [1], ready));
	// Returns the created widget reference.
	}); return widget;
}

// Resets all referenced inputs value.
function reset_inputs_value (data) {
	// Checks data type and content.
	data.forEach (item => $ (item.id).val (item.hasOwnProperty ("initial") ? String (item.initial) : ''));
	// Resets id viewer.
	$ ("div.item-id").css ("display", (($ ("div.dropdown > select").val () !== "Aucun") ? "inline-block" : "none"));
}

// Checks inputs values to decide whether "reset" button will be active or not.
function inputs_state (data, btn_id) {
	// Checks data type and content.
	let is_initialized = true; for (let item of data) {
		// Gets initial value.
		item.initial = (item.hasOwnProperty ("initial") ? String (item.initial) : '');
		// Whether ever an input is not set to his initial value.
		if ($ (item.id).val ().trimLeft ().trimRight () !== item.initial) {is_initialized = false; break;}
	// Checks the final result.
	} if (is_initialized) __ (btn_id).classList.add ("disabled"); else __ (btn_id).classList.remove ("disabled");
}

// Apply common formulary instructions.
function initialize_form (data, widget, opt_id = null, ready = null, height = "auto") {
	// Corrects the given option id.
	opt_id = ((typeof opt_id === "string") ? opt_id : widget.get_options_ids () [1]);
	// Fixing clear icon "click" event.
	$ ("div.form-cls-icon > svg").click (function () {
		// Clears the current input field and then checks input value state for potentials changements.
		$ ($ (this).parent ().parent ().children () [0]).val (''); inputs_state (data, opt_id);
	// Fixing all changing events on available inputs.
	}); data.forEach (item => {
		// Fixing "focus" event for input field error destruction.
		$ (item.id).focus (() => destroy_field_error (item.id.split ('>') [0].replace (/ /g, '')));
		// Getting the type of the passed input.
		item.type = ((typeof item.type === "string") ? item.type : '');
		// The current type of the input is dropdown.
		if (item.type === "dropdown") $ (item.id).change (() => {updates_id_viewer (item.id); inputs_state (data, opt_id);});
		// Otherwise.
		else $ (item.id).on ("input", () => inputs_state (data, opt_id));
	// Warns all listeners about formulary ready.
	});	if (typeof ready === "function") ready (widget);
}

// Creates a basic widget for any formulary.
function draw_basic_widget (path, height, title, widget_id, ready = null, reset = [], query = null, props_to_destroyed = []) {
	// Creates a widget for any operation.
	let wdm = draw_widget (path, new Object ({width: parseInt (Math.random () * (780 - 520) + 520), height: height, max_width: 780,
		zindex: 0, title: title, destroy: () => clear_widget_process (wdm, props_to_destroyed)
	// Creates all usefull options for any operation.
	}), () => initialize_form (reset, wdm, wdm.get_options_ids () [1], ready, height), widget_id); wdm.override_options ([
		{text: "Rafraîchir", title: "Rafraîchir la section.", click: (option_id) => {
			// Can it refreshes the active section ?
			if (network_manager () && window.DISCONNECT) {
				// Hides this option.
				$ (option_id).css ("transform", "scale(0)"); wdm.set_height (wdm.get_height ());
				// Clears the current section and reloads it.
				clear_widget_process (wdm, props_to_destroyed); $ (wdm.get_content_id ()).html ('');
				// Disabled reset button.
				if (!is_empty (__ (wdm.get_options_ids () [1]))) __ (wdm.get_options_ids () [1]).classList.add ("disabled");
				// Loads the passed section.
				wdm.set_load_pid (load_view (path, wdm.get_content_id (), window.MESSAGES [0], window.MESSAGES [1], () => {
					// Sets the widget height to "auto".
					$ (option_id).css ("transform", "scale(1)"); initialize_form (reset, wdm, wdm.get_options_ids () [1], ready, height);
				}));
			}
		}}, {text: "Réinitialiser", disabled: true, title: "Ramener les valeurs par défaut.", click: (option_id) => {
			// Empty all clearable fields and disables the passed option.
			reset_inputs_value (reset); __ (option_id).classList.add ("disabled");
		}}, {text: "Appliquer", title: "Valider l'opération à éffectuée.", click: (option_id) => {
			// Calls a slot to make an ajax request to server.
			if (typeof query === "function") query (wdm);
		}}, {text: "Annuler", title: "Abandonner l'opération.", click: (option_id) => wdm.visibility (false)}
	// Returns the final generated widget popup.
	]); return wdm;
}

// Overrides a dropdown option.
function override_dropdown_options (drop_id, data, allow_none = true) {
	// Removes all old options and appends "none" option.
	$ (drop_id).html (''); if (allow_none) $ (drop_id).append ("<option id = 'Aucun' value = 'Aucun' name = ''>Aucun</option>");
	// Generating all given dropdown options.
	data.forEach (item => {
		// Contains an option state value.
		let value = ((item.hasOwnProperty ("left") ? item.left : '') + (item.hasOwnProperty ("right") ? (" - " + item.right) : ''));
		// Generates the dropdown option id.
		let option_id = (value.split (" - ") [0] + value.split (" - ") [1]).replace (/ /g, '').replace ("undefined", '');
		// Adds adds this option to the given dropdown.
		$ (drop_id).append ("<option id = '" + option_id + "' value = '" + value + "' name = '" + item.id + "'>" + value + "</option>");
	});
}

// Returns a dropdown option name.
function get_drop_opt (drop_id) {
	// Gets combox current value.
	let value = $ (drop_id).val ().replace (/ /g, '');
	// Gets the option id.
	let opt_id = (drop_id + " > option#" + ((value.includes ('-')) ? (value.split ('-') [0] + value.split ('-') [1]) : value));
	// Returns the final result.
	return String ($ (opt_id).attr ("name")).replace ("div#", '');
}

// Listens crud data to change his behavior.
function listen_crud_data (toolbar) {
	// Checks toolbar type instance.
	if (toolbar instanceof CrudView) {
		// Calls search method for potentials old searches.
		toolbar.search ($ (toolbar.get_input_id ()).val ()); toolbar.check_data ();
		// Updates item count value to the loaded data count.
		$ (toolbar.get_item_count_id ()).text (String (toolbar.get_data ().length));
	}
}

// Manages id viewer input text field.
function updates_id_viewer (drop_id) {
	// Gets the dropdown value and checks his value.
	let val = $ (drop_id).val (); $ ("div.item-id").css ("display", ((val !== "Aucun") ? "inline-block" : "none"));
	// Updates id viewer input text field value.
	$ ("div.element-id > input[type='text']").val ((val !== "Aucun") ? ("ID: " + get_drop_opt (drop_id)) : "Undefined");
}

// Manages commum task.
function commum_task (key, title, card_ref = null, source = true, toolbar = null) {
	// Gets required equipment data and generates the initial dropdown value that will be applyed.
	let vls = get_require_equipment_data (card_ref, source); let init = (vls.left + " - " + vls.right);
	// Opens a widget popup about the target task.
	generic_task (key, title, () => override_dropdown_options ("div.dropdown > select", [vls], false), init, card_ref, toolbar);
}

// Returns all required data for an equipment.
function get_require_equipment_data (card_ref = null, source = true) {
	// Gets associated data of the current selected equipment reference.
	card_ref = ((card_ref instanceof DataCard) ? card_ref : window.selected_equipment); let vals = card_ref.get_data ();
	// Corrects the model and marque of the equipment.
	let eq_tag = [vals.Model.replace ('-', ''), vals.Marque.replace ('-', ''), (source ? card_ref.get_id () : vals.eq_id)];
	// Returns the final result.
	return new Object ({left: eq_tag [0], right: eq_tag [1], id: eq_tag [2]});
}

// Adds an equipement to database.
function add_equipment () {
	// Checks network state.
	if (network_manager ()) {
		// Displays a widget to load all required fields for an equipment adding. 
		let today = get_date (); draw_basic_widget ("../views/add_equipment.html", 600, "Enregistrement d'un équipement", "eq-add", () => {
			// Initializes dates value.
			$ ("div.eq-buy-date > input").val (today);
		}, [{id: "div.eq-ref > input"}, {id: "div.eq-mark > input"}, {id: "div.eq-model > input"}, {id: "div.pro-first-name > input"},
			{id: "div.eq-state > select", initial: "Non affecté", type: "dropdown"}, {id: "div.technic-report > textarea"},
			{id: "div.eq-buy-date > input", initial: today}, {id: "div.pro-address > input"}, {id: "div.pro-phone > input"},
			{id: "div.eq-price > input", initial: 0}, {id: "div.eq-buy-state > select", initial: "Neuf", type: "dropdown"},
			{id: "div.pro-last-name > input"}
		], widget => {
			// Contains all required fields id for user adding operation.
			let keys = ["div.eq-ref > input", "div.eq-mark > input", "div.eq-model > input", "div.pro-first-name > input",
			"div.eq-state > select", "div.technic-report > textarea", "div.eq-buy-date > input", "div.pro-address > input",
			"div.pro-phone > input", "div.eq-price > input", "div.eq-buy-state > select", "div.pro-last-name > input"];
			// Makes an ajax request to server.
			generic_task_query ("/add-equipment", keys, server => run_server_data (server, widget, () => {
				// Checks variables existance.
				if (window.hasOwnProperty ("eq_sec_idx") && window.active_option === "div.equipments" && window.eq_sec_idx === 0) {
					// Contains the filtered buy date.
					server.data ["Téléphone du fournisseur"] = get_better_phone_display (server.data ["Téléphone du fournisseur"], "+229");
					let date = server.data ["Date d'achat"].split ('-');
					date = [parseInt (date [2]), parseInt (date [1]), parseInt (date [0])];
					// Contains the crud data total elements count.
					server.data.Prix = (parse_float (server.data.Prix, 2) + " XOF"); let count = window.srv_eq_crud.get_data ().length;
					server.data ["Date d'achat"] = parse_date (date [0], date [1], date [2]);
					// Adds the associated data card to this section.
					window.draw_equipment (server.data, window.srv_eq_crud, count, (count + 1)); listen_crud_data (window.srv_eq_crud);
				}
			}));
		});
	}
}

// Gets serveur data and makes some treatments.
function run_server_data (data, widget, slot = null) {
	// Some errors have been found ?
	if (typeof data.errors !== "boolean") data.errors.forEach (item => field_error (item.id, item.message));
	// Closes the widget that contains the operation.
	else widget.visibility (false, () => {
		// Displays the server message for this operation.
		let server_message = new MessageBox ("div.other-views", new Object ({title: "Méssage serveur", zindex: 1, text: data.message,
			color: "green", options: [{text: "OK", title: "Ok.", click: () => {
				// Destroys the message box and calls slot whether it exists.
				server_message.visibility (false); if (typeof slot === "function") slot (data);
			}}]
		// Shows the message box.
		})); server_message.visibility (true);
	});
}

// Apply an accordeon effect to history.
function apply_accordeon_effect (current, older) {
	// The passed current ids is it some strings ?
	if (typeof current === "string") {
		// Contains all sub ids from the current.
		current = current.split (','); $ (current [0] + " > div.history-header > div.arrow-icon").css ("transform", "rotate(-90deg)");
		// Animates the active section tag and displays his content.
		$ (current [0]).animate ({height: "348px"}, 300); $ (current [1]).css ("display", "flex").animate ({opacity: 1}, 300);
	// Checks the older id value type.
	} if (typeof older === "string") {
		// Gets all sub ids from the older.
		older = older.split (','); $ (older [0] + " > div.history-header > div.arrow-icon").css ("transform", "rotate(-180deg)");
		// Animates the older section tag and turn off his content display.
		$ (older [0]).animate ({height: "37px"}, 300); $ (older [1]).animate ({opacity: 0}, 300, function () {
			// Hides the content.
			$ (this).css ("display", "none");
		});
	}
}

// Generates data that will be send to the server.
function get_server_data (data) {
	// Converting the passed data into an array.
	data = (Array.isArray (data) ? data : [data]); let results = []; data.forEach (key => {
		// Gets the input placeholder value.
		let reqd = ((key.endsWith ("input") || key.endsWith ("textarea")) ? $ (key).attr ("placeholder").endsWith ('*') : false);
		// Some restrictions must be applyed to this field.
		let restricts = true; if (key === "div.eq-ref > input") restricts = false;
		else if (key === "div.technic-report > textarea") restricts = false; else if (key === "div.serv-ref > input") restricts = false;
		else if (key === "div.bugs-report > textarea") restricts = false; else if (key === "div.solve-report > textarea") restricts = false;
		// Contains all common configurations.
		let cfgs = new Object ({id: key, value: $ (key).val (), restrictions: restricts});
		// For a classic input field.
		if (key.endsWith ("input")) results.push (_.extend (new Object ({required: reqd, type: $ (key).attr ("type")}), cfgs));
		// For a classic select tag.
		else if (key.endsWith ("select")) results.push (_.extend (new Object ({type: "dropdown"}), cfgs));
		// For a classic textarea.
		else if (key.endsWith ("textarea")) results.push (_.extend (new Object ({required: reqd, type: "text"}), cfgs));
	// Returns the final value.
	}); return (!results.length ? null : (results.length === 1 ? results [0] : results));
}

// Manages generic task backend request with ajax protocol.
function generic_task_query (link, targets, success = null, failed = null, add = null) {
	// Converting the passed targets into an array.
	targets = (Array.isArray (targets) ? targets : [targets]); targets = get_server_data (targets);
	// Sends the given data to server for advanced treatment.
	make_request (link, "POST", new Object ({data: targets, additional: add}), success, failed);
}

// Manages an error message on an input text field.
function field_error (field_id, message) {
	// Displays an error message on the bottom of the input filed.
	$ (field_id).addClass ("field-error"); $ ($ ($ (field_id).parent ().children () [1]).children () [0]).text (message);
}

// Removes an error on an input text field.
function destroy_field_error (field_id) {
	// Destroys the printed error message about the input.
	$ (field_id).removeClass ("field-error"); $ ($ ($ (field_id).parent ().children () [1]).children () [0]).text ('');
}

// Displays the associated history of an equipment.
function show_history (card) {
	// Checks the browser network.
	if (card instanceof DataCard && network_manager ()) {
		// Gets equipment marque, model and the history title. 
		let title = (card.get_data ().Model.replace ('-', '') + " - " + card.get_data ().Marque.replace ('-', ''));
		// Contains the active history section.
		let active_section = null; let ids = ["div.hproviders, div.hproviders > div.history-content",
		"div.husers, div.husers > div.history-content", "div.hbugs, div.hbugs > div.history-content",
		"div.hsolves, div.hsolves > div.history-content", "div.hservices, div.hservices > div.history-content"];
		// Draws a popup widget to display equipment history.
		draw_basic_widget ("../views/history.html", 600, ("Historique de " + title), "eq-hty", (widget) => {
			// Contains all options id created to this widget and then removes all unusefull options.
			let opts_ids = widget.get_options_ids (); $ (opts_ids [1] + ", " + opts_ids [2]).remove ();
			// Sets the title text and content text of the last widget option.
			$ (opts_ids [3]).attr ("title", "Fermer la fenêtre.").text ("Retour");
			// Selects providers as default value.
			apply_accordeon_effect (ids [0], null); active_section = ids [0];
			// Fixing "click" event on proviers history.
			$ ("div.hproviders").click (function () {
				// Selects providers history.
				if (active_section !== ids [0]) {apply_accordeon_effect (ids [0], active_section); active_section = ids [0];}
			// Fixing "click" event on users history.
			}); $ ("div.husers").click (function () {
				// Selects users history.
				if (active_section !== ids [1]) {apply_accordeon_effect (ids [1], active_section); active_section = ids [1];}
			// Fixing "click" event on bugs history.
			}); $ ("div.hbugs").click (function () {
				// Selects bugs history.
				if (active_section !== ids [2]) {apply_accordeon_effect (ids [2], active_section); active_section = ids [2];}
			// Fixing "click" event on solves history.
			}); $ ("div.hsolves").click (function () {
				// Selects solves history.
				if (active_section !== ids [3]) {apply_accordeon_effect (ids [3], active_section); active_section = ids [3];}
			// Fixing "click" event on services history.
			}); $ ("div.hservices").click (function () {
				// Selects services history.
				if (active_section !== ids [4]) {apply_accordeon_effect (ids [4], active_section); active_section = ids [4];}
			});
		});
	}
}

// Destroy any data card and his data from the associated crud manager.
function destroy_data_card (card_ref, toolbar) {
	// Removes this card configs from the toolbar.
	toolbar.set_data (_.filter ([...toolbar.get_data ()], obj => {return (obj.ID !== card_ref.get_id ());}));
	// Destroys the data card from the view.
	let count = toolbar.get_data ().length; card_ref.visibility (false, () => {
		// Contains the first and the last element.
		let privot = [toolbar.get_data () [0], toolbar.get_data () [(count - 1)]];
		// Checks the privots value.
		if (!is_empty (privot [0]) && !is_empty (privot [1])) {
			// Targets the first element of the list.
			toolbar.set_first_card_ref (__ (privot [0].ID)); toolbar.set_last_card_ref (__ (privot [1].ID));
			// Fixing link on up arrow.
			$ (toolbar.get_uparrow_id ()).attr ("href", privot [0].ID.replace ("div", ''));
			// Fixing link on down arrow.
			$ (toolbar.get_downarrow_id ()).attr ("href", privot [1].ID.replace ("div", ''));
		// Listens the target curd view data.
		} listen_crud_data (toolbar);
	});
}

// Creates a generic operation task.
function generic_task (type, title, ready = null, drop_init = null, card_ref = null, toolbar = null) {
	// Checks network state.
	if (network_manager ()) {
		// Displays a basic widget to load all required fields for a generic task. 
		let today = get_date (); draw_basic_widget ("../views/generic_task.html", 280, title, "gen-tsk", (widget) => {
			// Initializes dates value.
			$ ("div.bug-date > input, div.cancel-date > input, div.start-date > input, div.solve-date > input").val (today);
			// For user adding.
			if (type === "add-user") {
				// Shows all required fields for this task.
				$ ("div.user-identity").css ("display", "flex"); $ ("div.user-address").css ("display", "inline-block");
				// Hides all required fields at any task.
				$ ("div.combobox, div.item-id").css ("display", "none");
			// For service adding.
			} else if (type === "add-service") {
				// Hides all required fields at any task.
				$ ("div.service-identity").css ("display", "flex"); $ ("div.combobox, div.item-id").css ("display", "none");
				// Shows all required fields for this task.
				$ ("div.service-ref, div.service-address").css ("display", "inline-block");
			// Otherwise.
			} else {
				// Shows all required fields at any task.
				$ ("div.combobox").css ("display", "inline-block"); $ ("div.form-cpd-icon > svg").click (() => {
					// Getting the id viewer pointor reference and enables this input.
					let id_viewer = __ ("div.element-id > input[type='text']"); id_viewer.disabled = false;
					// Selects the text content corrects it.
					let prev_val = id_viewer.value; id_viewer.value = id_viewer.value.replace ("ID: ", ''); id_viewer.select ();
					// Copy the final result to clipboard and disables this input.
					window.navigator.clipboard.writeText (id_viewer.value); id_viewer.disabled = true;
					// Displays a browser alert.
					alert ("L'identifiant " + id_viewer.value + " a été copier dans le presse-papier."); id_viewer.value = prev_val;
				// For bug adding.
				}); if (type === "add-bug") $ ("div.problem-date, div.problem-description").css ("display", "inline-block");
				// For solve adding.
				else if (type === "add-solve") $ ("div.answer-date, div.solution-description").css ("display", "inline-block");
				// For assignment.
				else if (type === "assignment") $ ("div.task-identity").css ("display", "flex");
				// For unassignment date.
				else if (type === "unassignment") $ ("div.unssign-date").css ("display", "inline-block");
				// Sets the widget height to "auto" and warns all listeners about formulary ready.
			} widget.set_height ("auto"); if (typeof ready === "function") ready (widget); updates_id_viewer ("div.dropdown > select");
		// Formulary fields data.
		}, [{id: "div.last-name > input"}, {id: "div.first-name > input"}, {id: "div.guest-address > input"}, {id: "div.serv-ref > input"},
			{id: "div.bug-date > input", initial: today}, {id: "div.cancel-date > input", initial: today}, {id: "div.serv-address > input"},
			{id: "div.start-date > input", initial: today}, {id: "div.ending-date > input"}, {id: "div.bugs-report > textarea"},
			{id: "div.dropdown > select", initial: ((typeof drop_init === "string") ? drop_init : "Aucun"), type: "dropdown"},
			{id: "div.solve-date > input", initial: today}, {id: "div.serv-provider > input"}, {id: "div.serv-type > input"},
			{id: "div.solve-report > textarea"}
		], widget => {
			// For user adding.
			if (type === "add-user") {
				// Contains all required fields id for user adding operation.
				let keys = ["div.last-name > input", "div.first-name > input", "div.guest-address > input"];
				// Makes an ajax request to server.
				generic_task_query ("/add-user", keys, server => run_server_data (server, widget, () => {
					// Checks variables existance.
					if (window.hasOwnProperty ("usrs_sec_idx") && window.active_option === "div.users" && window.usrs_sec_idx === 0) {
						// Gets availables users total count.
						let count = window.avb_usr_crud.get_data ().length; server.data.Nom = server.data.Nom.toUpperCase ();
						// Corrects the passe surname value.
						server.data ["Prénom(s)"] = str_capitalize (server.data ["Prénom(s)"]);
						// Adds the associated data card to this section.
						window.draw_user (server.data, window.avb_usr_crud, count, (count + 1));
						// Updates the associated crud of the current services manager.
						listen_crud_data (window.avb_usr_crud);
					// Otherwise.
					} else if (window.active_option === "div.equipments") {
						// Adds a selectable user selection for equipment.
						let count = window.usr_slt_crud.get_data ().length; server.data.Nom = server.data.Nom.toUpperCase ();
						// Corrects the passe surname value.
						server.data ["Prénom(s)"] = str_capitalize (server.data ["Prénom(s)"]);
						// Adds the associated data card to this section.
						window.draw_usr_slt_data (server.data, count, (count + 1));
						// Updates the associated crud of the current services manager.
						listen_crud_data (window.usr_slt_crud);
					}
				}));
			// For service adding.
			} else if (type === "add-service") {
				// Contains all required fields id for user adding operation.
				let keys = ["div.serv-ref > input", "div.serv-address > input", "div.serv-provider > input", "div.serv-type > input"];
				// Makes an ajax request to server.
				generic_task_query ("/add-service", keys, server => run_server_data (server, widget, () => {
					// Checks variables existance.
					if (window.hasOwnProperty ("svc_sec_idx") && window.active_option === "div.services" && window.svc_sec_idx === 0) {
						// Gets availables services total count.
						let count = window.avb_svc_crud.get_data ().length;
						// Adds the associated data card to this section.
						window.draw_service (server.data, window.avb_svc_crud, count, (count + 1)); 
						// Updates the associated crud of the current services manager.
						listen_crud_data (window.avb_svc_crud);
					// Otherwise.
					} else if (window.active_option === "div.equipments") {
						// Adds a selectable service selection for equipment.
						let count = window.svc_slt_crud.get_data ().length; window.draw_svc_slt_data (server.data, count, (count + 1));
						// Updates the associated crud of the current services manager.
						listen_crud_data (window.svc_slt_crud);
					}
				}));
			// Otherwise.
			} else {
				// Contains some common keys.
				let common_keys = ["div.dropdown > select", "div.element-id > input"];
				// For bug adding.
				if (type === "add-bug") {
					// Contains all required fields id for user adding operation.
					let keys = String (["div.bug-date > input", "div.bugs-report > textarea,"] + common_keys).split (',');
					// Makes an ajax request to server.
					generic_task_query ("/add-bug", keys, server => run_server_data (server, widget, () => {
						// Problems section is actived.
						if (window.active_option === "div.problems") {
							// Gets availables problems total count.
							let count = window.bgs_crud.get_data ().length; let pdate = server.data.date.split ('-'); window.draw_bug ({
								Date: parse_date (parseInt (pdate [2]), parseInt (pdate [1]), parseInt (pdate [0])),
								Description: server.data.description, Marque: server.data.marque, Model: server.data.model,
								Equipement: (server.data.model + " - " + server.data.marque), Description: server.data.description,
								ID: server.data._id, disabled: ["ID", "Model", "Marque"]
							}, window.bgs_crud, count, (count + 1)); listen_crud_data (window.bgs_crud);
						// Otherwise.
						} else destroy_data_card (card_ref, toolbar);
					}));
				// For solve adding.
				} else if (type === "add-solve") {
					// Contains all required fields id for user adding operation.
					let keys = String (["div.solve-date > input", "div.solve-report > textarea,"] + common_keys).split (',');
					// Makes an ajax request to server.
					generic_task_query ("/add-solve", keys, server => run_server_data (server, widget, () => {
						// Removes this card configs from the toolbar and destroys his reference from the view.
						destroy_data_card (card_ref, toolbar);
					}));
				// For assignment.
				} else if (type === "assignment") {
					// Contains all required fields id for user adding operation.
					let keys = String (["div.start-date > input", "div.ending-date > input,"] + common_keys).split (',');
					// Makes an ajax request to server.
					generic_task_query ("/assignment", keys, server => run_server_data (server, widget, () => {
						// For equipments section.
						if (window.active_option === "div.equipments" && window.hasOwnProperty ("eq_wdm")) {
							// A reference of a widget popup is defined.
							if (window.eq_wdm instanceof WidgetPopup) window.eq_wdm.visibility (false, () => delete window.eq_wdm);
							// A reference of a data card is defined.
							if (window.elmt_slt.ref !== "service") destroy_data_card (window.selected_equipment, window.srv_eq_crud);
						}
					}), null, window.elmt_slt);
				// For unassignment date.
				} else if (type === "unassignment") {
					// Contains all required fields id for user adding operation.
					let keys = String (["div.cancel-date > input,"] + common_keys).split (',');
					// Makes an ajax request to server.
					generic_task_query ("/unassignment", keys, server => run_server_data (server, widget, () => {
						// Removes this card configs from the toolbar and destroys his reference from the view.
						destroy_data_card (card_ref, toolbar);
					}), null, window.unassignment);
				}
			}
		});
	}
}

// Manages some simple displayer with cookies.
function displayer (cookie, cookie_value, title, message, id, delay = 0) {
	// Contains the it greeter cookie variable.
	let old_value = get_cookie (cookie);
	// Checks greeter cookie existance.
	if (is_empty (old_value) || typeof old_value === "string" && old_value == "undefined") {
		// Waiting for the given delay.
		window.setTimeout (() => {
			// Displays a message box to greet the user.
			let messager = new MessageBox ("div.other-views", new Object ({title: title, zindex: 1, text: message,
				options: [{text: "OK", title: "Ok.", click: () => messager.visibility (false)}]
			// Shows the message box and updates his greeter cookie value on the browser.
			}), false, id); messager.visibility (true); set_cookie (cookie, cookie_value, 365);
		}, delay);
	}
}

// Greets the logged user.
function greet_user () {displayer ("it_welcome", "it_greet", "Message de bienvenu",
	"Soyez le bienvenu sur notre application de gestion d'un parc informatique.", "welcome-msg");
}

// Warns user about cookies using.
function warn_user () {displayer ("it_cookie", "notified", "Message informatif",
	"Cette application utilise les cookies pour vous donnez une expérience utilisateur avancée.", "cookie-msg", 20000);
}

// Called when this web page is fulled loaded.
$ (() => {
	// Contains the current connected user.
	let connected_user = ((get_cookie ("it_user") != undefined) ? get_cookie ("it_user") : '');
	// Fixing dropdown menu deployment on "click" event.
	$ ("div.guest-icon").attr ("title", connected_user); warn_user (); $ ("div.profil-icon").click (() => {
		// Can't it disconnect the user ?
		if (window.DISCONNECT) $ ("div.drp").css ("top", (((get_css_value ($ ("div.drp").css ("top")) < 0) ? 33 : -100) + "px"));
	// Fixing "click" event on "equipments" option.
	}); $ ("div.equipments").click (() => {
		// Contains all properties that will be destroyed.
		let props_to_destroyed = ["svc_keys", "svc_tc", "run_svc_crud", "exp_svc_crud", "svc_sec_idx", "avb_svc_crud", "usrs_keys",
		"usrs_crud", "bgs_crud", "prv_keys", "prv_tc", "god_prd_crud", "bad_prd_crud", "prv_sec_idx", "avb_usr_crud", "afd_usr_crud"];
		// Selects equipments options.
		select_option ("div.equipments", "../views/equipments.html", props_to_destroyed);
	// Fixing "click" event on "services" option.
	}); $ ("div.services").click (() => {
		// Contains all properties that will be destroyed.
		let props_to_destroyed = ["eq_keys", "eq_tc", "mtn_eq_crud", "srv_eq_crud", "usg_eq_crud", "eq_sec_idx", "usrs_keys",
		"usrs_crud", "bgs_crud", "prv_keys", "prv_tc", "god_prd_crud", "bad_prd_crud", "prv_sec_idx", "avb_usr_crud", "afd_usr_crud"];
		// Selects services options.
		select_option ("div.services", "../views/services.html", props_to_destroyed);
	// Fixing "click" event on "users" option.
	}); $ ("div.users").click (() => {
		// Contains all properties that will be destroyed.
		let props_to_destroyed = ["eq_keys", "eq_tc", "mtn_eq_crud", "srv_eq_crud", "usg_eq_crud", "exp_svc_crud", "eq_sec_idx",
		"svc_keys", "svc_tc", "run_svc_crud", "prv_keys", "prv_tc", "god_prd_crud", "bad_prd_crud", "bgs_crud", "svc_sec_idx",
		"prv_sec_idx", "avb_svc_crud"];
		// Selects users options.
		select_option ("div.users", "../views/users.html", props_to_destroyed);
	// Fixing "click" event on "bugs" option.
	}); $ ("div.problems").click (() => {
		// Contains all properties that will be destroyed.
		let props_to_destroyed = ["eq_keys", "eq_tc", "mtn_eq_crud", "srv_eq_crud", "usg_eq_crud", "exp_svc_crud", "eq_sec_idx",
		"svc_keys", "svc_tc", "run_svc_crud", "prv_keys", "prv_tc", "god_prd_crud", "bad_prd_crud", "usrs_crud", "svc_sec_idx",
		"prv_sec_idx", "avb_svc_crud", "usrs_keys", "avb_usr_crud", "afd_usr_crud"];
		// Selects problems options.
		select_option ("div.problems", "../views/problems.html", props_to_destroyed);
	// Fixing "click" event on "providers" option.
	}); $ ("div.providers").click (() => {
		// Contains all properties that will be destroyed.
		let props_to_destroyed = ["eq_keys", "eq_tc", "mtn_eq_crud", "srv_eq_crud", "usg_eq_crud", "svc_sec_idx", "avb_svc_crud",
		"exp_svc_crud", "svc_keys", "svc_tc", "run_svc_crud", "bgs_crud", "usrs_crud", "eq_sec_idx", "usrs_keys", "avb_usr_crud",
		"afd_usr_crud"];
		// Selects providers options.
		select_option ("div.providers", "../views/providers.html", props_to_destroyed);
	// Fixing "click" event on "disconnect" option.
	}); $ ("div.disconnect-option").click (() => {
		// Can't it disconnect the user ?
		if (network_manager () && window.DISCONNECT) {
			// Hides the menu dropdown.
			window.SIGN_IN = true; $ ("div.drp").css ("top", "-100%"); dashboard_visibility (false, () => {
				// Destroys all unusefull variables from the browser window.
				destroy_props (["eq_keys", "eq_tc", "mtn_eq_crud", "srv_eq_crud", "usg_eq_crud", "exp_svc_crud", "eq_sec_idx",
				"svc_keys", "svc_tc", "run_svc_crud", "prv_keys", "prv_tc", "god_prd_crud", "bad_prd_crud", "bgs_crud",
				"svc_sec_idx", "prv_sec_idx", "usrs_crud", "avb_svc_crud", "usrs_keys", "avb_usr_crud", "afd_usr_crud",
				"eq_wdm", "unassignment", "selected_equipment", "draw_equipment", "draw_service", "elmt_slt", "draw_svc_slt_data",
				"draw_usr_slt_data", "draw_user", "draw_bug"]); set_cookie ("it_user", undefined, (20 / 60));
				// Loads IT manager login web page.
				load_view ("../views/sign.html", "div.views", "Chargement...", "Chargement de la page de connexion...");
			});
		}
	// Animates the dashboard.
	}); dashboard_visibility (true, () => {
		// Loads the default dashboard option.
		select_option (window.active_option, ("../views/" + window.active_option.replace ("div.", '') + ".html"), [], true);
	// Removes this script.
	}); $ ("script").remove ();
});
