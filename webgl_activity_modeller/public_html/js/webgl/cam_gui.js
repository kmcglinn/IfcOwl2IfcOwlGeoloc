/*

This file has functions and variable for rendering click-able GUI panels to the
view for controlling the camera movement and rotation

The main functions to call are:

1) init_gui ();

call before the main loop to load images etc. if it is called after where the
mouse is set up in the code then it will add in any missing mouse functions.

2) update_gui_clicks (seconds);

call inside the main loop. the parameter should be the seconds in the loop i.e.
the time-step of the loop iteration. if it's actual timer seconds since last
update (i.e. inconsistent/not real time steps) then you'll get jerky movements.
this function returns true if camera matrices should be updated i.e.

	update_move = update_gui_clicks (time_step);
	...
	other keyboard input etc. here
	...
	if (update_move) {....shader uniforms updated here...}

The function also expects there to be a camera object called g_cam from the
camera.js file

3) render_gui ();

call this every drawing loop AFTER drawing the rest of the scene, to make sure
that it's always drawn on top

First version - Wed 22 May 2013 Anton Gerdelan <gerdela@scss.tcd.ie>
*/

// gui panel vertex buffer for points
var g_med_panel_vp_vbo;
// gui panel vertex buffer for texture coordinates
var g_med_panel_vt_vbo;
// shader programme for gui
var g_panel_sp;
// location of vertex point attribute in shader
var g_panel_sp_vp_loc;
// location of texture coordinate attribute in shader
var g_panel_sp_vt_loc;
// location of model matrix uniform in shader
var g_panel_sp_model_mat_loc;
// textures used for the gui panels
var cam_gui_texa, cam_gui_texb, cam_gui_texc, cam_gui_texd;

// if the mouse button is held down or has been released
var g_mouse_down = false;
// if the height gui knob is being clicked-and-dragged. allows it to be dragged
// as expected when mouse moves up and down, even if mouse cursor is no longer
// over the widget
var g_height_clicky_held_down = false;

function _init_mouse () {
	document.onmousedown = function (event) {
		g_mouse_down = true;
	
		var element = g_canvas;
		var top = 0;
		var left = 0;
		while (element && element.tagName != 'BODY')	{
				    top += element.offsetTop;
				    left += element.offsetLeft;
				    element = element.offsetParent;
		}
		// adjust for scrolling
		left += window.pageXOffset;
		top -= window.pageYOffset;
		g_mouse_x = event.clientX - left;
		g_mouse_y = (event.clientY - top);
		// sometimes range is a few pixels too big
		if (g_mouse_x >= g_canvas.width) {
			return;
		}
		if (g_mouse_y >= g_canvas.height) {
			return;
		}
		//console.log ("mouse " + g_mouse_x + ", " + g_mouse_y);
	}

	g_canvas.onmousemove = function (event) {
		if (!g_mouse_down) {
			return;
		}
		var element = g_canvas;
		var top = 0;
		var left = 0;
		while (element && element.tagName != 'BODY') {
			top += element.offsetTop;
			left += element.offsetLeft;
			element = element.offsetParent;
		}
		// adjust for scrolling
		left += window.pageXOffset;
		top -= window.pageYOffset;
		g_mouse_x = event.clientX - left;
		g_mouse_y = (event.clientY - top);
		// sometimes range is a few pixels too big
		if (g_mouse_x >= g_canvas.width) {
			return;
		}
		if (g_mouse_y >= g_canvas.height) {
			return;
		}
		//console.log ("mouse " + g_mouse_x + ", " + g_mouse_y);
	}

	document.onmouseup = function (event) {
		g_mouse_down = false;
		g_height_clicky_held_down = false;
	}
}

