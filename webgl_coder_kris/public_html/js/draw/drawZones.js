/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function draw_activity_zones(){
        
    zone_points = [
        current_activity_zone.p1X,0.1,current_activity_zone.p1Y,
        current_activity_zone.p2X,0.1,current_activity_zone.p1Y,
        current_activity_zone.p2X,0.1,current_activity_zone.p2Y,
        current_activity_zone.p1X,0.1,current_activity_zone.p1Y,
        current_activity_zone.p2X,0.1,current_activity_zone.p2Y,
        current_activity_zone.p1X,0.1,current_activity_zone.p2Y
    ];
    //console.log(zone_activity_array.length);
    //var temp_zone = clone.zone_activity_array[0];
    var set_z = 0.1;
    for(var i = 18;  i< zone_activity_array.length*18; i=i+18){
        a_z_count = i/18;
        zone_points[i] = zone_activity_array[a_z_count].p1X;
        zone_points[i+1] = set_z;
        zone_points[i+2] = zone_activity_array[a_z_count].p1Y;
        
        zone_points[i+3] = zone_activity_array[a_z_count].p2X;
        zone_points[i+4] = set_z;
        zone_points[i+5] = zone_activity_array[a_z_count].p1Y;
        
        zone_points[i+6] = zone_activity_array[a_z_count].p2X;
        zone_points[i+7] = set_z;
        zone_points[i+8] = zone_activity_array[a_z_count].p2Y;
        
        zone_points[i+9] = zone_activity_array[a_z_count].p1X;
        zone_points[i+10] = set_z;
        zone_points[i+11] = zone_activity_array[a_z_count].p1Y;
        
        zone_points[i+12] = zone_activity_array[a_z_count].p2X;
        zone_points[i+13] = set_z;
        zone_points[i+14] = zone_activity_array[a_z_count].p2Y;
        
        zone_points[i+15] = zone_activity_array[a_z_count].p1X;
        zone_points[i+16] = set_z;
        zone_points[i+17] = zone_activity_array[a_z_count].p2Y;
    }

        zone_vp_vbo = create_vbo(zone_points);
	zone_v_count = zone_points.length/3;
        
    	gl.disable (gl.CULL_FACE); // enable culling
    	gl.useProgram (zone_shader);
	
	gl.enableVertexAttribArray (0);
	gl.disableVertexAttribArray (1);
	
	gl.bindBuffer (gl.ARRAY_BUFFER, zone_vp_vbo);
	gl.vertexAttribPointer (0, 3, gl.FLOAT, false, 0, 0);
	//@todo-for each zone...
	// render one zone for the minute
	//gl.uniformMatrix4fv (zone_M_loc, false, transpose_mat4 (zone_a_M));
	gl.uniformMatrix4fv (zone_V_loc, false, transpose_mat4 (g_cam.mViewMat));
	gl.uniformMatrix4fv (zone_P_loc, false, transpose_mat4 (g_cam.mProjMat));

        //gl.uniform4f (zone_colour_loc, 0.2, 0.2, 0.2, 1.0);
        gl.drawArrays (gl.TRIANGLES, 0, zone_v_count);

	gl.enable (gl.CULL_FACE); // enable culling

}

