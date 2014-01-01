var url = "http://fhbapp.rumbledore.de/";
var currentSession = "";
var currentUser = [];
var currentContactList = [];
var currentEventContactList = [];
var currentCGID = null;
var qrcodeURL = "http://fhbapp.rumbledore.de/qrcode/?qrrequest=";
var minSearchInput = 2;

$.mobile.loader.prototype.options.textVisible = true;
$.mobile.loader.prototype.options.theme = "a";
$.mobile.loader.prototype.options.theme = "a";
moment.lang("de");

/*TODO: was machen wir mit der sessionid?*/
/*TODO: für ajax Handler noch loader einfügen*/
/*TODO: groups, cgs and events andersrum sortieren bitte*/

function myCreateEvent() {
    console.log("create event");
    var ename = $("#newEventName").val(); //value from input

    if (ename.length < 3) {
        alert("Bitte geben Sie einen Eventnamen mit mindestens 3 Buchstahben ein.");
        return;
    }

    var edescription = $("#newEventDescription").val();
    var date = $("#newEventDate").val();

    if (date.length <= 0) {
        alert("Bitte geben Sie ein Datum ein.");
        return;
    }

    var time = $("#newEventTime").val();

    if (time.length <= 0) {
        alert("Bitte geben Sie ein Datum ein.");
        return;
    }

    var mdate = moment(date+time, "DD.MM.YYYY HH:mm");
    var edate = "";  //timestamp (2 value from 2 input)
     if (mdate.isValid()) {
        edate = mdate.unix();
     }
    else {
         alert("Bitte geben Sie korrekte Daten für Termin und Uhrzeit ein.");
         return;
     }

    if (ename.length <= 0) {
        alert("Bitte geben Sie einen Namen ein.")
        return;
    }

     $.ajax({url: url + "create/event",
     dataType: "jsonp",
     data: {uid:currentUser.uid, ename:ename, edate:edate, edescription:edescription, attendeelist: currentEventContactList},
     async: true,
     success: function (result) {
         /*TODO:proof if success */
        console.log("new event created");
        showEvents(); /*TODO: better --> show eventDetails des eben erstellten events*/
     },
     error: function (request, error) {
        console.log(error);
        showFailurePage("Das Event konnte nicht erstellt werden. Bitte überprüfen Sie ihre Internetverbindung und versuchen Sie es erneut.", "#page_createEvent");
        /*TODO:retry überschreiben --> lade bereits eingegebene daten erneut in das formular (pagebofreshow müsste umgangen werden)*/
     }
     });
}

function test() {
    console.log(moment());
}

function addContactToCG(contact) {
    if (jQuery.inArray(contact.uid, currentContactList) >= 0) {
        console.log("already in array");
    }
    else {
        currentContactList.push(contact.uid);
        $.ajax({url: url+"update/contactgroup",
            dataType: "jsonp",
            data: {
                uid:currentUser.uid,
                cgid:currentCGID,
                contactlist:currentContactList},
            async: true,
            success: function (result) {
                /*TODO:proof if success */
                if ($(".deleteManageContactsForReset").text() == "keine Kontakte vorhanden")
                    $(".deleteManageContactsForReset").remove();
                $("#manageContactgroupDetailsList").append("<li class='deleteManageContactsForReset'>"+contact.firstname+" "+contact.lastname+"<div class='ui-li-aside'><a onclick='deleteContactFromCG("+currentCGID+", "+contact.uid+")' href='#'><img class='delete' src='./images/delete.png'></a></div></li>");
                $("#manageContactgroupDetailsList").listview('refresh');
            },
            error: function (request,error) {
                alert('Nutzer konnte nicht erfolgreich zur Gruppe hinzugefügt werden.');
            }
        });
    }
    $(event.target).closest("div").addClass("asideText").html("hinzugefügt");
}

