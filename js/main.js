var url = "http://fhbapp.rumbledore.de/";
var currentSSID = ""; // session ID
var currentUser = []; // user: uid, email, firstname, lastname, istutor, gids
var currentContactList = []; //contactList for contactgroup
var currentEventContactList = []; //contactList for events
var currentCGID = null;
var qrcodeURL = "http://fhbapp.rumbledore.de/generate/qrcode/?qrrequest=";
var minSearchInput = 2;
var targetUID = "";

$.mobile.loader.prototype.options.textVisible = true;
$.mobile.loader.prototype.options.theme = "a";
$.mobile.loader.prototype.options.theme = "a";
$.mobile.defaultPageTransition   = 'none'
$.mobile.defaultDialogTransition = 'none'
$.mobile.buttonMarkup.hoverDelay = 0
moment.lang("de");

/*TODO: groups und cgs andersrum sortieren bitte | falls, dann lösch .reverse()*/

/*
* checks if we have a valid session
* @return 1 if session is valid (no error message was send)
* */
function isSessionValid(result) {
    if (result.error == "NoSession") {
        alert("no valid session");
        showLoginPage();
        return 0;
    }
    else {
        if (result.error != undefined) {
            console.log("Fehler: "+result.error);
        }
        return 1;
    }
}

/*
* login with username and passwort
* @parameter uname, upassword
* @return user: uid, email, firstname, lastname, istutor, gids
*         sessionID: ssid
* */
function checkLogin() {
    $.ajax({url: url + "do/login",
        dataType: "jsonp",
        data: $("#formLogin").serialize(),
        async: true,
        success: function (result) { //TODO check if success?
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
                if (property != "ssid") {
                    currentUser[property] = value;
                    console.log(property + ": "+currentUser[property]);
                }
                else {
                    currentSSID = value;
                    console.log("SSID: "+currentSSID);
                }
            });
            loadContactsOnStartup(); //TODO: find a better position?
            loadGroupsOnStartup();
        }
    }
}

function logout() {
    console.log("logout");
    $.ajax({url: url + "do/logout",
        dataType: "jsonp",
        data: {ssid:currentSSID},
        async: true,
        success: function (result) {
            if(isSessionValid(result.dologout)) {
                if (result.dologout.success){
                    currentUser = [];
                    currentSSID = "";
                    showLoginPage();
                }
            }
        },
        error: function (request,error) {
            alert("Sie konnten nicht erfolgreich abgemeldet werden. Bitte versuchen Sie es später noch einmal.");
        }
    });
}

function loadContactsOnStartup() {
    $.ajax({url: url+"get/contacts",
        dataType: "jsonp",
        data: {ssid:currentSSID},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getcontacts)) {
                //$.mobile.showPageLoadingMsg();/*TODO: insert ajax loader pls*/
                ajax.parseJSONP(result.getcontacts);
                //$.mobile.hidePageLoadingMsg();
            }
        },
        error: function (request,error) {
            alert("Kontakte konnten nicht geladen werden.");
        }
    })

    var ajax = {
        parseJSONP:function(contacts){
            var contactList = [];
            $.each( contacts, function(i, user) {
                contactList.push(user);
            });
            sessionStorage.setItem("contacts", JSON.stringify(contactList));
        }
    }
}

/*
* loads all contacts from database and add them dynamically to the tab "Kontakte"
* @parameter ssid
* @return array of users: uid, firstname, lastname
* */
function getContacts() {
    var contacts = JSON.parse(sessionStorage.getItem("contacts"));
    console.log(contacts);
    $("#userList").empty();
    $.each( contacts, function(i, user) {
        $("#userList").append("<li><a onclick=\"getContactDetails("+user.uid+")\" href=\"#\">"+user.firstname +" "+user.lastname+"</a></li>");
        console.log(user);
    });
    $('#userList').listview('refresh');
    /*$.ajax({url: url+"get/contacts",
        dataType: "jsonp",
        data: {ssid:currentSSID},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getcontacts)) {
                //$.mobile.showPageLoadingMsg();/*TODO: kA ob das so überhaupt was bringt oder funktioniert..beforeSend hat bisher nich funktioniert
                ajax.parseJSONP(result.getcontacts);
                //$.mobile.hidePageLoadingMsg();
            }
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
    }*/
}

function loadGroupsOnStartup() {
    $.ajax({url: url+"get/groups",
        dataType: "jsonp",
        data: {ssid:currentSSID},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getgroups)) /*TODO: add ajax loader!*/
                ajax.parseJSONP(result.getgroups);
        },
        error: function (request,error) {
            alert("Öffentliche Gruppen konnten nicht geladen werden.");
        }
    });

    var ajax = {
        parseJSONP:function(groups){
            var groupList = [];
            $.each(groups, function(i, group) {
                groupList.push(group);
            });
            sessionStorage.setItem("groups", JSON.stringify(groupList));
        }
    }

    $.ajax({url: url+"get/contactgroups/",
        dataType: "jsonp",
        data: {ssid:currentSSID},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getcontactgroups))
                ajax2.parseJSONP(result.getcontactgroups);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax2 = {
        parseJSONP:function(contactgroups){
            var contactgroupList = [];
            $.each(contactgroups, function(i, contactGroup) {
                contactgroupList.push(contactGroup);
            });
            sessionStorage.setItem("contactgroups", JSON.stringify(contactgroupList));
        }
    };
}

/*
* loads all public groups from database and add them dynamically to the tab "Gruppen"
* @parameter ssid
* @return array of groups: gid, gname
* */
function getGroups() {
    var groups = JSON.parse(sessionStorage.getItem("groups"));
    $.each(groups.reverse(), function(i, group) {
        $(".groupDivider").after("<li class='deleteGroupsForReset'><a onclick=\"getGroupDetails("+group.gid+")\" href=\"#\"><h3>"+group.gname+"</h3></a></li>");
    });
    $('#groupList').listview('refresh');
  /*  $.ajax({url: url+"get/groups",
        dataType: "jsonp",
        data: {ssid:currentSSID},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getgroups))
                ajax.parseJSONP(result.getgroups);
        },
        error: function (request,error) {
            showFailurePage("Ihre Gruppen konnten nicht erfolgreich geladen werden. Überprüfen Sie ihre Internetverbindung und versuchen es später noch einmal.", "#page_groups");
        }
    });

    var ajax = {
        parseJSONP:function(groups){
            $.each(groups, function(i, group) {
                $(".groupDivider").after("<li class='deleteGroupsForReset'><a onclick=\"getGroupDetails("+group.gid+")\" href=\"#\"><h3>"+group.gname+"</h3></a></li>");
            });
            $('#groupList').listview('refresh');
        }
    }*/
}

