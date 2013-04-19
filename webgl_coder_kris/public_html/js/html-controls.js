/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


//function toggleVisibility(newSection) {
//    $(".section").not("#" + newSection).hide();
//    $("#" + newSection).show();
//}


    function toggleVisibility(divid) {
    if (divid="activity-console"){
        document.getElementById("activity-console").style.visibility = "visible";
        document.getElementById("energyvis-console").style.visibility = "hidden";
    }
    else if (divid="energyvis-console")
    {
        document.getElementById("energyvis-console").style.visibility = "visible";
        document.getElementById("activity-console").style.visibility = "hidden";
    }
    }