function searchContact(str) {
    $.ajax({url: url+"search/contact",
        dataType: "jsonp",
        data: {request: str},
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.searchcontact);
        },
        error: function (request,error) {
            $(".deleteSearchContactsToAdd").remove();
            $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd centerText errorMsg'>Suchanfrage konnte nicht übermittelt werden.</li>");
            $("#manageContactgroupDetailsList").listview('refresh');
        }
    });

    var ajax = {
        parseJSONP:function(contacts){
            console.log("currentList: "+currentContactList);
            $(".deleteSearchContactsToAdd").remove();
            if (contacts.length > 0) {
                $.each( contacts, function(i, contact) {
                    if (jQuery.inArray(contact.uid, currentContactList) >= 0) {
                        console.log("already in list "+contact.firstname + " "+ contact.uid);
                        $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd'>"+contact.firstname+ " " +contact.lastname+"<div class='ui-li-aside asideText'>bereits hinzugefügt</div></li>");
                    }
                    else
                    {
                        console.log("not in list "+ contact.firstname + " "+ contact.uid);
                        $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd'>"+contact.firstname+ " " +contact.lastname+"<div class='ui-li-aside'><a id='addContact-"+i+"' href='#'><img class='add' src='./images/add.png' /></a></div></li>");
                        $("#addContact-"+i).on('click', function() {
                             addContactToCG(contact);
                            });
                    }
                });
            }
            else {
                $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd centerText'>keine Kontakte gefunden</li>");
            }
            $("#manageContactgroupDetailsList").listview('refresh');
        }
    }
}

function searchContactForNavigation(str) {
    $.ajax({url: url+"search/contact",
        dataType: "jsonp",
        data: {request: str},
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.searchcontact);
        },
        error: function (request,error) {
            $(".deleteNavigationContacts").remove();
            $("#listNavigation").append("<li class='deleteNavigationContacts centerText errorMsg'>Fehler: Suchanfrage konnte nicht übermittelt werden.</li>");
            $("#listNavigation").listview('refresh');
        }
    });

    var ajax = {
        parseJSONP:function(contacts){
            $(".deleteNavigationContacts").remove();

            if (contacts.length > 0) {
                $.each( contacts, function(i, contact) {
                        $("#listNavigation").append("<li class='deleteNavigationContacts'><a id='nav-contact-"+i+"'>"+contact.firstname+ " " +contact.lastname+"</a></li>");
                        $("#nav-contact-"+i).on('click', function(){
                            showPositionPage(contact.uid);
                        });
                    });
            }
            else {
                $("#listNavigation").append("<li class='deleteNavigationContacts centerText'>keine Kontakte gefunden</li>");
            }
            $("#listNavigation").listview('refresh');
        }
    }
}

function addContactToCreateEvent(i, contact) {
    if (jQuery.inArray(contact.uid, currentEventContactList) >= 0) {
        console.log("already in contactlist");
    }
    else {
        if ($(".deleteEventContacts").text() == "noch keine Kontakte hinzugefügt")
            $(".deleteEventContacts").remove();
        $("#liAddedContactstoCreateEvent").after("<li class='deleteEventContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside'><a id='deleteEventContact-" + i + "' href='#'><img class='delete' src='./images/delete.png'></a></div></li>");

        $("#deleteEventContact-" + i).on('click', function () {
            console.log("delete contact");
            currentEventContactList = jQuery.grep(currentEventContactList, function (value) { //remove specific entry from array
                return value != contact.uid;
            });

            $(event.target).closest("li").remove();
            if ($(".deleteEventContacts").length == 0) {
                $("#liAddedContactstoCreateEvent").after("<li class='deleteEventContacts centerText'>noch keine Kontakte hinzugefügt</li>");
            }
            $("#listEventContacts").listview('refresh');
            if ($("#searchContactsToCreateEvent").val().length >= minSearchInput)
                searchContactForCreateEvents($("#searchContactsToCreateEvent").val());//starte suche erneut bzw. aktualisiere suche
        });

        $("#listEventContacts").listview('refresh');

        currentEventContactList.push(contact.uid);
    }
}

function searchContactForCreateEvents(str) {
    $.ajax({url: url+"search/contact",
        dataType: "jsonp",
        data: {request: str},
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.searchcontact);
        },
        error: function (request,error) {
            /*TODO failure*/
            //$(".deleteSearchEventContacts").remove();
            //$("#listNavigation").append("<li class='deleteNavigationContacts centerText errorMsg'>Fehler: Suchanfrage konnte nicht übermittelt werden.</li>");
            //$("#listNavigation").listview('refresh');
        }
    });

    var ajax = {
        parseJSONP:function(contacts){
            $(".deleteSearchEventContacts").remove();

            if (contacts.length > 0) {
                $.each( contacts, function(i, contact) {
                    if (jQuery.inArray(contact.uid, currentEventContactList) >= 0) {
                        console.log("already in list " + contact.firstname + " " + contact.uid);
                        $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside asideText'>bereits hinzugefügt</div></li>");
                    }
                    else {
                        console.log("not in list " + contact.firstname + " " + contact.uid);
                        $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside'><a id='addEventContact-" + i + "' href='#'><img class='add' src='./images/add.png' /></a></div></li>");

                        $("#addEventContact-" + i).on('click', function () {
                            addContactToCreateEvent(i, contact);
                            $(event.target).closest("div").addClass("asideText").html("hinzugefügt");
                        });
                    }
                });
            }
            else {
                $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts centerText'>keine Kontakte gefunden</li>");
            }
            $("#listEventContacts").listview('refresh');

        }
    }
}


