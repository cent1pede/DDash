var resp;
var group = "\'SD FIRST\'";
var thismonday = getUnixMonday(new Date);
var restring = 'requeststr= SELECT [Owner],[Assignee],[Incident_Number],[Assigned_group],[Status],[Description],[Status_reason] FROM [hqitsm-db-arsys].[ARSystem].[dbo].[HPD_Help_Desk] WHERE ([Assigned_Group] = ' + group + ' AND ([Status]<4 AND ([Status_reason] NOT IN (11000,7000,93000) OR [Status_reason] IS NULL))) OR (([Status] IN (4,5) AND [Last_Resolved_Date]> ' + thismonday + ') AND [Assigned_Group] = ' + group + ' )';

var assignees = [];

function getUnixMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1), // adjust when day is sunday
        t = new Date(d.setDate(diff));
    t.setHours(0, 0, 0, 0);

    return t / 1000;
}

function formSpecialistsArray(resposeObject) {

    for (i in resposeObject) {
        if ($.inArray(resposeObject[i].Assignee, assignees) == -1) {
            assignees.push(resposeObject[i].Assignee);
        }
    }
    assignees.sort();
}

function formTickets(specArray, resposeObject) {

    var resolvedTickets;
    var ownedTickets;

    for (i in specArray) {
        resolvedTickets = 0;
        ownedTickets = 0;
        for (j in resposeObject) {
            if (specArray[i] == resposeObject[j].Assignee && (resposeObject[j].Status == 4 || resposeObject[j].Status == 5)) {
                resolvedTickets++;
            } else if (specArray[i] == resposeObject[j].Owner && (resposeObject[j].Status==1 || resposeObject[j].Status==2)) ownedTickets++;


        }

        var li = $('<li>').appendTo('#tickets').text(specArray[i] + '- Resolved: ' + resolvedTickets + ' - Owned now: ' + ownedTickets);

        // $('#tickets').append(<li>)

    }

}

/*
function formAssignedTickets(specArray, resposeObject) {


    for (i in specArray) {
        resolvedTickets = 0;
        for (j in resposeObject) {
            if (specArray[i] == resposeObject[j].Assignee) resolvedTickets++;
        }

        var li = $('<li>').appendTo('#tickets').text(specArray[i] + ' ' + resolvedTickets)

        // $('#tickets').append(<li>)

    }


}
*/


/*                            var li = $('<li/>')
   .addClass('bombs-hand')
   .appendTo('#player3-hand')
   .text(decks_object[i][j]);*/

function getAllBacklog() {




    //обрати внимание, что запрос должен выглядеть именно так requeststr= иначе работать не будет
    /*  var restring = 'requeststr= SELECT [Assignee],[Incident_Number],[Assigned_group],[Status],[Description],[Status_reason] FROM [hqitsm-db-arsys].[ARSystem].[dbo].[HPD_Help_Desk] WHERE [Assigned_Group] = ' + group + ' AND ([Status]<4 AND ([Status_reason] NOT IN (11000,7000,93000) OR [Status_reason] IS NULL))';*/







    var myconnection = $.ajax({
        mimeType: 'multipart/form-data',
        data: restring,
        method: 'POST',
        async: true,
        url: 'https://dutydashboard.avp.ru/ITSM_Reports_API/Home/Request',
        processData: false,
        success: function (response) {
            resp = JSON.parse(response);
            formSpecialistsArray(resp);
            formTickets(assignees, resp);


        }
    });







}

$(document).ready(function () {





});
