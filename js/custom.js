var url = "http://fhbapp.rumbledore.de/";
var currentUser = [];

function test() {
    $.ajax({url: "http://fhbapp.no-ip.biz/",
        dataType: "json",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(result){
            console.log(result.message);
    }
}
}

/* ajax calls to get data from db in jsonp format */

/* TODO: sobald die DB angeschlossen wird müssen die requests parameter kleingeschrieben werden*/

function getEvents() {
    $.ajax({url: url+"get/events",
        dataType: "jsonp",
        data: {uid: currentUser.uid},
        async: true,
        success: function (result) {
            ajax.parseJSONP(result);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(result){
            $(".deleteForReset").remove();

            $.each(result.events, function(i, event) {
                //var d = new Date(event.ecreationdate);
               // alert(event.edate);
                var d = new Date(event.edate);
                var hours = d.getHours();
                var minutes = d.getMinutes();
                var day = d.getDate();
                var month = d.getMonth()+1;
                var year = d.getFullYear();
                $("#eventList").append("<li class='deleteForReset'><a onclick=\"getEventDetails("+event.eid+")\" href=\"#\"><h3>"+event.ename+"</h3><p>Erstellt am <span>"+day+"."+month+"."+year+"</p></li>");
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
            ajax.parseJSONP(eid, result.event);
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
        $("#eventInsertAfter").after("<li class='deleteForReset'><h3>Erstellt am</h3><p>"+day+"."+month+"</p></li>");
        $("#eventInsertAfter").after("<li class='deleteForReset'><h3>Zeitpunkt</h3><p>"+hours+":"+minutes+"</p></li>");
    }

    var ajax = {
        parseJSONP: function (kgid, event) { /*TODO:wofür wird kgid benötigt?*/
           /* $('#btnManageContactgroupContacts').on('click', function() {
                manageContactgroupContacts(kgid);
            });*/
            $(".deleteForReset").remove();
            $(".eventDetailName").html(event.ename);
            insertEventListDetails(event);
            $("#eventDetailsList").listview('refresh');
        }
    }
}

function getContacts() {
    $.ajax({url: url+"get/contacts",
        dataType: "jsonp",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result.contacts);
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
            ajax.parseJSONP(result.contact);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(contact){

            $(".profile_name").html(contact.firstname + " " + contact.lastname);
            $(".profile_email").html(contact.email);
            $(".profile_status").html(contact.sdescription); /*TODO:when status is null */
            $(".profile_wohnort").html(contact.city);

            $(".profile_gruppen").empty();
            $.each( contact.groups, function(i, group) {
                /*TODO:auch cg sollten geladen werden */
                /*TODO:wenn gruppen leer sind füge "in keiner gruppe" <-- geht eigentlich nicht, da jeder in globalen gruppen sein sollte*/
                $(".profile_gruppen").append(group+"<br>");
            });
        }
    }
}

function checkLogin(loginName,password) {
    $.ajax({url: url + "do/login",
        dataType: "jsonp",
        data: {uname:loginName, upassword:password},
        async: true,
        success: function (result) {
            console.log("success")
            ajax.parseJSONP(result.login);
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
            ajax.parseJSONP(result.groups);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(groups){

            $.each( groups, function(i, group) {
                $(".groupDivider").after("<li class='deleteForReset'><a onclick=\"getGroupDetails("+group.gid+")\" href=\"#\"><h3>"+group.gname+"</h3></a></li>");
                console.log(group);
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
            ajax.parseJSONP(result.group);
        },
        error: function (request, error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP: function (group) {
            $(".deleteForReset").remove();
            $(".groupDetailName").html(group.gname);
            $.each(group.users, function (i, user) {
                $("#groupDetailsListContacts").append("<li class='deleteForReset'><a onclick='getContactDetails(" + user.uid + ")' href='#'><img src='./images/userProfile.gif'/>" + user.firstname + " "+ user.lastname + "</a></li>");
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
            ajax.parseJSONP(result.contactgroups);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(contactgroups){
            $.each( contactgroups, function(i, contactGroup) {
                $(".privateGroupDivider").after("<li class='deleteForReset'><a onclick=\"getContactGroupDetails("+contactGroup.cgid+")\" href=\"#\"><h3>"+contactGroup.cgname+"</h3><p id='groupListDetails"+i+"'></p></a></li>");
                insertGroupListDetails(contactGroup,i);
                console.log(contactGroup);
            });
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

function getContactGroupDetails(kgid) {
    $.ajax({url: url + "contactgroup/?kgid="+kgid,
        dataType: "jsonp",
        async: true,
        success: function (result) {
            showContactGroupDetailPage();
            ajax.parseJSONP(kgid, result.contactgroup);

        },
        error: function (request, error) {
            alert('Network error has occurred please try again!');
        }
    });

    /*abhängig der eingetragenen informationen (fachbereich/semester können null sein) wird die darstellung verändert*/
    function insertContactGroupListDetails(contactGroup) {
        if (contactGroup.fachbereich != null && contactGroup.semester != null) {
            $("#contactgroupDetailsList").append("<li class='deleteForReset'><h3>"+contactGroup.fachbereich+"<span class='right'>"+contactGroup.semester+". Semester</span></h3><p>Fachbereich</p></li>");
        }
        else if (contactGroup.fachbereich != null) { /* TODO: check if null is correct */
            $("#contactgroupDetailsList").append("<li class='deleteForReset'><h3>"+contactGroup.fachbereich+"</h3><p class=''>Fachbereich</p></li>");
        } else if (contactGroup.semester != null) {
            $("#contactgroupDetailsList").append("<li class='deleteForReset'><h3>"+contactGroup.semester+".tes Semester</h3><p class=''>Studienhalbjahr</p></li>");
        }
    }

    var ajax = {
        parseJSONP: function (kgid, contactGroup) {
            $('#btnManageContactgroupContacts').on('click', function() {
                manageContactgroupContacts(kgid, contactGroup);
            });

            $(".deleteForReset").remove();
            $(".contactgroupDetailName").html(contactGroup.kontaktgruppenname);
            insertContactGroupListDetails(contactGroup);
            /* TODO: insert creation date somewhere*/
            $.each(contactGroup.users, function (i, user) {
                $("#contactgroupDetailsListContacts").append("<li class='deleteForReset'><a onclick='getContactDetails(" + user.uid + ")' href='#'><img src='./images/userProfile.gif'/>" + user.vorname + " " + user.nachname + "</a></li>");
            });

            if (contactGroup.users.length < 2) { /* TODO: change number */
                if (contactGroup.users.length == 0) {
                    $("#contactgroupDetailsListContacts").append("<li style='text-align: center' class='deleteForReset'>keine Kontakte vorhanden</li>");
                }
                $( ".collapsibleContacts" ).trigger( "expand" );

            }
            else {
                $( ".collapsibleContacts" ).trigger( "collapse" );
            }

            $("#contactgroupDetailsList").listview('refresh');
            $("#contactgroupDetailsListContacts").listview('refresh');
        }
    }
}

function deleteContactFromCG(kgid, uid) {
    console.log("delete user with uid "+uid+" von kgid "+kgid);
}

function loadContactsFromCG(kgid, contactGroup) {
    $(".deleteForReset").remove();
    $.each(contactGroup.users, function (i, user) {
        console.log(kgid + user.vorname);
        //<a onclick='getContactDetails(" + user.uid + ")' href='#'><img src='./images/userProfile.gif'/>" + user.vorname + " " + user.nachname + "</a>
        $("#manageContactgroupDetailsList").append("<li class='deleteForReset'>"+user.vorname+" "+user.nachname+"<div class='ui-li-aside'><a onclick='deleteContactFromCG("+kgid+", "+user.uid+")' href='#'><img class='delete' src='./images/delete.png'></a></div></li>");
        $("#manageContactgroupDetailsList").listview('refresh');

    });
}

function manageContactgroupContacts(kgid, contactGroup) {
    console.log("addContactsToGroup: "+kgid);
    showManageContactsPage();
    loadContactsFromCG(kgid, contactGroup);
}

function showHomePage() {
    insertEmailToFooter();
    if (currentUser["uid"] == null) {
        //showErrorPage_for_login()
        console.log("show error page for login"); //maybe redirect to login page
    }
    else {
        if (currentUser["isdozent"] == 0) {
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
function showGroupDetailPage() {
    console.log("showGroupDetailPage")
    $.mobile.changePage("#page_groupDetails");
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


/*load groups and contactGroups via jsonp*/
$(document).on('pagebeforeshow', '#page_groups', function(e, data){
    $(".deleteForReset").remove();
    getGroups();
    getContactGroups();
});



/*load contacts via jsonp*/
$(document).on('pagebeforeshow', '#page_contacts', function(e, data){
    getContacts();
});
/*load events via jsonp*/
$(document).on('pagebeforeshow', '#page_controlAttendance', function(e, data){
    getEvents();
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

$(document).on('pageinit', function(){ // <-- you must use this to ensure the DOM is ready
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

        /* //check if necessary
         submitHandler: function(form) {
         //resetForm is a method on the validation object, not the form
         v.resetForm();
         form.reset();

         }*/
    });

});

/* whenever a msg was send to chat do:
 document.getElementById('shoutContainer').scrollTop = 10000;
 */

$(document).delegate('.ui-page', 'pageshow', function () {
    var objDiv = document.getElementById("incomingMessages");
    objDiv.scrollTop = objDiv.scrollHeight;
});

$(document).delegate('#page_createEvent', 'pageshow', function () {
    $('#form_newEvent').data('validator').resetForm();
    $('#form_newEvent').each(function(){
        this.reset();
    });
    $('#newEventGroup').val('Gruppe auswählen').selectmenu('refresh');
});

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
}

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