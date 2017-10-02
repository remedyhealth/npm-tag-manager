function _getvhid() {
  var match = RegExp('[?&]vhid=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
var _vhs = document.createElement("script");
_vhs.onload = function() {
    _VHparseID();
}
var _hcpidurl = "//id.verticalhealth.net/script.js";
var _vhid = _getvhid();
var _oas_groups = '';
if(_vhid != null) {
    _hcpidurl += '?vhid='+vhid;
}
_vhs.src = _hcpidurl;
document.head.appendChild(_vhs);
function _VHparseID() {
    for(var g in window.__vhusr.vhgroups) {
        _oas_groups += '&group='+window.__vhusr.vhgroups[g];
    }
    __ad_data.groups = _oas_groups;
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
    }
    __render_ad();
}
//(function(__ad_data) {
function __render_ad() {
    if (!__ad_data || !__ad_data.tag || __ad_data.tag === null) return;
    var tag = __ad_data.tag;
    OAS_url = tag.url;
    OAS_sitepage = tag.sitepage;

    OAS_pos = tag.pos || "";
    OAS_query = tag.query || "";
    OAS_exclude = tag.exclude || "";

    // add utm_source to ad server call
    try {
        if(document.referrer) {
            // safeframe implementation
            var rawurl = document.referrer;
        } else {
            // on-page
            var rawurl = document.location['href'];            
        }
        var rawurlparts = rawurl.split('?');
        if(rawurlparts[1]) {
            var rawqueryparts = rawurlparts[rawurlparts.length - 1].split('&');
            var srcstr = '';
            for(var rawpair in rawqueryparts) {
                var rawkeys = rawqueryparts[rawpair].split('=');
                if(rawkeys[0] == 'utm_source') {
                    srcstr = 'terms=utm_source_'+rawkeys[1];
                }
            }
            if(srcstr != "") {
                if(OAS_query != "") {
                    OAS_query += "&";
                }
                OAS_query += srcstr;               
            }
       }
    } catch(err) {}

    // parse context data
    if(__ad_data.context && __ad_data.context.matches) {
        var contextTerms =[];
        for (match in __ad_data.context.matches) {
            var term = match;
            var score = __ad_data.context.matches[match].score;
            if(score < 4) {
                contextTerms.push('kwlow='+term);
            } else {
                contextTerms.push('kwhigh='+term);
            }
        }
        if(OAS_query != "") {
            OAS_query += "&";
        }
        OAS_query += contextTerms.join('&');
        var _url = __ad_data.context.url;
        var _urlparts = _url.split('//');
        OAS_query += '&vhurl='+_urlparts[1];
    }

    if(__ad_data.groups) {
        OAS_query += __ad_data.groups;
    }

    var OAS_RN = new String(Math.random());
    var OAS_RNS = OAS_RN.substring(2, 11);

    var adid = 'VH'+OAS_pos;
    var sizes = __ad_data.tag.size.split('x');
    var adscript = document.createElement('iframe');
    var adsrc = OAS_url + '/RealMedia/ads/adstream_sx.ads/' + OAS_sitepage + '/1' + OAS_RNS + '@' + OAS_pos + '?_RM_Exclude_=' + OAS_exclude + '&' + OAS_query;
    adscript.width = sizes[0];
    adscript.height = sizes[1];
    adscript.frameBorder = 0;
    adscript.scrolling = 'no';
    adscript.src = adsrc;
    adscript.marginWidth = 0;
    adscript.marginHeight = 0;
    try {
        document.getElementById(adid).appendChild(adscript);
    } catch(err) {
        document.body.appendChild(adscript);
    }

}
//})(__ad_data);
