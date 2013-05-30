/*
 * 
 * @Kris-Code
 * "Zone" class This wont work as an external file for some reason...
 */
/*
function Zone(type, id, originX, originY, originZ, width, length, isSquare, height){
    
    this.type = type;
    this.originX = originX;
    this.originY = originY;
    this.originZ = originZ;
    this.id = id;
    this.width = width;
    this.length = length;
    this.height = height;
    this.isSquare = isSquare;
        
}
*/
function Zone(type, id, p1X, p1Y, p1Z, p2X, p2Y, p2Z){
    
    this.type = type;
    this.id = id;
    this.p1X = p1X;
    this.p1Y = p1Y;
    this.p1Z = p1Z;
    this.p2X = p2X;
    this.p2Y = p2Y;
    this.p2Z = p2Z;
        
}

Zone.prototype.getInfo = function(){
    
        return 'Zone type: ' + this.type + '. Zone id: ' + this.id + 'Position 1 x, y, z: ' + this.p1X + ' : ' + this.p1Y + ' : ' + this.p1Z + '...Position 2 x, y, z: ' + this.p2X + ' : ' + this.p2Y + ' : ' + this.p2Z;
        
}

function createTestZone(){
    //type, id, originX, originY, originZ, width, length, isSquare, height
    zone_activity_array[0] = new Zone('Activity', 0, 0,0,0,  0,0,0);
    
}
function init_floor() {
    
    //createTestZone();
    floor_shader = load_shaders (floor_vs_url, floor_fs_url);
    floor_P_loc = gl.getUniformLocation (floor_shader, "P");
    floor_V_loc = gl.getUniformLocation (floor_shader, "V");
        
}
function init_walls () {
    
    //createTestZone();
    wall_shader = load_shaders (wall_vs_url, wall_fs_url);
    wall_P_loc = gl.getUniformLocation (wall_shader, "P");
    wall_V_loc = gl.getUniformLocation (wall_shader, "V");
        
}
function init_zones () {
    
    //createTestZone();
    zone_shader = load_shaders (zone_vs_url, zone_fs_url);
    zone_P_loc = gl.getUniformLocation (zone_shader, "P");
    zone_V_loc = gl.getUniformLocation (zone_shader, "V");
        
}



function save_zone(){
    
    var r=confirm("Warning: This will save the current zone to the database");
    if (r===true)
    {
        
        var temp_zone = new Zone(current_activity_zone.type, current_activity_zone.id, current_activity_zone.p1X, current_activity_zone.p1Y, current_activity_zone.p1Z, current_activity_zone.p2X, current_activity_zone.p2Y, current_activity_zone.p2Z);
        zone_activity_array.push(temp_zone);
        update_zone(temp_zone);
        zone_selected = true;
        console.log("ZONE SELECTED - " + zone_selected);
        can_select = false; //_zone
        can_create_zone = false;
        currentlyPressedKeys[90] = false;
        g_zone_is_being_built = false;
        //current_activity_zone = new Zone('Activity', 0, 0,0,0,  0,0,0); //Create an empty zone for the current zone

    }//END OF IF
    else
    {
        current_activity_zone = new Zone('Activity', 0, 0,0,0,  0,0,0); //Create an empty zone for the current zone
        zone_selected = true;
        console.log("ZONE SELECTED - " + zone_selected);
        can_select = false; //_zone
        can_create_zone = false;
        currentlyPressedKeys[90] = false;
        g_zone_is_being_built = false;
        return; //End function
    }//END OF ELSE
    set_zone_form_values();

}


function delete_zone(){
    
    //alert(zone_activity_array.length);
    var exists = false;
    for(var i = 1;  i< zone_activity_array.length; i++){
        
        if(zone_activity_array[i].id===current_activity_zone.id){
            console.log("DELETING ZONE: " + current_activity_zone.id + " at position: " + i);
            console.log("Array length (before splice)" + zone_activity_array.length);
            zone_activity_array.splice(i,1);
            delete_zone_sparql(current_activity_zone.id);
            current_activity_zone = new Zone('Activity', 0, 0,0,0,  0,0,0);
            console.log("Array length (after splice)" + zone_activity_array.length);
            exists = true;
            zone_selected = false;
            console.log("ZONE SELECTED - " + zone_selected);
        }
  
    }
    if(exists == false)
    {
        alert("No Zone with that i.d. exists (you must select a zone)")
    }
    set_zone_form_values();
    //This is temporary to fix bug...should be improved!!!
    //query_zones(exists);
    
//    alert("Number of Zone Points: " + zone_points.length);
}