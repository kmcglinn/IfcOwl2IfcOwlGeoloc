var g_step_time_accum = 0.0;
var step_size = 0.02;
var currentlyPressedKeys = {};
var fps_counter = 0;
var fps_accum = 0;

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
		document.getElementById('fps').innerHTML=fps.toFixed(2);
	}
	
	// compute time steps
	while (g_step_time_accum > step_size) {
		g_step_time_accum -= step_size;
		// update matrix for shader
		
		// enable the shader
		g_shader.use (gl);
		
		
		// TODO there are functions in glmatrix to get the normal matrix
	
		// camera movement
		var camMove = [0, 0, 0];
		var camspeed = 6.0;
		var updateMove = false;
		// keys listed by code: http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants
		if (currentlyPressedKeys[87] == true) { // w
			camMove[2] = -1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
			//g_cam.moveInCamDirBy (camspeed * step_size);
			updateMove = true;
		}
		if (currentlyPressedKeys[83] == true) { // s
			camMove[2] = 1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
			//g_cam.moveInCamDirBy (-camspeed * step_size);
			updateMove = true;
		}
		if (currentlyPressedKeys[65] == true) { // a
			camMove[0] = -1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
			//g_cam.slideCamBy (-camspeed * step_size);
			updateMove = true;
		}
		if (currentlyPressedKeys[68] == true) { // d
			camMove[0] = 1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
			//g_cam.slideCamBy (camspeed * step_size);
			updateMove = true;
		}
		if (currentlyPressedKeys[69] == true) { // d
			camMove[1] = -1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
			updateMove = true;
		}
		if (currentlyPressedKeys[81] == true) { // d
			camMove[1] = 1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
			updateMove = true;
		}
		if (updateMove == true) {
			//g_cam.moveBy (camMove);
			g_shader.use (gl);
			g_shader.setUniformMat4ByLocation (gl, view_mat_loc, transpose_mat4 (g_cam.mViewMat));
			g_grid_shader.use (gl);
			g_grid_shader.setUniformMat4ByLocation (gl, grid_view_mat_loc, transpose_mat4 (g_cam.mViewMat));
			g_zone_shader.use (gl);
			g_zone_shader.setUniformMat4ByLocation (gl, zone_view_mat_loc, transpose_mat4 (g_cam.mViewMat));
			g_sensor_shader.use (gl);
			g_sensor_shader.setUniformMat4ByLocation (gl, g_sensor_view_mat_loc, transpose_mat4 (g_cam.mViewMat));
		}
	}
	// show dragging-out of zone with mouse is still held
	if (g_zone_is_being_built) {
    // recursively get location within parent(s)
    var ray = get_mouse_ray_wor (g_mouse_x, g_mouse_y);
    // plane intersection
		if (ray_plane (ray, g_cam.mWC_Pos, [0, 1, 0], 0)) {
		  var m = scale_mat4 (identity_mat4 (), add_vec3 ([0,0.1,0], sub_vec3 (intersection_point_wor, g_zone_pos)));
		  m = mult_mat4_mat4 (g_zone_model_mat, m);
		  g_zone_shader.use (gl);
			g_zone_shader.setUniformMat4ByLocation (gl, zone_model_mat_loc, transpose_mat4 (m));
		}
	}
	render ();

	var canvas = document.getElementById ("gl_canvas"); // get canvas using DOM
  window.requestAnimFrame(update, canvas);
}
