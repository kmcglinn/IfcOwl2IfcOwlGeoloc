/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//var zone_id_handsontable = "";
var user_id_handsontable_data = [
            ["001"],
            ["01"]/*,
            [""],
            ["11"],
            ["2012"]*/
        ];
        
var work_place_handsontable_data;

$(function () {
   
    
   
    function loadExamples() {

        ///var date = ""; //set to empty for now

        /**
         * Identification
         */

        var $containerID = $("#id_roomNo");
        $containerID.handsontable({
        startRows: 3,
        startCols: 1,
        manualColumnResize: true,
        rowHeaders: ["User I.D.", "Room Number", "Zone ID" /*"Month", "Year"*/],
         autoComplete: [
            {
            match: function (row, col, data) {
                    return (row == 1); //if it is second row
              },
                    source: function () {
                    return ["01", "02", "03","04", "05", "06", "08", "09", "10"]
              },
              strict: false //only accept predefined values (from array above)
            }
                          ],
          contextMenu: true,
        });


        $containerID.handsontable("loadData", user_id_handsontable_data);
        var handsontableID = $containerID.data('handsontable');

     //Meetings - Load & Save

        var $containerMeetings = $("#meetings");

        $containerMeetings.handsontable({
            startRows: 3,
            startCols: 13,
            rowHeaders: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            colHeaders: ["Start Time", "End Time", "Location", "Path To", "Return Path",
            "Lighting","Heating",
            "Air Conditioning",  "Windows",
            "Blinds", "Door", "Projector Used", "Laptop Plugged In"],
            autoComplete: [
                {
                match: function (row, col, data) {
                        return (col == 0); //if it is first column
                  },
                        source: function () {
                        return ["7:00", "8:00", "9:00", "10:00","11:00", "12:00", "13:00", "xx:xx"]
                  },
                  highlighter: function (item) {
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                      return '<strong>' + match + '</strong>';
                    });
                    return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                  },
                  strict: false  //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 1); //if it is first column
                  },
                        source: function () {
                        return ["8:00", "9:00", "10:00","11:00", "12:00", "13:00", "14:00", "xx:xx"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 2); //if it is first column
                  },
                        source: function () {
                        return ["P1", "R04"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 3); //if it is first column
                  },
                        source: function () {
                        return ["P3", "P4", "P3-P2", "P4-P2"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 4); //if it is first column
                  },
                        source: function () {
                        return ["P3", "P4", "P2-P3", "P2-P4", "P1-P2-P3", "P1-P2-P4"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                  match: function (row, col, data) {
                    return (col == 5); //if it is first column
                  },
                  source: function () {
                    return ["On", "Off"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                  match: function (row, col, data) {
                    return (col == 6); //if it is first column
                  },
                  source: function () {
                    return ["On", "Off"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                  match: function (row, col, data) {
                    return (col == 7); //if it is first column
                  },
                  source: function () {
                    return ["On", "Off"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                  match: function (row, col, data) {
                    return (col == 8); //if it is first column
                  },
                  source: function () {
                    return ["Open", "Closed"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                  match: function (row, col, data) {
                    return (col == 9); //if it is first column
                  },
                  source: function () {
                    return ["Raised", "Lowered"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                  match: function (row, col, data) {
                    return (col == 10); //if it is first column
                  },
                  source: function () {
                    return ["Open", "Closed"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                 { match: function (row, col, data) {
                    return (col == 11); //if it is first column
                  },
                  source: function () {
                    return ["Yes", "No"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                  {match: function (row, col, data) {
                    return (col == 12); //if it is first column
                  },
                  source: function () {
                    return ["Yes", "No"]
                  },
                  strict: false //only accept predefined values (from array above)
                }
              ],
        contextMenu: true,
    });


    var handsontableMeetingMon = $containerMeetings.data('handsontable');

    //var handsontableMeetingTues = $container.data('handsontable');
    //
    //var handsontableMeetingWeds = $container.data('handsontable');
    //
    //var handsontableMeetingThurs = $container.data('handsontable');
    //
    //var handsontableMeetingFri = $container.data('handsontable');
    //
    //var handsontableMeetingSat = $container.data('handsontable');
    //
    //var handsontableMeetingSun = $container.data('handsontable');

       //Daily Breaks - Load & Save

    var $containerM = $("#dailyBreaksMon");
        $containerM.handsontable({
            startRows: 7,
             autoComplete: [
            {
            match: function (row, col, data) {
                    return (col == 0); //if it is first column
              },
                    source: function () {
                    return ["Smoke", "Drink", "Printer" /*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*/]
              },
              highlighter: function (item) {
                var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                  return '<strong>' + match + '</strong>';
                });
                return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
              },
              strict: false  //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 1); //if it is first column
              },
                    source: function () {
                    return ["1", "2", "3","4", "5", "6", "7", "enter amount"]
              },
              strict: false //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 2); //if it is first column
              },
                    source: function () {
                    return ["5", "10", "15", "20", "25", "30", "enter amount"]
              },
              strict: false //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 3); //if it is first column
              },
                    source: function () {
                    return ["P6", "P5", "P1", "R07", "R13", "R36"]
              },
              strict: false //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 5); //if it is first column
              },
                    source: function () {
                    return ["No Path", "P3", "P4", "P2-P3", "P2-P4", "P1-P2-P3", "P1-P2-P4"]
              },
              strict: false //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 4); //if it is first column
              },
                    source: function () {
                    return ["No Path", "P3", "P4", "P3-P2", "P4-P2"]
              },
              strict: false //only accept predefined values (from array above)
            }
            ],   startCols: 6,
            colHeaders: ["Type", "Frequency", "Duration", "Destination", "Path", "Return Path"],
            autoComplete: [
            {
            match: function (row, col, data) {
                    return (col == 0); //if it is first column
              },
                    source: function () {
                    return ["Smoke", "Drink", "Printer" /*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*/]
              },
              highlighter: function (item) {
                var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                  return '<strong>' + match + '</strong>';
                });
                return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
              },
              strict: false  //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 1); //if it is first column
              },
                    source: function () {
                    return ["1", "2", "3","4", "5", "6", "7", "enter amount"]
              },
              strict: false //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 2); //if it is first column
              },
                    source: function () {
                    return ["5", "10", "15", "20", "25", "30", "enter amount"]
              },
              strict: false //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 3); //if it is first column
              },
                    source: function () {
                    return ["P6", "P5", "P1", "R07", "R13", "R36"]
              },
              strict: false //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 5); //if it is first column
              },
                    source: function () {
                    return ["No Path", "P3", "P4", "P2-P3", "P2-P4", "P1-P2-P3", "P1-P2-P4"]
              },
              strict: false //only accept predefined values (from array above)
            },
            {
            match: function (row, col, data) {
                    return (col == 4); //if it is first column
              },
                    source: function () {
                    return ["No Path", "P3", "P4", "P3-P2", "P4-P2"]
              },
              strict: false //only accept predefined values (from array above)
            }
        ],
        contextMenu: true,
    });

    var handsontableM = $containerM.data('handsontable');
     //Daily Breaks - Load & Save

    var $containerTue = $("#dailyBreaksTues");
        $containerTue.handsontable({
            startRows: 7,
            startCols: 6,
            fixedRowsTop:7,
            fixedColumnsLeft:6,
            colHeaders: ["Type", "Frequency", "Duration", "Destination", "Path", "Return Path"],
                autoComplete: [
                    {
                    match: function (row, col, data) {
                            return (col == 0); //if it is first column
                      },
                            source: function () {
                            return ["Smoke", "Drink", "Printer"] // /*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*/]
                      },
                      highlighter: function (item) {
                        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                        var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                          return '<strong>' + match + '</strong>';
                        });
                        return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                      },
                      strict: false  //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 1); //if it is first column
                      },
                            source: function () {
                            return ["1", "2", "3","4", "5", "6", "7", "enter amount"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 2); //if it is first column
                      },
                            source: function () {
                            return ["5", "10", "15", "20", "25", "30", "enter amount"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 3); //if it is first column
                      },
                            source: function () {
                            return ["P6", "P5", "P1", "R07", "R13", "R36"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 5); //if it is first column
                      },
                            source: function () {
                            return ["No Path", "P3", "P4", "P2-P3", "P2-P4", "P1-P2-P3", "P1-P2-P4"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 4); //if it is first column
                      },
                            source: function () {
                            return ["No Path", "P3", "P4", "P3-P2", "P4-P2"]
                      },
                      strict: false //only accept predefined values (from array above)
                    }
                ],
            contextMenu: true,
        });

      var handsontableTue = $containerTue.data('handsontable');

       //Daily Breaks - Load & Save

    var $containerWed = $("#dailyBreaksWed");
        $containerWed.handsontable({
            startRows: 7,
            startCols: 6,
            colHeaders: ["Type", "Frequency", "Duration", "Destination", "Path", "Return Path"],
            autoComplete: [
                    {
                    match: function (row, col, data) {
                            return (col == 0); //if it is first column
                      },
                            source: function () {
                            return ["Smoke", "Drink", "Printer"] /*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*/ /*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*/
                      },
                      highlighter: function (item) {
                        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                        var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                          return '<strong>' + match + '</strong>';
                        });
                        return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                      },
                      strict: false  //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 1); //if it is first column
                      },
                            source: function () {
                            return ["1", "2", "3","4", "5", "6", "7", "enter amount"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 2); //if it is first column
                      },
                            source: function () {
                            return ["5", "10", "15", "20", "25", "30", "enter amount"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 3); //if it is first column
                      },
                            source: function () {
                            return ["P6", "P5", "P1", "R07", "R13", "R36"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 5); //if it is first column
                      },
                            source: function () {
                            return ["No Path", "P3", "P4", "P2-P3", "P2-P4", "P1-P2-P3", "P1-P2-P4"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 4); //if it is first column
                      },
                            source: function () {
                            return ["No Path", "P3", "P4", "P3-P2", "P4-P2"]
                      },
                      strict: false //only accept predefined values (from array above)
                    }
        ],
        contextMenu: true,
    });

    var handsontableWed = $containerWed.data('handsontable');


     //Daily Breaks - Load & Save

    var $containerThurs = $("#dailyBreaksThurs");
        $containerThurs.handsontable({
            startRows: 7,
            startCols: 6,
            colHeaders: ["Type", "Frequency", "Duration", "Destination", "Path", "Return Path"],
             autoComplete: [
                {
                match: function (row, col, data) {
                        return (col == 0); //if it is first column
                  },
                        source: function () {
                        return ["Smoke", "Drink", "Printer"] /*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*//*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*/
                  },
                  highlighter: function (item) {
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                      return '<strong>' + match + '</strong>';
                    });
                    return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                  },
                  strict: false  //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 1); //if it is first column
                  },
                        source: function () {
                        return ["1", "2", "3","4", "5", "6", "7", "enter amount"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 2); //if it is first column
                  },
                        source: function () {
                        return ["5", "10", "15", "20", "25", "30", "enter amount"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 3); //if it is first column
                  },
                        source: function () {
                        return ["P6", "P5", "P1", "R07", "R13", "R36"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 5); //if it is first column
                  },
                        source: function () {
                        return ["No Path", "P3", "P4", "P2-P3", "P2-P4", "P1-P2-P3", "P1-P2-P4"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 4); //if it is first column
                  },
                        source: function () {
                        return ["No Path", "P3", "P4", "P3-P2", "P4-P2"]
                  },
                  strict: false //only accept predefined values (from array above)
                }
            ],
      contextMenu: true,
    });

    var handsontableThurs = $containerThurs.data('handsontable');

        //Daily Breaks - Load & Save

    var $containerFri = $("#dailyBreaksFri");
        $containerFri.handsontable({
            startRows: 7,
            startCols: 6,
            colHeaders: ["Type", "Frequency", "Duration", "Destination", "Path", "Return Path"],
            autoComplete: [
                    {
                    match: function (row, col, data) {
                            return (col == 0); //if it is first column
                      },
                            source: function () {
                            return ["Smoke", "Drink", "Printer" /*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*/] 
                      },
                      highlighter: function (item) {
                        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                        var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                          return '<strong>' + match + '</strong>';
                        });
                        return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                      },
                      strict: false  //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 1); //if it is first column
                      },
                            source: function () {
                            return ["1", "2", "3","4", "5", "6", "7", "enter amount"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 2); //if it is first column
                      },
                            source: function () {
                            return ["5", "10", "15", "20", "25", "30", "enter amount"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 3); //if it is first column
                      },
                            source: function () {
                            return ["P6", "P5", "P1", "R07", "R13", "R36"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 5); //if it is first column
                      },
                            source: function () {
                            return ["No Path", "P3", "P4", "P2-P3", "P2-P4", "P1-P2-P3", "P1-P2-P4"]
                      },
                      strict: false //only accept predefined values (from array above)
                    },
                    {
                    match: function (row, col, data) {
                            return (col == 4); //if it is first column
                      },
                            source: function () {
                            return ["No Path", "P3", "P4", "P3-P2", "P4-P2"]
                      },
                      strict: false //only accept predefined values (from array above)
                    }
                ],
        contextMenu: true,
    });

    var handsontableFri = $containerFri.data('handsontable');

        //Daily Breaks - Load & Save

    var $containerSat = $("#dailyBreaksSat");
        $containerSat.handsontable({
            startRows: 7,
            startCols: 6,
            colHeaders: ["Type", "Frequency", "Duration", "Destination", "Path", "Return Path"],
            autoComplete: [
                {
                match: function (row, col, data) {
                        return (col == 0); //if it is first column
                  },
                        source: function () {
                        return ["Smoke", "Drink", "Printer" /*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*//*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*/]
                  },
                  highlighter: function (item) {
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                      return '<strong>' + match + '</strong>';
                    });
                    return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                  },
                  strict: false  //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 1); //if it is first column
                  },
                        source: function () {
                        return ["1", "2", "3","4", "5", "6", "7", "enter amount"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 2); //if it is first column
                  },
                        source: function () {
                        return ["5", "10", "15", "20", "25", "30", "enter amount"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 3); //if it is first column
                  },
                        source: function () {
                        return ["P6", "P5", "P1", "R07", "R13", "R36"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 5); //if it is first column
                  },
                        source: function () {
                        return ["No Path", "P3", "P4", "P2-P3", "P2-P4", "P1-P2-P3", "P1-P2-P4"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 4); //if it is first column
                  },
                        source: function () {
                        return ["No Path", "P3", "P4", "P3-P2", "P4-P2"]
                  },
                  strict: false //only accept predefined values (from array above)
                }
            ],
        contextMenu: true,
    });

    var handsontableSat = $containerSat.data('handsontable');

        //Daily Breaks - Load & Save

    var $containerSun = $("#dailyBreaksSun");
        $containerSun.handsontable({
            startRows: 7,
            startCols: 6,
            colHeaders: ["Type", "Frequency", "Duration", "Destination", "Path", "Return Path"],
            autoComplete: [
                {
                match: function (row, col, data) {
                        return (col == 0); //if it is first column
                  },
                        source: function () {
                        return ["Smoke", "Drink", "Printer"] /*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*//*,Toilet", "Excercise", "Walk to Printer", "Walk to mailbox", "Impromptu Meeting"*/
                  },
                  highlighter: function (item) {
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                      return '<strong>' + match + '</strong>';
                    });
                    return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                  },
                  strict: false  //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 1); //if it is first column
                  },
                        source: function () {
                        return ["1", "2", "3","4", "5", "6", "7", "enter amount"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 2); //if it is first column
                  },
                        source: function () {
                        return ["5", "10", "15", "20", "25", "30", "enter amount"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 3); //if it is first column
                  },
                        source: function () {
                        return ["P6", "P5", "P1", "R07", "R13", "R36"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 5); //if it is first column
                  },
                        source: function () {
                        return ["No Path", "P3", "P4", "P2-P3", "P2-P4", "P1-P2-P3", "P1-P2-P4"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                match: function (row, col, data) {
                        return (col == 4); //if it is first column
                  },
                        source: function () {
                        return ["No Path", "P3", "P4", "P3-P2", "P4-P2"]
                  },
                  strict: false //only accept predefined values (from array above)
                }
            ],
        contextMenu: true,
    });

      var handsontableSun = $containerSun.data('handsontable');

              //Lunch Breaks - Load & Save

    var $container2 = $("#lunchBreak");
        $container2.handsontable({
            startRows: 7,
            startCols: 5,
            rowHeaders: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            colHeaders: ["Start Time", "End Time", "Destination", "Path", "Return Path"],
            autoComplete: [
                {
                  match: function (row, col, data) {
                    if (col == 2) {
                      return true;
                    }
                    return false;
                  },
                  highlighter: function (item) {
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                      return '<strong>' + match + '</strong>';
                    });
                    return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                  },
                  source: function () {
                    return ["P1", "P5", "P6", "R13", "R36"]

                  },
                  strict: true //allows other values that defined in array above
                },
                 {
                  match: function (row, col, data) {
                    if (col == 4) {
                      return true;
                    }
                    return false;
                  },
                  source: function () {
                    return ["P2-P3", "P2-P4","P3", "P4"]
                  },
                  strict: true //allows other values that defined in array above
                },
                {
                match: function (row, col, data) {
                    if (col == 3) {
                      return true;
                    }
                    return false;
                  },
                  source: function () {
                    return ["P3", "P4", "P3-P2", "P4-P2"]
                  },
                  strict: true //allows other values that defined in array above
                },
                {
                match: function (row, col, data) {
                    if (col == 0) {
                      return true;
                    }
                    return false;
                  },
                  source: function () {
                    return ["11:30", "12:00", "12:30", "13:00", "13:30","14:00", "14:30"]
                  },
                  strict: true //allows other values that defined in array above
                },
                {
                match: function (row, col, data) {
                    if (col == 1) {
                      return true;
                    }
                    return false;
                  },
                  source: function () {
                    return ["12:30", "13:00", "13:30","14:00", "14:30", "15:00", "15:30", "16:00"]
                  },
                  strict: true //allows other values that defined in array above
                }
            ],
        contextMenu: true,

    });

    var handsontable2 = $container2.data('handsontable');

    //Office Interactions Lunch Breaks - Load & Save

    var $container3 = $("#officeInteractions");
        $container3.handsontable({
            startRows: 7,
            startCols: 5,
            rowHeaders: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            colHeaders: [ "Lighting On (Approx hours)", 
          "Window Open (Approx Hours)", "Blinds Lowered  (Approx Hours)", "Door Open  (Approx Hours)", 
          "Desktop On (Approx Hours)", "Lamp On (Approx Hours)"],
            contextMenu: true,
            autoComplete: [
                {
                  match: function (row, col, data) {
                    return (col == 0); //if it is first column
                  },
                  source: function () {
                    return ["0", "1", "2", "3", "4", "5", "6", "enter number"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                {
                  match: function (row, col, data) {
                    if (col == 1) {
                      return true;
                    }
                    return false;
                  },
                  highlighter: function (item) {
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                      return '<strong>' + match + '</strong>';
                    });
                    return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                  },
                  source: function () {
                    return ["0", "1", "2", "3", "4", "5", "6", "enter number"]
                  },
                  strict: true //allows other values that defined in array above
                },
                 {
                  match: function (row, col, data) {
                    if (col == 2) {
                      return true;
                    }
                    return false;
                  },
                  source: function () {
                    return ["0", "1", "2", "3", "4", "5", "6", "enter number"]
                  },
                  strict: true //allows other values that defined in array above
                },
                {
                match: function (row, col, data) {
                    if (col == 3) {
                      return true;
                    }
                    return false;
                  },
                  source: function () {
                    return ["0", "1", "2", "3", "4", "5", "6", "enter number"]
                  },
                  strict: true //allows other values that defined in array above
                },
                {
                  match: function (row, col, data) {
                    return (col == 4); //if it is first column
                  },
                  source: function () {
                    return ["0", "1", "2", "3", "4", "5", "6", "enter number"]
                  },
                  strict: false //only accept predefined values (from array above)
                },
                 { match: function (row, col, data) {
                    return (col == 5); //if it is first column
                  },
                  source: function () {
                    return ["0", "1", "2", "3", "4", "5", "6", "enter number"]
                  },
                  strict: false //only accept predefined values (from array above)
                }
            ]
    });

    var handsontable3 = $container3.data('handsontable');


    //Day Start and End Time and Path to and from Office - Load & Save

    var $container4 = $("#dayStart_dayEnd");
        $container4.handsontable({
            startRows: 7,
            startCols: 6,
            rowHeaders: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            colHeaders: ["Start Time", "End Time", "Entrance", "Entrance-Path", "Exit", "Exit-Path"],
            colWidths: [80, 80, 120, 120, 80, 120, 120],
            manualColumnResize: true,
            autoComplete: [
                {
                  match: function (row, col, data) {
                    if (col == 2||col == 4) {
                      return true;
                    }
                    return false;
                  },
                  highlighter: function (item) {
                    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                    var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                      return '<strong>' + match + '</strong>';
                    });
                    return '<span style="margin-right: 10px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
                  },
                  source: function () {
                    return ["P1", "P5", "P6"]
                  },
                  strict: true //allows other values that defined in array above
                },
                 {
                  match: function (row, col, data) {
                    if (col == 3) {
                      return true;
                    }
                    return false;
                  },
                  source: function () {
                    return ["P3", "P4", "P2-P3", "P2-P4"]
                  },
                  strict: true //allows other values that defined in array above
                },
                {
                match: function (row, col, data) {
                    if (col == 5) {
                      return true;
                    }
                    return false;
                  },
                  source: function () {
                    return ["P3", "P4", "P3-P2", "P4-P2"]
                  },
                  strict: true //allows other values that defined in array above
                },
                {
                  match: function (row, col, data) {
                    return (col == 0); //if it is first column
                  },
                  source: function () {
                    return ["07:00", "08:00", "09:00", "10:00", "12:00", "13:00", "14:00"]
                  },
                  strict: true //only accept predefined values (from array above)
                },
                {
                  match: function (row, col, data) {
                    return (col == 1); //if it is first column
                  },
                  source: function () {
                    return ["14:00", "15:00", "16:00", "17:00", "18:00"]
                  },
                  strict: true //only accept predefined values (from array above)
                }
        ],
          contextMenu: true
    });

    var handsontable4 = $container4.data('handsontable');


    var $parent = $containerM.parent();

        $("button[name='load']").click(function () {
        //$parent.find('button[name=load]').click(function () {
            var d = new Date();
            log_data = log_data + d.getTime()+ " - Activty Load Button Clicked\n";

            parse_ID_Json(handsontableID.getData());
            handsontable4.clear();
            handsontable2.clear();

            handsontableM.clear();
            handsontableTue.clear();	
            handsontableWed.clear();
            handsontableThurs.clear();
            handsontableFri.clear();
            handsontableSat.clear();
            handsontableSun.clear();

            //handsontableMeetingMon.clear();
            //alert(queryStartEnd(handsontableID.getData()).data.toString());
//            handsontable4.loadData(queryStartEnd(handsontableID.getData()).data);
//            handsontable2.loadData(queryLunch(handsontableID.getData()).data);
//            
            handsontableM.loadData(queryBreaks($("#dayOptionsId").val()).data);
//            handsontableTue.loadData(queryBreaks(handsontableID.getData(), 1).data);		
//            handsontableWed.loadData(queryBreaks(handsontableID.getData(), 2).data);
//            handsontableThurs.loadData(queryBreaks(handsontableID.getData(), 3).data);
//            handsontableFri.loadData(queryBreaks(handsontableID.getData(), 4).data);
//            handsontableSat.loadData(queryBreaks(handsontableID.getData(), 5).data);
//            handsontableSun.loadData(queryBreaks(handsontableID.getData(), 6).data);
//            send_log_data();
            //handsontableMeetingMon.loadData(queryMeetings(handsontableID.getData(), 0).data);

          //parseDayScheduleJson(handsontable4.getData());

        });
        $("button[name='save']").click(function () {
//        $parent.find('button[name=save]').click(function () {
            var d = new Date();
            log_data = log_data + d.getTime()+ " - Save Load Button Clicked\n";
            
            
            parse_ID_Json(handsontableID.getData());
            
//            parseDayScheduleJson(handsontable4.getData()); 
//            handsontable4.clear();
//            handsontable4.loadData(queryStartEnd(handsontableID.getData()).data);
//            handsontable4.loadData(queryStartEnd(handsontableID.getData()).data);
//
//            parseLunchScheduleJson(handsontable2.getData());    
//            handsontable2.loadData(queryLunch(handsontableID.getData()).data);
//            handsontable2.loadData(queryLunch(handsontableID.getData()).data);
            
            parseBreaksJson(handsontableM.getData(), $("#dayOptionsId").val());
//            parseBreaksJson(handsontableTue.getData(), 1);
//            parseBreaksJson(handsontableWed.getData(), 2);
//            parseBreaksJson(handsontableThurs.getData(), 3);
//            parseBreaksJson(handsontableFri.getData(), 4);
//            parseBreaksJson(handsontableSat.getData(), 5);
//            parseBreaksJson(handsontableSun.getData(), 6);
            
            handsontableM.loadData(queryBreaks($("#dayOptionsId").val()).data);
//            handsontableTue.loadData(queryBreaks(handsontableID.getData(), 1).data);		
//            handsontableWed.loadData(queryBreaks(handsontableID.getData(), 2).data);
//            handsontableThurs.loadData(queryBreaks(handsontableID.getData(), 3).data);
//            handsontableFri.loadData(queryBreaks(handsontableID.getData(), 4).data);
//            handsontableSat.loadData(queryBreaks(handsontableID.getData(), 5).data);
//            handsontableSun.loadData(queryBreaks(handsontableID.getData(), 6).data);

            
        //                        overwrite = false;
            //parseOtherBreaks(date, jsonObj)			
//            send_log_data();
        });
