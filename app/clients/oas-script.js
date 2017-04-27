(function(__ad_data) {
    if (!__ad_data || !__ad_data.tag || __ad_data.tag === null) return;
    var tag = __ad_data.tag;
    OAS_url = tag.url;
    OAS_sitepage = tag.sitepage;

    OAS_pos = tag.pos || "";
    OAS_query = tag.query || "";
    OAS_exclude = tag.exclude || "";

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

})(__ad_data);
