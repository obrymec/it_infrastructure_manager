/**
* @project It Manager - https://it-infrastructure-manager.onrender.com
* @author Obrymec - obrymecsprinces@gmail.com
* @fileoverview Crud view component.
* @created 2021-12-17
* @updated 2024-04-21
* @file crud_view.js
* @supported DESKTOP
* @version 0.0.2
*/

// Crud view class definition.
function CrudView (parent, keys = [], id = null) {
	// Attributes.
	let scroll = 0, scroll_id = null, ad_id = null, up_id = null, dw_id = null, fcard = null, lcard = null;
	let cu_data = [], mui_id = null, mdi_id = null, ip_id = null, itc_id = null, cls_id = null, cu_id = null;
	let cnt_id = null, msg_id = null, is_show = false, sh_id = null, rf_id = null, hdr_id = null;

	// Builds the toolbar on the app view.
	this._build = () => {
		// Try to corrects the given parent id.
		parent = (!is_empty (parent) ? String (parent).replace (' ', '') : null);
		// A parent has been specified.
		if (parent != null) {
			// Generating the toolbar id.
			id = (!is_empty (id) ? String (id).replace (' ', '') : parseInt (Math.random () * 10000000));
			// Configures subs ids.
			ad_id = ("div#tb-ar-" + id); up_id = ("div#tb-mu-" + id); dw_id = ("div#tb-md-" + id); cu_id = ("div#cu-" + id);
			mui_id = ("div#tb-mui-" + id + " > a"); mdi_id = ("div#tb-mdi-" + id + " > a"); cnt_id = ("div#cu-cnt-" + id);
			ip_id = ("div#shr-fd-" + id + " > input[type='text']"); itc_id = ("div#shr-itc-" + id + " > label");
			cls_id = ("div#shr-cls-" + id + " > svg"); msg_id = ("div#cu-msg-" + id + " > label"); hdr_id = ("div#cu-hdr-" + id);
			sh_id = ("div#tb-sh-" + id); rf_id = ("div#tb-rf-" + id);
			// Generating crud view html code.
			$ (parent).append ("<div class = 'crud-view vflex' id = 'cu-" + id + "'>\
				<div class = 'crud-header' id = 'cu-hdr-" + id + "'><div class = 'searcher' id = 'shr-" + id + "'>\
					<svg fill = 'none' height = '20px' stroke = 'grey' stroke-width = '2' viewBox = '0 0 24 24' width = '20px'>\
						<circle cx = '10.5' cy = '10.5' r = '7.5'/><line x1 = '21' x2 = '15.8' y1 = '21' y2 = '15.8'/>\
					</svg></div><div class = 'search-field' id = 'shr-fd-" + id + "'>\
						<input type = 'text' placeholder = 'Search' title = \"Search for a given item.\"/>\
						<div class = 'field-clear' id = 'shr-cls-" + id + "' title = \"Completely clean the entered value.\">\
							<svg height = '20px' style = 'enable-background:new 0 0 512 512;' viewBox = '0 0 512 512'\
								width = '20px' fill = 'silver'><g><path d = 'M256,33C132.3,33,32,133.3,32,257c0,123.7,\
								100.3,224,224,224c123.7,0,224-100.3,224-224C480,133.3,379.7,33,256,33z M364.3,332.5c1.5,\
								1.5,2.3,3.5,2.3,5.6c0,2.1-0.8,4.2-2.3,5.6l-21.6,21.7c-1.6,1.6-3.6,2.3-5.6,2.3c-2,0-4.1-0.8-5.6-2.3L256,\
								289.8 l-75.4,75.7c-1.5,1.6-3.6,2.3-5.6,2.3c-2,0-4.1-0.8-5.6-2.3l-21.6-21.7c-1.5-1.5-2.3-3.5-2.3-5.6c0-2.1,\
								0.8-4.2,2.3-5.6l75.7-76 l-75.9-75c-3.1-3.1-3.1-8.2,0-11.3l21.6-21.7c1.5-1.5,\
								3.5-2.3,5.6-2.3c2.1,0,4.1,0.8,5.6,2.3l75.7,74.7l75.7-74.7 c1.5-1.5,3.5-2.3,\
								5.6-2.3c2.1,0,4.1,0.8,5.6,2.3l21.6,21.7c3.1,3.1,3.1,8.2,0,11.3l-75.9,75L364.3,332.5z'/></g>\
							</svg>\
						</div>\
					</div><div class = 'item-count' id = 'shr-itc-" + id + "'><label>0</label></div>\
				</div><div class = 'crud-content' id = 'cu-cnt-" + id + "'>\
					<div class = 'crud-msg center grc-msg' id = 'cu-msg-" + id + "'>\
						<div class = 'empty-answer' align = 'center' style = 'visibility: hidden;'>\
							<svg viewBox = '0 0 384 512' width = '24px' height = '24px' fill = 'rgb(165, 165, 165)'>\
								<path d = 'M0 32C0 14.33 14.33 0 32 0H352C369.7 0 384 14.33 384 \
								32C384 49.67 369.7 64 352 64V74.98C352 117.4 335.1 158.1 305.1 \
								188.1L237.3 256L305.1 323.9C335.1 353.9 352 394.6 352 437V448C369.7 \
								448 384 462.3 384 480C384 497.7 369.7 512 352 512H32C14.33 512 \
								0 497.7 0 480C0 462.3 14.33 448 32 448V437C32 394.6 48.86 353.9 \
								78.86 323.9L146.7 256L78.86 188.1C48.86 158.1 32 117.4 32 74.98V64C14.33 \
								64 0 49.67 0 32zM96 64V74.98C96 100.4 106.1 124.9 124.1 142.9L192 \
								210.7L259.9 142.9C277.9 124.9 288 100.4 288 74.98V64H96zM96 \
								448H288V437C288 411.6 277.9 387.1 259.9 369.1L192 301.3L124.1 \
								369.1C106.1 387.1 96 411.6 96 437V448z'/>\
							</svg>\
						</div><label></label>\
					</div>\
				</div>\
				<div class = 'crud-toolbar' id = 'cu-tb-" + id + "'>\
					<div class = 'main-options'>\
						<div class = 'ar' id = 'tb-ar-" + id + "'>\
							<div class = 'ari' id = 'tb-ari-" + id + "' title = \"Add an item.\">\
								<svg viewBox = '0 0 32 32' width = '40px' height = '40px'>\
									<defs><style>line.cls-2{fill: none; stroke: grey; stroke-width: 2px;}</style></defs>\
									<g><line class = 'cls-2' x1 = '16' x2 = '16' y1 = '7' y2 = '25'/>\
									<line class = 'cls-2' x1 = '7' x2 = '25' y1 = '16' y2 = '16'/></g>\
								</svg>\
							</div>\
						</div>\
						<div class = 'sh' id = 'tb-sh-" + id + "'>\
							<div class = 'shi' id = 'tb-shi-" + id + "' title = \"Search for an item.\">\
								<svg fill = 'none' height = '25px' width = '25px' stroke = 'grey' stroke-width = '2' viewBox = '0 0 24 24'>\
									<circle cx = '10.5' cy = '10.5' r = '7.5'/><line x1 = '21' x2 = '15.8' y1 = '21' y2 = '15.8'/>\
								</svg>\
							</div>\
						</div>\
						<div class = 'rf' id = 'tb-rf-" + id + "'>\
							<div class = 'rfi' id = 'tb-rfi-" + id + "' title = \"Refresh section.\">\
								<svg viewBox = '0 0 512 512' width = '20px' height = '20px' fill = 'grey'>\
									<path d = 'M496 48V192c0 17.69-14.31 32-32 32H320c-17.69 0-32-14.31-32-32s14.31-32 \
									32-32h63.39c-29.97-39.7-77.25-63.78-127.6-63.78C167.7 96.22 96 167.9 96 256s71.69 \
									159.8 159.8 159.8c34.88 0 68.03-11.03 95.88-31.94c14.22-10.53 34.22-7.75 44.81 \
									6.375c10.59 14.16 7.75 34.22-6.375 44.81c-39.03 29.28-85.36 44.86-134.2 44.86C132.5 \
									479.9 32 379.4 32 256s100.5-223.9 223.9-223.9c69.15 0 134 32.47 176.1 86.12V48c0-17.69 \
									14.31-32 32-32S496 30.31 496 48z'/>\
								</svg>\
							</div>\
						</div>\
					</div>\
					<div class = 'mu' id = 'tb-mu-" + id + "'>\
						<div class = 'mui' id = 'tb-mui-" + id + "' title = 'Refresh section.'>\
							<a><svg height = '28px' viewBox = '0 0 512 512' width = '28px' fill = 'grey'>\
								<polygon points = '396.6,352 416,331.3 256,160 96,331.3 115.3,352 256,201.5'/>\
							</svg></a>\
						</div>\
					</div>\
					<div class = 'md' id = 'tb-md-" + id + "'>\
						<div class = 'mdi' id = 'tb-mdi-" + id + "' title = 'Quick scroll down.'>\
							<a><svg height = '28px' viewBox = '0 0 512 512' width = '28px' fill = 'grey'>\
								<polygon points = '396.6,352 416,331.3 256,160 96,331.3 115.3,352 256,201.5'/>\
							</svg></a>\
						</div>\
					</div>\
				</div>\
			</div>");
			// Fixing "click" event on search icon manager.
			$ (sh_id).click (() => {
				// The search bar is it show ?
				if (!is_show) {$ (hdr_id).css ("margin-top", 0); __ (ip_id).focus (); is_show = true;}
				// Otherwise.
				else {$ (hdr_id).css ("margin-top", "-47px"); __ (ip_id).blur (); is_show = false;}
			// Fixing "click" event on scroll to up manager.
			}); $ (mui_id).click (() => apply_css_animation (new Object ({name: "bg_blink", duration: 800, easing: "linear",
				iteration: 3, ref: fcard}), new Object ({backgroundColor: "#fff"})));
			// Fixing "click" event on scroll to down manager.
			$ (mdi_id).click (() => apply_css_animation (new Object ({name: "bg_blink", duration: 800, easing: "linear",
				iteration: 3, ref: lcard}), new Object ({backgroundColor: "#fff"})));
			// Fixing "click" event on clear icon.
			$ (cls_id).click (() => {if (str_check ($ (ip_id).val ()) != null) {
				// Clears input content value and gets his content value.
				$ (ip_id).val (''); this.search ($ (ip_id).val ());
			// Fixing "input" event to check his value whether it changed.
			}}); $ (ip_id).on ("input", () => this.search ($ (ip_id).val ()));
			// Fixing "scroll" event on the crud view content.
			$ (cnt_id).on ("scroll", event => {
				// Clears the current process whether it active.
				if (!is_empty (scroll_id)) window.clearTimeout (scroll_id);
				// For Scroll down event.
				if (event.target.scrollTop > scroll) {
					// Hides up arrow link.
					$ (up_id).css ("transform", "translate(20px, -100px)").css ("visibility", "hidden").css ("opacity", 0);
					// Shows down arrow link.
					$ (dw_id).css ("transform", "translate(-20px, 0)").css ("visibility", "visible").css ("opacity", 1);
					// Waiting for a few moment before hiding the current arrow.
					scroll_id = window.setTimeout (() => {
						// Hides down arrow link.
						$ (dw_id).animate ({opacity: 0}, 300, function () {
							// Hides the current arrow.
							$ (this).css ("transform", "translate(-20px, -100px)").css ("visibility", "hidden");
						});
					}, 3000);
				// Otherwise.
				} else {
					// Hides down arrow link.
					$ (dw_id).css ("transform", "translate(-20px, -100px)").css ("visibility", "hidden").css ("opacity", 0);
					// Shows up arrow link.
					$ (up_id).css ("transform", "translate(20px, 0)").css ("visibility", "visible").css ("opacity", 1);
					// Waiting for a few moment before hiding the current arrow.
					scroll_id = window.setTimeout (() => {
						// Hides up arrow link.
						$ (up_id).animate ({opacity: 0}, 300, function () {
							// Hides this arrow.
							$ (this).css ("transform", "translate(20px, -100px)").css ("visibility", "hidden");
						});
					}, 3000);
				// Updates the last scroll value.
				} scroll = event.target.scrollTop;
			});
		// Error message for missing.
		} else console.error ("Missing toolbar parent id !");
	}

	// Searches an element into the loaded crud data.
	this.search = (entry) => {
		// Checks the entry value.
		let filter = []; if (str_check (entry) != null) {
			// Hides add button.
			if ($ (ad_id).css ("display") !== "none") apply_css_animation (new Object ({name: "scale", duration: 200,
				ref: __ (ad_id), direction: "reverse"}), new Object ({transform: "scale(0)", display: "none"}));
			// Hides search button.
			if ($ (sh_id).css ("display") !== "none") apply_css_animation (new Object ({name: "scale", duration: 200,
				ref: __ (sh_id), direction: "reverse"}), new Object ({transform: "scale(0)", display: "none"}));
			// Hides all loaded elements and checks keys type.
			this._items_display (cu_data, null); if (typeof keys === "object" && keys.length) {
				// Filters all given data.
				filter = _.filter (cu_data, obj => {
					// Starts checking data.
					for (let key of Object.keys (obj)) {
						// The current key is inside of the passed keys list.
						if (!is_empty (_.find (keys, item => {return key.toLowerCase () === item.toLowerCase ()}))) {
							// Any key checks the imposed statement.
							if (String (obj [key]).toLowerCase ().includes (entry.toLowerCase ())) return true;
						}
					// No elements found.
					} return false;
				});
			// Checks the result length.
			} if (filter.length) {
				// Destroys "no-result" label text and shows all filtered elements.
				$ (msg_id).text (''); $ (itc_id).text (filter.length); this._items_display (filter, "inline-block");
				$ ($ (msg_id).parent ().children () [0]).css ("visibility", "hidden");
			// Otherwise.
			} else {
				// Shows graphics for no result found.
				$ ($ (msg_id).parent ().children () [0]).css ("visibility", "visible");
				$ (msg_id).text ("No result"); $ (itc_id).text (filter.length);
			}
		// Shows all items data card and updates the total result found.
		} else {
			// Shows add button.
			if ($ (ad_id).css ("display") !== "inline-block") apply_css_animation (new Object ({name: "scale", duration: 200,
				ref: __ (ad_id)}), new Object ({transform: "scale(1)"})); $ (ad_id).css ("display", "inline-block");
			// Shows search button.
			if ($ (sh_id).css ("display") !== "inline-block") apply_css_animation (new Object ({name: "scale", duration: 200,
				ref: __ (sh_id)}), new Object ({transform: "scale(1)"})); $ (sh_id).css ("display", "inline-block");
			// Resets values.
			this._items_display (cu_data, "inline-block"); $ (itc_id).text (cu_data.length); $ (msg_id).text ('');
			$ ($ (msg_id).parent ().children () [0]).css ("visibility", "hidden");
		}
	}

	// Manages items data card display.
	this._items_display = (data, value) => {
		// Hides/Shows all passed elements.
		data.forEach ((elmt, index) => {if (typeof elmt === "object" && elmt.hasOwnProperty ("ID") && typeof elmt.ID === "string") {
			// Sets the display css property of the current element tag.
			$ (elmt.ID.replace (' ', '')).css ("display", ((str_check (value) != null) ? value.replace (' ', '') : "none"));
			// Overrides arrows action.
			this.override_up_down_action (data.length, index, (elmt.hasOwnProperty ("ref") ? elmt.ref : null));
		}});
	}

	// Overrides up and down arrow action.
	this.override_up_down_action = (count, index, card) => {
		// The given reference is validate.
		if (card instanceof DataCard) {
			// Gets the first element from the list.
			if (index === 0) {
				// Gets the first reference of the first data card on loaded cards and updates first card reference.
				$ (mui_id).attr ("href", card.get_id ().replace ("div", '')); fcard = __ (card.get_id ());
			// Gets the last element from the list.
			} else if (index === (count - 1)) {
				// Gets reference of the last data card on loaded cards and updates last card reference.
				$ (mdi_id).attr ("href", card.get_id ().replace ("div", '')); lcard = __ (card.get_id ());
			}
		}
	}

	// Checks crud data content.
	this.check_data = () => {
		// Checks data length.
		if (cu_data.length > 0) {
			// Shows search button option.
			$ (sh_id).css ("display", "inline-block").css ("pointer-events", "auto"); $ (msg_id).text ('');
			// Destroys "no data" message.
			$ ($ (msg_id).parent ().children () [0]).css ("visibility", "hidden");
		} else {
			// Hides the search input field.
			if (is_show) {$ (hdr_id).css ("margin-top", "-47px"); __ (ip_id).blur (); is_show = false;}
			// Hides search button option and shows "No data" message.
			$ (sh_id).css ("display", "none").css ("pointer-events", "none"); $ (msg_id).text ("No data");
			// Displays a message to warns user about empty data case and clears input field content value.
			$ ($ (msg_id).parent ().children () [0]).css ("visibility", "visible"); $ (ip_id).val (''); 
		}
	}

	// Changes the crud data.
	this.set_data = (new_data) => cu_data = new_data;

	// Changes the first captured card item reference.
	this.set_first_card_ref = (new_ref) => fcard = new_ref;

	// Changes the last captured card item reference.
	this.set_last_card_ref = (new_ref) => lcard = new_ref;

	// Returns the object reference of the first item.
	this.get_first_card_ref = () => {return fcard;}

	// Returns the object reference of the last item.
	this.get_last_card_ref = () => {return lcard;}

	// Returns the toolbar data content.
	this.get_data = () => {return cu_data;}

	// Returns the search button id.
	this.get_search_button_id = () => {return sh_id;}

	// Returns the add button id.
	this.get_add_button_id = () => {return (ad_id);}

	// Returns the crud view id.
	this.get_crud_id = () => {return cu_id;}

	// Returns the search bar input field id.
	this.get_input_id = () => {return ip_id;}

	// Returns item count id.
	this.get_item_count_id = () => {return itc_id;}

	// Returns clear icon id.
	this.get_cls_icon_id = () => {return cls_id;}

	// Returns the crud content id.
	this.get_content_id = () => {return cnt_id;}

	// Returns refresh button id.
	this.get_refresh_button_id = () => {return rf_id;}

	// Returns the up arrow id.
	this.get_uparrow_id = () => {return mui_id;}

	// Returns the down arrow id.
	this.get_downarrow_id = () => {return mdi_id;}

	// Builds the crud view component.
	this._build ();
}