/* ajax calls to get data from db in jsonp format */
function getEvents() {
    $.ajax({url: url+"get/events",
        dataType: "jsonp",
        data: {uid: currentUser.uid},
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.getevents);
        },
        error: function (request,error) {
            showFailurePage("Events konnten nicht geladen werden. Überprüfen Sie, ob Sie eine bestehende Internetverbindung besitzen.", "#page_controlAttendance");
        }
    });

    var ajax = {
        parseJSONP:function(events){
            $(".deleteEventsForReset").remove();
            var finishedEvents = 0;
            var remainingEvents = 0;
            $.each(events, function(i, event) {
                var d = new Date(event.edate*1000); //js works with millisecond while mysql works with seconds

                if (d < new Date()) { //wenn das event abgelaufen ist
                    $("#liFinishedEvents").after("<li class='deleteEventsForReset'><a onclick=\"getEventDetails("+event.eid+")\" href=\"#\"><h3>"+event.ename+"</h3><p>"+moment(d).calendar()+"</p></li>");
                    finishedEvents++;
                }
                else {
                    $("#liFinishedEvents").before("<li class='deleteEventsForReset'><a onclick=\"getEventDetails("+event.eid+")\" href=\"#\"><h3>"+event.ename+"</h3><p>"+moment(d).calendar()+"</p></li>");
                    remainingEvents++;
                }
            });
            if (finishedEvents == 0) {//falls keine Events abgelaufen sind
                $("#liFinishedEvents").after("<li class='deleteEventsForReset bold centerText'>keine Events abgelaufen</li>");
            }
            if (remainingEvents == 0) { //falls keine Events noch ausstehen
                $("#liFinishedEvents").before("<li class='deleteEventsForReset bold centerText'>keine Events mehr ausstehend</li>");
            }
            $('#eventList').listview('refresh');
        }
    }
}

/* ajax calls to get data from db in jsonp format */
function getEventlist() {
    $.ajax({url: url+"get/eventlist",
        dataType: "jsonp",
        data: {uid: currentUser.uid},
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.geteventlist);
        },
        error: function (request,error) {
            showFailurePage("Events konnten nicht geladen werden. Überprüfen Sie, ob Sie eine bestehende Internetverbindung besitzen.", "#page_eventList");
        }
    });

    var ajax = {
        parseJSONP:function(events){
            $(".deleteListEventsForReset").remove();

            var lastDivider = "";
            if (events.length > 0) {
                $.each(events, function(i, event) {
                    var newDivider = moment(event.edate*1000).format("dddd, DD.MMMM YYYY");
                    if (lastDivider != newDivider) {
                        $("#listEventlist").append("<li class='deleteListEventsForReset' data-role='list-divider'>"+newDivider+"</li>");
                        lastDivider = newDivider;
                    }
                    else {
                        //do nothing
                    }

                    $("#listEventlist").append("<li class='deleteListEventsForReset'><h3>"+event.ename+"</h3><p class='bold'>"+event.edescription+"</p><p>Erstellt von "+ event.ecreator+"</p><p class='ui-li-aside'><span class='bold'>"+moment(event.edate*1000).format("HH:mm")+"</span> Uhr</p></li>");

                });
            }
            else {
                $("#listEventlist").append("<li data-role='list-divider' class='deleteListEventsForReset'><h3>Eventliste</h3></li>");
                $("#listEventlist").append("<li class='deleteListEventsForReset centerText bold'>keine anstehenden Events vorhanden</li>");
            }
            $('#listEventlist').listview('refresh');
        }
    }
}

