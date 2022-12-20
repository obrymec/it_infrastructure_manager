// Locals attributes.
window.sign_confirm_pass = __ ("input#confirm-password");
window.sign_container = __ ("div.sign-container");
window.sign_password = __ ("input#password");
window.sign_fields = __ ("div.sign-fields");
window.sign_options = __ ("div.options");
window.sign_email = __ ("input#email");
window.lock = false;

// Adjusts the target elements into the DOM.
function adjust () {
	// Getting the window size: Width and Height.
	let size = [(window.innerWidth + "px"), (window.innerHeight + "px")];
	// Updates target tag element(s) size.
	$ ("div.img-zone > img, div.sign-fields").css ("width", size [0]).css ("height", size [1]);
}

// Puts a mouse focus effect to an input.
function focuser (element, color = "skyblue") {
	// Apply input focus effect.
	$ (element).css ("transition", "box-shadow 0.4s").css ("font-weight", "bold").css ("box-shadow", ("0 0 10px " + color));
}

// Puts a mouse blur effect to an input.
function blurer (element, color = "silver") {
	// Apply input blur focus effect.
	$ (element).css ("box-shadow", ("0 0 5px " + color)).css ("font-weight", "normal");
}

// Animates the last field of a sign up page.
function animate_options (finished) {$ ("div.cpass-icon-zone > svg").css ("opacity", 1);
	// Animates the sign page provided options.
	apply_css_animation (new Object ({name: "options_show", duration: 150, ref: sign_options, finish: finished}),
	new Object ({opacity: 1, transform: "translateY(0)"}));		
}

// Loads a sign page.
function load_sign (path) {
	// Checks the network.
	if (typeof path === "string" && network_manager ()) sign_animation (0, () => {
		// Destroys all unusefull variables.
		destroy_props (["sign_confirm_pass", "sign_password", "sign_email", "sign_options", "sign_container", "sign_fields", "lock"]);
		// Updates the sign in global variable.
		window.SIGN_IN = (window.SIGN_IN ? false : true);
		// Loads the target sign web page.
		load_view (path, "div.views", "Chargement...", "Veillez patienter pendant qu'on charge les données de l'application.");
	});
}

// Animates common sign elements.
function animate_elements (finished, title) {
	// Hides confirm password icon field.
	$ ("div.cpass-icon-zone > svg").css ("opacity", 0);
	// Password field animation.
	apply_css_animation ({name: "field_resize", duration: 150, direction: "reverse", ref: sign_password, finish: () => {
		// Hides password icon field.
		$ ("div.pass-icon-zone > svg").css ("opacity", 0);
		// Email field animation.
		apply_css_animation ({name: "field_resize", duration: 150, direction: "reverse", ref: sign_email, finish: () => {
			// Hides email icon field.
			$ ("div.email-icon-zone > svg").css ("opacity", 0);
			// Animates the title view.
			animate_text (__ ("div.title > label"), title, 15, 0, 1, true, () => {
				// Disables blur effect.
				$ (sign_fields).css ("backdrop-filter", "blur(0)");
				// Animates sign fields container.
				apply_css_animation (new Object ({name: "fadeout", duration: 300, direction: "reverse", ref: sign_fields, finish: () => {
					// Animates sign container.
					apply_css_animation (new Object ({name: "sign_in_up", duration: 300, direction: "reverse", ref: sign_container,
					finish: finished}), new Object ({top: "-100%", visibility: "hidden"}));
				}}), new Object ({opacity: 0}));
			});
		}}, new Object ({opacity: 0, width: 0}));
	}}, new Object ({opacity: 0, width: 0}));
}

