
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

    //key up event for searching contacts for contactgroup creation
    $("#searchContactsToCreateCG").keyup(function() {
        var str = $("#searchContactsToCreateCG").val()
        if (str.length >= minSearchInput)
            searchContactsForCreateContactgroup(str);
        else {
            $(".deleteSearchCGContacts").remove();
            if(str.length > 0) {
                $("#liSearchContactsToCreateCG").after("<li class='deleteSearchCGContacts centerText'>mindestens zwei Buchstaben zum Suchen eingeben</li>");
                $("#listCGContacts").listview('refresh');
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
$(document).on('pagebeforeshow', '#page_createContactgroup', function(e, data){
    console.log("pagebeforeshow: page_createGroup");
    resetCreateContactgroup()
});

/*start qr-scanner on mobile device if user enters #page_scanPosition*/
$(document).on('pagebeforeshow', '#page_scanPosition', function(e, data){
    console.log("pagebeforeshow: page_scanPosition");
    try {
        console.log("start qr scanner");
        scanCode();
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

/*load statuses via jsonp*/
$(document).on('pagebeforeshow', '#page_getStatuses', function(e, data){
    console.log("pagebeforeshow: page_getStatuses");
    getStatusList();
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
            pane.style.display = (pane.style.display == "block") ? "none" : "block";
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

/*load gps data from current user*/
$(document).on("pagebeforeshow", "#page_position", function() {
    navigator.geolocation.getCurrentPosition(locSuccess, locError, {maximumAge:90000, timeout:20000, enableHighAccuracy: true});
});

$(document).on("pagebeforehide", "#page_position", function() {
    $("#map_container").hide();
    $("#directions").html("");
    $("#detailedDescription").html("");
});