/*
* load all private contactgroups of a specific user and add them dynamically to the tab "Gruppen"
* @parameter ssid
* @return array of contactgroups: cgid, cgname, faculty, semester, cgcreationdate
* */
function getContactgroups() {
    var contactgroups = JSON.parse(sessionStorage.getItem("contactgroups"));
    if (contactgroups.length > 0) {
        $.each(contactgroups.reverse(), function(i, contactGroup) {
            console.log(contactGroup);
            $(".privateGroupDivider").after("<li class='deleteGroupsForReset'><a onclick=\"getContactgroupDetails("+contactGroup.cgid+")\" href=\"#\"><h3>"+contactGroup.cgname+"</h3><p id='groupListDetails"+i+"'></p></a></li>");
        });
    }
    else {
        $(".privateGroupDivider").after("<li class='deleteGroupsForReset'><h3 class='centerText'>keine privaten Gruppen</h3></li>");
    }
    $('#groupList').listview('refresh');
  /*  $.ajax({url: url+"get/contactgroups/",
        dataType: "jsonp",
        data: {ssid:currentSSID},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getcontactgroups))
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
                    $(".privateGroupDivider").after("<li class='deleteGroupsForReset'><a onclick=\"getContactgroupDetails("+contactGroup.cgid+")\" href=\"#\"><h3>"+contactGroup.cgname+"</h3><p id='groupListDetails"+i+"'></p></a></li>");
                    insertGroupListDetails(contactGroup,i);
                });
            }
            else {
                $(".privateGroupDivider").after("<li class='deleteGroupsForReset'><h3 class='centerText'>keine privaten Gruppen</h3></li>");
            }
            $('#groupList').listview('refresh');
        }
    };*/
}

