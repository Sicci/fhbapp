var html = "<div id='header' class='header' data-role='header' data-position='fixed' data-id='header'>" +
    "    <div class='header-text'>FH-Brandenburg App - Student</div>" +
    "    <div data-iconpos='top' data-role='navbar' class='nav-example'>" +
    "        <ul>" +
    "            <li><a class='ui-btn-active ui-state-persist' id='home' data-icon='custom' href='#' onclick='showHomePage()'" +
    "            data-transition='none'>Home</a></li>" +
    "            <li><a id='chat' data-icon='custom' href='#page_chat' data-transition='none'>Chat</a></li>" +
    "            <li><a id='contact' data-icon='custom' href='#page_contacts' data-transition='none'>Kontakte</a>" +
    "            </li>" +
    "            <li><a id='group' data-icon='custom' href='#page_groups' data-transition='none'>Gruppen</a></li>" +
    "        </ul>" +
    "    </div>" +
    "    </div>";    <!-- /header -->




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
        if (key == "home")
            header_html+='<li><a id="'+key+'" data-icon="custom" href="#" onclick="showHomePage()" class="'+_insert+'" data-transition="none">'+myarray[key]+'</a></li>';
        else
            header_html+='<li><a id="'+key+'" data-icon="custom" href="#page_'+key+'" class="'+_insert+'" data-transition="none">'+myarray[key]+'</a></li>';
    }

    header_html+='</ul></div></div><!-- /header -->';

    $("div[id='"+pageID+"']").append(header_html);
}