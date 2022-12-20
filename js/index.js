// Global attributes.
window.MESSAGES = ["Chargement des composants graphiques...", "Chargement de la vue...", "Chargement des données...",
	"Interrogation de la base de données..."];
window.DISCONNECT = true;
window.RESP_ERR = null;
window.SIGN_IN = true;
window.DELAY = 0;

// Manages network disconnection.
function network_manager () {
	// Checks network.
	if (check_responsive () && !window.navigator.onLine) {let network_msg = new MessageBox ("div.other-views", new Object ({
			text: "Le navigateur est hors réseau. Veuillez vérifier votre wifi ou câble Ethernet, puis reéssayer.",
			title: "Erreur de connexion", color: "red", zindex: 1
		// Shows the message box and returns false.
		}), true, "nk-err"); network_msg.visibility (true); return false;
	// The browser is connected.
	} return true;
}

// Manages page loading.
function load_view (path, parent_id, message = null, infobull = null, finished = null, limit = 180000, delay = 0.0) {
	// Checks the passed path.
	if (str_check (path) != null) {
		// Hides the guest icon.
		$ ("div.guest-icon").css ("transform", "scale(0)"); $ ("div.drp").css ("top", "-100px");
		// Corrects the passed path and id.
		window.DISCONNECT = false; path = String (path).replace (' ', ''); let load_page_error = null;
		// Draws the loader.
		draw_loader (new Object ({title: infobull, parent: parent_id, label: message}), true);
		// Starts loading page time counter.
		let load_pid = window.setTimeout (() => {
			// Shows a message box about a slow loading.
			load_page_error = new MessageBox ("div.other-views", new Object ({title: "Erreur de chargement", zindex: 1,
				text: "Le délai d'atente de chargement de la page est dépassé. Veuillez réessayer à nouveau.", color: "red",
				options: [{text: "Recharger", title: "Désirez-vous relancer le chargement de la page cible à nouveau ?",
				click: () => {load_page_error.visibility (false); load_view (path, parent_id, message, infobull, finished, limit);}},
				{text: "Annuler", title: "Abandonner le chargement.", click: () => load_page_error.visibility (false)}]
			// Shows the message box.
			}), false, "ld-pg-err"); load_page_error.visibility (true);
		// Loads the given web page.
		}, Number (limit)); window.setTimeout (() => {$ (parent_id).load (path, () => {
			// Destroys the message box, kills the loading process id and enables "disconnect" option on guest icon.
			if (load_page_error != null) load_page_error.visibility (false); window.clearTimeout (load_pid); window.DISCONNECT = true;
			// Calls the passed callback.
			$ ("div.guest-icon").css ("transform", "scale(1)"); if (typeof finished === "function") finished ();
		});}, delay); return load_pid;
	// Error message.
	} else console.error ("Invalid path !"); return null;
}

