// Attributes.
window.usr_slt_crud = new CrudView ("div.user-select", ["Prénom(s)", "Nom", "Adresse", "ID"], "usr-slt");

// Draws all availables data from an array of objects.
function draw_usr_slt_data (item, index, length) {
	// The passed elements is it an object ?
	if (typeof item === "object") {
		// Creating a new data card.
		let usr_card = new DataCard (usr_slt_crud.get_content_id (), new Object ({}), item.ID);
		// Overrides arrows action.
		window.usr_slt_crud.override_up_down_action (length, index, usr_card);
		// Sets data card icon.
		usr_card.set_icon ("<svg viewBox = '0 0 512 512' width = '80px' height = '80px' fill = 'grey'>\
			<path d = 'M256 112c-48.6 0-88 39.4-88 88C168 248.6 207.4 288 256 288s88-39.4 88-88C344 151.4 304.6 112 256 112zM256 \
			240c-22.06 0-40-17.95-40-40C216 177.9 233.9 160 256 160s40 17.94 40 40C296 222.1 278.1 240 256 240zM256 0C114.6 0 0 \
			114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-46.73 0-89.76-15.68-124.5-41.79C148.8 \
			389 182.4 368 220.2 368h71.69c37.75 0 71.31 21.01 88.68 54.21C345.8 448.3 302.7 464 256 464zM416.2 388.5C389.2 \
			346.3 343.2 320 291.8 320H220.2c-51.36 0-97.35 26.25-124.4 68.48C65.96 352.5 48 306.3 48 256c0-114.7 93.31-208 \
			208-208s208 93.31 208 208C464 306.3 446 352.5 416.2 388.5z'/>\
		</svg>");
		// Changes the default size of the created card.
		$ (usr_card.get_id ()).css ("border-bottom", "1px solid silver").css ("cursor", "pointer").css ("box-shadow", "none")
			.hover (function () {$ (this).css ("background-color", "rgb(158, 205, 243)");},
			function () {$ (this).css ("background-color", "#fff");});
		// Fix "click" event on this current card to opens a widget popup about user affectation.
		usr_card.override_data (item); usr_card.click (() => {
		 	// Binds data.
			window.elmt_slt = _.extend (usr_card.get_data (), {ref: "user"});
			// Runs commun tasks.
			commum_task ("assignment", "Affectation d'un utilisateur");
		// Shows the card and then increases the current delay.
		}); window.setTimeout (() => usr_card.visibility (true), window.DELAY); window.DELAY += 150;
		// Contains all data that will be shown.
		window.usr_slt_crud.get_data ().push (_.extend (usr_card.get_data (), {ID: usr_card.get_id (), ref: usr_card}));
	}
}

// Loads users data from the data base.
function load_users_data () {
	// Empty the crud content.
	$ (window.usr_slt_crud.get_content_id () + " > div.data-card").remove (); $ (window.usr_slt_crud.get_input_id ()).val ('');
	// Empty the crud data by clearing it.
	window.usr_slt_crud.get_data ().length = 0; $ (window.usr_slt_crud.get_item_count_id ()).text ('0');
	// Loads availables users.
	make_request ("/users-availables", "POST", {eq_id: window.selected_equipment.get_id ().replace ("div#cd-", '')}, server_data => {
		// Loading availables users from the database.
		window.DELAY = 0; server_data.data.forEach ((element, index) => {
			// Draws all logged users.
			draw_usr_slt_data (new Object ({
				ID: element._id, Nom: element.name, "Prénom(s)": element.surname, Adresse: element.address, disabled: ["ID"]
			}), index, server_data.length);
		// Listens crud data.
		}); listen_crud_data (window.usr_slt_crud);
	});
}

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on crud add button.
	$ (window.usr_slt_crud.get_add_button_id ()).click (() => generic_task ("add-user", "Inscrire un utilisateur"));
	// Fixing "click" event on crud refresh button.
	$ (window.usr_slt_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_users_data ();});
	// Overrides the current crud buttons title and loads all availables users from the data base.
	sets_crud_btns_title ("utilisateur", window.usr_slt_crud); load_users_data (); window.draw_usr_slt_data = draw_usr_slt_data;
	// Removes this script.
	$ ("script").remove ();
});
