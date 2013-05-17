/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


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
        can_view_path_id = false;;
        sparql_update_path(); //currently does nothing
        var temp_path_node_array = new Array();
        temp_path_node_array = current_path_node_array;
        
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