function _getvhid() {
  var match = RegExp('[?&]vhid=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var _vhs = document.createElement("script");
_vhs.onload = function() {
	_VHparseID();
}
var _hcpidurl = '//id.verticalhealth.net/script.js';
var _vhid = _getvhid();
var _dfp_groups = [];
var _dfp_terms = [];
var _dfp_low = [];
var _dfp_high = [];
if(_vhid != null) {
	_hcpidurl += '?vhid='+vhid;
}
_vhs.src = _hcpidurl;
document.head.appendChild(_vhs);
function _VHparseID() {
	for(var g in window.__vhusr.vhgroups) {
		_dfp_groups.push(window.__vhusr.vhgroups[g]);
	}
  // render any pixels for the matched target groups
  if(window.__vhusr.pixels != undefined) {
    var _vhpx = document.createElement('div');
    _vhpx.style = 'display: none;';
    _vhpx.innerHTML = window.__vhusr.pixels;
    document.body.appendChild(_vhpx);
    // pixels are rendered, look for scripts to execute
    var _vhscrpts = _vhpx.getElementsByTagName('script');
    for (var _vhn=0; _vhn < _vhscrpts.length; _vhn++) {
      eval(_vhscrpts[_vhn].innerHTML);
    }
    // convert <span> into scripts
    var _vhpsuedos = _vhpx.getElementsByTagName('span');
    for (var _vhn=0; _vhn < _vhpsuedos.length; _vhn++) {
        var _vhxtra = document.createElement('script');
        _vhxtra.src = _vhpsuedos[_vhn].innerHTML;
        _vhpx.appendChild(_vhxtra);
    }
  }
	__render_ad();
}
//(function(__ad_data) {
function __render_ad() {
	if (!__ad_data || !__ad_data.tag || __ad_data.tag === null) return;

	// add utm_source to add server call
	try {
		if(document.referrer) {
			var rawurl = document.referrer;
		} else {
			var rawurl = document.location['href'];
		}
		var rawurlparts = rawurl.split('?');
		if(rawurlparts[1]) {
			var rawqueryparts = rawurlparts[rawurlparts.length - 1].split('&');
			var srcstr = '';
			for (var rawpair in rawqueryparts) {
				var rawkeys = rawqueryparts[rawpair].split('=');
				if(rawkeys[0] == 'utm_source') {
					_dfp_terms.push('utm_source_'+rawkeys[1]);
				}
			}
		}
	} catch(err) {}



	// parse context data
	if(__ad_data.context && __ad_data.context.matches) {
		var contextTerms = [];
		for(match in __ad_data.context.matches) {
			var term = match;
			var score = __ad_data.context.matches[match].score;
			if(score < 4) {
				_dfp_low.push(term);
			} else {
				_dfp_high.push(term);
			}
		}
	}


	/**
	 * Format sizes as an array.
	 * @type String
	 * @private
	 */
	var sizes = (function() {
		var sizes = [],
		d;
		d = __ad_data.tag.size.split("x");
		sizes.push(parseInt(d[0]), parseInt(d[1]));
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
	var divId = 'VH' + __ad_data.tag.pos;
	var slotName = '/3185446/'+__ad_data.tag.pos;
	var _url = __ad_data.context.url;
	var _urlparts = _url.split('//');

	/**
	 * This is standard GPT implementation code, and can be replaced with implementation code for any ad server.
	 */
	var googletag = window.googletag || {};
	googletag.cmd = googletag.cmd || [];

	googletag.cmd.push(function() {
		var slot = googletag.defineSlot(
			slotName,
			sizes,
			divId
		).addService(googletag.pubads());
		slot.setTargeting("vhurl", _urlparts[1]);
		if(__ad_data.tag.sitepage != undefined) {
			slot.setTargeting('property', __ad_data.tag.sitepage);
		}
		if(_dfp_groups.length) {
			slot.setTargeting('groups', _dfp_groups);
		}
		if(_dfp_terms.length) {
			slot.setTargeting('terms', _dfp_terms);
		}
		if(_dfp_high.length) {
			slot.setTargeting('kwhigh', _dfp_high);
		}
		if(_dfp_low.length) {
			slot.setTargeting('kwlow', _dfp_low);
		}
		if(window.__vhusr.vhid != undefined) {
			slot.setTargeting('vhid', window.__vhusr.vhid);
		}
		googletag.enableServices();
		googletag.display(divId);
	});
}
//})(__ad_data);
