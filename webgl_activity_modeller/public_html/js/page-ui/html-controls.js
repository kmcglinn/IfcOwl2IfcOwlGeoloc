
/*
 * @Kris Code - Controls display of zone form values
 */
//var gl_canvas_width = 450;
//var gl_canvas_height = 600;
var activity_day = new Array();
for(var i = 0; i<7; i++){
    activity_day.push(false);
}
  $(function() {
    $( "#tabs" ).tabs();
  });

function toggleVisibility(divid) {
    if (divid==="activity-console"){
        document.getElementById("activity-console").style.visibility = "visible";
        document.getElementById("energyvis-console").style.visibility = "hidden";
    }
    else if (divid==="energyvis-console")
    {
        document.getElementById("energyvis-console").style.visibility = "visible";
        document.getElementById("activity-console").style.visibility = "hidden";
    }
    else if (divid==="activity-day-start-end-table")
    {
        document.getElementById("activity-day-start-end-table").style.display = "block";
        document.getElementById("activity-lunch-table").style.display = "none";
        document.getElementById("activity-breaks-table").style.display = "none";
    }
    else if (divid==="activity-lunch-table")
    {
        document.getElementById("activity-day-start-end-table").style.display = "none";
        document.getElementById("activity-lunch-table").style.display = "block";
        document.getElementById("activity-breaks-table").style.display = "none";
    }
    else if (divid==="activity-breaks-table")
    {
        document.getElementById("activity-day-start-end-table").style.display = "none";
        document.getElementById("activity-lunch-table").style.display = "none";
        document.getElementById("activity-breaks-table").style.display = "block";
    }
    else if (divid==="gl_canvas")
    {
        document.getElementById("gl_canvas").style.display = "block";
        document.getElementById("zone_viewer_div").style.display = "block";
        document.getElementById("forum_image").style.display = "none";
        document.getElementById("webg-size-radio").style.display = "block";
        document.getElementById("path_viewer_div").style.display = "block";
        if(can_view_path_id===true)
        {
            document.getElementById("path_viewer_div").style.display = "block";
        }
    }
        else if (divid==="forum_image")
    {
        document.getElementById("gl_canvas").style.display = "none";
        document.getElementById("zone_viewer_div").style.display = "none";
        document.getElementById("webg-size-radio").style.display = "none";
        document.getElementById("forum_image").style.display = "block";
        document.getElementById("path_viewer_div").style.display = "none";
    }
}

function toggleSize(size){
    var glcanvas;
    if(size===1){
        glcanvas=document.getElementById('gl_canvas');
        glcanvas.style.height = '450px';
        glcanvas.style.width = '600px';
    }
    else if(size===2){
        glcanvas=document.getElementById('gl_canvas');
        glcanvas.style.height = '600px';
        glcanvas.style.width = '800px';
    }
    
}
function set_zone_form_values(){
    
    document.forms["zone_form"]["zone_id_name"].value = current_activity_zone.id;
    
//    document.forms["zone_form"]["zone_x1"].value = current_activity_zone.p1X;
//    document.forms["zone_form"]["zone_y1"].value = current_activity_zone.p1Y;
//    document.forms["zone_form"]["zone_z1"].value = current_activity_zone.p1Z;
//    
//    document.forms["zone_form"]["zone_x2"].value = current_activity_zone.p2X;
//    document.forms["zone_form"]["zone_y2"].value = current_activity_zone.p2Y;
//    document.forms["zone_form"]["zone_z2"].value = current_activity_zone.p2Z;
    if(can_view_path_id===true)
    {
        document.forms["path_form"]["path_id_name"].value = current_path_node_array[0].path_id;
    }
    
    document.forms["path_form"]["path_entrance_id_form"].value = path_entry_id; //current_path_node_array[0].activity_path_id; //?
    document.forms["path_form"]["path_exit_id_form"].value = path_exit_id;  //current_path_node_array[length-1].activity_path_id;//
    
}

function set_entrance(){
//    alert(entrance_set);
    if(entrance_set === false)
    {
        entrance_set = true;
    }
    else entrance_set = false;
//    alert(entrance_set);
}

