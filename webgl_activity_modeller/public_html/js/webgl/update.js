/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var path_exit_id = "undefined";
function update () {
	// timer
	var time = (new Date).getTime ();
	var elapsed = time - g_last_time;
	g_last_time = time;
	var seconds = elapsed / 1000.0;
	g_step_time_accum += seconds;
	
	// update fps printout
	fps_counter++;
	fps_accum += seconds;
	if (fps_counter > 9) {
		fps_counter = 0;
		var fps = 10.0 / fps_accum;
		fps_accum = 0.0;
//		document.getElementById('para_fps').innerHTML = fps.toFixed(2);
	}
        //NEED TO UPDATE THIS SO THAT FORM CAN BE EDITED
        set_zone_form_values();
	// compute time steps
        //console.log();
	while (g_step_time_accum > step_size) 
        {
            
            g_step_time_accum -= step_size;
            var camMove = [0, 0, 0];
            var camspeed = 20.0;
            // keys listed by code: http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants

            if (currentlyPressedKeys[84] === true) // T to pitch
            { 
                g_cam.change_attitude (-20.0, seconds); 
            }
             else if (currentlyPressedKeys[71] === true)  //G to pitch Up
            { 
                g_cam.change_attitude (20.0, seconds);
            }
            // F key to yaw left
            if (currentlyPressedKeys[70] === true)   
            {
                g_cam.change_heading (40.0, seconds);  
						// H key to yaw right    	
            } else if (currentlyPressedKeys[72] === true)      
            { 
		g_cam.change_heading (-40.0, seconds);     
            }
            if (currentlyPressedKeys[90] === true) // z
            { 
                    can_create_zone = true;                     
            }
            else 
            {
                can_create_zone = false;
            }

            if (currentlyPressedKeys[88] === true) // x
            { 
                    can_select_zone = true;
//                    console.log("SIZE OF ZONE ARRAY: " + zone_activity_array.length);
//                    console.log("ARRAY[0] ID: " + zone_activity_array[0].id);
//                    console.log("ARRAY[1] ID: " + zone_activity_array[1].id);
            }
            else 
            {
                can_select_zone = false;
            }
            if (currentlyPressedKeys[67] === true) //c
            { 
                if(path_node_array.length===0)
                {
                    path_node_array.push(current_path_node_array);
                    
                }
                if(zone_selected === true)
                {
                    can_create_path = true;
                    path_exit_id = "undefined";
//                    console.log("SETTING FIRST NODE AS ORIGIN OF ZONE");
                    previous_path_node = new PathNode();
                    previous_path_node.p1X = midpoint(current_activity_zone.p1X, current_activity_zone.p2X);
                    previous_path_node.p1Y = midpoint(current_activity_zone.p1Y, current_activity_zone.p2Y);
                    previous_path_node.p1Z = midpoint(current_activity_zone.p1Z, current_activity_zone.p2Z);
                    previous_path_node.has_activity_node_id = current_activity_zone.id;
                    previous_path_node.id = create_simple_guid();                  
                    document.getElementById("path_viewer_div").style.display = "block";
                    if(current_path_node_array.length===0)
                    {
                        console.log("PATH NODE ARRAY WAS EMPTY");
                        current_path_node_array.push(previous_path_node); //pointer to previous_path_node storing midpoint of first activity zone
                        current_path_node_array.push(current_path_node); //pointer to current_path_node which is updated below
//                        console.log("current_path_node_array LENGTH: " + current_path_node_array.length);
//                        console.log("current_path_node_array[0].id: " + current_path_node_array[0].id);
                        
                        can_view_path_id = true;
                    }
                }
                else
                {
                    alert("You must select a start zone");
                    currentlyPressedKeys[67] = false;

                    //update_path();
                }
            }

            else 
            {
  
            }
//                if (currentlyPressedKeys[88] == true) { // w
//
//                    save_zone();
//  
//                }
            if (currentlyPressedKeys[87] === true) 
            { // w
                camMove[2] = -1.0 * camspeed * step_size;
                g_cam.move_cam_relative_forward_by (camMove);
                updateMove = true;
            }
            if (currentlyPressedKeys[83] === true) 
            { // s
                camMove[2] = 1.0 * camspeed * step_size;
                g_cam.move_cam_relative_forward_by (camMove);
                updateMove = true;
            }
            if (currentlyPressedKeys[65] === true) 
            { // a
                    camMove[0] = -1.0 * camspeed * step_size;
                    g_cam.move_cam_relative_forward_by (camMove);
                    updateMove = true;
            }
            if (currentlyPressedKeys[68] === true) 
            { // d
                    camMove[0] = 1.0 * camspeed * step_size;
                    g_cam.move_cam_relative_forward_by (camMove);
                    updateMove = true;
            }
            if (currentlyPressedKeys[69] === true) 
            { // q
                    camMove[1] = -1.0 * camspeed * step_size;
                    g_cam.moveBy (camMove);
                    updateMove = true;
            }
            if (currentlyPressedKeys[81] == true) 
            { // r
                    camMove[1] = 1.0 * camspeed * step_size;
                    g_cam.moveBy (camMove);
                    updateMove = true;
            }
            if (updateMove) 
            {
                    // update view and projection matrices in each shader programme

                    gl.useProgram (phong_shader);
                    gl.uniformMatrix4fv (phong_view_mat_loc, false, transpose_mat4 (g_cam.mViewMat));
                    gl.uniformMatrix4fv (phong_proj_mat_loc, false, transpose_mat4 (g_cam.mProjMat));

                    gl.useProgram (normals_shader);
                    gl.uniformMatrix4fv (view_mat_loc, false, transpose_mat4 (g_cam.mViewMat));
                    gl.uniformMatrix4fv (proj_mat_loc, false, transpose_mat4 (g_cam.mProjMat));

                    gl.useProgram (ssao_shader);
                    gl.uniformMatrix4fv (ssao_inv_proj_mat_loc, false, transpose_mat4 ( inverse_mat4 (g_cam.mProjMat)));

                    gl.useProgram (depth_shader);
                    gl.uniformMatrix4fv (depth_view_mat_loc, false, transpose_mat4 (g_cam.mViewMat));
                    gl.uniformMatrix4fv (depth_proj_mat_loc, false, transpose_mat4 (g_cam.mProjMat));

                    // update html with cam pos
//                    document.getElementById ('para_cam_pos').innerHTML =
//                            "campos = " + g_cam.mWC_Pos[0].toFixed(2) + ", "
//                            + g_cam.mWC_Pos[1].toFixed(2) + ", " + g_cam.mWC_Pos[2].toFixed(2);
//                    updateMove = false;
            }

            // show dragging-out of zone with mouse is still held
            if (g_zone_is_being_built) {
            //if(true){
                // recursively get location within parent(s)
                var ray = get_mouse_ray_wor (g_mouse_x, g_mouse_y);

                if (ray_plane (ray, g_cam.mWC_Pos, [0, 1, 0], 0)) {

                }

                current_activity_zone.p2X = intersection_point_wor_x;
                current_activity_zone.p2Y = intersection_point_wor_y;
                current_activity_zone.p2Z = intersection_point_wor_z;

            }

            if (can_create_path) 
            {

                    var ray = get_mouse_ray_wor (g_mouse_x, g_mouse_y);

                    if (ray_plane (ray, g_cam.mWC_Pos, [0, 1, 0], 0)) 
                    {

                    }
                    var apos;
                    for(var i = 1; i<zone_activity_array.length;i++)
                    {
                        if(((intersection_point_wor_x>zone_activity_array[i].p1X)&&(intersection_point_wor_y>zone_activity_array[i].p1Y))
                            &&((intersection_point_wor_x<zone_activity_array[i].p2X)&&(intersection_point_wor_y<zone_activity_array[i].p2Y)))
                        {

                            path_connected = true;
                            can_save_path = true;
                            //console.log(path_connected);
                            apos = i;

                        } 
                        
                    }
                    if(!path_connected)                     
                    {
                        
                        current_path_node.p1X = intersection_point_wor_x;
                        current_path_node.p1Y = intersection_point_wor_y;
                        current_path_node.p1Z = intersection_point_wor_z;
                        can_save_path = false;
//                        if(path_node_array)
//                        {
//                            console.log(path_node_array[path_node_array.length][0].p1X);
//                            
//                        }
                        //console.log(path_connected);
                    }
                    if(path_connected)                     
                    {                          
                        current_path_node.p1X = midpoint(zone_activity_array[apos].p1X, zone_activity_array[apos].p2X);
                        current_path_node.p1Y = midpoint(zone_activity_array[apos].p1Y, zone_activity_array[apos].p2Y);
                        current_path_node.p1Z = midpoint(zone_activity_array[apos].p1Z, zone_activity_array[apos].p2Z);
                        path_exit_id = zone_activity_array[apos].id;
                        path_connected = false;
                        
                            
                        //console.log(path_connected);
                    }

//                    console.log("SETTING CURRENT PATH NODE AS MOUSE POSITION");
//                    console.log("X = " + intersection_point_wor_x);
//                    console.log("Previous path X = " + previous_path_node.p1X); 


//                    }
            }

     
	}
	
	// render once and request re-draw of canvas
	if (!render ()) {
		console.error ("error rendering scene");
		return false;
	}
	window.requestAnimFrame(update, g_canvas);
	return true;
}
