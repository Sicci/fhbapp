/*only load contacts a single time via jsonp*/
$(document).on('pageinit', '#page_createGroup', function(e, data){
    loadContacts();
});


$(document).on( 'pageinit',function(event){
    $("#searchContactsToAdd").keyup(function() {
        var str = $("#searchContactsToAdd").val()
        console.log("keydown: "+ str);
        if (str.length >= 2)
        //$("#searchContactsToAdd").css("background-color", "yellow");
            searchContact(str);
        else $(".deleteSearchContactsToAdd").remove();
    });

    $("#searchContactsForNavigation").keyup(function() {
        var str = $("#searchContactsForNavigation").val()
        console.log("keydown: "+ str);
        if (str.length >= 2)
        //$("#searchContactsToAdd").css("background-color", "yellow");
            searchContactForNavigation(str);
        else {
            $(".deleteNavigationContacts").remove();
            $("#listNavigation").append("<li class='deleteNavigationContacts centerText'>mindestens zwei Buchstaben zum Suchen eingeben</li>");
            $("#listNavigation").listview('refresh');
        }
    });
});

/**/
$(document).on('pagebeforeshow', '#page_createGroup', function(e, data){
    console.log("clear form");
    $('input').not('[type="button"]').val(''); // clear inputs except buttons, setting value to blank
    $("input[type='checkbox']").removeAttr('checked');
    $("input[type='checkbox']").attr("class","deleteCreateContactsForReset").checkboxradio("refresh");
    if ($("#sliderSemester").val() == 'off') { //if switch is off
        $("#sliderSemester").slider('disable');
        $("#sliderSemester").slider('refresh');
        $("#sliderSemester").textinput('disable');
    }
});
/*load groups and contactGroups via jsonp*/
$(document).on('pagebeforeshow', '#page_groups', function(e, data){
    $(".deleteGroupsForReset").remove();
    getGroups();
    getContactGroups();
});

$(document).on('pagebeforeshow', '#page_navigation', function(e, data){
    $(".deleteNavigationContacts").remove(); //clear search results
    $("#searchContactsForNavigation").val(""); //clear search input
    $("#listNavigation").append("<li class='deleteNavigationContacts centerText'>keine Kontakte geladen</li>");
    $(".ui-input-clear").addClass("ui-input-clear-hidden");
    $("#listNavigation").listview('refresh');
});

$(document).on('pagebeforeshow', '#page_manageContacts', function(e, data){
    $(".deleteSearchContactsToAdd").remove(); //clear search results
    $("#searchContactsToAdd").val(""); //clear search input
    $(".ui-input-clear").addClass("ui-input-clear-hidden");
});


$(document).on('pagebeforeshow', '#page_contactgroupDetails', function(e, data){
    /*TODO:bei changes der cg muss sie neu geladen werden*/
    //if manage contact group contacts has changed some contacts (e.g. delete user a or add user b)
    //load cg again (how to determine which cg has to be loaded?)
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

        /* TODO//check if necessary
         submitHandler: function(form) {
         //resetForm is a method on the validation object, not the form
         v.resetForm();
         form.reset();

         }*/
    });

});

/* TODO: whenever a msg was send to chat do:
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
    /*TODO: load contactgroups for selectmenu*/
    $('#newEventGroup').val('Gruppe auswählen').selectmenu('refresh');
});