function getEventDetails(eid) {
    $.ajax({url: url + "get/event",
        dataType: "jsonp",
        data: {eid:eid},
        async: true,
        success: function (result) {
            showEventDetailPage();
            ajax.parseJSONP(result.getevent);
        },
        error: function (request, error) {
            showFailurePage("Die Detailinformationen zu einem Event konnte nicht geladen werden. " +
                "Überprüfen Sie, ob Sie eine bestehende Internetverbindung besitzen.", "#page_controlAttendance");
        }
    });

    //abhängig der eingetragenen informationen (fachbereich/semester können null sein) wird die darstellung verändert
    function insertEventListDetails(event) {
        var creationDate = new Date(event.ecreationdate*1000); //js works with millisecond while mysql works with seconds
        var eventDate = new Date(event.edate*1000); //js works with millisecond while mysql works with seconds
        $("#eventInsertAfter").after("<li class='deleteEventDetailsForReset'><h3>Erstellt am "+moment(creationDate).format("LL")+"</h3><p>Erstelldatum</p></li>");
        $("#eventInsertAfter").after("<li class='deleteEventDetailsForReset'><h3>"+moment(eventDate).calendar()+"</h3><p>Eventstart</p></li>");
    }

    var ajax = {
        parseJSONP: function (event) {
            $(".deleteEventDetailsForReset").remove();
            $(".eventDetailName").html(event.ename);
            $(".eventName").html(event.ename);
            $(".eventDetailDescription").html(event.edescription);
            insertEventListDetails(event);
            $("#eventDetailsList").listview('refresh');

            $("#eventQRCode").attr("src", qrcodeURL+event.eqrcontent);
            $("#eventQRCode").height(400);$("#eventQRCode").width(400);

            $('#btnAttendees').off(); //ent multiple events of the same type
            $('#btnAttendees').on('click', function() {
                showEventAttendees();
                getEventAttendees(event.eid);
            });
        }
    }
}

function getEventAttendees(eid) {
    $.ajax({url: url + "get/attendees",
        dataType: "jsonp",
        data: {eid:eid},
        async: true,
        success: function (result) {
            ajax.parseJSONP(eid, result.getattendees);
        },
        error: function (request, error) {
            alert('Network error has occurred please try again!'); /*TODO:failure page einfügen, evtl retry btn here überschreiben*/
        }
    });

    var ajax = {
        parseJSONP: function (eid, attendees) {
            var cVerified = 0;
            var cNotVerified = 0;
            $(".deleteEventAttendeesForReset").remove();
            $("#btnRefreshAttendees").off(); //prevent multiple events
            $("#btnRefreshAttendees").on('click', function() {
                getEventAttendees(eid);
            });

            $.each( attendees, function(i, attendee) {
                if (attendee.hasverified) {
                    $("#liAttendeesVerified").after("<li class='deleteEventAttendeesForReset' data-filtertext='verified verifiziert "+attendee.firstname+" "+attendee.lastname+"'><img src='images/check.png' class='ui-li-icon'>"+attendee.firstname+" "+attendee.lastname+"</li>");
                    cVerified++;
                }
                else {
                    $("#liAttendeesNotVerified").after("<li class='deleteEventAttendeesForReset' data-filtertext='not nicht "+attendee.firstname+" "+attendee.lastname+"'><img src='images/nocheck.png' class='ui-li-icon'>"+attendee.firstname+" "+attendee.lastname+"</li>");
                    cNotVerified++;
                }
            });

            if (cVerified == 0) {
                $("#liAttendeesVerified").after("<li class='deleteEventAttendeesForReset centerText' data-filtertext='verified verifiziert'>es wurde bisher niemand verifiziert</li>");
            }

            if (cNotVerified == 0) {
                $("#liAttendeesNotVerified").after("<li class='deleteEventAttendeesForReset centerText' data-filtertext='not nicht'>alle Teilnehmer wurden bereits verifiziert</li>");
            }

            $("#listEventAttendees").listview('refresh');
        }
    }
}


function getContacts() {
    $.ajax({url: url+"get/contacts",
        dataType: "jsonp",
        async: true,
        success: function (result) {
            //$.mobile.showPageLoadingMsg();
            ajax.parseJSONP(result.getcontacts);
            //$.mobile.hidePageLoadingMsg(); /*TODO: kA ob das so überhaupt was bringt oder funktioniert..beforeSend hat bisher nich funktioniert*/
        },
        error: function (request,error) {
            $("#userList").empty();
            $("#userList").append("<li class='centerText errorMsg'>Kontakte konnten nicht geladen werden.</li>");
            $('#userList').listview('refresh');
            $(".ui-li-divider").html("Fehler");
        }
    });

    var ajax = {
        parseJSONP:function(contacts){
            $("#userList").empty();
            $.each( contacts, function(i, user) {
                 $("#userList").append("<li><a onclick=\"getContactDetails("+user.uid+")\" href=\"#\">"+user.firstname +" "+user.lastname+"</a></li>");
                    console.log(user);
            });
            $('#userList').listview('refresh');
        }
    }
}

