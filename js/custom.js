var url = "http://fhbapp.rumbledore.de/";
var currentUser = [];

/* ajax calls to get data from db in jsonp format */

function getContacts() {
    $.ajax({url: url+"users/",
        dataType: "jsonp",
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
            $("#userList").empty();
            $.each( result.users, function(i, user) {
                 $("#userList").append("<li><a onclick=\"getUserDetails("+user.uid+")\" href=\"#\">"+user.vorname +" "+user.nachname+"</a></li>"); /* TODO: sort userList by vorname through database */
                    console.log(user);
            });
            $('#userList').listview('refresh');
        }
    }
}
function getUserDetails(userID) {
    console.log(url+"user/?uid="+userID);
    $.ajax({url: url + "user/?uid="+userID,
        dataType: "jsonp",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result);
            showProfilePage();
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(result){

            $(".profile_name").html(result.vorname + " " + result.nachname);
            $(".profile_email").html(result.email);
            $(".profile_status").html(result.status);
            $(".profile_wohnort").html(result.wohnort);

            $(".profile_gruppen").empty();
            $.each( result.gruppen, function(i, gruppe) {

                $(".profile_gruppen").append(gruppe+"<br>");
            });
        }
    }
}
function checkLogin(loginName) {
    $.ajax({url: url + "login/?loginname="+loginName,
        dataType: "jsonp",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result);
            showHomePage();
        },
        error: function (request,error) {
            alert('Network error has occurred please try again!');
        }
    });

    var ajax = {
        parseJSONP:function(result){
            $.each( result, function(property, value) {
                currentUser[property] = value;
                console.log(property + ": "+currentUser[property]);
            });
        }
    }
}


function showHomePage() {
    insertEmailToFooter();
    if (currentUser["uid"] == null) {
        //showErrorPage_for_login()
        console.log("show error page for login"); //maybe redirect to login page
    }
    else {
        if (currentUser["dozent"] == 0) {
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
function showProfilePage() {
    console.log("showProfilePage")
    $.mobile.changePage("#page_profile");
}

function insertEmailToFooter() {
    $(".footer_email").html(currentUser["email"]);
}






/*load contacts via jsonp*/
$(document).on('pagebeforeshow', '#page_contacts', function(e, data){
    getContacts();
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