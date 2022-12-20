// Attributes.
window.prv_keys = ["Nom", "Prénom(s)", "Numéro de téléphone", "Adresse", "ID", "Nombre de problèmes"];
window.prv_tc = new TabControl ("div.providers-manager", "prv-tabctrl");
window.prv_sec_idx = get_cookie ("it_prv_tab_sec");
window.prv_sec_idx = (!is_empty (window.prv_sec_idx) ? window.prv_sec_idx : 0);

// Draws a provider data.
function draw_provider (item, toolbar, index, length) {
	// The passed elements is it an object ?
	if (typeof item === "object" && toolbar instanceof CrudView) {
		// Creating a new data card.
		let pcard = new DataCard (toolbar.get_content_id (), new Object ({}), item.ID); pcard.set_index (index + 1);
		// Sets data card icon.
		pcard.set_icon ("<svg width = '85px' height = '85px' viewBox = '0 0 1024 1024'>\
       		<g transform = 'translate(0, 1024) scale(0.1, -0.1)' fill = 'grey' stroke = 'none'>\
       		<path d = 'M2849 9640 c-49 -26 -96 -82 -109 -129 -7 -27 -9 -420 -8 -1235 l3\
       		-1196 -1285 0 c-1221 0 -1287 -1 -1325 -19 -51 -23 -101 -79 -114 -128 -8 -26\
       		-11 -753 -11 -2303 0 -2185 1 -2266 19 -2305 22 -47 74 -99 114 -114 20 -8\
       		1513 -11 4985 -11 4773 0 4958 1 4997 19 51 23 101 79 114 128 15 53 15 2293\
       		0 2346 -5 21 -24 53 -41 73 -62 71 -47 68 -518 74 l-424 5 -398 1314 c-218\
       		723 -405 1326 -416 1340 -10 14 -35 39 -56 55 l-38 31 -873 5 -874 5 -28 27\
       		c-26 24 -3440 1979 -3528 2019 -53 24 -139 24 -186 -1z m1875 -1450 l1481\
       		-845 0 -2360 0 -2360 -222 -3 -223 -2 0 2137 c0 1461 -3 2150 -11 2176 -13 49\
       		-63 105 -114 128 -38 18 -102 19 -1264 19 l-1223 0 6 31 c3 17 6 468 6 1001\
       		l0 969 41 -23 c23 -13 708 -403 1523 -868z m3376 -1025 c0 -21 794 -2626 808\
       		-2649 10 -17 37 -44 61 -61 l43 -30 399 -3 399 -3 0 -899 0 -900 -1587 2\
       		-1588 3 -3 2260 c-1 1243 0 2266 3 2273 3 9 160 12 735 12 401 0 730 -2 730\
       		-5z m-2770 -2520 l0 -2015 -2450 0 -2450 0 0 2015 0 2015 2450 0 2450 0 0\
       		-2015z'/><path d = 'M6945 4115 c-5 -2 -23 -6 -38 -9 -16 -4 -48 -25 -73 -48 -111 -102\
       		-87 -275 47 -342 53 -26 55 -26 278 -26 127 0 243 5 264 11 82 22 146 111 147\
       		202 0 85 -39 149 -115 190 -37 21 -56 22 -270 24 -126 1 -234 0 -240 -2z'/>\
       		<path d = 'M2425 2020 c-407 -55 -690 -438 -621 -840 32 -184 149 -370 295 -469\
       		133 -90 226 -121 386 -128 101 -5 134 -2 203 15 209 53 373 183 471 372 64\
       		124 76 176 75 335 0 127 -2 147 -28 220 -67 193 -191 337 -370 427 -111 56\
       		-285 85 -411 68z m220 -450 c184 -89 226 -337 82 -478 -60 -59 -126 -86 -212\
       		-86 -112 0 -205 55 -260 155 -27 48 -30 63 -30 139 0 70 4 93 24 130 41 79\
       		105 133 191 161 45 15 154 4 205 -21z'/><path d = 'M8594 2019 c-226 -29 -420 -156 -534 -348 -119 -201 -133 -463 -36\
       		-668 63 -132 143 -227 254 -301 124 -83 253 -122 405 -122 119 0 213 22 327\
       		78 79 38 109 60 181 132 71 71 94 101 132 180 64 130 81 201 81 335 -1 194\
       		-61 347 -190 484 -125 133 -271 209 -445 231 -91 11 -87 11 -175 -1z m216\
       		-449 c61 -30 106 -75 138 -135 23 -43 27 -63 27 -135 0 -76 -3 -91 -30 -139\
       		-33 -60 -104 -122 -162 -142 -60 -21 -160 -16 -218 10 -249 111 -231 472 28 557 60 20 161 12 217 -16z'/></g>\
       	</svg>"); pcard.set_radius (0, 5, 5, 0); pcard.override_data (item);
		// Overrides arrows action.
		toolbar.override_up_down_action (length, index, pcard); pcard.set_title (item ["Prénom(s)"] + ' ' + item.Nom);
		// Changes the default size of the created card.
		$ (pcard.get_id ()).css ("border", "1px solid silver").css ("box-shadow", "none").hover (function () {
			$ (this).css ("background-image", "linear-gradient(rgb(203, 226, 243), #fff, rgb(203, 226, 243)")
			.css ("box-shadow", "0 0 8px gray");
		}, function () {$ (this).css ("background-image", "none").css ("box-shadow", "0 0 0 transparent");});
		// Contains all data that will be shown.
		toolbar.get_data ().push (_.extend (pcard.get_data (), new Object ({ID: pcard.get_id (), ref: pcard})));
		// Shows the data card.
		window.setTimeout (() => pcard.visibility (true), window.DELAY); window.DELAY += 150;
	}
}

// Loads good providers crud web page view.
function load_good_providers () {
	// Loads goods providers web page.
	load_view ("../views/good_providers.html", window.prv_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["bad_prd_crud"]); set_cookie ("it_prv_tab_sec", 0, 365); window.prv_sec_idx = 0;
}

// Loads bad providers crud web page view.
function load_bad_providers () {
	// Loads bad providers web page.
	load_view ("../views/bad_providers.html", window.prv_tc.get_tab_content_id (), window.MESSAGES [2], window.MESSAGES [3]);
	// Destroys external property and updates browser cookies.
	destroy_props (["god_prd_crud"]); set_cookie ("it_prv_tab_sec", 1, 365); window.prv_sec_idx = 1;
}


// Called when this web page is fulled loaded.
$ (() => {
	// Changes the dashboard text title.
	animate_text (__ ("div.big-title > label"), "Fournisseurs", 35);
	// Fixing tabcontrol sections behavior.
	window.prv_tc.override_sections ([
		{text: "Excélent", title: "Consulter les meilleurs fournisseurs.", click: () => load_good_providers ()},
		{text: "Mauvais", title: "Consulter les mauvais fournisseurs.", click: () => load_bad_providers ()}
	], parseInt (window.prv_sec_idx)); $ ("script").remove ();
});
