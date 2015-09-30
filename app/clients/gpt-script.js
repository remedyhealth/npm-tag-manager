(function(__ad_data) {
	if (!__ad_data || !__ad_data.tag || __ad_data.tag === null) return;

	/**
	 * The page URL, to be passed into the ad server.
	 * @type String
	 */
	var url = (function() {
		var AD_SERVER_URL_MACRO = "JSVQQVRURVJOOnVybCUl";
		var q = {};
		var a = document.getElementById("adsuite");
		if (a) {
			var s = a.src;
			s.replace(
				new RegExp("([^?=&]+)(=([^&]*))?", "g"),
				function($0, $1, $2, $3) {
					q[$1] = $3;
				}
			);
		}
		var u = q['url'];

		//The following ensures that an unresolved ad server macro doesn't accidentally get used as the url.
		if (!u || btoa(u) === "" || btoa(u) === AD_SERVER_URL_MACRO) {
			u = location.href;
			break;
		}

		return u;
	})();

	/**
	 * Formats contextual keywords as an array.
	 * @type Array
	 */
	var context = (function() {
		var c = [],
			k = typeof __ad_data.context != "undefined" && __ad_data.context != null && typeof __ad_data.context.matches == "object" ? __ad_data.context.matches : null;
		if (!k) return;
		for (var t in k) {
			if (!k.hasOwnProperty(t)) continue;
			c.push(t);
		}
		return c;
	})();

	/**
	 * Format sizes as an array.
	 * @type String
	 * @private
	 */
	var sizes = (function() {
		var sizes = [],
			d;
		for (var s = 0, len = __ad_data.tag.sizes.length; s < len; s++) {
			d = __ad_data.tag.sizes[s].split("x");
			sizes.push(parseInt(d[0]), parseInt(d[1]));
		}
		return sizes;
	})();

	/**
	 * The click URL, to be passed into the ad server.
	 * @type String
	 * @private
	 */
	var clickUrl = __ad_data.clickUrl || "";

	/**
	 * The id attribute of the div element into which the ad will be injected.
	 * @type String
	 * @private
	 */
	var divId = 'ad-' + __ad_data.tag._id;

	/**
	 * This is standard GPT implementation code, and can be replaced with implementation code for any ad server.
	 */
	var googletag = window.googletag || {};
	googletag.cmd = googletag.cmd || [];

	googletag.cmd.push(function() {
		var slot = googletag.defineSlot(
			__ad_data.tag.adUnit,
			sizes,
			divId
		).addService(googletag.pubads());
		slot.setTargeting("url", url)
		slot.setTargeting("ct", context);
		slot.setTargeting("click", clickUrl);
		for (var key in __ad_data.tag.targeting) {
			slot.setTargeting(key, __ad_data.tag.targeting[key])
		}
		googletag.pubads().enableSyncRendering();
		googletag.enableServices();
		googletag.display(divId);
	});
})(__ad_data);