// Animates the current page.
function sign_animation (direction = 1, finished = null) {
	// Disabled a certains features.
	$ ("input").css ("pointer-events", "none"); title = (window.SIGN_IN ? "Identification" : "Inscription");
	// Checks animation direction.
	if (direction >= 1) apply_css_animation (new Object ({name: "sign_in_up", duration: 300, ref: sign_container, finish: () => {
		// Enables blur effect.
		$ (sign_fields).css ("backdrop-filter", "blur(2px)");
		// Animates sign fields container.
		apply_css_animation (new Object ({name: "fadeout", duration: 300, ref: sign_fields, finish: () => {
			// Title animation.
			animate_text (__ ("div.title > label"), title, 25, 0, -1, false, () => {
				// Email field animation.
				apply_css_animation (new Object ({name: "field_resize", duration: 150, ref: sign_email, finish: () => {
					// Shows email icon field.
					$ ("div.email-icon-zone > svg").css ("opacity", 1);
					// Password field animation.
					apply_css_animation (new Object ({name: "field_resize", duration: 150, ref: sign_password, finish: () => {
						// Shows password icon field.
						$ ("div.pass-icon-zone > svg").css ("opacity", 1);
						// The current page is sign in.
						if (window.SIGN_IN) animate_options (finished);
						// The current page is sign up.
						else apply_css_animation (new Object ({name: "field_resize", duration: 150, ref: sign_confirm_pass,
						finish: () => animate_options (finished)}), new Object ({opacity: 1, width: "250px"}));
					}}), new Object ({opacity: 1, width: "250px"}));
				}}), new Object ({opacity: 1, width: "250px"}));
			});
		}}), new Object ({opacity: 1}));	
	}}), new Object ({top: 0, visibility: "visible"}));
	// Otherwise.
	else apply_css_animation ({name: "options_show", duration: 150, direction: "reverse", ref: sign_options, finish: () => {
		// The current page is sign in.
		if (window.SIGN_IN) animate_elements (finished, title);
		// The current page is sign up.
		else apply_css_animation (new Object ({name: "field_resize", duration: 150, direction: "reverse", ref: sign_confirm_pass,
		finish: () => animate_elements (finished, title)}), new Object ({opacity: 0, width: 0}));
	}}, new Object ({opacity: 0, transform: "translateY(-53.5px)"}));
}

// Manages message box.
function message_box (message) {
	// Create a new instance of the message.
	let message_box = new MessageBox ("div.other-views", new Object ({text: message, title: "Méssage serveur", color: "red",
	zindex: 1, options: [{text: "OK", title: "Ok.", click: () => message_box.visibility (false, () => window.lock = false)}]
	// Shows the message box.
	})); message_box.visibility (true);
}

// A user sign in manager.
function sign_in () {
	// Checks the network.
	if (network_manager () && !window.lock) {
		// Contains all fields data that will be sent.
		let form_data = [{type: "email", id: "div.email-zone > input", required: true, value: $ ("div.email-zone > input").val ()},
			{type: "password", id: "div.password-zone > input", required: true, value: $ ("div.password-zone > input").val ()}
		// Checking the given data.
		]; make_request ("/sign-in", "POST", new Object ({data: form_data}), server => {
			// The server data contains some errors.
			if (Array.isArray (server.errors)) message_box (server.errors [0].message); else {
				// Loads the application dashboard and gets the current user id.
				set_cookie ("it_user", server.user_id, (20 / 60)); load_sign ("../views/dashboard.html");
			}
		// Disables any potentials actions.
		}, null, 180000, 0, true); window.lock = true;
	}
}

// A user sign up manager.
function sign_up () {
	// Checks the network.
	if (network_manager () && !window.lock) {
		// Contains all fields data that will be sent.
		let form_data = [{type: "email", id: "div.email-zone > input", required: true, value: $ ("div.email-zone > input").val ()},
			{type: "password", id: "div.password-zone > input", required: true, value: $ ("div.password-zone > input").val ()},
			{type: "password", id: "div.confirm-password-zone > input", required: true, value: $ ("div.confirm-password-zone > input").val ()}
		// Checking the given data.
		]; make_request ("/sign-up", "POST", new Object ({data: form_data}), server => {
			// For empty fields.
			if (Array.isArray (server.errors) && server.errors [0].message === "Ce champ n'a pas été renseigné.") {
				// Changes the server message.
				server.errors [0].message = "Des champs n'ont pas été renseignés. Veuillez les remplir afin de poursuivre l'opération.";
			// The server data contains some errors.
			} if (Array.isArray (server.errors)) message_box (server.errors [0].message); else load_sign ("../views/sign.html");
		// Disables any potentials actions.
		}, null, 180000, 0, true); window.lock = true;
	}
}

