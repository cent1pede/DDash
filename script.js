var resp;
var boba;
var seriesArr = [];
var seriesArr2 = [];
var group = "\'SD FIRST\'";
var thismonday = getUnixMonday(new Date);
var restring = 'requeststr= SELECT [Owner],[Assignee],[Incident_Number],[Assigned_group],[Status],[Description],[Status_reason] FROM [hqitsm-db-arsys].[ARSystem].[dbo].[HPD_Help_Desk] WHERE ([Assigned_Group] = ' + group + ' AND ([Status]<4 AND ([Status_reason] NOT IN (11000,7000,93000) OR [Status_reason] IS NULL))) OR (([Status] IN (4,5) AND [Last_Resolved_Date]> ' + thismonday + ') AND [Assigned_Group] = ' + group + ' )';

var assignees = [];

function getUnixMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1),
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
    assignees.reverse();
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
            } else if ((specArray[i] == resposeObject[j].Owner && (resposeObject[j].Status == 1 || resposeObject[j].Status == 2)) || (specArray[i] == resposeObject[j].Assignee && (resposeObject[j].Status == 1 || resposeObject[j].Status == 2))) ownedTickets++;


        }
        //.css('width'=resolvedTickets;'height'='20')
        /*var g = $('<g>').addClass('bar').appendTo('#ticketchart');
        var rect = $('<rect>').appendTo(g);
        var text = $('<text>').text(specArray[i]).appendTo(g);
          */



        var li = $('<li>').appendTo('#tickets').text(specArray[i] + ' - Resolved: ' + resolvedTickets + ' - Assigned now: ' + ownedTickets);

        // $('#tickets').append(<li>)
        var temp = {
            name: specArray[i],
            //          value: resolvedTickets
            value: (Math.floor(Math.random() * 130) + 4)
        };

        var temp2 = {
            name: specArray[i],
            value: (Math.floor(Math.random() * 25) + 1)
        };

        seriesArr.push(temp);
        seriesArr2.push(temp2);


    }

    var specForChart = [];
    var seriesForChart = [[]];
    for (i in seriesArr) {
        specForChart.push(seriesArr[i].name);
        seriesForChart[0].push(seriesArr[i].resolved);

    }



    var graphdef = {
        categories: ['Assigned', 'Resloved'],
        dataset: {
            'Assigned': seriesArr2,
            'Resloved': seriesArr
        },


    }

    var config = {
        dimension: {
            width: 600,
            height: 400
        },
        margin: {
            left: 150
        },
        meta: {
            caption: 'ДАННЫЕ ПОКА ЧТО ГЕНЕРЯТСЯ РАНДОМНО',
        },
        caption:{
            fontfamily: '"Tahoma"'
        }
    }

    var chart = uv.chart('StackedBar', graphdef, config);
    //
    //
    //chartist experiment
    //
    /*var data = {
        labels: specForChart,
        series: [
            [40, 80, 15, 50, 0, 12, 120, 221, 93, 100, 45, 60, 52, 8, 42, 140],
            [22, 17, 24, 14, 21, 16, 9, 25, 7, 27, 4, 26, 18, 19, 12, 15]
        ]
        //   series: seriesForChart

    }

    var options = {
        horizontalBars: true,
        height: '600px',
        width: '1000px',
        axisX: {
            onlyInteger: true,

        },
        axisY: {
            //position: 'end',   
            labelOffset: {
                x: 5,
                y: 0
            },
            labelInterpolationFnc: Chartist.noop,
            showGrid: false
        },
        chartPadding: {
            top: 15,
            right: 15,
            bottom: 5,
            left: 40
        },
        stackBars: true,
        stackMode: 'overlap'


    }


    var chart = new Chartist.Bar('.ct-chart', data, options);
    
    
    //
    //
    //chartist experiment
    //

*/





    console.log(seriesArr);




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

    getAllBacklog();
    /*
    var graphdef = {
    	categories : ['uvCharts', 'Matisse', 'SocialByWay'],
    	dataset : {
    		'uvCharts' : [
    			{ name : '2008', value: 15},
    			{ name : '2009', value: 28},
    			{ name : '2010', value: 42},
    			{ name : '2011', value: 88},
    			{ name : '2012', value: 100},
    			{ name : '2013', value: 143}
    		],
    		'Matisse' : [
    			{ name : '2008', value: 15},
    			{ name : '2009', value: 28},
    			{ name : '2010', value: 42},
    			{ name : '2011', value: 88},
    			{ name : '2012', value: 100},
    			{ name : '2013', value: 143}
    		],	
    		'SocialByWay' : [
    			{ name : '2008', value: 15},
    			{ name : '2009', value: 28},
    			{ name : '2010', value: 42},
    			{ name : '2011', value: 88},
    			{ name : '2012', value: 100},
    			{ name : '2013', value: 143}
    		]
    	}
    }

    var chart = uv.chart('StackedBar', graphdef);



    */

    // Create a simple bar chart
    /*var data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      series: [
        [5, 2, 4, 2, 0]
      ]
    };

    // In the global name space Chartist we call the Bar function to initialize a bar chart. As a first parameter we pass in a selector where we would like to get our chart created and as a second parameter we pass our data object.
    new Chartist.Bar('.ct-chart', data);*/
});
