/*only load contacts a single time via jsonp*/
$(document).on('pageinit', '#page_createGroup', function(e, data){
    loadContacts();
});


$(document).on('pageinit', function(){
    var formNewEvent=$("#form_newEvent").validate({
        rules: {
            newEventName: {required:true, minlength:3},
            newEventDate: "required",
            newEventTime: "required",
            newEventGroup: "required"
        },
        errorPlacement: function(error, element) {
            if (element.attr("name") === "newEventGroup") {
                error.insertAfter($(element).parent());
            } else {
                error.insertAfter(element);
            }
        }
    });
});

$(document).on( 'pageinit',function(event){
    $("#searchContactsToAdd").keyup(function() {
        var str = $("#searchContactsToAdd").val()
        console.log("keydown: "+ str);
        if (str.length >= minSearchInput)
        //$("#searchContactsToAdd").css("background-color", "yellow");
            searchContact(str);
        else $(".deleteSearchContactsToAdd").remove();
    });

    $("#searchContactsForNavigation").keyup(function() {
        var str = $("#searchContactsForNavigation").val()
        console.log("keydown: "+ str);
        if (str.length >= minSearchInput)
        //$("#searchContactsToAdd").css("background-color", "yellow");
            searchContactForNavigation(str);
        else {
            $(".deleteNavigationContacts").remove();
            if(str.length > 0) {
                $("#listNavigation").append("<li class='deleteNavigationContacts centerText'>mindestens zwei Buchstaben zum Suchen eingeben</li>");
                $("#listNavigation").listview('refresh');
            }
        }
    });

    $("#searchContactsToCreateEvent").keyup(function() {
        var str = $("#searchContactsToCreateEvent").val()
        console.log("keydown: "+ str);
        if (str.length >= minSearchInput)
            searchContactForCreateEvents(str);
        else {
            $(".deleteSearchEventContacts").remove();
            if(str.length > 0) {
                $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts centerText'>mindestens zwei Buchstaben zum Suchen eingeben</li>");
                $("#listEventContacts").listview('refresh');
            }
        }
    });
});

/*load groups and contactGroups via jsonp*/
$(document).on('pagebeforeshow', '#page_profile', function(e, data){
    console.log("pagebeforeshow: page_profile");
    $("#btnLocateContact").removeClass("ui-disabled");
});

$(document).on('pagebeforeshow', '#page_attendees', function(e, data){
    console.log("pagebeforeshow: page_attendees");
    $("input").val('');
    $("li").removeClass("ui-screen-hidden");
});

/**/
$(document).on('pagebeforeshow', '#page_createGroup', function(e, data){
    console.log("pagebeforeshow: page_createGroup");
    $('input').not('[type="button"]').val(''); // clear inputs except buttons, setting value to blank
    $("input[type='checkbox']").removeAttr('checked');
    $("input[type='checkbox']").attr("class","deleteCreateContactsForReset").checkboxradio("refresh");
    if ($("#sliderSemester").val() == 'off') { //if switch is off
        $("#sliderSemester").slider('disable');
        $("#sliderSemester").slider('refresh');
        $("#sliderSemester").textinput('disable');
    }
});

$(document).on('pagebeforeshow', '#page_scanPosition', function(e, data){
    console.log("pagebeforeshow: page_scanPosition");
    try {
        console.log("start qr scanner");
        var scanResult = scanCode();
        if (scanResult != null)
            updateAttendance(scanResult);
        else {
            alert("Fehler beim Einscannen");
            //showHomePage();
        }
    }
    catch (error) {
            showFailurePage("QR-Scanner kann im Browser nicht geladen werden.", "#page_scanPosition");
    }

});

/*load groups and contactGroups via jsonp*/
$(document).on('pagebeforeshow', '#page_groups', function(e, data){
    console.log("pagebeforeshow: page_groups");
    $(".deleteGroupsForReset").remove();
    getGroups();
    getContactGroups();
});

$(document).on('pagebeforeshow', '#page_navigation', function(e, data){
    console.log("pagebeforeshow: page_navigation");
    $(".deleteNavigationContacts").remove(); //clear search results
    $("#searchContactsForNavigation").val(""); //clear search input
    $("#listNavigation").append("<li class='deleteNavigationContacts centerText'>keine Kontakte geladen</li>");
    $(".ui-input-clear").addClass("ui-input-clear-hidden");
    $("#listNavigation").listview('refresh');
});

