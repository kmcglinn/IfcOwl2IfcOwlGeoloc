/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function PathNode(id, p1X, p1Y, p1Z, has_activity_node_id){
    
    this.path_id = id;
    this.p1X = p1X;
    this.p1Y = p1Y;
    this.p1Z = p1Z;
    this.has_activity_node_id = has_activity_node_id;
        
}

PathNode.prototype.getInfo = function(){
    
        return 'Zone type: ' + this.type + '. Zone id: ' + this.id + 'Position 1 x, y, z: ' + this.p1X + ' : ' + this.p1Y + ' : ' + this.p1Z ;
        
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
        can_view_path_id = false; //once a path is saved, deselect all paths (so can_view_path_id is set to false)
        sparql_save_path(); //saves path to ontology
        var temp_path_node_array = new Array(); //create new array (so copy is not by reference)
        current_path_node_array[current_path_node_array.length-1].has_activity_node_id = document.getElementById("path_exit_id_form").value; //set the last node in the array with the end activity zone id
        alert(current_path_node_array[current_path_node_array.length-1].has_activity_node_id);
        temp_path_node_array = current_path_node_array; //copy the current path node array to new array
        
        path_node_array[path_node_array.length-1] = temp_path_node_array; 
//        current_path_node_array = new Array();
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
//            temp_path_node.id = current_path_node_array[i].path_id;
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