function getContactDetails(userID) {
    $.ajax({url: url + "get/contact",
        dataType: "jsonp",
        data: {uid: userID},
        async: true,
        success: function (result) {
            showUserDetailPage();
            ajax.parseJSONP(result.getcontact);
        },
        error: function (request,error) {
            alert('Kontaktinformationen konnten nicht geladen werden.');
        }
    });

    var ajax = {
        parseJSONP:function(contact){
            $("#btnLocateContact").off(); //prevent multiple events
            $("#btnLocateContact").on('click', function(){
                showPositionPage(contact.uid);
            });

            $(".profile_name").html(contact.firstname + " " + contact.lastname);
            $(".profile_email").html(contact.email);
            if (contact.sdescription != null) {
                $(".profile_status").html(contact.sdescription);
            }
            else {
                console.log("add disable");
                $("#btnLocateContact").addClass("ui-disabled");
                $(".profile_status").html("aktueller Status unbekannt");
            }
            $(".profile_wohnort").html(contact.city);

            $(".profile_gruppen").empty();
            $.each( contact.groups, function(i, group) {
                $(".profile_gruppen").append(group+"<br>");
            });
        }
    }
}

function logout() {
    //ajax request with uid do/logout
    currentUser = [];
    currentSession = "";
    showLoginPage();

}

function checkLogin() {
    $.ajax({url: url + "do/login",
        dataType: "jsonp",
        data: $("#formLogin").serialize(),
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.dologin);
            showHomePage();
        },
        error: function (request,error) {
            showFailurePage("Sie konnten nicht erfolgreich angemeldet werden. Bitte versuchen Sie es später erneut.", "#page_login");
        }
    });

    var ajax = {
        parseJSONP:function(login){
            $.each( login, function(property, value) {
                currentUser[property] = value;
                console.log(property + ": "+currentUser[property]);
            });
        }
    }
}

function getGroups() {
    $.ajax({url: url+"get/groups",
        dataType: "jsonp",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.getgroups);
        },
        error: function (request,error) {
            showFailurePage("Ihre Gruppen konnten nicht erfolgreich geladen werden. Überprüfen Sie ihre Internetverbindung und versuchen es später noch einmal.", "#page_groups")
        }
    });

    var ajax = {
        parseJSONP:function(groups){

            $.each( groups, function(i, group) {
                $(".groupDivider").after("<li class='deleteGroupsForReset'><a onclick=\"getGroupDetails("+group.gid+")\" href=\"#\"><h3>"+group.gname+"</h3></a></li>");
            });
            $('#groupList').listview('refresh');
        }
    }
}

function getGroupDetails(gid) {
    $.ajax({url: url + "get/group",
        dataType: "jsonp",
        data: {gid:gid},
        async: true,
        success: function (result) {
            showGroupDetailPage();
            ajax.parseJSONP(result.getgroup);
        },
        error: function (request, error) {
            alert('Fehler bei der Übertragung. Details über ihre ausgewählte Gruppe konnten nicht geladen werden.');
        }
    });

    var ajax = {
        parseJSONP: function (group) {
            $(".deleteGroupDetailsForReset").remove();
            $(".groupDetailName").html(group.gname);
            $.each(group.users, function (i, user) {
                $("#groupDetailsListContacts").append("<li class='deleteGroupDetailsForReset'><a onclick='getContactDetails(" + user.uid + ")' href='#'><img src='./images/userProfile.gif'/>" + user.firstname + " "+ user.lastname + "</a></li>");
            });

            if (group.users.length < 6) {
                $( ".collapsibleContacts" ).trigger( "expand" );
            }
            else {
                $( ".collapsibleContacts" ).trigger( "collapse" );
            }

            $("#groupDetailsList").listview('refresh');
            $("#groupDetailsListContacts").listview('refresh');
        }
    }
}

function getContactGroups() {
    $.ajax({url: url+"get/contactgroups/",
        dataType: "jsonp",
        data: {uid:currentUser.uid},
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.getcontactgroups);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(contactgroups){
            if (contactgroups.length > 0) {
                $.each( contactgroups, function(i, contactGroup) {
                    $(".privateGroupDivider").after("<li class='deleteGroupsForReset'><a onclick=\"getContactGroupDetails("+contactGroup.cgid+")\" href=\"#\"><h3>"+contactGroup.cgname+"</h3><p id='groupListDetails"+i+"'></p></a></li>");
                    insertGroupListDetails(contactGroup,i);
                });
            }
            else {
                $(".privateGroupDivider").after("<li class='deleteGroupsForReset'><h3 class='centerText'>keine privaten Gruppen</h3></li>");
            }
            $('#groupList').listview('refresh');
        }
    };

    function insertGroupListDetails(contactGroup,position) {
        var foo = "";
        if (contactGroup.faculty != null) {
            foo = contactGroup.faculty;
        }

        if (contactGroup.faculty != null && contactGroup.semester != null) {
            foo = foo + ", Semester "+contactGroup.semester;
        } else if (contactGroup.semester != null) {
            foo = "Semester " + contactGroup.semester;
        }
        $("#groupListDetails"+position).html(foo);
    }
}