// initialise the gui vertex buffers, textures, shaders
function init_gui () {
	console.log ("initialising GUI");
	
	// create buffers vp and vt
	var med_panel_vp = [
		-128 / g_canvas.width, 128 / g_canvas.height,
		-128 / g_canvas.width, -128 / g_canvas.height,
		 128 / g_canvas.width, -128 / g_canvas.height,
		 128 / g_canvas.width, -128 / g_canvas.height,
		 128 / g_canvas.width, 128 / g_canvas.height,
		-128 / g_canvas.width, 128 / g_canvas.height
	];
	var med_panel_vt = [
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,
		0.0, 0.0
	];
	g_med_panel_vp_vbo = create_vbo (med_panel_vp);
	g_med_panel_vt_vbo = create_vbo (med_panel_vt);
	
	// shader
	g_panel_sp = load_shaders ("js/webgl/shaders/gui_vs.glsl", "js/webgl/shaders/gui_fs.glsl");
	g_panel_sp_vp_loc = gl.getAttribLocation (g_panel_sp, "vp");
	g_panel_sp_vt_loc = gl.getAttribLocation (g_panel_sp, "vt");
	g_panel_sp_model_mat_loc = gl.getUniformLocation (g_panel_sp, "model_mat");
	gl.useProgram (g_panel_sp);
	gl.uniformMatrix4fv (g_panel_sp_model_mat_loc, false, identity_mat4 ());
	
	// textures
	var imga = new Image ();
	var imgb = new Image ();
	var imgc = new Image ();
	var imgd = new Image ();
	cam_gui_texa = gl.createTexture ();
	cam_gui_texb = gl.createTexture ();
	cam_gui_texc = gl.createTexture ();
	cam_gui_texd = gl.createTexture ();
	imga.onload = function () {
		gl.bindTexture (gl.TEXTURE_2D, cam_gui_texa);
		gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imga);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	}
	imga.src = "img/rotate_gui.png";
	imgb.onload = function () {
		gl.bindTexture (gl.TEXTURE_2D, cam_gui_texb);
		gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgb);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	}
	imgb.src = "img/move_gui.png";
	imgc.onload = function () {
		gl.bindTexture (gl.TEXTURE_2D, cam_gui_texc);
		gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgc);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	}
	imgc.src = "img/height_gui.png";
	imgd.onload = function () {
		gl.bindTexture (gl.TEXTURE_2D, cam_gui_texd);
		gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgd);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	}
	imgd.src = "img/height_knot_gui.png";
	
	_init_mouse ();
	
	console.log ("GUI initialised");
}

// check if a user has clicked on something and respond appropriately
function update_gui_clicks (seconds) {
	if (g_mouse_down) {
		var camMove = [0, 0, 0];
		var camspeed = 20.0;
	
		// height bar
		if (g_height_clicky_held_down || g_mouse_x <= 32 &&
			g_mouse_y >= g_canvas.height - 256) {
			
			g_height_clicky_held_down = true;
			var height_fac = 1.0 - (g_mouse_y - (g_canvas.height - 256)) / 256;
			var h = height_fac * 100.0;
			if (h > 100.0) {
				h = 100.0;
			}
			if (h < 0.0) {
				h = 0.0;
			}
			g_cam.setPos ([g_cam.mWC_Pos[0], h, g_cam.mWC_Pos[2]]);
			updateMove = true;
		
		// directional arrows
		} else if (g_mouse_x >= 32 && g_mouse_x < (32 + 128) &&
			g_mouse_y >= g_canvas.height - 128) {
			
			// fwd and back
			if (g_mouse_x >= (32 + 48) && g_mouse_x < (32 + 128 - 48)) {
				// fwd
				if (g_mouse_y < g_canvas.height - 128 + 48) {
					camMove[2] = -1.0 * camspeed * step_size;
					g_cam.move_cam_relative_forward_by (camMove);
					updateMove = true;
				
				// back
				} else if (g_mouse_y >= g_canvas.height - 48) {
					camMove[2] = 1.0 * camspeed * step_size;
					g_cam.move_cam_relative_forward_by (camMove);
					updateMove = true;
				
				// reset diamond thingy (placeholder)
				} else {
				
				}
			
			// left and right
			} else if (g_mouse_y >= g_canvas.height - 96 &&
				g_mouse_y < g_canvas.height - 48) {
				// left
				if (g_mouse_x < 32 + 48) {
					camMove[0] = -1.0 * camspeed * step_size;
					g_cam.move_cam_relative_sideways_by (camMove);
					updateMove = true;
					
				// right
				} else {
					camMove[0] = 1.0 * camspeed * step_size;
					g_cam.move_cam_relative_sideways_by (camMove);
					updateMove = true;
				}
			} // end of fwd and back, l&r
			
		// rotate clicky in bottom right-hand corner
		} else if (	g_mouse_x >= g_canvas.width - 128 &&
			g_mouse_y >= g_canvas.height - 128) {
			// pitch up and down
			if (g_mouse_x >= g_canvas.width - 96 &&
				g_mouse_x < g_canvas.width - 32) {
				// pitch down
				if (g_mouse_y < g_canvas.height - 96) {
					g_cam.change_attitude (40.0, seconds);
					updateMove = true;
				// pitch up
				} else if (g_mouse_y >= g_canvas.height - 32) {
					g_cam.change_attitude (-40.0, seconds);
					updateMove = true;
				}
				
			// yaw left yaw right. we know that mouse_x is in zone by now
			} else if (g_mouse_y >= g_canvas.height - 96 &&
				g_mouse_y < g_canvas.height - 32) {
				// yaw clock-wise
				if (g_mouse_x < g_canvas.width - 96) {
					g_cam.change_heading (40.0, seconds);
					updateMove = true;
				// we know for sure that yaw ccw is the last remaining part to click
				} else {
					g_cam.change_heading (-40.0, seconds);
					updateMove = true;
				}
			} // end pitch/yaw
		} // end clicky pitchy rotatey
	} // end mousedown
}

