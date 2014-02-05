function showHeader(pageID, activePage, pageTitle) {
    var myarray = {
        "home":"Home",
        "chat":"Chat",
        "contacts":"Kontakte",
        "groups":"Gruppen",
        "logout":"Abmelden"
    };

    var header_html = '<div id="header" class="header" data-role="header" data-position="fixed" data-id="header">';
    header_html+=' <div class="header-text">FH-Brandenburg App - '+pageTitle+'</div>';
    header_html+='<div data-iconpos="top" data-role="navbar" class="nav-example"><ul>';
    var _insert = "";
    for (var key in myarray) {
        if (key == activePage)
            _insert="ui-btn-active ui-state-persist";
        else _insert = "";
        if (key == "home") {
            header_html+='<li><a id="'+key+'" data-icon="custom" href="#" onclick="showHomePage()" class="'+_insert+'" data-transition="none">'+myarray[key]+'</a></li>';
        }
        else if (key == "logout") {
            header_html+='<li><a id="'+key+'" data-icon="custom" href="#" onclick="logout()" class="'+_insert+'" data-transition="none">'+myarray[key]+'</a></li>';
        }
        else {
            header_html+='<li><a id="'+key+'" data-icon="custom" href="#page_'+key+'" class="'+_insert+'" data-transition="none">'+myarray[key]+'</a></li>';
        }
    }

    header_html+='</ul></div></div><!-- /header -->';
    $("div[id='"+pageID+"']").append(header_html);
}