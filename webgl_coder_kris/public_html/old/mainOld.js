/*

TODO
1. get attrib location()  because it is messing it up between 0 and 1
2. diagonal move speed is too fast
3. turn around camera
4. further tidy up
5. RAY vs PLANE with coords or RAY vs SPHERE or COLOUR


NOTE
flicker geometry on firefox - gl.clear was missing depth buffer bit
*/

var gl = undefined; // webgl context

var vp_vbo_idx = undefined;
var vn_vbo_idx = undefined;
var grid_vp_vbo_idx = undefined;
var grid_vt_vbo_idx = undefined;
var zone_vp_vbo_idx = undefined;
var g_zone_pos = [0,0,0];
var g_zone_model_mat = identity_mat4 ();
var g_zone_is_being_built = false;
var g_mouse_x = 0;
var g_mouse_y = 0;
var g_cam = undefined;

var g_shader;
var g_grid_shader;
var grid_texture;
var grid_model_mat_loc;
var grid_view_mat_loc;
var grid_proj_mat_loc;
var grid_sampler_loc;
var g_zone_shader;
var zone_model_mat_loc;
var zone_view_mat_loc;
var zone_proj_mat_loc;

var g_sensor_shader;
var g_sensor_model_mat_loc;
var g_sensor_view_mat_loc;
var g_sensor_proj_mat_loc;
var sensor_vp_vbo_idx;
var sensor_vn_vbo_idx;
var sensor_point_count;
var g_sensor_colour_loc;

var g_last_time; // timer reference

// mesh data
var array_of_points = new Array();
var normals_array = new Array ();
var point_count = 0;

var model_mat_loc;
var view_mat_loc;
var proj_mat_loc;

// start programme here
function main () {
  init (); // initialise

	gl.depthFunc (gl.LESS);
	gl.enable (gl.DEPTH_TEST);
	gl.cullFace (gl.BACK);
	gl.frontFace (gl.CCW);
	gl.enable (gl.CULL_FACE); // enable culling
	gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // 1 minus alpha is what we want

  g_last_time = (new Date).getTime ();
  update (); // draw geometry
}

// draw with shaders and vertex buffers
function render () {
	gl.clear (gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); // wipe canvas to background colour

	gl.enable (gl.CULL_FACE); // enable culling
	// draw the grid
	gl.enable (gl.BLEND); // enable transp
  g_grid_shader.use (gl);
  gl.enableVertexAttribArray (0);
  gl.enableVertexAttribArray (1);
  gl.bindBuffer (gl.ARRAY_BUFFER, grid_vp_vbo_idx); // switch to this vertex buffer
  gl.vertexAttribPointer (0, 3, gl.FLOAT, false, 0, 0); // use its data for zeroth shader attribute
  gl.bindBuffer (gl.ARRAY_BUFFER, grid_vt_vbo_idx); // switch to this vertex buffer
  gl.vertexAttribPointer (1, 2, gl.FLOAT, false, 0, 0); // use its data for zeroth shader attribute
  gl.drawArrays (gl.TRIANGLES, 0, 6); // draw the geometry
	gl.disable (gl.BLEND);

	// draw the main model 
  g_shader.use (gl);
  gl.enableVertexAttribArray (0);
  gl.enableVertexAttribArray (1);
  gl.bindBuffer (gl.ARRAY_BUFFER, vp_vbo_idx); // switch to this vertex buffer
  gl.vertexAttribPointer (1, 3, gl.FLOAT, false, 0, 0); // use its data for zeroth shader attribute
  gl.bindBuffer (gl.ARRAY_BUFFER, vn_vbo_idx); // switch to this vertex buffer
  gl.vertexAttribPointer (0, 3, gl.FLOAT, false, 0, 0); // use its data for zeroth shader attribute
  gl.drawArrays (gl.TRIANGLES, 0, point_count / 3); // draw the geometry
  gl.disableVertexAttribArray (1);
  
  // draw zones
  gl.enable (gl.BLEND); // enable transp
  gl.disable (gl.CULL_FACE); // disable culling, so they can be dragged negatively too
  g_zone_shader.use (gl);
  gl.enableVertexAttribArray (0);
  gl.bindBuffer (gl.ARRAY_BUFFER, zone_vp_vbo_idx); // switch to this vertex buffer
  gl.vertexAttribPointer (0, 3, gl.FLOAT, false, 0, 0); // use its data for zeroth shader attribute
  gl.drawArrays (gl.TRIANGLES, 0, 6); // draw the geometry
  
  // draw the sensors
  gl.enable (gl.CULL_FACE); // enable culling
  g_sensor_shader.use (gl);
  gl.enableVertexAttribArray (0);
  gl.bindBuffer (gl.ARRAY_BUFFER, sensor_vp_vbo_idx);
  gl.vertexAttribPointer (1, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray (1);
  gl.bindBuffer (gl.ARRAY_BUFFER, sensor_vn_vbo_idx); // switch to this vertex buffer
  gl.vertexAttribPointer (0, 3, gl.FLOAT, false, 0, 0); // use its data for zeroth shader attribute
  gl.drawArrays (gl.TRIANGLES, 0, sensor_point_count); // draw the geometry
  gl.disable (gl.BLEND);
}