function set_exit(){
    
    if(exit_set === false)
    {
        exit_set = true;
    }
    else exit_set = false;
}

function update_zone_id_handsontables(){
    
    zone_id_handsontable = "Ooooh!";
//    alert(zone_id_handsontable);
    
}
function check_activity_path_entrance_exit()
{   
    document.write("\n\
            <div id=\"e_a_text_div\">\n\
                <div id=\"entrance_path_zone_id\">Path Entrace Zone:</div>\n\
                <div id=\"exit_path_zone_id\">Path Exit Zone:</div>\n\
            </div>\n\
            <div id=\"e_a_form_checks_div\">\n\
                <form name=\"path_form\">\n\
                    <input type=\"text\" id=\"path_entrance_id_form\"><input id = \"activity_ea_checkbox_id_1\" type=\"checkbox\" class=\"adri\" onclick=\"set_entrance();\">\n\
                    <input type=\"text\" id=\"path_exit_id_form\"><input id = \"activity_ea_checkbox_id_2\" type=\"checkbox\" class=\"adri\" onclick=\"set_exit();\">\n\
                </form>\n\
            </div>");
}
function radio_activity_day()
{
    
    document.write("\
            <div id=\"radio_activity_day_left\">\n\
            <input id = \"activity_day_radio_id_1\" type=\"checkbox\" class=\"adri\" onclick=\"set_activity_day(1);\">Monday</br>"+
            "<input id = \"activity_day_radio_id_3\" type=\"checkbox\" class=\"adri\" onclick=\"set_activity_day(3);\">Wednesday</br>"+
            "<input id = \"activity_day_radio_id_5\" type=\"checkbox\" class=\"adri\" onclick=\"set_activity_day(5);\">Friday</br>"+
            "<input id = \"activity_day_radio_id_7\" type=\"checkbox\" class=\"adri\" onclick=\"set_activity_day(7);\">Sunday"+
            "</div>\n\
            <div id=\"radio_activity_day_right\">"+
            "<input id = \"activity_day_radio_id_2\" type=\"checkbox\" class=\"adri\" onclick=\"set_activity_day(2);\">Tuesday</br>"+
            "<input id = \"activity_day_radio_id_4\" type=\"checkbox\" class=\"adri\" onclick=\"set_activity_day(4);\">Thursday</br>"+
            "<input id = \"activity_day_radio_id_6\" type=\"checkbox\" class=\"adri\" onclick=\"set_activity_day(6);\">Saturday</div>");
}