function getContactGroupDetails(cgid) {
    $.ajax({url: url + "get/contactgroup",
        dataType: "jsonp",
        data: {uid:currentUser.uid, cgid:cgid},
        async: true,
        success: function (result) {
            showContactGroupDetailPage();
            ajax.parseJSONP(result.getcontactgroup);
        },
        error: function (request, error) {
            showFailurePage("Ihre Gruppen konnten nicht erfolgreich geladen werden. Überprüfen Sie ihre Internetverbindung und versuchen es später noch einmal.", "#page_groups")
        }
    });

    /*abhängig der eingetragenen informationen (fachbereich/semester können null sein) wird die darstellung verändert*/
    function insertContactGroupListDetails(contactGroup) {
        if (contactGroup.faculty != null && contactGroup.semester != null) {
            $("#contactgroupDetailsList").append("<li class='deleteCGDetailsForReset'><h3>"+contactGroup.faculty+"<span class='right'>"+contactGroup.semester+". Semester</span></h3><p>Fachbereich</p></li>");
        }
        else if (contactGroup.faculty != null) {
            $("#contactgroupDetailsList").append("<li class='deleteCGDetailsForReset'><h3>"+contactGroup.faculty+"</h3><p class=''>Fachbereich</p></li>");
        } else if (contactGroup.semester != null) {
            $("#contactgroupDetailsList").append("<li class='deleteCGDetailsForReset'><h3>"+contactGroup.semester+". Semester</h3><p class=''>Studienhalbjahr</p></li>");
        }
    }

    var ajax = {
        parseJSONP: function (contactGroup) {
            currentCGID = contactGroup.cgid;
            $('#btnManageContactgroupContacts').off(); //prevent ge events of the same type
            $('#btnManageContactgroupContacts').on('click', function() {
                manageContactgroupContacts(contactGroup);
            });

            $(".deleteCGDetailsForReset").remove();
            $(".contactgroupDetailName").html(contactGroup.cgname);
            insertContactGroupListDetails(contactGroup);
            if (contactGroup.users != null) {
                $.each(contactGroup.users, function (i, user) {
                    $("#contactgroupDetailsListContacts").append("<li class='deleteCGDetailsForReset'><a onclick='getContactDetails(" + user.uid + ")' href='#'><img src='./images/userProfile.gif'/>" + user.firstname + " " + user.lastname + "</a></li>");
                    });

                if (contactGroup.users.length < 7) {
                    $( ".collapsibleContacts" ).trigger( "expand" );
                }
                else {
                    $( ".collapsibleContacts" ).trigger( "collapse" );
                }
            }
            else {
                $("#contactgroupDetailsListContacts").append("<li class='deleteCGDetailsForReset centerText'>keine Kontakte vorhanden</li>");
                $( ".collapsibleContacts" ).trigger( "expand" );
            }

            $("#contactgroupDetailsList").listview('refresh');
            $("#contactgroupDetailsListContacts").listview('refresh');
        }
    }
}

function showFailurePage(errorMessage, retryAction) {
    $.mobile.changePage("#page_error");
    $("#failureMessage").html(errorMessage);
    $("#btnFailureRetry").off();
    $("#btnFailureRetry").on('click', function() {
        $.mobile.changePage(retryAction);
    });
}

function updateAttendance(qrcontent) {
    $.ajax({url: url + "update/attendance",
        dataType: "jsonp",
        data: {uid:currentUser.uid, eqrcontent:qrcontent},
        async: true,
        success: function (result) {
            /*TODO:proof if success */
            showAttendanceVerifiedPage();
        },
        error: function (request, error) {
            showFailurePage("Es gab einen Fehler beim Übertragen des QR-Codes. Ihre Eventteilnahme konnte nicht verifiziert werden.", "#page_scanPosition");
        }
    });
}