//        $("button[name='save']").click(function () {
////        $parent.find('button[name=save]').click(function () {
//            //alert(overwrite);
//            parseIDJson(handsontableID.getData());
//            parseDayScheduleJson(handsontable4.getData());                      
//            parseLunchScheduleJson(handsontable2.getData());                        
//            parseBreaksJson(handsontableM.getData(), 0);
//            parseBreaksJson(handsontableTue.getData(), 1);
//            parseBreaksJson(handsontableWed.getData(), 2);
//            parseBreaksJson(handsontableThurs.getData(), 3);
//            parseBreaksJson(handsontableFri.getData(), 4);
//            parseBreaksJson(handsontableSat.getData(), 5);
//            parseBreaksJson(handsontableSun.getData(), 6);
//        //                        overwrite = false;
//            //parseOtherBreaks(date, jsonObj)			
//            send_log_data();
//        });

        $("button[name='log_data']").click(function () {
            var d = new Date();
            log_data = log_data + d.getTime()+ " - Log Data Button Clicked\n";
            log_data = log_data + d.getTime()+ " - Log Ends Here\n -------------------- \n";
            
            parseIDJson(handsontableID.getData());
            retrieve_log_data();
            
        });
        $("button[name='path_activity_add_button_div']").click(function () {
            
            handsontable4.clear();
            var pos3 = new Array();
            var pos4 = new Array();
            var pos5 = new Array();
            var pos6 = new Array();
            
            var tempJSONObj = handsontable4.getData();
//            alert(tempJSONObj);
            parseIDJson(handsontableID.getData());
//            console.log("Before");    
//            if(current_path_node_array.length===0)
//            {
//                console.log("Before1"); 
                for(var i=0; i<7;i++)
                {
                    console.log("A"+activity_day[i]);
                    console.log("E"+entrance_set);
                    pos3.push(undefined);
                    pos4.push(undefined);
                    //console.log(pos3[i]);
                    if((activity_day[i]===true)&&(entrance_set===true))
                    {
                        pos3[i] = document.getElementById('path_entrance_id_form').value;//first_path_node.id;    
                        pos4[i] = document.getElementById('path_id_form').value;
                        console.log(pos3[i]);
                        console.log(pos4[i]);
                    }
                    else  
                    {
                        pos3[i] = tempJSONObj[i][2];
                        pos4[i] = tempJSONObj[i][3];
//                        console.log(pos3[i]);
                    }
                }
                    
//            } 
//            if(current_path_node_array.length===0)
//            {
//                console.log("Before1"); 
                for(var i=0; i<7;i++)
                {
//                    console.log(activity_day[i]);
                    pos5.push(undefined);
                    pos6.push(undefined);
                    //console.log(pos3[i]);
                    if((activity_day[i]===true)&&(exit_set===true))
                    {
                        pos5[i] = document.getElementById('path_entrance_id_form').value;//first_path_node.id;    
                        pos6[i] = document.getElementById('path_id_form').value;
                        console.log(pos5[i]);
                        console.log(pos6[i]);
                        
//                        console.log(pos3[i]);
                    }
                    else
                    {
                        pos5[i] = tempJSONObj[i][4];
                        pos6[i] = tempJSONObj[i][5];
//                        console.log(pos3[i]);
                    }
                }
                    
//            }
//            for(var j = 0 ; j++; j<7){
//                
//                if(tempJSONObj[j][0]==="null"){
//                    tempJSONObj[j][0]="test";
//                }
//                
//            }
                work_place_handsontable_data = [
                [""+tempJSONObj[0][0]+"", ""+tempJSONObj[0][1]+"", ""+pos3[0]+"", ""+pos4[0]+"", ""+pos5[0]+"", ""+pos6[0]+""],
                [""+tempJSONObj[1][0]+"", ""+tempJSONObj[1][1]+"", ""+pos3[1]+"", ""+pos4[1]+"", ""+pos5[1]+"", ""+pos6[1]+""],
                [""+tempJSONObj[2][0]+"", ""+tempJSONObj[2][1]+"", ""+pos3[2]+"", ""+pos4[2]+"", ""+pos5[2]+"", ""+pos6[2]+""],
                [""+tempJSONObj[3][0]+"", ""+tempJSONObj[3][1]+"", ""+pos3[3]+"", ""+pos4[3]+"", ""+pos5[3]+"", ""+pos6[3]+""],
                [""+tempJSONObj[4][0]+"", ""+tempJSONObj[4][1]+"", ""+pos3[4]+"", ""+pos4[4]+"", ""+pos5[4]+"", ""+pos6[4]+""],
                [""+tempJSONObj[5][0]+"", ""+tempJSONObj[5][1]+"", ""+pos3[5]+"", ""+pos4[5]+"", ""+pos5[5]+"", ""+pos6[5]+""],
                [""+tempJSONObj[6][0]+"", ""+tempJSONObj[6][1]+"", ""+pos3[6]+"", ""+pos4[6]+"", ""+pos5[6]+"", ""+pos6[6]+""]
            ];
            //alert(work_place_handsontable_data);
            handsontable4.loadData(work_place_handsontable_data);		

        });
      //End Breaks

    }

    loadExamples();
    if (!$.browser.msie || parseInt($.browser.version, 10) > 7) { //syntax coloring does not work well with IE7
      $('pre.html').each(function (i, e) {
        hljs.highlightBlock(e)
      });
    }

    var examplesList = $('.examplesList');
    $('.example').each(function () {
      var $this = $(this);
      $this.append(examplesList.clone());
      $this.find('a[href~=#' + $this.attr('id').replace('container', '') + ']').addClass('active');
    });
    examplesList.remove();

});

