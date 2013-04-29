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

function draw_path(){

    var set_z = 0;
    var path_width = 1.0;

    path_node_points = new Array();
    //console.log(path_node_array.length);
    //var array_length = 0;
    for(var j = 0;  j< path_node_array.length; j++){
        //console.log("path_node_array at position: " + j + " has length: "+ path_node_array[j].length);
        for(var i = 0;  i< (path_node_array[j].length - 1)*18; i=i+18){
            p_n_count = i/18;
            // a
            path_node_points.push (path_node_array[j][p_n_count].p1X);
            path_node_points.push (set_z); // bottom
            path_node_points.push (path_node_array[j][p_n_count].p1Y);
            // b.just vertically up 1m from a
            path_node_points.push (path_node_array[j][p_n_count].p1X);
            path_node_points.push (path_width); // top
            path_node_points.push (path_node_array[j][p_n_count].p1Y);
            // c 
            path_node_points.push (path_node_array[j][p_n_count + 1].p1X);
            path_node_points.push (path_width); // top
            path_node_points.push (path_node_array[j][p_n_count + 1].p1Y);
            // d is just c again
            path_node_points.push (path_node_array[j][p_n_count + 1].p1X);
            path_node_points.push (path_width); // top
            path_node_points.push (path_node_array[j][p_n_count + 1].p1Y);
            // e is a new vertex, just vertically down from d
            path_node_points.push (path_node_array[j][p_n_count + 1].p1X);
            path_node_points.push (set_z); // top
            path_node_points.push (path_node_array[j][p_n_count + 1].p1Y);
            // f is just a again
            path_node_points.push (path_node_array[j][p_n_count].p1X);
            path_node_points.push (set_z); // bottom
            path_node_points.push (path_node_array[j][p_n_count].p1Y);
        }
        //array_length = path_node_points.length;
    }
//    if(path_node_array.length!=0){
//        console.log(path_node_array[path_node_array.length-1][path_node_array[path_node_array.length-1].length-1].p1X);
//    }
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

function draw_current_path(){

    current_path_node_points = new Array();
    var set_z = 0.0;
    var path_width = 1.0;

    for(var i = 0;  i< (current_path_node_array.length-1)*18; i=i+18){
        p_n_count = i/18;
        current_path_node_points.push (current_path_node_array[p_n_count].p1X);
        current_path_node_points.push (set_z); // bottom
        current_path_node_points.push (current_path_node_array[p_n_count].p1Y);
        console.log(current_path_node_points[0]);
        // b.just vertically up 1m from a
        current_path_node_points.push (current_path_node_array[p_n_count].p1X);
        current_path_node_points.push (path_width); // top
        current_path_node_points.push (current_path_node_array[p_n_count].p1Y);
        // c 
        current_path_node_points.push (current_path_node_array[p_n_count + 1].p1X);
        current_path_node_points.push (path_width); // top
        current_path_node_points.push (current_path_node_array[p_n_count + 1].p1Y);
        // d is just c again
        current_path_node_points.push (current_path_node_array[p_n_count + 1].p1X);
        current_path_node_points.push (path_width); // top
        current_path_node_points.push (current_path_node_array[p_n_count + 1].p1Y);
        // e is a new vertex, just vertically down from d
        current_path_node_points.push (current_path_node_array[p_n_count + 1].p1X);
        current_path_node_points.push (set_z); // top
        current_path_node_points.push (current_path_node_array[p_n_count + 1].p1Y);
        // f is just a again
        current_path_node_points.push (current_path_node_array[p_n_count].p1X);
        current_path_node_points.push (set_z); // bottom
        current_path_node_points.push (current_path_node_array[p_n_count].p1Y);
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