function deleteContactFromCG(cgid, uid) {
    console.log("delete user "+uid+" from cg "+cgid);
    currentContactList = jQuery.grep(currentContactList, function(value) { //remove specific entry from array
        return value != uid;
    });

    var listElement = event.target;

    $.ajax({url: url + "update/contactgroup",
        dataType: "jsonp",
        data: {uid:currentUser.uid, cgid:cgid, contactlist:currentContactList},
        async: true,
        complete: function() {
            console.log("delete contact: "+this.url);
        },
        success: function (result) {
            $(listElement).closest("li").remove();
            if ($(".deleteManageContactsForReset").length == 0) {
                $("#manageContactgroupDetailsList").append("<li class='deleteManageContactsForReset centerText'>keine Kontakte vorhanden</li>");
            }
            $("#manageContactgroupDetailsList").listview('refresh');
        },
        error: function (request, error) {
            alert('Kontakt konnte nicht erfolgreich gelöscht werden. Bitte versuchen Sie es später noch einmal.');
        }
    });
}

function loadContactsFromCG(contactGroup) {
    $(".deleteManageContactsForReset").remove();
    currentContactList = [];
    if (contactGroup.users != null) {
        $.each(contactGroup.users, function (i, user) {
            $("#manageContactgroupDetailsList").append("<li class='deleteManageContactsForReset'>"+user.firstname+" "+user.lastname+"<div class='ui-li-aside'><a onclick='deleteContactFromCG("+contactGroup.cgid+", "+user.uid+")' href='#'><img class='delete' src='./images/delete.png'></a></div></li>");
            currentContactList.push(user.uid);
        });
    } else {
        $("#manageContactgroupDetailsList").append("<li class='deleteManageContactsForReset centerText'>keine Kontakte vorhanden</li>");
    }
    $("#manageContactgroupDetailsList").listview('refresh');
}

function manageContactgroupContacts(contactGroup) {
    showManageContactsPage();
    loadContactsFromCG(contactGroup);
}

function showHomePage() {
    insertEmailToFooter();
    if (currentUser["uid"] == null) {
        //showErrorPage_for_login() TODO:error page for login?*/
        console.log("show error page for login"); //maybe redirect to login page
        $.mobile.changePage("#page_login");
    }
    else {
        if (currentUser["istutor"] == 0) {
            showStudentHomePage();
        }
        else {
            showDozentHomePage();
        }
    }
}

function showEventAttendees() {
    console.log("showEventAttendees");
    $.mobile.changePage("#page_attendees");
}

function showGroupPage() {
    console.log("showGroupPage");
    $.mobile.changePage("#page_groups");
}

function showStudentHomePage() {
    console.log("showStudentPage");
    $.mobile.changePage("#page_home");
}
function showDozentHomePage() {
    console.log("showDozentPage");
    $.mobile.changePage("#page_homeDozent");
}
function showGroupDetailPage() {
    console.log("showGroupDetailPage");
    $.mobile.changePage("#page_groupDetails");
}

function showLastGroupDetailPage() {
    console.log("showLastGroupDetailPage");
    getContactGroupDetails(currentCGID);
}

function showEvents() {
    console.log("showEvents");
    $.mobile.changePage("#page_controlAttendance");
}

function showContactGroupDetailPage() {
    console.log("showContactGroupDetailPage");
    $.mobile.changePage("#page_contactgroupDetails");
}

function showLoginPage() {
    console.log("logout");
    $.mobile.changePage("#page_login");
}
function showUserDetailPage() {
    console.log("showUserDetailPage");
    $.mobile.changePage("#page_profile");
}
function showEventDetailPage() {
    console.log("showEventDetailPage");
    $.mobile.changePage("#page_eventDetails");
}
function showManageContactsPage() {
    console.log("showManageContactsPage");
    $.mobile.changePage("#page_manageContacts");
}
function showContacts() {
    console.log("showContacts");
    $.mobile.changePage("#page_contacts");
    getContacts();
}

function insertEmailToFooter() {
    $(".footer_email").html(currentUser["email"]);
}

function createContactGroup() {
    var cgname = $("#newGroupName").val();
    if (cgname.length < 3){
        alert("Bitte geben Sie einen Namen mit mindestens 3 Zeichen ein.");
        /*TODO: remove active state from Erstellen btn, bei create Event wird der btn gar nicht active (evtl. input vs a tag?)*/
        return;
    }

    var faculty = $("#newGroupFachbereich").val();
    var semester = "";
    var contactList = [];

    if (!$("#sliderSemester").is(":disabled"))
        semester = $("#sliderSemester").val();

    $("input[type='checkbox']:checked").each(function()
    {
        contactList.push(this.id.substring(8)); //delete 'contact-' in front of checkbox-id to get user id
    });

    console.log(cgname+" "+faculty+" "+semester+" "+contactList);

    $.ajax({url: url + "create/contactgroup",
        dataType: "jsonp",
        data: {uid:currentUser.uid, cgname:cgname, faculty:faculty, semester:semester, contactlist:contactList},
        async: true,
        success: function (result) {
            /*TODO:proof if success */
            showGroupPage();
        },
        error: function (request, error) {
            showFailurePage("Ihre Gruppe konnte nicht erstellt werden. Bitte überprüfen Sie ihre Internetverbindung und versuchen Sie es erneut.", "#page_createGroup");
        }
    });
}

