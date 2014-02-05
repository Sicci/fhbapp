function showFooter(pageID) {

    var footer_html = "<div class='footer' data-role='footer' data-id='footer' data-position='fixed'>" +
        "    <div>" +
        "    <p>Ihr Gerät ist mit dem Account <span class='footer_email'></span> verbunden.</p>" +
        "    </div>" +
        "</div>    <!-- /footer -->";

    $("#"+pageID).append(footer_html);
}