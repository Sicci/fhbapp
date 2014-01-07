/*only load contacts a single time via jsonp*/
$(document).on('pageinit', '#page_createGroup', function(e, data){
    getContactsForCreateContactgroup();
});

//this code will just run once
$(document).on('pageinit',function(event){
    //validation for event creation
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

    //key up event for searching contacts to add them to contactgroups
    $("#searchContactsToAdd").keyup(function() {
        var str = $("#searchContactsToAdd").val()
        if (str.length >= minSearchInput)
            searchContactsForContactgroup(str);
        else $(".deleteSearchContactsToAdd").remove();
    });

    //key up event for searching contacts for navigation
    $("#searchContactsForNavigation").keyup(function() {
        var str = $("#searchContactsForNavigation").val()
        if (str.length >= minSearchInput)
            searchContactForNavigation(str);
        else {
            $(".deleteNavigationContacts").remove();
            if(str.length > 0) {
                $("#listNavigation").append("<li class='deleteNavigationContacts centerText'>mindestens zwei Buchstaben zum Suchen eingeben</li>");
                $("#listNavigation").listview('refresh');
            }
        }
    });

    //key up event for searching contacts for event creation
    $("#searchContactsToCreateEvent").keyup(function() {
        var str = $("#searchContactsToCreateEvent").val()
        if (str.length >= minSearchInput)
            searchContactsForCreateEvents(str);
        else {
            $(".deleteSearchEventContacts").remove();
            if(str.length > 0) {
                $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts centerText'>mindestens zwei Buchstaben zum Suchen eingeben</li>");
                $("#listEventContacts").listview('refresh');
            }
        }
    });
});

/*removes disable state from locate button on #page_profile each time this site will be shown*/
$(document).on('pagebeforeshow', '#page_profile', function(e, data){
    console.log("pagebeforeshow: page_profile");
    $("#btnLocateContact").removeClass("ui-disabled");
});

/*set search field empty on #page_attendees and show previous hidden elements*/
$(document).on('pagebeforeshow', '#page_attendees', function(e, data){
    console.log("pagebeforeshow: page_attendees");
    $("input").val('');
    $("li").removeClass("ui-screen-hidden");
});

/*reset form each time it will be shown on page_createGroup*/
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

/*start qr-scanner on mobile device if user enters #page_scanPosition*/
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
    getContactgroups();
});

/*reset #page_navigation to default state (remove previous input) */
$(document).on('pagebeforeshow', '#page_navigation', function(e, data){
    console.log("pagebeforeshow: page_navigation");
    $(".deleteNavigationContacts").remove(); //clear search results
    $("#searchContactsForNavigation").val(""); //clear search input
    $("#listNavigation").append("<li class='deleteNavigationContacts centerText'>keine Kontakte geladen</li>");
    $(".ui-input-clear").addClass("ui-input-clear-hidden");
    $("#listNavigation").listview('refresh');
});

/*reset #page_manageContacts to default state (remove previous input) */
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

/*load contactgroups for #page_createEvent via jsonp*/
$(document).on('pagebeforeshow', '#page_createEvent', function(e, data){
    console.log("pagebeforeshow: page_createEvent");
    getContactgroupsForCreateEvent();
});

/*load events via jsonp*/
$(document).on('pagebeforeshow', '#page_eventList', function(e, data){
    console.log("pagebeforeshow: page_eventList");
    getEventlist();
});

/*connect to candy chat*/
$(document).on('pagebeforeshow', '#page_chat', function(e, data){
    console.log("pageboforeshow: page_chat");
    var chatIDs = [];
    currentUser.gids.forEach(function(gid) {
        chatIDs.push(gid+"@conference.candychat"); //each group has his own room
    });

    //initialize chat
    Candy = initChat();
    Candy.init( 'http://fhbapp.no-ip.biz:7070/http-bind/', {
        core: { debug: true, autojoin: chatIDs },
        view: { language: 'de', resources: 'res-chat/' } });

    Candy.Core.connect('candychat', null, currentUser.firstname+" "+currentUser.lastname); //connect to server with username

    //add onclick event to toolbar usercount
    $("#chat-toolbar").off();
    $("#chat-toolbar").on('click', function() {
        $.each($(".roster-pane"), function( index, pane ) { //for each userlist (roster-pane) in all chat rooms
            pane.style.display = (pane.style.display == "none") ? "block" : "none";
        });
    });
});

/*prevent default behaviour of submitting the chat formular*/
$(".message-form").live("submit", function(event) {
    event.preventDefault();
});

/*disconnect from chat if user leaves chat page*/
$(document).on('pagehide', '#page_chat', function(e, data){
    Candy.Core.disconnect();
    Candy = null; //reset chat
});

/*der gute slider :D*/
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



/*probably not necessary in fact of candy chat.... can be deleted if we dont have another chat*/
$(document).delegate('.ui-page', 'pageshow', function () {
    var objDiv = document.getElementById("incomingMessages");
    objDiv.scrollTop = objDiv.scrollHeight;

    /* TODO: whenever a msg was send to chat do:
     document.getElementById('shoutContainer').scrollTop = 10000;
     */
});

/*reset #page_createEvent to initial state*/
$(document).delegate('#page_createEvent', 'pageshow', function () { /*dunno why delegate and not 'on' <-- there is already an event for on(pagebeforeshow)*/
    currentEventContactList = []; /*TODO: check if this adresses global variable and not local*/
    $(".deleteSearchEventContacts").remove();
    $(".deleteEventContacts").remove();
    $("#listEventContacts").append("<li class='centerText bold deleteEventContacts'>noch keine Kontakte hinzugefügt</li>");
    $("#listEventContacts").listview('refresh');
    $('#form_newEvent').data('validator').resetForm();
    $('#form_newEvent').each(function(){
        this.reset();
    });
});