/*
* load details of a specific public group and show them on #page_groupDetails
* @parameter ssid, gid
* @return group: gid, gname, array of users: uid, firstname, lastname
*
* */
function getGroupDetails(gid) {
    $.ajax({url: url + "get/group",
        dataType: "jsonp",
        data: {ssid:currentSSID, gid:gid},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getgroup)) {
                showGroupDetailPage();
                ajax.parseJSONP(result.getgroup);
            }
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

            //collapse contactlist if group contains more than 6 users
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

/*
* load details of a specific private contactgroup and show them on #page_contactgroupDetails
* @parameter ssid, cgid
* @return contactgroup: cgid, cgname, faculty, semester, cgcreationdate, array of users: uid, firstname, lastname
* */
function getContactgroupDetails(cgid) {
    $.ajax({url: url + "get/contactgroup",
        dataType: "jsonp",
        data: {ssid:currentSSID, cgid:cgid},
        async: true,
        success: function (result) {
            if(isSessionValid(result.getcontactgroup)) {
                showContactGroupDetailPage();
                ajax.parseJSONP(result.getcontactgroup);
            }
        },
        error: function (request, error) {
            showFailurePage("Ihre Gruppen konnten nicht erfolgreich geladen werden. Überprüfen Sie ihre Internetverbindung und versuchen es später noch einmal.", "#page_groups")
        }
    });


    var ajax = {
        parseJSONP: function (contactGroup) {
            currentCGID = contactGroup.cgid;
            $('#btnManageContactgroupContacts').off(); //prevent multiple events of the same type
            $('#btnManageContactgroupContacts').on('click', function() {
                manageContactgroupContacts(contactGroup); //helper method to show #page_manageContacts and load contacts
            });

            $(".deleteCGDetailsForReset").remove();
            $("#cgd-cgid").html(contactGroup.cgid);
            $(".contactgroupDetailName").html(contactGroup.cgname);

            if (contactGroup.users != null) {
                $.each(contactGroup.users, function (i, user) {
                    $("#contactgroupDetailsListContacts").append("<li class='deleteCGDetailsForReset'><a onclick='getContactDetails(" + user.uid + ")' href='#'><img src='./images/userProfile.gif'/>" + user.firstname + " " + user.lastname + "</a></li>");
                });

                //collapse contactlist if group contains more than 7 users
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

/*
* load details of a specific user(contact) and show them on #page_profile
* @parameter ssid, uid
* @return user(contact): uid, firstname, lastname, email, city, sdescription, names of groups and contactgroups
* */
function getContactDetails(userID) {
    $.ajax({url: url + "get/contact",
        dataType: "jsonp",
        data: {ssid:currentSSID, uid: userID},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getcontact)) {
                showUserDetailPage();
                ajax.parseJSONP(result.getcontact);
            }
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

/*
 * load all contacts and display them on #page_createGroup
 * @parameter ssid
 * @return array of users: uid, firstname, lastname
 *
function getContactsForCreateContactgroup() {
    $.ajax({url: url+"get/contacts",
        dataType: "jsonp",
        data: {ssid:currentSSID},
        async: true,
        success: function (result) {
            if(isSessionValid(result.getcontacts))
                ajax.parseJSONP(result.getcontacts);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(contacts){
            $(".deleteCreateContactsForReset").remove(); //not necessary because this function will only called once (on init page)
            $.each( contacts, function(i, user) {
                $("#createCG_userlist").append("<input type='checkbox' name='contact-"+user.uid+"' id='contact-"+user.uid+"' class='deleteCreateContactsForReset'/><label for='contact-"+user.uid+"'>"+user.firstname + " " + user.lastname +"</label>");
            });
            $("#createCG_userlist_container").trigger('create');
            $("input[type='checkbox']").attr("class","deleteCreateContactsForReset").checkboxradio("refresh");
        }
    }
}*/

/*
 * search all contacts by string for #page_createContactgroup
 * @parameter ssid, request(search string)
 * @return array of users: uid, firstname, lastname
 * */
function searchContactsForCreateContactgroup(str) {
    var contacts = JSON.parse(sessionStorage.getItem("contacts"));
    contacts = $.grep(contacts, function(ele){
        if ((ele.firstname.toLowerCase().indexOf(str.toLowerCase()) >= 0) || (ele.lastname.toLowerCase().indexOf(str.toLowerCase()) >= 0))
            return ele;
    });

    $(".deleteSearchCGContacts").remove();

    if (contacts.length > 0) {
        $.each(contacts, function(i, contact) {
            if (isContactAlreadyInList(contact.uid, currentContactList) >= 0) {
                $("#liSearchContactsToCreateCG").after("<li class='deleteSearchCGContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside asideText'>bereits hinzugefügt</div></li>");
            }
            else { //if contact not in currentContactList
                $("#liSearchContactsToCreateCG").after("<li class='deleteSearchCGContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside'><a id='addCGContact-" + i + "' href='#'><img class='add' src='./images/add.png' /></a></div></li>");

                $("#addCGContact-" + i).on('click', function () {
                    addContactToCreateContactgroup(i, contact); //helper method to add contacts
                    $(event.target).closest("div").addClass("asideText").html("hinzugefügt");
                });
            }
        });
    }
    else { //if there are no search results found
        $("#liSearchContactsToCreateCG").after("<li class='deleteSearchCGContacts centerText'>keine Kontakte gefunden</li>");
    }
    $("#listCGContacts").listview('refresh');
}

/*
* create a private contactgroup for the current logged in user
* @parameter ssid, cgname, semester, faculty, array of contactlist[uid]
* @return success(1), gid
* */
function createContactgroup() {
    var contactgroup = new Object();
    var cgname = $("#newGroupName").val();
    if (cgname.length < 3){
        alert("Bitte geben Sie einen Namen mit mindestens 3 Zeichen ein.");
        return;
    }
    contactgroup.cgname = cgname;

    $.ajax({url: url + "create/contactgroup",
        dataType: "jsonp",
        data: {ssid:currentSSID, cgname:cgname, contactlist:currentContactList},
        async: true,
        success: function (result) {
            if (isSessionValid(result.createcontactgroup)) {
                if (result.createcontactgroup.success) {
                    contactgroup.cgid = result.createcontactgroup.cgid;
                    var contactgroups = JSON.parse(sessionStorage.getItem("contactgroups"));
                    contactgroups.push(contactgroup);
                    sessionStorage.setItem("contactgroups",JSON.stringify(contactgroups));

                    getContactgroupDetails(result.createcontactgroup.cgid);
                }
                else {
                    alert("Kontaktgruppe konnte nicht erstellt werden.");
                }
            }
        },
        error: function (request, error) {
            showFailurePage("Ihre Gruppe konnte nicht erstellt werden. Bitte überprüfen Sie ihre Internetverbindung und versuchen Sie es erneut.", "#page_createContactgroup");
        }
    });
}

/*
* load all events created by the current user
* @parameter ssid
* @return array of events: eid, ename, edate
* */
function getEvents() {
    $.ajax({url: url+"get/events",
        dataType: "jsonp",
        data: {ssid: currentSSID},
        async: true,
        success: function (result) {
            if(isSessionValid(result.getevents))
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

                if (d < new Date()) { //if event out of date
                    $("#eventList").append("<li class='deleteEventsForReset'><a onclick=\"getEventDetails("+event.eid+")\" href=\"#\"><h3>"+event.ename+"</h3><p>"+moment(d).calendar()+"</p></li>");
                    finishedEvents++;
                }
                else { //if event is upcoming
                    $("#eventList .ui-first-child").after("<li class='deleteEventsForReset'><a onclick=\"getEventDetails("+event.eid+")\" href=\"#\"><h3>"+event.ename+"</h3><p>"+moment(d).calendar()+"</p></li>");
                    remainingEvents++;
                }
            });
            if (finishedEvents == 0) {//if no events exist out of date
                $("#liFinishedEvents").after("<li class='deleteEventsForReset bold centerText'>keine Events abgelaufen</li>");
            }
            if (remainingEvents == 0) { //if there are no events in the future
                $("#liFinishedEvents").before("<li class='deleteEventsForReset bold centerText'>keine Events mehr ausstehend</li>");
            }
            $('#eventList').listview('refresh');
        }
    }
}

/*
 * load details of a specific event and show #page_eventDetails
 * @parameter ssid, eid
 * @return eid, edescription, ename, edate, ecreationdate, eqrcontent, firstname (of creator), lastname (of creator)
 * */
function getEventDetails(eid) {
    $.ajax({url: url + "get/event",
        dataType: "jsonp",
        data: {ssid:currentSSID, eid:eid},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getevent)) {
                showEventDetailPage();
                ajax.parseJSONP(result.getevent);
            }
        },
        error: function (request, error) {
            showFailurePage("Die Detailinformationen zu einem Event konnten nicht geladen werden. " +
                "Überprüfen Sie, ob Sie eine bestehende Internetverbindung besitzen.", "#page_controlAttendance");
        }
    });

    //change formatting dependent on event detail information (some information may be empty)
    function insertEventListDetails(event) {
        var creationDate = new Date(event.ecreationdate*1000); //js works with millisecond while mysql works with seconds
        var eventDate = new Date(event.edate*1000); //js works with millisecond while mysql works with seconds
        $("#eventInsertAfter").after("<li class='deleteEventDetailsForReset'><h3>Erstellt am "+moment(creationDate).format("LL")+"</h3><p>Erstelldatum</p></li>");
        $("#eventInsertAfter").after("<li class='deleteEventDetailsForReset'><h3>"+moment(eventDate).calendar()+"</h3><p>Eventstart</p></li>");
    }

    var ajax = {
        parseJSONP: function (event) {
            $(".deleteEventDetailsForReset").remove();

            //add detail information dynamically to html
            $("#ed-eid").html(event.eid);
            $(".eventDetailName").html(event.ename);
            $(".eventName").html(event.ename);
            $(".eventDetailDescription").html(event.edescription);
            insertEventListDetails(event);
            $("#eventDetailsList").listview('refresh');

            $("#eventQRCode").attr("src", qrcodeURL+event.eqrcontent);
            $("#eventQRCode").height(400);$("#eventQRCode").width(400);

            $('#btnAttendees').off(); //prevent multiple events of the same type
            $('#btnAttendees').on('click', function() {
                showEventAttendees();
                getEventAttendees(event.eid);
            });
        }
    }
}

/*
* load all attendees of a specific event with their status of verification
* @parameter ssid, eid
* @return array of users: uid, firstname, lastname, hasverified
* */
function getEventAttendees(eid) {
    $.ajax({url: url + "get/attendees",
        dataType: "jsonp",
        data: {ssid:currentSSID, eid:eid},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getattendees))
                ajax.parseJSONP(eid, result.getattendees);
        },
        error: function (request, error) {
            /*TODO:failure page einfügen, evtl retry btn here überschreiben*/
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP: function (eid, attendees) {
            var cVerified = 0;
            var cNotVerified = 0;
            $(".deleteEventAttendeesForReset").remove();
            $("#btnRefreshAttendees").off(); //prevent multiple events of the same type
            $("#btnRefreshAttendees").on('click', function() {
                getEventAttendees(eid);
            });

            $.each(attendees, function(i, attendee) {
                if (attendee.hasverified) {
                    $("#liAttendeesVerified").after("<li class='deleteEventAttendeesForReset' data-filtertext='verified verifiziert "+attendee.firstname+" "+attendee.lastname+"'><img src='images/check.png' class='ui-li-icon'>"+attendee.firstname+" "+attendee.lastname+"</li>");
                    cVerified++;
                }
                else {
                    $("#liAttendeesNotVerified").after("<li class='deleteEventAttendeesForReset' data-filtertext='not nicht "+attendee.firstname+" "+attendee.lastname+"'><img src='images/nocheck.png' class='ui-li-icon'>"+attendee.firstname+" "+attendee.lastname+"</li>");
                    cNotVerified++;
                }
            });

            if (cVerified == 0) { //if no one has verified
                $("#liAttendeesVerified").after("<li class='deleteEventAttendeesForReset centerText' data-filtertext='verified verifiziert'>es wurde bisher niemand verifiziert</li>");
            }

            if (cNotVerified == 0) { //if everyone has already verified
                $("#liAttendeesNotVerified").after("<li class='deleteEventAttendeesForReset centerText' data-filtertext='not nicht'>alle Teilnehmer wurden bereits verifiziert</li>");
            }

            $("#listEventAttendees").listview('refresh');
        }
    }
}

/*
* load all future events where the current user is registered / has to participate
* @parameter ssid
* @return array of events: eid, ename, edescription, edate, ecreator
* */
function getEventlist() {
    $.ajax({url: url+"get/eventlist",
        dataType: "jsonp",
        data: {ssid: currentSSID},
        async: true,
        success: function (result) {
            if(isSessionValid(result.geteventlist))
                ajax.parseJSONP(result.geteventlist);
        },
        error: function (request,error) {
            showFailurePage("Events konnten nicht geladen werden. Überprüfen Sie, ob Sie eine bestehende Internetverbindung besitzen.", "#page_eventList");
        }
    });

    var ajax = {
        parseJSONP:function(events){
            $(".deleteListEventsForReset").remove();

            //create event divider dynamically by date
            var lastDivider = "";
            if (events.length > 0) {
                $.each(events, function(i, event) {
                    var newDivider = moment(event.edate*1000).format("dddd, DD.MMMM YYYY");
                    if (lastDivider != newDivider) { //create a new divider if edate differs from other events
                        $("#listEventlist").append("<li class='deleteListEventsForReset' data-role='list-divider'>"+newDivider+"</li>");
                        lastDivider = newDivider;
                    }

                    $("#listEventlist").append("<li class='deleteListEventsForReset'><h3>"+event.ename+"</h3><p class='bold'>"+event.edescription+"</p><p>Erstellt von "+ event.ecreator+"</p><p class='ui-li-aside'><span class='bold'>"+moment(event.edate*1000).format("HH:mm")+"</span> Uhr</p></li>");

                });
            }
            else { //if there are no events
                $("#listEventlist").append("<li data-role='list-divider' class='deleteListEventsForReset'><h3>Eventliste</h3></li>");
                $("#listEventlist").append("<li class='deleteListEventsForReset centerText bold'>keine anstehenden Events vorhanden</li>");
            }
            $('#listEventlist').listview('refresh');
        }
    }
}

/*
* create an event to control attendance of students
* @parameter ssid, edescription, ename, edate, attendeelist[uid]
* @return success(1), eid
* */
function _createEvent() {
    var _event = new Object();
    _event = getEventInformation();
    if (_event != null) {
         $.ajax({url: url + "create/event",
             dataType: "jsonp",
             data: {ssid:currentSSID, ename:_event.ename, edate:_event.edate, edescription:_event.edescription, attendeelist: currentEventContactList}, //for currentEventContactList see @addContactToCreateEvent
             async: true,
             success: function (result) {
                 if (isSessionValid(result.createevent)) {
                     if (result.createevent.success)
                        getEventDetails(result.createevent.eid); //show event details of created event
                     else {
                         /*TODO failure*/
                     }
                 }
             },
             error: function (request, error) {
                console.log(error);
                showFailurePage("Das Event konnte nicht erstellt werden. Bitte überprüfen Sie ihre Internetverbindung und versuchen Sie es später erneut.", "#page_createEvent");
             }
         });
    }
}

/*
* search all contacts by string for #page_createEvent
* @parameter ssid, request(search string)
* @return array of users: uid, firstname, lastname
* */
function searchContactsForCreateEvents(str) {
    var contacts = JSON.parse(sessionStorage.getItem("contacts"));
    contacts = $.grep(contacts, function(ele){
        if ((ele.firstname.toLowerCase().indexOf(str.toLowerCase()) >= 0) || (ele.lastname.toLowerCase().indexOf(str.toLowerCase()) >= 0))
            return ele;
    });

    $(".deleteSearchEventContacts").remove();

    if (contacts.length > 0) {
        $.each(contacts, function(i, contact) {
            if (isContactAlreadyInList(contact.uid, currentEventContactList) >= 0) {
                $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside asideText'>bereits hinzugefügt</div></li>");
            }
            else { //if contact not in currentEventContactList
                $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside'><a id='addEventContact-" + i + "' href='#'><img class='add' src='./images/add.png' /></a></div></li>");

                $("#addEventContact-" + i).on('click', function () {
                    addContactToCreateEvent(i, contact); //helper method to add contacts
                    $(event.target).closest("div").addClass("asideText").html("hinzugefügt");
                });
            }
        });
    }
    else { //if there are no search results found
        $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts centerText'>keine Kontakte gefunden</li>");
    }
    $("#listEventContacts").listview('refresh');
    /*
    $.ajax({url: url+"search/contact",
        dataType: "jsonp",
        data: {ssid:currentSSID, request: str},
        async: true,
        success: function (result) {
            if(isSessionValid(result.searchcontact))
                ajax.parseJSONP(result.searchcontact);
        },
        error: function (request,error) {
            //$(".deleteSearchEventContacts").remove();
            //$("#listNavigation").append("<li class='deleteNavigationContacts centerText errorMsg'>Fehler: Suchanfrage konnte nicht übermittelt werden.</li>");
            //$("#listNavigation").listview('refresh');
        }
    });

    var ajax = {
        parseJSONP:function(contacts){
            $(".deleteSearchEventContacts").remove();

            if (contacts.length > 0) {
                $.each(contacts, function(i, contact) {
                    if (isContactAlreadyInList(contact.uid, currentEventContactList) >= 0) {
                        $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside asideText'>bereits hinzugefügt</div></li>");
                    }
                    else { //if contact not in currentEventContactList
                        $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside'><a id='addEventContact-" + i + "' href='#'><img class='add' src='./images/add.png' /></a></div></li>");

                        $("#addEventContact-" + i).on('click', function () {
                            addContactToCreateEvent(i, contact); //helper method to add contacts
                            $(event.target).closest("div").addClass("asideText").html("hinzugefügt");
                        });
                    }
                });
            }
            else { //if there are no search results found
                $("#liSearchContactsToCreateEvent").after("<li class='deleteSearchEventContacts centerText'>keine Kontakte gefunden</li>");
            }
            $("#listEventContacts").listview('refresh');
        }
    }*/
}

/* TODO: auslagern
 * helper method to add contacts to current event
 * @parameter i (current position for identification), contact
 *
 * */
function addContactToCreateEvent(i, contact) {
    if (isContactAlreadyInList(contact.uid, currentEventContactList) >= 0) {
        console.log("already in contactlist");
        //do nothing
    }
    else { //add contact to currentEventContactList

        if ($(".deleteEventContacts").text() == "noch keine Kontakte hinzugefügt")
            $(".deleteEventContacts").remove();

        $("#liAddedContactstoCreateEvent").after("<li class='deleteEventContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside'><a id='deleteEventContact-" + i + "' href='#'><img class='delete' src='./images/delete.png'></a></div></li>");

        //add delete function
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
            if ($("#searchContactsToCreateEvent").val().length >= minSearchInput) //if search field is not empty
                searchContactsForCreateEvents($("#searchContactsToCreateEvent").val()); //update search results
        });

        $("#listEventContacts").listview('refresh');

        currentEventContactList.push(contact.uid);
    }
}