// Makes a http request from the frontend to backend.
function make_request (link, method, data, success = null, failed = null, limit = 180000, delay = 0.0, force = false) {
	// Checks the network.
	if (network_manager ()) {
		// Checks whether the user is connected.
		if (!is_empty (get_cookie ("it_user")) || force) {
			// Creating a new instance of a widget popup.
			let wdp = new WidgetPopup ("div.other-views", new Object ({width: 380, height: 80}), "ajx-req"); let req_pid = null;
			// Disables closable feature on this widget and sets his border radius.
			wdp.is_closable (false); wdp.set_radius (5, 5, 5, 5); wdp.visibility (true, () => {
				// Draws the loader and lauches an ajax request.
				draw_loader (new Object ({title: window.MESSAGES [3], parent: wdp.get_content_id (), label: window.MESSAGES [3]}), true);
				// Waiting for the given delay.
				window.setTimeout (() => {
					// Sends ajax request to server and wait his response.
					ajax_request_nodejs (link, method, data, server_data => {
							// For an error system.
							if (server_data.hasOwnProperty ("errors") && typeof server_data.errors === "string") {
								// Shows a message box about a rejected request.
								wdp.visibility (false, () => {let sys_error = new MessageBox ("div.other-views", new Object ({
									title: "Erreur système", zindex: 1, text: server_data.errors, color: "red",
									options: [{text: "Reéssayer", title: "Désirez-vous relancer la demande à nouveau ?", click: () => {
										// Destroys the active message box and retry the target request.
										sys_error.visibility (false); make_request (link, method, data, success, failed, limit, delay, force);
									}}, {text: "Annuler", title: "Abandonner la demande.", click: () => sys_error.visibility (false)}]
									// Shows the message box.
									}), false, "sys-err"); sys_error.visibility (true);
								});
							// Closes the widget popup and calls success callback method.
							} else wdp.visibility (false, () => {if (typeof success === "function") success (server_data);});
							// Kills the request process id.
							if (req_pid != null) window.clearTimeout (req_pid);
						}, () => {
							// Shows a message box about a rejected request.
							wdp.visibility (false, () => {let rejected_request = new MessageBox ("div.other-views", new Object ({
								title: "Erreur de demande", zindex: 1, text: "La demande éffectuée a échouée ou été rejetée.",
								color: "red", options: [{text: "Reéssayer", title: "Désirez-vous relancer la demande à nouveau ?",
								click: () => {
									// Destroys the active message box and retry the target request.
									rejected_request.visibility (false); make_request (link, method, data, success, failed, limit, delay, force);
								}}, {text: "Annuler", title: "Abandonner la demande.", click: () => rejected_request.visibility (false)}]
								// Shows the message box.
								}), false, "req-err"); rejected_request.visibility (true); if (typeof failed === "function") failed ();
							// Kills the request process id.
							}); if (req_pid != null) window.clearTimeout (req_pid);
						});
				}, delay);
				// Waiting a moment.
				req_pid = window.setTimeout (() => {
					// Shows a message box about a slow request.
					wdp.visibility (false, () => {let request_error = new MessageBox ("div.other-views", new Object ({
						text: "La délai d'attente de réception de réponse du serveur est dépassé. Veuillez réessayer à nouveau.",
						title: "Erreur de demande", color: "red", zindex: 1, options: [{text: "Reéssayer",
						title: "Désirez-vous relancer la demande à nouveau ?", click: () => {
							// Destroys the active message box and retry the target request.
							request_error.visibility (false); make_request (link, method, data, success, failed, limit, delay, force);
						}}, {text: "Annuler", title: "Abandonner la demande.", click: () => request_error.visibility (false)}]
						// Shows the message box.
						})); request_error.visibility (true); if (typeof failed === "function") failed ();
					});
				}, limit);
			});
		} else {
			// Shows a message box about user disconnection.
			let disconnection_message = new MessageBox ("div.other-views", new Object ({title: "Méssage de déconnexion", zindex: 1,
			text: "Le délai de connexion accordé à l'utilisateur actuel est expiré. Veuilez vous reconnectez à nouveau sur"
			+ " l'application pour réinitialiser votre section.", options: [{text: "Reconnexion",
			title: "Se connecter à nouveau sur l'application pour réinitialiser votre section.", click: () => {
				// Destroys the active message box and reload the current page.
				disconnection_message.visibility (false, () => window.location.reload ());
			// Shows the message box.
			}}] }), false, "disc-msg"); disconnection_message.visibility (true);
		}
	}
}

// Checks the browser window size.
function check_responsive () {
	// Window width is less than 1140 pixel.
	if (window.outerWidth < 1024) {
		// This message box is already shown.
		if (window.RESP_ERR == null) {
			// Shows a message box about web page responsive.
			window.RESP_ERR = new MessageBox ("div.other-views", new Object ({title: "Message de redimensionnement",
				text: "Cette application ne supporte pas les écrans de basse résolution. Veuillez redimensionner votre écran à\
				une résolution suppérieur ou égale à (1024 x 768) pixels.", zindex: 1
			// Shows the message box.
			}), false, "res-pg-err"); window.RESP_ERR.visibility (true); return false;
		}
	// Otherwise.
	} else if (window.RESP_ERR != null) window.RESP_ERR.visibility (false, () => window.RESP_ERR = null); return true;
}

// Fixing views container resize and load events.
$ (() => {
	// Listen browser window resize event.
	$ (window).resize (() => {$ ("div.views").css ("height", (window.innerHeight + "px")); check_responsive ();});
	// Checks the network.
	if (network_manager ()) {
		// Contains the generated path.
		let target_path = (!is_empty (get_cookie ("it_user")) ? "../views/dashboard.html" : "../views/sign.html");
		// Loads IT manager login web page.
		load_view (target_path, "div.views", "Chargement...", "Chargement de la page de connexion en cours...");
		// Resizes the views container height to browser window height.
		$ ("div.views").css ("height", (window.innerHeight + "px"));
		// Fixing "offline" event on the browser window.
		$ (window).on ("offline", () => {
			// Destroys the previously shown message box and shows a message box about a slow loading.
			let network_error = new MessageBox ("div.other-views", new Object ({title: "Méssage de connexion",
				text: "Le navigateur viens d'être mis hors réseau. Veuillez vérifier votre wifi ou câble Ethernet, puis reéssayer.",
				options: [{text: "OK", title: "OK.", click: () => network_error.visibility (false)}], zindex: 1
			// Shows the message box.
			}), false, "ntk-err"); network_error.visibility (true);
		});
	// Fixing "online" event on the browser window.
	} $ (window).on ("online", () => window.location.reload ()); check_responsive (); $ ("script").remove ();
});