// Called when this web page is fulled loaded.
$ (() => {
	// Draws the loader for sign web page image loading.
	draw_loader (new Object ({title: window.MESSAGES [2], parent: "div.views", label: "Chargement...", id: "sign"}));
	// Waiting for the background image loaded.
	$ ("div.img-zone > img").attr ("src", (window.SIGN_IN ? "../images/sign_in.jpg" : "../images/sign_up.jpeg")).on ("load", () => {
		// Waiting for the given delay.
		window.setTimeout (() => {
			// Displays the confirm password field with the loaded sign page.
			$ ("div.confirm-password-zone").css ("display", (window.SIGN_IN ? "none" : "flex")); $ ("div#ld-sign").remove ();
			// Fixing resizing event on background image.
			adjust (); $ (window).resize (() => adjust ()); $ (sign_options).css ("margin-top", (window.SIGN_IN ? 0 : "18px"));
			// Animates the sign page.
			sign_animation (1, () => {$ ("input").css ("pointer-events", "auto"); let options = $ (sign_options).children ();
				// Password input container hover effect.
				$ ("div.password-zone").hover (() => $ ("div.pass-cls-icon").click (() => $ (sign_password).val (''))
					.css ("visibility", "visible"), () => $ ("div.pass-cls-icon").css ("visibility", "hidden"));
				// Email input container hover effect.
				$ ("div.email-zone").hover (() => $ ("div.email-cls-icon").click (() => $ (sign_email).val (''))
					.css ("visibility", "visible"), () => $ ("div.email-cls-icon").css ("visibility", "hidden"));
				// Password focus and blur event fixing.
				$ (sign_password).focus (() => focuser (sign_password)).blur (() => blurer (sign_password));
				// Email focus and blur event fixing.
				$ (sign_email).focus (() => focuser (sign_email)).blur (() => blurer (sign_email));
				// Fixing left button action.
				options [0].addEventListener ("click", () => load_sign ("../views/sign.html"));
				// Is it a sign in page ?
				if (window.SIGN_IN) {
					// Fixing "keydown" event on password field.
					sign_password.addEventListener ("keydown", event => {if (event.key == "Enter") sign_in ();});
					// Fixing "keydown" event on email field.
					sign_email.addEventListener ("keydown", event => {if (event.key == "Enter") sign_in ();});
					// Fixing options rules and data value.
					options [0].title = "Vous n'avez pas encore un compte."; options [0].value = "S'incrire";
					options [1].title = "Se connecter maintenant ?"; options [1].value = "Connexion";
					// Fixing right button action.
					options [1].addEventListener ("click", () => sign_in ());
				// Otherwise.
				} else {
					// Confirm password input container hover effect.
					$ ("div.confirm-password-zone").hover (() => $ ("div.cpass-cls-icon").click (() => $ (sign_confirm_pass).val (''))
						.css ("visibility", "visible"), () => $ ("div.cpass-cls-icon").css ("visibility", "hidden"));
					// Confirm password focus and blur event fixing.
					$ (sign_confirm_pass).focus (() => focuser (sign_confirm_pass)).blur (() => blurer (sign_confirm_pass));
					// Fixing "keydown" event on confirm password field.
					sign_confirm_pass.addEventListener ("keydown", event => {if (event.key == "Enter") sign_up ();});
					// Fixing "keydown" event on password field.
					sign_password.addEventListener ("keydown", event => {if (event.key == "Enter") sign_up ();});
					// Fixing "keydown" event on email field.
					sign_email.addEventListener ("keydown", event => {if (event.key == "Enter") sign_up ();});
					// Fixing options rules and data value.
					options [1].title = "Lancer la création de votre compte ?"; options [1].value = "Inscription";
					options [0].title = "Se connecter maintenant ?"; options [0].value = "Se connecter";
					// Fixing right button action.
					options [1].addEventListener ("click", () => sign_up ());
				}
			});
		}, 0);
	// Removes this script.
	}); $ ("script").remove ();
});