/* TODO: auslagern
 * helper method to add contacts to current contactgroup
 * @parameter i (current position for identification), contact
 *
 * */
function addContactToCreateContactgroup(i, contact) {
    if (isContactAlreadyInList(contact.uid, currentContactList) >= 0) {
        console.log("already in contactlist");
        //do nothing
    }
    else { //add contact to currentContactList

        if ($(".deleteCGContacts").text() == "noch keine Kontakte hinzugefügt")
            $(".deleteCGContacts").remove();

        $("#liAddedContactstoCreateCG").after("<li class='deleteCGContacts'>" + contact.firstname + " " + contact.lastname + "<div class='ui-li-aside'><a id='deleteCGContact-" + i + "' href='#'><img class='delete' src='./images/delete.png'></a></div></li>");

        //add delete function
        $("#deleteCGContact-" + i).on('click', function () {
            console.log("delete contact");

            currentContactList = jQuery.grep(currentContactList, function (value) { //remove specific entry from array
                return value != contact.uid;
            });

            $(event.target).closest("li").remove();
            if ($(".deleteCGContacts").length == 0) {
                $("#liAddedContactstoCreateCG").after("<li class='deleteCGContacts centerText'>noch keine Kontakte hinzugefügt</li>");
            }
            $("#listCGContacts").listview('refresh');
            if ($("#searchContactsToCreateCG").val().length >= minSearchInput) //if search field is not empty
                searchContactsForCreateContactgroup($("#searchContactsToCreateCG").val()); //update search results
        });

        $("#listCGContacts").listview('refresh');

        currentContactList.push(contact.uid);
    }
}