//function load_button() {
//
//    alert("Load_Working");
//    //alert($("#month").val());
//    parseIDJson(handsontableID.getData());
//    handsontable4.clear();
//    handsontable2.clear();
//
//    handsontableM.clear();
//    handsontableTue.clear();	
//    handsontableWed.clear();
//    handsontableThurs.clear();
//    handsontableFri.clear();
//    handsontableSat.clear();
//    handsontableSun.clear();
//
//    //handsontableMeetingMon.clear();
//
//    handsontable4.loadData(queryStartEnd(handsontableID.getData()).data);
//    handsontable2.loadData(queryLunch(handsontableID.getData()).data);
//
//    handsontableM.loadData(queryBreaks(handsontableID.getData(), 0).data);
//    handsontableTue.loadData(queryBreaks(handsontableID.getData(), 1).data);		
//    handsontableWed.loadData(queryBreaks(handsontableID.getData(), 2).data);
//    handsontableThurs.loadData(queryBreaks(handsontableID.getData(), 3).data);
//    handsontableFri.loadData(queryBreaks(handsontableID.getData(), 4).data);
//    handsontableSat.loadData(queryBreaks(handsontableID.getData(), 5).data);
//    handsontableSun.loadData(queryBreaks(handsontableID.getData(), 6).data);
//
//    //handsontableMeetingMon.loadData(queryMeetings(handsontableID.getData(), 0).data);
//
//  //parseDayScheduleJson(handsontable4.getData());
//
//}//             alert("After");
//            if(current_path_node_array.length===0)
//            {
//                if((activity_day===1)&&(entrance_set===true))                       
//                {
//                    pos13 = first_path_node.id;
//                }
//                else if((activity_day===1)&&(entrance_set===false))    
//                {
//                    pos12 = tempJSONObj[0][2];
//                    pos13 = tempJSONObj[0][3];
//                }
//                if((activity_day===2)&&(entrance_set===true))                       
//                {
//                    pos23 = first_path_node.id;
//                }
//                else if((activity_day===2)&&(entrance_set===false))    
//                {
//                    pos22 = tempJSONObj[1][2];
//                    pos23 = tempJSONObj[1][3];
//                }
//                if((activity_day===3)&&(entrance_set===true))                       
//                {
//                    pos33 = first_path_node.id;
//                }
//                else if((activity_day===3)&&(entrance_set===false))    
//                {
//                    pos32 = tempJSONObj[2][2];
//                    pos33 = tempJSONObj[2][3];
//                }
//                if((activity_day===4)&&(entrance_set===true))                       
//                {
//                    pos43 = first_path_node.id;
//                }
//                else if((activity_day===4)&&(entrance_set===false))    
//                {
//                    pos42 = tempJSONObj[3][2];
//                    pos43 = tempJSONObj[3][3];
//                }
//                if((activity_day===5)&&(entrance_set===true))                       
//                {
//                    pos53 = first_path_node.id;
//                }
//                else if((activity_day===5)&&(entrance_set===false))    
//                {
//                    pos52 = tempJSONObj[4][2];
//                    pos53 = tempJSONObj[4][3];
//                }
//                if((activity_day===6)&&(entrance_set===true))                       
//                {
//                    pos63 = first_path_node.id;
//                }
//                else if((activity_day===6)&&(entrance_set===false))    
//                {
//                    pos62 = tempJSONObj[5][2];
//                    pos63 = tempJSONObj[5][3];
//                }
//                if((activity_day===7)&&(entrance_set===true))                       
//                {
//                    pos73 = first_path_node.id;
//                }
//                else if((activity_day===7)&&(entrance_set===false))    
//                {
//                    pos72 = tempJSONObj[6][2];
//                    pos73 = tempJSONObj[6][3];
//                }
//            }
//            else 
//                if((activity_day===1)&&(entrance_set===true))                           
//                {
//                    pos13 = current_path_node_array[0].id;
//                    pos12 = current_activity_zone.id;
//                }
//                if((activity_day===2)&&(entrance_set===true))                            
//                {
//                    pos23 = current_path_node_array[0].id;
//                    pos22 = current_activity_zone.id;
//                }
//                if((activity_day===3)&&(entrance_set===true))                           
//                {
//                    pos33 = current_path_node_array[0].id;
//                    pos32 = current_activity_zone.id;
//                }
//                if((activity_day===4)&&(entrance_set===true))                            
//                {
//                    pos43 = current_path_node_array[0].id;
//                    pos42 = current_activity_zone.id;
//                }
//                if((activity_day===5)&&(entrance_set===true))                            
//                {
//                    pos53 = current_path_node_array[0].id;
//                    pos52 = current_activity_zone.id;
//                }
//                if((activity_day===6)&&(entrance_set===true))                           
//                {
//                    pos63 = current_path_node_array[0].id;
//                    pos62 = current_activity_zone.id;
//                }
//                if((activity_day===7)&&(entrance_set===true))                           
//                {
//                    pos73 = first_path_node.id;
//                    pos72 = current_activity_zone.id;
//                }                         
            
            
    

            
            