// render gui panels
function render_gui () {
	// disable depth testing to make GUI always on top of scenery
	gl.disable (gl.DEPTH_TEST);
	// enable semi-transparency
	gl.enable (gl.BLEND);
	// use shader programme for GUI
  gl.useProgram (g_panel_sp);
  
  // use the panel vertex buffers. this is a square that is resized and
  // positioned for each panel by using a matrix uniform
  gl.bindBuffer (gl.ARRAY_BUFFER, g_med_panel_vp_vbo);
  gl.vertexAttribPointer (g_panel_sp_vp_loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer (gl.ARRAY_BUFFER, g_med_panel_vt_vbo);
  gl.vertexAttribPointer (g_panel_sp_vt_loc, 2, gl.FLOAT, false, 0, 0);
  // only one texture is used, so just activate the zeroeth texture slot
  gl.activeTexture (gl.TEXTURE0);
  
  gl.enableVertexAttribArray (g_panel_sp_vp_loc);
  gl.enableVertexAttribArray (g_panel_sp_vt_loc);
  
  // first panel (rotation in bottom-right)
  var mat = transpose_mat4 (translate_mat4 (
  	identity_mat4 (),
  	[1.0 - 128 / g_canvas.width, -1.0 + 128 / g_canvas.height, 0.0]
  ));
  gl.uniformMatrix4fv (g_panel_sp_model_mat_loc, false, mat);
  gl.bindTexture (gl.TEXTURE_2D, cam_gui_texa);
  gl.drawArrays (gl.TRIANGLES, 0, 6);

  // second panel (movement arrows)
   mat = transpose_mat4 (translate_mat4 (
  	identity_mat4 (),
  	[-1.0 + 192 / g_canvas.width, -1.0 + 128 / g_canvas.height, 0.0]
  ));
  gl.uniformMatrix4fv (g_panel_sp_model_mat_loc, false, mat);
  gl.bindTexture (gl.TEXTURE_2D, cam_gui_texb);
  gl.drawArrays (gl.TRIANGLES, 0, 6);
  
  // third panel (height slider background)
  mat = transpose_mat4 (	translate_mat4 (
   	scale_mat4 (
			identity_mat4 (),
			[0.25, 2.0, 1.0]
  	),
  	[-1.0 + 32 / g_canvas.width, -1.0 + 256 / g_canvas.height, 0.0]
  ));
  gl.uniformMatrix4fv (g_panel_sp_model_mat_loc, false, mat);
  gl.bindTexture (gl.TEXTURE_2D, cam_gui_texc);
  gl.drawArrays (gl.TRIANGLES, 0, 6);
  
  // 4th panel (height slider control knob)
  var height_fac = g_cam.mWC_Pos[1] / 100.0; // 0-100 height range
  mat = transpose_mat4 (	translate_mat4 (
   	scale_mat4 (
			identity_mat4 (),
			[0.25, 0.125, 1.0]
  	),
  	[
  		-1.0 + 32 / g_canvas.width,
  		-1.0 + 8 / g_canvas.height + height_fac * 512 / g_canvas.height,
  		0.0
  	]
  ));
  gl.uniformMatrix4fv (g_panel_sp_model_mat_loc, false, mat);
  gl.bindTexture (gl.TEXTURE_2D, cam_gui_texd);
  gl.drawArrays (gl.TRIANGLES, 0, 6);
  
  gl.disableVertexAttribArray (g_panel_sp_vp_loc);
  gl.disableVertexAttribArray (g_panel_sp_vt_loc);
  
  // set blending and depth testing back to sensible default values
  gl.disable (gl.BLEND);
  gl.enable (gl.DEPTH_TEST);
}