/*
* add all members of a specific contactgroup to an event
* @parameter ssid, cgid
* @return contactgroup: cgid, cgname, faculty, semester, cgcreationdate, array of users: uid, firstname, lastname
* */
function addContactgroupToCreateEvent(cgid) {
     $.ajax({url: url+"get/contactgroup",
        dataType: "jsonp",
        data: {ssid:currentSSID, cgid:cgid},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getcontactgroup))
                ajax.parseJSONP(result.getcontactgroup);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(contactGroup){
            if (contactGroup.users != null) {
                $.each(contactGroup.users, function(i, contact) {
                    addContactToCreateEvent(i, contact); //helper method to add contact to an event
                });
                if ($("#searchContactsToCreateEvent").val().length >= minSearchInput) //if search field is not empty
                    searchContactsForCreateEvents($("#searchContactsToCreateEvent").val()); //update serach results
            }
            else { //if contactgroup has no members
                $("#newEventGroup option[value='"+cgid+"']").text(contactGroup.cgname+" (ohne Kontakte)");
                $("#newEventGroup").selectmenu('refresh');
                alert("Ihre ausgewählte Gruppe enthält keine Kontakte. Es wurden keine Kontakte hinzugefügt.");
            }
        }
    }
}

/*
* load all contactgroups created by current user and show them on #page_createEvent
* @parameter ssid
* @return array of contactgroups: cgid, cgname, faculty, semester, cgcreationdate
* */
function getContactgroupsForCreateEvent() {
    var contactgroups = JSON.parse(sessionStorage.getItem("contactgroups"));
    $(".deleteEventGroupOption").remove(); //reset previous page calls side-effects
    $("#newEventGroup").removeClass("ui-disabled"); //reset previous page calls side-effects
    $("#btnAddGroupToCreateEvent").removeClass("ui-disabled"); //reset previous page calls side-effects

    if (contactgroups.length > 0) {
        $.each(contactgroups, function(i, contactGroup) {
            $("#newEventGroup").append('<option class="deleteEventGroupOption" value="'+contactGroup.cgid+'">'+contactGroup.cgname+'</option>');
        });
    }
    else { //if current user has no contactgroups
        $("#newEventGroup").prepend("<option class='deleteEventGroupOption'>keine Kontaktgruppen vorhanden</option>");
        $("#newEventGroup").addClass("ui-disabled");
        $("#btnAddGroupToCreateEvent").addClass("ui-disabled");
    }
    $('#newEventGroup').selectmenu('refresh');
    /*   $.ajax({url: url+"get/contactgroups/",
        dataType: "jsonp",
        data: {ssid:currentSSID},
        async: true,
        success: function (result) {
            if(isSessionValid(result.getcontactgroups))
                ajax.parseJSONP(result.getcontactgroups);
        },
        error: function (request,error) {

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
            else { //if current user has no contactgroups
                $("#newEventGroup").prepend("<option class='deleteEventGroupOption'>keine Kontaktgruppen vorhanden</option>");
                $("#newEventGroup").addClass("ui-disabled");
                $("#btnAddGroupToCreateEvent").addClass("ui-disabled");
            }
            $('#newEventGroup').selectmenu('refresh');
        }
    }*/
}

/* TODO: auslagern
* helper method to check if contact is already in a specific array list
* @parameter uid, list
* @return -1 if user is not in list
*         >=0 index of specific user
* */
function isContactAlreadyInList(uid, list) {
    return jQuery.inArray(uid, list);
}