//            if(exit_set===false)
//            {
//                pos4 = tempJSONObj[0][4];
//                pos5 = tempJSONObj[0][5];
//            }
//            else 
//            {
//                pos4 = path_exit_id;
//                if(current_path_node_array.length===0){
//                    pos5 = first_path_node.id;
//                    
//                }
//                else pos5 = current_path_node_array[0].id;
//                
//            }
//            
//            if(activity_day===1){
//                
//            }
              
//            work_place_handsontable_data = [
//                [""+tempJSONObj[0][0]+"", ""+tempJSONObj[0][1]+"", ""+pos12+"", ""+pos13+"", ""+pos14+"", ""+pos15+""],
//                [""+tempJSONObj[1][0]+"", ""+tempJSONObj[1][1]+"", ""+pos22+"", ""+pos23+"", ""+pos24+"", ""+pos25+""],
//                [""+tempJSONObj[2][0]+"", ""+tempJSONObj[2][1]+"", ""+pos32+"", ""+pos33+"", ""+pos34+"", ""+pos35+""],
//                [""+tempJSONObj[3][0]+"", ""+tempJSONObj[3][1]+"", ""+pos42+"", ""+pos43+"", ""+pos44+"", ""+pos45+""],
//                [""+tempJSONObj[4][0]+"", ""+tempJSONObj[4][1]+"", ""+pos52+"", ""+pos53+"", ""+pos54+"", ""+pos55+""],
//                [""+tempJSONObj[5][0]+"", ""+tempJSONObj[5][1]+"", ""+pos62+"", ""+pos63+"", ""+pos64+"", ""+pos65+""],
//                [""+tempJSONObj[6][0]+"", ""+tempJSONObj[6][1]+"", ""+pos72+"", ""+pos73+"", ""+pos74+"", ""+pos75+""]
//            ];