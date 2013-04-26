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

function init_zones () {
    
    //createTestZone();
    zone_shader = load_shaders (zone_vs_url, zone_fs_url);
    zone_P_loc = gl.getUniformLocation (zone_shader, "P");
    zone_V_loc = gl.getUniformLocation (zone_shader, "V");
        
}

function init_paths() {
    
    path_shader = load_shaders (path_vs_url, path_fs_url);
    path_P_loc = gl.getUniformLocation (path_shader, "P");
    path_V_loc = gl.getUniformLocation (path_shader, "V");
        
}

function save_path()
{
    var r=confirm("Do you wish to save this path?");
    if (r==true)
    {
        sparql_update_path(); //currently does nothing
        var temp_path_node_array = new Array();
        temp_path_node_array = current_path_node_array;
        
        path_node_array[path_node_array.length-1] = temp_path_node_array;
        
        path_node_array.push(current_path_node_array);
        
        console.log("path_node_array length: "+path_node_array.length);
        path_connected = false;
        can_create_path = false;
        can_save_path = false;
        zone_selected = false;
        current_path_node_array = new Array();
        previous_path_node = new PathNode();
        current_path_node = new PathNode();
        currentlyPressedKeys[67] = false;
        
//        for(var i = 0; i < current_path_node_array; i++)
//        {
//            temp_path_node = new PathNode();
//            temp_path_node.id = current_path_node_array[i].id;
//            temp_path_node.p1X = current_path_node_array[i].p1X;
//            temp_path_node.p1Y= current_path_node_array[i].p1Y;
//            temp_path_node.p1Z = current_path_node_array[i].p1Z;
//            path_node_array.push(temp_path_node);        
//        }
        //alert(path_node_array.length);
    }//END OF IF
    else
    {
        path_connected = false;
        can_create_path = false;
        can_save_path = false;
        zone_selected = false;
        current_path_node_array = new Array();
        previous_path_node = new PathNode();
        current_path_node = new PathNode();//return; //End function
        currentlyPressedKeys[67] = false;
    }//END OF ELSE
//    state_booleans();
}

function save_zone(){
    
    var temp_zone = new Zone(current_activity_zone.type, current_activity_zone.id, current_activity_zone.p1X, current_activity_zone.p1Y, current_activity_zone.p1Z, current_activity_zone.p2X, current_activity_zone.p2Y, current_activity_zone.p2Z);
    zone_activity_array.push(temp_zone);
    update_zone(temp_zone);
    //alert(zone_activity_array.length);
    
    for(var i = 0;  i< zone_activity_array.length; i++){
        
        //alert(zone_activity_array[i].getInfo());
  
    }
    
//    alert("Number of Zone Points: " + zone_points.length);
}


function delete_zone(){
    
    //alert(zone_activity_array.length);
    var exists = false;
    for(var i = 1;  i< zone_activity_array.length; i++){
        
        if(zone_activity_array[i].id==current_activity_zone.id){
            console.log("DELETING ZONE: " + current_activity_zone.id + " at position: " + i)
            console.log("Array length (before splice)" + zone_activity_array.length);
            zone_activity_array.splice(i,1);
            delete_zone_sparql(current_activity_zone.id);
            current_activity_zone = new Zone('Activity', 0, 0,0,0,  0,0,0);
            console.log("Array length (after splice)" + zone_activity_array.length);
            exists = true;
            zone_selected = false;
        }
  
    }
    if(exists == false)
    {
        alert("No Zone with that i.d. exists (you must select a zone)")
    }
    
    //This is temporary to fix bug...should be improved!!!
    //query_zones(exists);
    
//    alert("Number of Zone Points: " + zone_points.length);
}