/*
* add a single contact to current contactgroup and update contactgroup on database
* @parameter ssid, cgid, contactList (array of uids)
* @return success(1)
* */
function addContactToCG(contact) {
    if (isContactAlreadyInList(contact.uid, currentContactList) >= 0) {
        console.log("already in array");
    }
    else { //if contact is not in currentContactList
        currentContactList.push(contact.uid);

        //update contactgroup on database
        $.ajax({url: url+"update/contactgroup",
            dataType: "jsonp",
            data: {
                ssid:currentSSID,
                cgid:currentCGID,
                contactlist:currentContactList},
            async: true,
            success: function (result) {
                if (isSessionValid(result.updatecontactgroup))
                    if (result.updatecontactgroup.success)
                        ajax.parseJSONP(result.getcontactgroups);
                    else {
                        alert("Kontakt konnte nicht hinzugefügt werden.");
                        return;
                    }
            },
            error: function (request,error) {
                alert('Nutzer konnte nicht erfolgreich zur Gruppe hinzugefügt werden.');
                return;
            }
        });

        var ajax = {
            parseJSONP:function(contactgroups){
                if ($(".deleteManageContactsForReset").text() == "keine Kontakte vorhanden")
                    $(".deleteManageContactsForReset").remove();

                $("#manageContactgroupDetailsList").append("<li class='deleteManageContactsForReset'>"+contact.firstname+" "+contact.lastname+"<div class='ui-li-aside'><a onclick='deleteContactFromCG("+currentCGID+", "+contact.uid+")' href='#'><img class='delete' src='./images/delete.png'></a></div></li>");
                $("#manageContactgroupDetailsList").listview('refresh');
            }
        }
    }
    $(event.target).closest("div").addClass("asideText").html("hinzugefügt");
}

/*
* search all contacts by string for #page_manageContacts
* @parameter ssid, request (search string)
* @return array of users: uid, firstname, lastname
* */
function searchContactsForContactgroup(str) {
    var contacts = JSON.parse(sessionStorage.getItem("contacts"));
    contacts = $.grep(contacts, function(ele){
        if ((ele.firstname.toLowerCase().indexOf(str.toLowerCase()) >= 0) || (ele.lastname.toLowerCase().indexOf(str.toLowerCase()) >= 0))
            return ele;
    });

    $(".deleteSearchContactsToAdd").remove();
    if (contacts.length > 0) {
        $.each( contacts, function(i, contact) {
            if (isContactAlreadyInList(contact.uid, currentContactList) >= 0) {
                console.log("already in list "+contact.firstname + " "+ contact.uid);
                $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd'>"+contact.firstname+ " " +contact.lastname+"<div class='ui-li-aside asideText'>bereits hinzugefügt</div></li>");
            }
            else
            { //if contact is not already in contactgroup
                console.log("not in list "+ contact.firstname + " "+ contact.uid);
                $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd'>"+contact.firstname+ " " +contact.lastname+"<div class='ui-li-aside'><a id='addContact-"+i+"' href='#'><img class='add' src='./images/add.png' /></a></div></li>");
                $("#addContact-"+i).on('click', function() {
                    addContactToCG(contact); //safe to db immediately
                });
            }
        });
    }
    else { //if there was no contact found by search string
        $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd centerText'>keine Kontakte gefunden</li>");
    }
    $("#manageContactgroupDetailsList").listview('refresh');

    /*
    $.ajax({url: url+"search/contact",
        dataType: "jsonp",
        data: {ssid:currentSSID,request: str},
        async: true,
        success: function (result) {
            if (isSessionValid(result.searchcontact))
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
            $(".deleteSearchContactsToAdd").remove();
            if (contacts.length > 0) {
                $.each( contacts, function(i, contact) {
                    if (isContactAlreadyInList(contact.uid, currentContactList) >= 0) {
                        console.log("already in list "+contact.firstname + " "+ contact.uid);
                        $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd'>"+contact.firstname+ " " +contact.lastname+"<div class='ui-li-aside asideText'>bereits hinzugefügt</div></li>");
                    }
                    else
                    { //if contact is not already in contactgroup
                        console.log("not in list "+ contact.firstname + " "+ contact.uid);
                        $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd'>"+contact.firstname+ " " +contact.lastname+"<div class='ui-li-aside'><a id='addContact-"+i+"' href='#'><img class='add' src='./images/add.png' /></a></div></li>");
                        $("#addContact-"+i).on('click', function() {
                             addContactToCG(contact);
                        });
                    }
                });
            }
            else { //if there was no contact found by search string
                $("#liSearchContactsToAdd").after("<li class='deleteSearchContactsToAdd centerText'>keine Kontakte gefunden</li>");
            }
            $("#manageContactgroupDetailsList").listview('refresh');
        }
    }*/
}


/*
* search all contacts by string for #page_navigation
* @parameter ssid, request (search string)
* @return array of users: uid, firstname, lastname
* */
function searchContactForNavigation(str) {
    var contacts = JSON.parse(sessionStorage.getItem("contacts"));
    contacts = $.grep(contacts, function(ele){
        if ((ele.firstname.toLowerCase().indexOf(str.toLowerCase()) >= 0) || (ele.lastname.toLowerCase().indexOf(str.toLowerCase()) >= 0))
            return ele;
    });

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
    /*$.ajax({url: url+"search/contact",
        dataType: "jsonp",
        data: {ssid:currentSSID, request: str},
        async: true,
        success: function (result) {
            if(isSessionValid(result.searchcontact)) {
                ajax.parseJSONP(result.searchcontact);
            }
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
    }*/
}

/*
* delete a specific user from contactgroup and update contactgroup on database
* @parameter ssid, cgid, contactlist (array of uids)
* @return success(1)
* */
function deleteContactFromCG(cgid, uid) {
    console.log("delete user "+uid+" from cg "+cgid);

    currentContactList = jQuery.grep(currentContactList, function(value) { //remove specific entry from array
        return value != uid;
    });

    var listElement = event.target;

    $.ajax({url: url + "update/contactgroup",
        dataType: "jsonp",
        data: {ssid:currentSSID, cgid:cgid, contactlist:currentContactList},
        async: true,
        success: function (result) {
            if (isSessionValid(result.updatecontactgroup))
                if (result.updatecontactgroup.success) {
                    ajax.parseJSONP();
                }
                else {
                    alert("Kontakte konnte nicht gelöscht werden.");
                }
        },
        error: function (request, error) {
            alert('Kontakt konnte nicht erfolgreich gelöscht werden. Bitte versuchen Sie es später noch einmal.');
        }
    });

    var ajax = {
        parseJSONP:function(){
            $(listElement).closest("li").remove();
            /*TODO start update search results @see create event page*/
            if ($(".deleteManageContactsForReset").length == 0) {
                $("#manageContactgroupDetailsList").append("<li class='deleteManageContactsForReset centerText'>keine Kontakte vorhanden</li>");
            }
            $("#manageContactgroupDetailsList").listview('refresh');
        }
    }
}

