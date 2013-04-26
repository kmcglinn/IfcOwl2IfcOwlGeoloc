
/*
 * @Kris Code - Controls display of zone form values
 */


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


function set_zone_form_values(){
    
    document.forms["zone_form"]["zone_id_name"].value = current_activity_zone.id;
    
    document.forms["zone_form"]["zone_x1"].value = current_activity_zone.p1X;
    document.forms["zone_form"]["zone_y1"].value = current_activity_zone.p1Y;
    document.forms["zone_form"]["zone_z1"].value = current_activity_zone.p1Z;
    
    document.forms["zone_form"]["zone_x2"].value = current_activity_zone.p2X;
    document.forms["zone_form"]["zone_y2"].value = current_activity_zone.p2Y;
    document.forms["zone_form"]["zone_z2"].value = current_activity_zone.p2Z;
    
}
