/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @fileoverview Manages historical data section.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2021-12-17
* @updated 2024-04-21
* @supported DESKTOP
* @file history.js
* @version 0.0.2
*/

// Draw a data card for any case.
function draw_history_data (parent_id, data, id) {
	// Creating a new data card.
	let hscard = new DataCard (parent_id, new Object ({}), (id + parseInt (Math.random () * 1000000000)));
	// Overrides card header.
	$ (hscard.get_id ()).css ("border-bottom", "1px solid silver").css ("box-shadow", "none")
		.hover (function () {$ (this).css ("background-color", "rgb(158, 205, 243)");},
		function () {$ (this).css ("background-color", "#fff");});
	// Contains the sub widget id and draws availables data and waiting a moment before showing the target history card.
	hscard.override_data (data); window.setTimeout (() => hscard.visibility (true), window.DELAY); window.DELAY += 150;
}

// Loads history data from the database.
function load_history_data () {
	// Contains equipment id.
	let id = window.selected_equipment.get_id ().replace ("div#cd-", '');
	// Loading availables services.
	make_request ("/eq-history", "POST", new Object ({eq_id: id}), server => {
		// Contains the total services count.
		let services_count = (server.data.history.old_services.length + server.data.affected_services.length);
		// Updates sections count.
		$ ("div.hsolves > div.history-header > div.item-count > label").text (server.data.history.old_problems.length);
		$ ("div.hbugs > div.history-header > div.item-count > label").text (server.data.history.old_problems.length);
		$ ("div.husers > div.history-header > div.item-count > label").text (server.data.history.old_users.length);
		$ ("div.hservices > div.history-header > div.item-count > label").text (services_count);
		$ ("div.hproviders > div.history-header > div.item-count > label").text (1);
		// For the provider history data.
		window.DELAY = 0.0; draw_history_data ("div.hproviders > div.history-content", new Object ({
			Name: server.data.provider.name.toUpperCase (), "Surname(s)": server.data.provider.surname,
			Address: server.data.provider.address,
			"Phone number": get_better_phone_display (server.data.provider.phone_number, "+229")
		}), id); $ ("div.hproviders > div.history-content > div.hmsg").remove ();
		// For user(s) history data.
		server.data.history.old_users.forEach (old_user => {
			// Contains the filtered assign, expired and cancel date.
			let adate = old_user.assign_date.split ('-'); let edate = old_user.expired_date.split ('-');
			// Removes users history message.
			$ ("div.husers > div.history-content > div.hmsg").remove ();
			// Draws users history data.
			let cdate = old_user.cancel_date.split ('-'); draw_history_data ("div.husers > div.history-content", new Object ({
				Name: old_user.name.toUpperCase (), "Surname(s)": old_user.surname, Address: old_user.address,
				"Assignment date": parse_date (parseInt (adate [2]), parseInt (adate [1]), parseInt (adate [0])),
				"End date": parse_date (parseInt (edate [2]), parseInt (edate [1]), parseInt (edate [0])),
				"Date of withdrawal": parse_date (parseInt (cdate [2]), parseInt (cdate [1]), parseInt (cdate [0])), 
			}), id);
		// For problem(s) and solution(s) history data.
		}); server.data.history.old_problems.forEach (old_problem => {
			// Contains the filtered solution date.
			let pdate = old_problem.date.split ('-'); let sdate = old_problem.solution.date.split ('-');
			// Removes solves and problems history messages.
			$ ("div.hsolves > div.history-content > div.hmsg, div.hbugs > div.history-content > div.hmsg").remove ();
			// Draws solution history data.
			draw_history_data ("div.hsolves > div.history-content", new Object ({
				Date: parse_date (parseInt (sdate [2]), parseInt (sdate [1]), parseInt (sdate [0])),
				Description: old_problem.solution.description,
			// Draws problem history data.
			}), id); draw_history_data ("div.hbugs > div.history-content", new Object ({
				Date: parse_date (parseInt (pdate [2]), parseInt (pdate [1]), parseInt (pdate [0])),
				Description: old_problem.description
			}), id);
		// For service(s) history data.
		}); server.data.history.old_services.forEach (old_service => {
			// Removes solves and problems history messages.
			$ ("div.hservices > div.history-content > div.hmsg").remove ();
			// Contains the filtered assign, expired and cancel date.
			let adate = old_service.assign_date.split ('-'); let edate = old_service.expired_date.split ('-');
			// Gets the cancel date and draws services history data.
			let cdate = old_service.cancel_date.split ('-'); draw_history_data ("div.hservices > div.history-content", new Object ({
				"Provider address": old_service.address,
				"Assignment date": parse_date (parseInt (adate [2]), parseInt (adate [1]), parseInt (adate [0])),
				"End date": parse_date (parseInt (edate [2]), parseInt (edate [1]), parseInt (edate [0])),
				Provider: old_service.service_provider,
				"Date of withdrawal": parse_date (parseInt (cdate [2]), parseInt (cdate [1]), parseInt (cdate [0])),
				Reference: ((typeof old_service.reference === "string") ? old_service.reference : null), Type: old_service.type				
			}), id);
		// For affected services data.
		}); server.data.affected_services.forEach (affected_service => {
			// Removes solves and problems history messages.
			$ ("div.hservices > div.history-content > div.hmsg").remove ();
			// Contains the filtered assign and expired date.
			let adate = affected_service.assign_date.split ('-'); let edate = affected_service.expired_date.split ('-');
			// Draws affected services into history data.
			draw_history_data ("div.hservices > div.history-content", new Object ({
				"Provider address": affected_service.address,
				"Assignment date": parse_date (parseInt (adate [2]), parseInt (adate [1]), parseInt (adate [0])),
				"End date": parse_date (parseInt (edate [2]), parseInt (edate [1]), parseInt (edate [0])),
				Provider: affected_service.service_provider,
				Reference: ((typeof affected_service.reference === "string") ? affected_service.reference : null),
				Type: affected_service.type
			}), id);
		});
	});
}

// Called when this web page is fulled loaded.
$ (() => load_history_data ());