/* TODO:auslagern
* helper method to show #page_manageContacts and load all members of the current contactgroup
* @paremeter contactgroup (last/current loaded contactgroup)
* */
function manageContactgroupContacts(contactGroup) {
    showManageContactsPage();
    loadContactsFromCG(contactGroup);
}

/* TODO: auslagern
* helper method to load all contacts from the current contactgroup and add them to currentContactList
* with this method we prevent loading the whole contactlist several times if the contactgroup stays the same
* */
function loadContactsFromCG(contactGroup) {
    $(".deleteManageContactsForReset").remove();
    currentContactList = [];
    if (contactGroup.users != null) {
        $.each(contactGroup.users, function (i, user) {
            $("#manageContactgroupDetailsList").append("<li class='deleteManageContactsForReset'>"+user.firstname+" "+user.lastname+"<div class='ui-li-aside'><a onclick='deleteContactFromCG("+contactGroup.cgid+", "+user.uid+")' href='#'><img class='delete' src='./images/delete.png'></a></div></li>");
            currentContactList.push(user.uid);
        });
    } else { // if contactgroup has no members
        $("#manageContactgroupDetailsList").append("<li class='deleteManageContactsForReset centerText'>keine Kontakte vorhanden</li>");
    }
    $("#manageContactgroupDetailsList").listview('refresh');
}


function showHomePage() {
    $(".footer_email").html(currentUser["email"]); //insert email adress to footer

    if (currentUser["uid"] == null) {
        alert("Username und/oder Passwort falsch. Bitte versuchen Sie es erneut.");
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
function showStudentHomePage() {
    console.log("showStudentPage");
    $.mobile.changePage("#page_home");
}
function showDozentHomePage() {
    console.log("showDozentPage");
    $.mobile.changePage("#page_homeDozent");
}
function showEventAttendees() {
    console.log("showEventAttendees");
    $.mobile.changePage("#page_attendees");
}
function showGroupPage() {
    console.log("showGroupPage");
    $.mobile.changePage("#page_groups");
}
function showGroupDetailPage() {
    console.log("showGroupDetailPage");
    $.mobile.changePage("#page_groupDetails");
}
function showLastGroupDetailPage() {
    console.log("showLastGroupDetailPage");
    getContactgroupDetails(currentCGID);
}
function showEvents() {
    console.log("showEvents");
    $.mobile.changePage("#page_controlAttendance");
}
function showCreateEvent() {
    console.log("showCreateEvent");
    $.mobile.changePage("#page_createEvent");
}
function showContactGroupDetailPage() {
    console.log("showContactGroupDetailPage");
    $.mobile.changePage("#page_contactgroupDetails");
}
function showLoginPage() {
    console.log("showLoginPage");
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
function showPositionPage(uid) {
    console.log("show position page of uid "+uid);
    $.mobile.changePage("#page_position");
    targetUID = uid;
}
function showFailurePage(errorMessage, retryAction) {
    $.mobile.changePage("#page_error");
    $("#failureMessage").html(errorMessage);
    $("#btnFailureRetry").off();
    $("#btnFailureRetry").on('click', function() {
        $.mobile.changePage(retryAction);
    });
}



/*function sortListByDate() {
    $("p").sort(function(a,b){
        return new Date($(a).attr("data-date")) > new Date($(b).attr("data-date"));
    }).each(function(){
            $("body").prepend(this);
        });
}*/

/*TODO just update attendance*/
function scanCode() {
    //TODO how to know what to do with the code
    /*
    * raum scan --> update status with sid, uid, rid (rid muss aus dem qr-code hervorgehen)
    * verification scan -->
    *
    * */
    //is it just a room or a event verification?!
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
            if (result.text != "")
                updateAttendance(result.text);
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}

/*TODO: send qr code to server and server will do the rest*/
function updateAttendance(qrcontent) {
    $.ajax({url: url + "update/attendance",
        dataType: "jsonp",
        data: {ssid:currentSSID, qrcontent:qrcontent},
        async: true,
        success: function (result) {
            if (isSessionValid(result.updateattendance)) {
                if (result.updateattendance.success) {
                    ajax.parseJSONP(result.updateattendance);
                }
                else {
                    alert(result.updateattendance.error);
                    if (result.updateattendance.error == "NotFound") {
                        alert("qrcode unbekannt");
                    }
                    else if (result.updateattendance.error == "NoAccess") {
                        alert("nutzer hat keine berechtigung sich für dieses event zu registrieren");
                    }
                }
                showHomePage();
            }
        },
        error: function (request, error) {
            showFailurePage("Es gab einen Fehler beim Übertragen des QR-Codes. Ihre Eventteilnahme konnte nicht verifiziert werden.", "#page_scanPosition");
        }
    });

    var ajax = {
        parseJSONP:function(scanResult){
            console.log(scanResult);
            if (scanResult.room != undefined) {
                alert("raum erfolgreich eingescannt");
            }
            else if(scanResult.event != undefined) {
                alert("event erfolgreich eingescannt");
            }

        }
    }
}

/*delete current contactgroup
* @parameter ssid, cgid
* @return success(1)
* */
function deleteContactgroup() {
    var _cgid = $("#cgd-cgid").html();
    $.ajax({url: url + "delete/contactgroup",
        dataType: "jsonp",
        data: {ssid:currentSSID, cgid:_cgid},
        async: true,
        success: function (result) {
            if (isSessionValid(result.deletecontactgroup)) {
                if (result.deletecontactgroup.success) {
                    var contactgroups = JSON.parse(sessionStorage.getItem("contactgroups"));
                    contactgroups = jQuery.grep(contactgroups, function(value) { //remove specific entry from array
                        return value.cgid != _cgid;
                    });
                    sessionStorage.setItem("contactgroups",JSON.stringify(contactgroups));
                    showGroupPage();
                }
            }
        },
        error: function (request, error) {
            alert("Kontaktgruppe konnte nicht gelöscht werden.");
        }
    });
}

/* delete current event
 * @parameter ssid, eid
 * @return success(1)
 * */
function deleteEvent() {
    var _eid = $("#ed-eid").html();
    $.ajax({url: url + "delete/event",
        dataType: "jsonp",
        data: {ssid:currentSSID, eid:_eid},
        async: true,
        success: function (result) {
            if (isSessionValid(result.deleteevent)) {
                if (result.deleteevent.success) {
                    showEvents();
                }
            }
        },
        error: function (request, error) {
            alert("Event konnte nicht gelöscht werden.");
        }
    });
}

/* TODO: auslagern
* helper method to reset input fields of createEvent formular
* */
function resetCreateEvent() {
    currentEventContactList = [];
    $("#ce-eid").html(""); //empty hidden field
    $(".deleteSearchEventContacts").remove();
    $(".deleteEventContacts").remove();
    $("#listEventContacts").append("<li class='centerText bold deleteEventContacts'>noch keine Kontakte hinzugefügt</li>");
    $("#listEventContacts").listview('refresh');
    $('#form_newEvent').data('validator').resetForm();
    $('#form_newEvent').each(function(){
        this.reset();
    });
    $("#btnCreateEvent").find(".ui-btn-text").html("Erstellen");
}

/* TODO: auslagern
 * helper method to reset input fields of createEvent formular
 * */
function resetCreateContactgroup() {
    currentContactList = [];
    $(".deleteSearchCGContacts").remove();
    $(".deleteCGContacts").remove();
    $("#listCGContacts").append("<li class='centerText bold deleteCGContacts'>noch keine Kontakte hinzugefügt</li>");
    $("#listCGContacts").listview('refresh');
    $('input').not('[type="button"]').val(''); // clear inputs except buttons, setting value to blank
}

/*
* defines what to do when the user hit the button create event
* */
function createNewEvent() {
    try {
        resetCreateEvent();
    }
    catch (error) {
        console.log(error);
    }
    showCreateEvent();
}

/* show page_createEvent with already filled information for update event
* @parameter ssid, eid
* @return attendees of event + event details
* */
function showUpdateEvent() {
    var _eid = $("#ed-eid").html();
    try {
        resetCreateEvent();
    }
    catch (error) {
        console.log(error);
    }
    showCreateEvent();
    $("#ce-eid").html(_eid);

    $.ajax({url: url + "get/event",
        dataType: "jsonp",
        data: {ssid:currentSSID, eid:_eid},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getevent)) {
                    ajax.parseJSONP(result.getevent);
            }
        },
        error: function (request, error) {
            alert("Eventdetails konnten nicht geladen werden.");
        }
    });

    $.ajax({url: url + "get/attendees",
        dataType: "jsonp",
        data: {ssid:currentSSID, eid:_eid},
        async: true,
        success: function (result) {
            if (isSessionValid(result.getattendees)) {
                $.each(result.getattendees, function (i, attendee) {
                   addContactToCreateEvent(i, attendee);
                });
            }
        },
        error: function (request, error) {
            alert("Eventdetails konnten nicht geladen werden.");
        }
    });

    var ajax = {
        parseJSONP:function(event){
            $("#newEventName").val(event.ename);
            $("#newEventDescription").val(event.edescription);
            var edate = event.edate;
            $("#newEventDate").val(moment(edate*1000).format("DD.MM.YYYY"));
            $("#newEventTime").val(moment(edate*1000).format("HH:mm"));
        }
    }
    $("#btnCreateEvent").find(".ui-btn-text").html("Speichern");
}