/*load contacts in form for page_createEvent*/
function loadContactGroups() {
    $.ajax({url: url+"get/contactgroups/",
        dataType: "jsonp",
        data: {uid:currentUser.uid},
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.getcontactgroups);
        },
        error: function (request,error) {
            /*TODO: failure*/
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(contactgroups){
            $(".deleteEventGroupOption").remove(); //reset previous page calls side-effects
            $("#newEventGroup").removeClass("ui-disabled"); //reset previous page calls side-effects
            $("#btnAddGroupToCreateEvent").removeClass("ui-disabled"); //reset previous page calls side-effects

            if (contactgroups.length > 0) {
                $.each( contactgroups, function(i, contactGroup) {
                    $("#newEventGroup").append('<option class="deleteEventGroupOption" value="'+contactGroup.cgid+'">'+contactGroup.cgname+'</option>');
                });
            }
            else {
                $("#newEventGroup").prepend("<option class='deleteEventGroupOption'>keine Kontaktgruppen vorhanden</option>");
                $("#newEventGroup").addClass("ui-disabled");
                $("#btnAddGroupToCreateEvent").addClass("ui-disabled");
            }
            $('#newEventGroup').selectmenu('refresh');
        }
    };
}

/*fügt alle mitglieder einer cg zu currentEventContactlist hinzu*/
function addMemberOfGroupToCreateEvent(cgid) {
    $.ajax({url: url+"get/contactgroup",
        dataType: "jsonp",
        data: {uid:currentUser.uid, cgid:cgid},
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.getcontactgroup);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(contactGroup){
            console.log("add contacts from cg "+cgid)
            if (contactGroup.users != null) {
                $.each(contactGroup.users, function(i, contact) {
                    addContactToCreateEvent(i, contact);
                });
                if ($("#searchContactsToCreateEvent").val().length >= minSearchInput)
                    searchContactForCreateEvents($("#searchContactsToCreateEvent").val());//starte suche erneut bzw. aktualisiere suche
            }
            else {
                $("#newEventGroup option[value='"+cgid+"']").text(contactGroup.cgname+" (ohne Kontakte)");
                $("#newEventGroup").selectmenu('refresh');
                alert("Ihre ausgewählte Gruppe enthält keine Kontakte. Es wurden keine Kontakte hinzugefügt.");
            }
        }
    }
}

/*load contacts for page_createContactgroup*/
function loadContacts() {
    $.ajax({url: url+"get/contacts",
        dataType: "jsonp",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.getcontacts);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(contacts){
            //$(".deleteCreateContactsForReset").remove();
            $.each( contacts, function(i, user) {
                $("#createCG_userlist").append("<input type='checkbox' name='contact-"+user.uid+"' id='contact-"+user.uid+"' class='deleteCreateContactsForReset'/><label for='contact-"+user.uid+"'>"+user.firstname + " " + user.lastname +"</label>");
            });
            $("#createCG_userlist_container").trigger('create');
            $("input[type='checkbox']").attr("class","deleteCreateContactsForReset").checkboxradio("refresh");
        }
    }
}


function sortListByDate() {
    $("p").sort(function(a,b){
        return new Date($(a).attr("data-date")) > new Date($(b).attr("data-date"));
    }).each(function(){
            $("body").prepend(this);
        });
}

function scanCode() {
    //TODO how to know what to do with the code
    //is it just a room or a event verification?!
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
            return result.text;
        },
        function (error) {
            alert("Scanning failed: " + error);
            return null;
        }
    );
}

/* übernimmt der server
function encodeData(){
    var data = document.getElementById("data").value;
    if (data != ''){
        window.plugins.barcodeScanner.encode(
            BarcodeScanner.Encode.TEXT_TYPE, data,
            function(success){
                alert("Encode success: " + success);
            },
            function(fail){
                alert("Encoding failed: " + fail);
            }
        );
    }
    else{
        alert("Please enter some data.");
        return false;
    }
} */

function sendMessage(){
    /*
     TODO: methode implementieren
     */
}

function showPositionPage(uid) {
    console.log("show position page of uid "+uid);
    $.mobile.changePage("#page_position");
    $("#showParmHere3").html(uid);
}
/*function openEventProfilePage(name) {
    $("#showEventName").html(name);
}*/