$(document).on('pagebeforeshow', '#page_manageContacts', function(e, data){
    console.log("pagebeforeshow: page_manageContacts");
    $(".deleteSearchContactsToAdd").remove(); //clear search results
    $("#searchContactsToAdd").val(""); //clear search input
    $(".ui-input-clear").addClass("ui-input-clear-hidden");
});


$(document).on('pagebeforeshow', '#page_contactgroupDetails', function(e, data){
    console.log("pagebeforeshow: page_contactgroupDetails");
    /*TODO:bei changes der cg muss sie neu geladen werden*/
    //if manage contact group contacts has changed some contacts (e.g. delete user a or add user b)
    //load cg again (how to determine which cg has to be loaded?)
});

/*load contacts via jsonp*/
$(document).on('pagebeforeshow', '#page_contacts', function(e, data){
    console.log("pagebeforeshow: page_contacts");
    getContacts();
});
/*load events via jsonp*/
$(document).on('pagebeforeshow', '#page_controlAttendance', function(e, data){
    console.log("pagebeforeshow: page_controlAttendance");
    getEvents();
});

/*load events via jsonp*/
$(document).on('pagebeforeshow', '#page_createEvent', function(e, data){
    console.log("pagebeforeshow: page_createEvent");
    loadContactGroups();
});

/*load events via jsonp*/
$(document).on('pagebeforeshow', '#page_eventList', function(e, data){
    console.log("pagebeforeshow: page_eventList");
    getEventlist();
});

$(document).on('pagebeforeshow', '#page_chat', function(e, data){
    console.log("pageboforeshow: page_chat");
    var chatIDs = [];
    currentUser.gids.forEach(function(gid) {
        chatIDs.push(gid+"@conference.candychat");
    });
    Candy = initChat();
    Candy.init( 'http://fhbapp.no-ip.biz:7070/http-bind/', {
        core: { debug: true, autojoin: chatIDs },
        view: { language: 'de', resources: 'res-chat/' } });

    Candy.Core.connect('candychat', null, currentUser.firstname+" "+currentUser.lastname);

    //add onclick event to toolbar usercount
    $("#chat-toolbar").off();
    $("#chat-toolbar").on('click', function() {
        $.each($(".roster-pane"), function( index, pane ) { //for each userlist (roster-pane) in all chat rooms
            pane.style.display = (pane.style.display == "none") ? "block" : "none";
        });
    });
});

$(".message-form").live("submit", function(event) {
    console.log("bind submit");
    event.preventDefault();
});

$(document).on('pagehide', '#page_chat', function(e, data){
    Candy.Core.disconnect();
    Candy = null;
});


$(document).on('change', '#activateSemester', function () {
    if ($(this).val() == 'off') { //if switch is off
        $("#sliderSemester").slider('disable');
        $("#sliderSemester").slider('refresh');
        $("#sliderSemester").textinput('disable');
    }
    else {
        $("#sliderSemester").slider('enable');
        $("#sliderSemester").slider('refresh');
        $("#sliderSemester").textinput('enable');
    }
});


/* TODO: whenever a msg was send to chat do:
 document.getElementById('shoutContainer').scrollTop = 10000;
 */

$(document).delegate('.ui-page', 'pageshow', function () {
    var objDiv = document.getElementById("incomingMessages");
    objDiv.scrollTop = objDiv.scrollHeight;
});

$(document).delegate('#page_createEvent', 'pageshow', function () {
    currentEventContactList = [];
    $(".deleteSearchEventContacts").remove();
    $(".deleteEventContacts").remove();
    $("#listEventContacts").append("<li class='centerText bold deleteEventContacts'>noch keine Kontakte hinzugefügt</li>");
    $("#listEventContacts").listview('refresh');
    $('#form_newEvent').data('validator').resetForm();
    $('#form_newEvent').each(function(){
        this.reset();
    });
    /*TODO: load contactgroups for selectmenu*/
    //$('#newEventGroup').val('Gruppe auswählen').selectmenu('refresh');
});

