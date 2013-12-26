var url = "http://fhbapp.rumbledore.de/";
var currentUser = [];
var currentContactList = [];
var currentCGID = null;

$.mobile.loader.prototype.options.textVisible = true;
$.mobile.loader.prototype.options.theme = "a";
$.mobile.loader.prototype.options.theme = "a";

/*TODO: was machen wir mit der sessionid?*/
/*TODO: Möglichkeit zum abmelden*/
/*TODO: LoginFailurePage mit automatischem redirect oder so*/
/*TODO: für ajax Handler noch loader einfügen*/
/*TODO: groups and cgs andersrum sortieren bitte*/


function addContactToCG(contact) {
    if (jQuery.inArray(contact.uid, currentContactList) >= 0) {
        console.log("already in array")
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
                if ($(".deleteManageContactsForReset").text() == "keine Kontakte vorhanden")
                    $(".deleteManageContactsForReset").remove();
                $("#manageContactgroupDetailsList").append("<li class='deleteManageContactsForReset'>"+contact.firstname+" "+contact.lastname+"<div class='ui-li-aside'><a onclick='deleteContactFromCG("+currentCGID+", "+contact.uid+")' href='#'><img class='delete' src='./images/delete.png'></a></div></li>");
                $("#manageContactgroupDetailsList").listview('refresh');
            },
            error: function (request,error) {
                alert('Network error has occurred please try again!');
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
            alert('Network error has occurred please try again!');
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

function test() {
    $("li.hide").removeClass("hide");
    $("#btnAddContactsToGroup").addClass("hide");
    $("#manageContactgroupDetailsList").listview('refresh');
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
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(events){
            $(".deleteEventsForReset").remove();

            $.each(events, function(i, event) {
                //var d = new Date(event.ecreationdate);
               // alert(event.edate);
                var d = new Date(event.edate);
                var hours = d.getHours();
                var minutes = d.getMinutes();
                var day = d.getDate();
                var month = d.getMonth()+1;
                var year = d.getFullYear();
                $("#eventList").append("<li class='deleteEventsForReset'><a onclick=\"getEventDetails("+event.eid+")\" href=\"#\"><h3>"+event.ename+"</h3><p>Erstellt am <span>"+day+"."+month+"."+year+"</p></li>");
            });
            $('#eventList').listview('refresh');
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
            alert('Network error has occurred please try again!');
        }
    });

    //abhängig der eingetragenen informationen (fachbereich/semester können null sein) wird die darstellung verändert
    function insertEventListDetails(event) {
        //alert(event.ecreationdate);
        var d = new Date(event.ecreationdate);
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var day = d.getDate();
        var month = d.getMonth()+1;
        var year = d.getFullYear();
        $("#eventInsertAfter").after("<li class='deleteEventDetailsForReset'><h3>Erstellt am</h3><p>"+day+"."+month+"</p></li>");
        $("#eventInsertAfter").after("<li class='deleteEventDetailsForReset'><h3>Zeitpunkt</h3><p>"+hours+":"+minutes+"</p></li>");
    }

    var ajax = {
        parseJSONP: function (event) {
           /* $('#btnManageContactgroupContacts').on('click', function() {
                manageContactgroupContacts(kgid);
            });*/
            $(".deleteEventDetailsForReset").remove();
            $(".eventDetailName").html(event.ename);
            insertEventListDetails(event);
            $("#eventDetailsList").listview('refresh');
            /*TODO:show QR-Code and load pageAttendees*/
        }
    }
}

function getContacts() {
    $.ajax({url: url+"get/contacts",
        dataType: "jsonp",
        async: true,
        success: function (result) {
            $.mobile.showPageLoadingMsg();
            ajax.parseJSONP(result.getcontacts);
            $.mobile.hidePageLoadingMsg(); /*TODO: kA ob das so überhaupt was bringt oder funktioniert..beforeSend hat bisher nich funktioniert*/
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
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
    console.log(url+"get/contact?uid="+userID);
    $.ajax({url: url + "get/contact",
        dataType: "jsonp",
        data: {uid: userID},
        async: true,
        success: function (result) {
            showUserDetailPage();
            ajax.parseJSONP(result.getcontact);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(contact){

            $("#btnLocateContact").on('click', function(){
                openPositionPage(contact.firstname); /*TODO:change to uid*/
            });

            $(".profile_name").html(contact.firstname + " " + contact.lastname);
            $(".profile_email").html(contact.email);
            $(".profile_status").html(contact.sdescription); /*TODO:when status is null */
            $(".profile_wohnort").html(contact.city);

            $(".profile_gruppen").empty();
            $.each( contact.groups, function(i, group) {
                /*TODO:wenn gruppen leer sind füge "in keiner gruppe" <-- geht eigentlich nicht, da jeder in globalen gruppen sein sollte --> jeder in mindestens einer gloabalen Gruppe*/
                $(".profile_gruppen").append(group+"<br>");
            });
        }
    }
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
            alert('Network error has occurred please try again!');
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
            alert('Network error has occurred please try again!');
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
            alert('Network error has occurred please try again!');
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
    }

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
            alert('Network error has occurred please try again!');
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
            $('#btnManageContactgroupContacts').off(); //prevent multiple events of the same type
            $('#btnManageContactgroupContacts').on('click', function() {
                manageContactgroupContacts(contactGroup);
            });

            $(".deleteCGDetailsForReset").remove();
            $(".contactgroupDetailName").html(contactGroup.cgname);
            insertContactGroupListDetails(contactGroup);
            /* TODO: insert creation date somewhere*/
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
            alert('Network error has occurred please try again!');
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
        //showErrorPage_for_login()
        console.log("show error page for login"); //maybe redirect to login page
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
    console.log("showGroupDetailPage")
    $.mobile.changePage("#page_groupDetails");
}

function showLastGroupDetailPage() {
    console.log("showLastGroupDetailPage");
    getContactGroupDetails(currentCGID);
}

function showContactGroupDetailPage() {
    console.log("showContactGroupDetailPage")
    $.mobile.changePage("#page_contactgroupDetails");
}
function showUserDetailPage() {
    console.log("showUserDetailPage")
    $.mobile.changePage("#page_profile");
}
function showEventDetailPage() {
    console.log("showEventDetailPage")
    $.mobile.changePage("#page_eventDetails");
}
function showManageContactsPage() {
    console.log("showManageContactsPage")
    $.mobile.changePage("#page_manageContacts");
}

function insertEmailToFooter() {
    $(".footer_email").html(currentUser["email"]);
}

function createContactGroup() {
    /*TODO: security issue - falsche eingaben abfangen?!*/
    var cgname = $("#newGroupName").val();
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
            showGroupPage();
        },
        error: function (request, error) {
            alert('Network error has occurred please try again!');
        }
    });
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
    alert("scan qr code");
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
        },
        function (error) {
            alert("Scanning failed: " + error);
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

function openPositionPage(name) {
    $("#showParmHere3").html(name);
}
function openEventProfilePage(name) {
    $("#showEventName").html(name);
}