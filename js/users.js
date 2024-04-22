/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Manages users to be assigned to an equipment.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @file users.js
* @version 0.0.2
*/

// Attributes.
window.usrs_keys = ["Surname(s)", "Name", "Address", "Equipment", "Assignment date", "End date", "ID"];
window.usrs_tc = new TabControl ("div.users-manager", "usrs-tabctrl");
window.usrs_sec_idx = get_cookie ("it_usrs_tab_sec");
window.usrs_sec_idx = parseInt (!is_empty (window.usrs_sec_idx) ? window.usrs_sec_idx : 0);

// Draws a user data.
function draw_user (item, toolbar, index, length) {
	// The passed elements is it an object ?
	if (typeof item === "object" && toolbar instanceof CrudView) {
		// Creating a new data card.
		let uscard = new DataCard (toolbar.get_content_id (), new Object ({}), (item.ID + '-' + index)); uscard.set_index (index + 1);
		// Sets data card icon.
		uscard.set_icon ("<svg viewBox = '0 0 448 512' width = '80px' height = '80px' fill = 'grey'>\
        	<path d = 'M352 128C352 198.7 294.7 256 224 256C153.3 256 96 198.7 96 128C96 57.31 153.3 0 224 0C294.7 0 \
          	352 57.31 352 128zM209.1 359.2L176 304H272L238.9 359.2L272.2 483.1L311.7 321.9C388.9 333.9 448 400.7 \
          	448 481.3C448 498.2 434.2 512 417.3 512H30.72C13.75 512 0 498.2 0 481.3C0 400.7 59.09 333.9 136.3 321.9L175.8 \
          	483.1L209.1 359.2z'/>\
        </svg>"); uscard.set_radius (5, 5, 5, 5); uscard.override_data (item);
		// Overrides arrows action.
		toolbar.override_up_down_action (length, index, uscard);
		// Changes the default size of the created card.
		$ (uscard.get_id ()).css ("border", "1px solid silver").css ("box-shadow", "none").hover (function () {
			$ (this).css ("background-image", "linear-gradient(rgb(203, 226, 243), #fff, rgb(203, 226, 243)")
			.css ("box-shadow", "0 0 8px gray");
		}, function () {$ (this).css ("background-image", "none").css ("box-shadow", "0 0 0 transparent");});
		// For availables users.
		if (window.usrs_tc.get_active_section () === 0) uscard.override_options ([{text: "Assign equipment",
			title: "Assign this user to a device.", click: () => generic_task ("assignment", "Assignment of equipment",
			// Loads all allowed equipments for this user.
			() => {make_request ("/eq-availables", "GET", new Object ({}), server => {
				// Contains all options that will be shown.
				let options = []; server.data = (!Array.isArray (server.data) ? [server.data] : server.data);
				// Generating all loaded options.
				for (let opt of server.data) options.push ({left: opt.model, right: opt.brand, id: opt._id});
				// Overrides dropdown options.
				override_dropdown_options ("div.dropdown > select", options);
				// Binds data and runs commun tasks.
				window.elmt_slt = _.extend (uscard.get_data (), new Object ({ref: "user"}));
			});
		})}
		// For affected users.
		]); else if (window.usrs_tc.get_active_section () === 1) {uscard.set_title (item ["Surname(s)"] + ' ' + item.Name);
			// Changes the card title and overrides these features.
			uscard.override_options ([{text: "Remove equipment", title: "Remove this user from targeted equipment.", click: () => {
				// Opens a widget popup about user unassignment.
				window.unassignment = {ref: "user"}; commum_task ("unassignment", "Removing equipment", uscard, true, toolbar);
			}
		// Shows the card.
		}]);} window.setTimeout (() => uscard.visibility (true), window.DELAY); window.DELAY += 150;
		// Contains all data that will be shown.
		toolbar.get_data ().push (_.extend (uscard.get_data (), new Object ({ID: uscard.get_id (), ref: uscard})));
	}
}

// Loads availables users crud web page view.
function load_availables_users () {
	// Loads availables users web page.
	load_view ("../views/availables_users.html", window.usrs_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["afd_usr_crud"]); set_cookie ("it_usrs_tab_sec", 0, 365); window.usrs_sec_idx = 0;
}

// Loads affected users crud web page view.
function load_affected_users () {
	// Loads affected users web page.
	load_view ("../views/affected_users.html", window.usrs_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["avb_usr_crud"]); set_cookie ("it_usrs_tab_sec", 1, 365); window.usrs_sec_idx = 1;
}

// Called when this web page is fulled loaded.
$ (() => {
	// Changes the dashboard text title.
	animate_text (__ ("div.big-title > label"), "Users", 35); window.draw_user = draw_user;	
	// Fixing tabcontrol sections behavior.
	window.usrs_tc.override_sections ([
		{text: "Available", title: "View registered users on the park.", click: () => load_availables_users ()},
		{text: "Assigned", title: "Consult users who have been assigned to a device.", click: () => load_affected_users ()}
	], window.usrs_sec_idx); $ ("script").remove ();
});