function set_activity_day(day){
//    //alert(day);
//    if(day===1)
//    {
        if(activity_day[day-1]===false)
        {
            activity_day[day-1] = true;
//            alert(day);
        }
        else
            activity_day[day-1] = false;
//    }
//    alert(activity_day[day-1]);
}
function drop_down_activities(){
    
    document.write("<select name=\"activity_type_dropdown\" id=\"activity_type_dropdown_id\" class=\"OptionsStyle\">"+
                        "<option value=\"1\" id=\"1\">Work Place</option>"+
                        "<option value=\"2\" id=\"2\">Lunch Break</option>"+
                        "<option value=\"3\" id=\"3\">Smoke</option>"+
                        "<option value=\"4\" id=\"4\">Toilet</option>"+
                        "<option value=\"5\" id=\"5\">Drink</option>"+
                "</select>");
        
}
function drop_down_dates(){

    document.write("<select id=\"month\" name=\"month\">"+
                            "<option value=\"01\">January</option>"+
                            "<option value=\"02\">February</option>"+
                            "<option value=\"03\">March</option>"+
                            "<option value=\"04\">April</option>"+
                            "<option value=\"05\">May</option>"+
                            "<option value=\"06\">June</option>"+
                            "<option value=\"07\">July</option>"+
                            "<option value=\"08\">August</option>"+
                            "<option value=\"09\">September</option>"+
                            "<option value=\"10\">October</option>"+
                            "<option value=\"11\">November</option>"+
                            "<option value=\"12\">December</option>"+
                    "</select>"+
                    "<select id=\"day\" name=\"day\">"+
                            "<option value=\"01\">1</option>"+
                            "<option value=\"02\">2</option>"+
                            "<option value=\"03\">3</option>"+
                            "<option value=\"04\">4</option>"+
                            "<option value=\"05\">5</option>"+
                            "<option value=\"06\">6</option>"+
                            "<option value=\"07\">7</option>"+
                            "<option value=\"08\">8</option>"+
                            "<option value=\"09\">9</option>"+
                            "<option value=\"10\">10</option>"+
                            "<option value=\"11\">11</option>"+
                            "<option value=\"12\">12</option>"+
                            "<option value=\"13\">13</option>"+
                            "<option value=\"14\">14</option>"+
                            "<option value=\"15\">15</option>"+
                            "<option value=\"16\">16</option>"+
                            "<option value=\"17\">17</option>"+
                            "<option value=\"18\">18</option>"+
                            "<option value=\"19\">19</option>"+
                            "<option value=\"20\">20</option>"+
                            "<option value=\"21\">21</option>"+
                            "<option value=\"22\">22</option>"+
                            "<option value=\"23\">23</option>"+
                            "<option value=\"24\">24</option>"+
                            "<option value=\"25\">25</option>"+
                            "<option value=\"26\">26</option>"+
                            "<option value=\"27\">27</option>"+
                            "<option value=\"28\">28</option>"+
                            "<option value=\"29\">29</option>"+
                            "<option value=\"30\">30</option>"+
                            "<option value=\"31\">31</option>"+
                    "</select>"+
                    "<select id=\"year\" name=\"year\">"+
                            "<option value=\"2012\">2012</option>"+
                            "<option value=\"2013\">2013</option>"+
                    "</select>"+
                    "<input type=\"hidden\" id=\"datepicker\" />");
    
}

function drop_down_break_table(){
    
    document.write("<select name=\"dayOptions\" id=\"dayOptionsId\" class=\"OptionsStyle\">"+
                            "<option value=\"1\" id=\"1\">Monday</option>"+
                            "<option value=\"2\" id=\"2\">Tuesday</option>"+
                            "<option value=\"3\" id=\"3\">Wednesday</option>"+
                            "<option value=\"4\" id=\"4\">Thursday</option>"+
                            "<option value=\"5\" id=\"5\">Friday</option>"+
                            "<option value=\"6\" id=\"6\">Saturday</option>"+
                            "<option value=\"7\" id=\"7\">Sunday</option>"+
                    "</select>");
    
    
}
$(document).ready(function () {
        $("#dayOptionsId").change(function () {
                 $("#dayOptionsId option:selected").each(function ()
                {
                        if($(this).attr("id") == "1")
                        {
                                $("#dailyBreaksMon").show();
                                //$("#dayOfTheWeek").update("Monday");
                        }
                        else
                        {
                                $("#dailyBreaksMon").hide();
                        }
                        if($(this).attr("id") == "2")
                        {
                                $("#dailyBreaksTues").show();
                                //$("#dayOfTheWeek").update("Tuesday");
                        }
                        else
                        {
                                $("#dailyBreaksTues").hide();
                        }
                        if($(this).attr("id") == "3")
                        {
                                $("#dailyBreaksWed").show();
                        }
                        else
                        {
                                $("#dailyBreaksWed").hide();
                        }
                        if($(this).attr("id") == "4")
                        {
                                $("#dailyBreaksThurs").show();
                        }
                        else
                        {
                                $("#dailyBreaksThurs").hide();
                        }
                        if($(this).attr("id") == "5")
                        {
                                $("#dailyBreaksFri").show();
                        }
                        else
                        {
                                $("#dailyBreaksFri").hide();
                        }
                        if($(this).attr("id") == "6")
                        {
                                $("#dailyBreaksSat").show();
                        }
                        else
                        {
                                $("#dailyBreaksSat").hide();
                        }
                        if($(this).attr("id") == "7")
                        {
                                $("#dailyBreaksSun").show();
                        }
                        else
                        {
                                $("#dailyBreaksSun").hide();
                        }
                });
        }).change();
});