function getEventInformation() {
    var _event = new Object();
    var ename = $("#newEventName").val();

    if (ename.length < 3) {
        alert("Bitte geben Sie einen Eventnamen mit mindestens 3 Zeichen ein.");
        return null;
    }

    var edescription = $("#newEventDescription").val(); //can be empty
    var date = $("#newEventDate").val();

    if (date.length <= 0) {
        alert("Bitte geben Sie ein Datum ein.");
        return ull;
    }

    var time = $("#newEventTime").val();

    if (time.length <= 0) {
        alert("Bitte geben Sie eine Uhrzeit an.");
        return null;
    }

    var mdate = moment(date+time, "DD.MM.YYYY HH:mm"); //create moment from moment.js for specific time formatting
    var edate = "";
    if (mdate.isValid()) { //check if date and time are valid
        edate = mdate.unix();
    }
    else {
        alert("Bitte geben Sie gültige Werte für Termin und Uhrzeit ein.");
        return null;
    }
    _event.ename = ename;
    _event.edescription = edescription;
    _event.edate = edate;
    return _event;

}

/* update current event
* @parameter: ssid, eid, edescription, ename, edate, attendeelist
* @return: success (1)
* */
function updateEvent(eid) {
    var _event = new Object();
    _event = getEventInformation();
    if (_event != null) {
        $.ajax({url: url + "update/event",
            dataType: "jsonp",
            data: {ssid:currentSSID, eid:eid, ename:_event.ename, edate:_event.edate, edescription:_event.edescription, attendeelist: currentEventContactList}, //for currentEventContactList see @addContactToCreateEvent
            async: true,
            success: function (result) {
                if (isSessionValid(result.updateevent)) {
                    if (result.updateevent.success) {
                        getEventDetails(eid);
                    }
                }
            },
            error: function (request, error) {
                alert("Eventdetails konnten nicht geladen werden.");
            }
        });
    }
}

/*
* decide what action on page has to be done by continue on page_createEvent
* */
function continueFromCreateEvent() {
    var _eid = $("#ce-eid").html();
    if (_eid != "") {
       updateEvent(_eid);
    }
    else {
        _createEvent();
    }
}

/*
* dices what action on page has to be done by hitting back
* */
function backFromCreateEvent() {
    if ($("#ce-eid").html() != "") {
        showEventDetailPage();
    }
    else {
        showEvents();
    }
}


/*
 * load details of a specific public group and show them on #page_groupDetails
 * @parameter ssid, gid
 * @return group: gid, gname, array of users: uid, firstname, lastname
 *
 * */
function searchPosition(isStudentInFH) {
    $.ajax({url: url + "search/position",
        dataType: "jsonp",
        data: {ssid:currentSSID, uid:targetUID, infh:isStudentInFH},
        async: true,
        success: function (result) {
            if (isSessionValid(result.searchposition)) {
                ajax.parseJSONP(result.searchposition);
            }
        },
        error: function (request, error) {
            alert('Verbindungsfehler.');
        }
    });

    var ajax = {
        parseJSONP:function(position){
            if (position.error == "BadDatabase") {
                $("#map_container").hide();
                $("#detailedDescription").html('<b style="color:red;">Position konnte nicht ermittelt werden.</b><br>Aufgrund fehlender GPS-Informationen konnte die Person nicht lokalisiert werden. ' +
                    'Eventuell können ihre GPS-Koordinaten nicht ermittelt werden oder der Standort ihrer gesuchten Person ist derzeit unbekannt.');
            }
            else {
                $("#map_container").show();
                updateCurrentLocation(position.sender.geolat,position.sender.geolng);
                setDestinationAndDrawMap(position.target.geolat,position.target.geolng);
                if (isStudentInFH) {
                    $("#detailedDescription").html('<h3>Position von '+position.target.firstname+'</h3>'+position.geopath);
                }
                else {
                    $("#detailedDescription").html('<h3>Position von '+position.target.firstname+'</h3>');
                    $("#results").append("<br>"+position.geopath);
                }

            }
        }
    }
}