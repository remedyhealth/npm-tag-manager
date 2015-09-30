(function(__ad_data) {
    if (!__ad_data || !__ad_data.tag || __ad_data.tag === null) return;
    var tag = __ad_data.tag;
    OAS_url = tag.url;
    OAS_sitepage = tag.sitepage;

    OAS_pos = tag.pos || "";
    OAS_query = tag.query || "";
    OAS_exclude = tag.exclude || "";

    var OAS_RN = new String(Math.random());
    var OAS_RNS = OAS_RN.substring(2, 11);

    document.write('<scr' + 'ipt language="javascript" type="text/javascript" src="' + OAS_url + '/RealMedia/ads/adstream_jx.ads/' + OAS_sitepage + '/1' + OAS_RNS + '@' + OAS_pos + '?_RM_Exclude_=' + OAS_exclude + '&' + OAS_query + '"></scr' + 'ipt>');

})(__ad_data);