function draw_current_path(){

    var set_z = 0;
    var path_width = "1"

    current_path_node_points = new Array();

    for(var i = 0;  i< (current_path_node_array.length-1)*18; i=i+18){
        p_n_count = i/18;
        current_path_node_points[i] = current_path_node_array[p_n_count].p1X;
        current_path_node_points[i+1] = set_z;
        current_path_node_points[i+2] = current_path_node_array[p_n_count].p1Y;
        
        current_path_node_points[i+3] = current_path_node_array[p_n_count].p1X;
        current_path_node_points[i+4] = path_width;
        current_path_node_points[i+5] = current_path_node_array[p_n_count].p1Y;
        
        current_path_node_points[i+6] = current_path_node_array[p_n_count+1].p1X;
        current_path_node_points[i+7] = path_width;
        current_path_node_points[i+8] = current_path_node_array[p_n_count+1].p1Y;
        
        current_path_node_points[i+9] = current_path_node_array[p_n_count].p1X;
        current_path_node_points[i+10] = set_z;
        current_path_node_points[i+11] = current_path_node_array[p_n_count].p1Y;
        
        current_path_node_points[i+12] = current_path_node_array[p_n_count].p1X;
        current_path_node_points[i+13] = set_z;
        current_path_node_points[i+14] = current_path_node_array[p_n_count+1].p1Y;
        
        current_path_node_points[i+15] = current_path_node_array[p_n_count].p1X;
        current_path_node_points[i+16] = path_width;
        current_path_node_points[i+17] = current_path_node_array[p_n_count+1].p1Y;
    }
 
    //The last node on the array is alway the current node (when creating paths) otherwise
        path_vp_vbo = create_vbo(current_path_node_points);
	path_v_count = current_path_node_points.length/3;
        
    	gl.disable (gl.CULL_FACE); // enable culling
    	gl.useProgram (path_shader);
	
	gl.enableVertexAttribArray (0);
	gl.disableVertexAttribArray (1);
	
	gl.bindBuffer (gl.ARRAY_BUFFER, path_vp_vbo);
	gl.vertexAttribPointer (0, 3, gl.FLOAT, false, 0, 0);
	//@todo-for each zone...
	// render one zone for the minute
	//gl.uniformMatrix4fv (zone_M_loc, false, transpose_mat4 (zone_a_M));
	gl.uniformMatrix4fv (path_V_loc, false, transpose_mat4 (g_cam.mViewMat));
	gl.uniformMatrix4fv (path_P_loc, false, transpose_mat4 (g_cam.mProjMat));

        //gl.uniform4f (zone_colour_loc, 0.2, 0.2, 0.2, 1.0);
        gl.drawArrays (gl.TRIANGLES, 0, path_v_count);

	gl.enable (gl.CULL_FACE); // enable culling

}

function draw_path(){

    var set_z = 0;
    var path_width = "1"

    //current_path_node_points = new Array();

    for(var i = 0;  i< (path_node_array.length-1)*18; i=i+18){
        p_n_count = i/18;
        path_node_points[i] = path_node_array[p_n_count].p1X;
        path_node_points[i+1] = set_z;
        path_node_points[i+2] = path_node_array[p_n_count].p1Y;
        
        path_node_points[i+3] = path_node_array[p_n_count].p1X;
        path_node_points[i+4] = path_width;
        path_node_points[i+5] = path_node_array[p_n_count].p1Y;
        
        path_node_points[i+6] = path_node_array[p_n_count+1].p1X;
        path_node_points[i+7] = path_width;
        path_node_points[i+8] = path_node_array[p_n_count+1].p1Y;
        
        path_node_points[i+9] = path_node_array[p_n_count].p1X;
        path_node_points[i+10] = set_z;
        path_node_points[i+11] = path_node_array[p_n_count].p1Y;
        
        path_node_points[i+12] = path_node_array[p_n_count].p1X;
        path_node_points[i+13] = set_z;
        path_node_points[i+14] = path_node_array[p_n_count+1].p1Y;
        
        path_node_points[i+15] = path_node_array[p_n_count].p1X;
        path_node_points[i+16] = path_width;
        path_node_points[i+17] = path_node_array[p_n_count+1].p1Y;
    }
 
    //The last node on the array is alway the current node (when creating paths) otherwise
        path_vp_vbo = create_vbo(path_node_points);
	path_v_count = path_node_points.length/3;
        
    	gl.disable (gl.CULL_FACE); // enable culling
    	gl.useProgram (path_shader);
	
	gl.enableVertexAttribArray (0);
	gl.disableVertexAttribArray (1);
	
	gl.bindBuffer (gl.ARRAY_BUFFER, path_vp_vbo);
	gl.vertexAttribPointer (0, 3, gl.FLOAT, false, 0, 0);
	//@todo-for each zone...
	// render one zone for the minute
	//gl.uniformMatrix4fv (zone_M_loc, false, transpose_mat4 (zone_a_M));
	gl.uniformMatrix4fv (path_V_loc, false, transpose_mat4 (g_cam.mViewMat));
	gl.uniformMatrix4fv (path_P_loc, false, transpose_mat4 (g_cam.mProjMat));

        //gl.uniform4f (zone_colour_loc, 0.2, 0.2, 0.2, 1.0);
        gl.drawArrays (gl.TRIANGLES, 0, path_v_count);

	gl.enable (gl.CULL_FACE); // enable culling

}