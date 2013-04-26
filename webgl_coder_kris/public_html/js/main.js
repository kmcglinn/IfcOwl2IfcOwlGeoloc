//Create all global variables

var normals_vs_url = "shaders/basic_vs.glsl";
var normals_fs_url = "shaders/basic_fs.glsl";
var walls_xml_url = "cad_xml/smart_homes_cad.xml";
var ssao_vs_url = "shaders/ssao_quad_vs.glsl";
var ssao_fs_url = "shaders/ssao_quad_fs.glsl";
var depth_vs_url = "shaders/depth_vs.glsl";
var depth_fs_url = "shaders/depth_fs.glsl";
var blur_vs_url = "shaders/blur_vs.glsl";
var blur_fs_url = "shaders/blur_fs.glsl";
var phong_vs_url = "shaders/phong_vs.glsl";
var phong_fs_url = "shaders/phong_fs.glsl";

var zone_vs_url = "shaders/zone_vs.glsl";
var zone_fs_url = "shaders/zone_fs.glsl";

var path_vs_url = "shaders/zone_vs.glsl";
var path_fs_url = "shaders/zone_fs.glsl";

var enable_only_phong = false;
var enable_phong = true;
var enable_ssao = true;
var enable_blur = true;

var g_canvas; //stores canvas id
var gl = undefined; // webgl context
var g_cam;
var camera_pos;
var g_ground_plane_vp_vbo, g_ground_plane_vn_vbo;

var mouse_x;
var mouse_y;

//Stuff for zone
var can_draw_activity_zones = true;
var zone_vp_vbo_idx = undefined;
var g_zone_pos = [0,0,0];
var g_zone_model_mat = identity_mat4 ();
var g_zone_shader;

//Store for mouse
var g_mouse_x = 0;
var g_mouse_y = 0;
// variables used in update ()
var g_step_time_accum = 0.0;
var step_size = 0.02;
var currentlyPressedKeys = {};
var fps_counter = 0;
var fps_accum = 0;
var g_last_time;
var updateMove = true;

var phong_shader;
var phong_proj_mat_loc;
var phong_view_mat_loc;
var phong_vp_loc;
var phong_vn_loc;
var phong_fb;
var phong_fb_texture;

var zone_shader;
var zone_vp_loc;
var zone_vn_loc;
var zone_P_loc;
var zone_V_loc;
var zone_M_loc;
var zone_colour_loc;

var zone_vp_vbo = 0;
var zone_vn_vbo = 0;
var zone_v_count = 0;
var zone_a_M = translate_mat4 (identity_mat4 (), [-47.65, 4.0, 3.52]);
var zone_c_M = translate_mat4 (identity_mat4 (), [-47.65, 4.0, 5.52]);
var zone_b_M = translate_mat4 (identity_mat4 (), [-56.24, 4.0, 5.92]);
var zone_d_M = translate_mat4 (identity_mat4 (), [-54.24, 4.0, 5.92]);

var path_shader;
var path_vp_loc;
var path_vn_loc;
var path_P_loc;
var path_V_loc;
var path_M_loc;
var path_colour_loc;

var path_vp_vbo = 0;
var path_vn_vbo = 0;
var path_v_count = 0;

// shader programme index
var normals_shader = undefined;
// locations of attributes in shader programme
var normals_vp_loc;
var normals_vn_loc;
// locations of uniforms in shader programme
var normals_view_mat_loc;
var normals_proj_mat_loc;
// FRAMEBUFFER FOR NORMALS
var g_normals_framebuffer;
var g_normals_fb_texture;

var ss_quad_vp_vbo;
var ss_quad_vt_vbo;
var ssao_shader;
var ssao_vp_loc;
var ssao_vt_loc;
var ssao_inv_proj_mat_loc;
var ssao_tex_loc;
var ssao_depth_tex_loc;
var g_ssao_fb;
var g_ssao_fb_texture;

var g_depth_framebuffer;
var g_depth_fb_texture;
var depth_shader;
var depth_vp_loc;
var depth_view_mat_loc;
var depth_proj_mat_loc;


var blur_shader;
var blur_vp_loc;
var blur_vt_loc;
var blur_ssao_texture_loc;
var blur_phong_texture_loc;


/*
 * 
 * @Kris Code
 * Function to load in zones from ontology
 */
var can_create_zone = false; //This must be set to true to draw a new zone.
var can_select_zone = false; //This is set when 
var can_create_path = false; //This is set to true when a zone has been selected and the key (c) has been pressed
var zone_selected = false; //this is set to true when a zone has been selected (pressing xand clicking)
var path_connected = false; //this is set when a path is being created and the mouse goes over an existing path so that it selects the zones origin.
var can_save_path = false; //this is set when the path is connected to a zone aso that you san save the path

var g_zone_is_being_built = false; //
var zone_points = new Array(); //stores all the vertices of the zones
var current_path_node_points = new Array(); //stores all the vertices of the path nodes
var path_node_points = new Array();


var zone_activity_array = new Array();
var current_activity_zone = new Zone('Activity', 0, 0,0,0,  0,0,0); //Create an empty zone for the current zone
zone_activity_array.push(current_activity_zone); //The first object in the array stores a reference to the (current) zone which is currently being drawn.

var current_path_node_array = new Array();
var path_node_array = new Array();

var previous_path_node = new PathNode();
var current_path_node = new PathNode();

/*
 * 
 * @Kris-Code
 * "Zone" class
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
function PathNode(id, p1X, p1Y, p1Z, activity_zone_id){
    
    this.id = id;
    this.p1X = p1X;
    this.p1Y = p1Y;
    this.p1Z = p1Z;
    this.activity_zone_id = activity_zone_id;
        
}

PathNode.prototype.getInfo = function(){
    
        return 'Zone type: ' + this.type + '. Zone id: ' + this.id + 'Position 1 x, y, z: ' + this.p1X + ' : ' + this.p1Y + ' : ' + this.p1Z ;
        
}


// @end-Kris-Code


function render() {

	if (enable_phong) {
		if (enable_only_phong) {
			gl.bindFramebuffer (gl.FRAMEBUFFER, null);
		} else {
			gl.bindFramebuffer (gl.FRAMEBUFFER, phong_fb);
		}
		gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.useProgram (phong_shader);
		gl.enableVertexAttribArray (0);
		gl.enableVertexAttribArray (1);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_ground_plane_vp_vbo);
		gl.vertexAttribPointer (phong_vp_loc, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_ground_plane_vn_vbo);
		gl.vertexAttribPointer (phong_vn_loc, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays (gl.TRIANGLES, 0, 6);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_walls_vp_vbo);
		gl.vertexAttribPointer (phong_vp_loc, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_walls_vn_vbo);
		gl.vertexAttribPointer (phong_vn_loc, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays (gl.TRIANGLES, 0, g_walls_point_count);
                
                if (can_draw_activity_zones){
                    draw_activity_zones();
                    draw_current_path();
                    //draw_path();
                 
                }
	}
	
	if (enable_only_phong) {
		return true;
	}
       
	if (enable_ssao) {
		// DEPTH CAPTURE PASS in 24-bit packed texture
		gl.bindFramebuffer (gl.FRAMEBUFFER, g_depth_framebuffer);
		gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.useProgram (depth_shader);
		gl.enableVertexAttribArray (0);
		gl.disableVertexAttribArray (1);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_ground_plane_vp_vbo);
		gl.vertexAttribPointer (depth_vp_loc, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays (gl.TRIANGLES, 0, 6);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_walls_vp_vbo);
		gl.vertexAttribPointer (depth_vp_loc, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays (gl.TRIANGLES, 0, g_walls_point_count);
	
		// NORMALS CAPTURE PASS - WRITE NORMALS AND DEPTH TO A TEXTURE
		gl.bindFramebuffer (gl.FRAMEBUFFER, g_normals_framebuffer);
		gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.useProgram (normals_shader);
		gl.enableVertexAttribArray (0);
		gl.enableVertexAttribArray (1);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_ground_plane_vp_vbo);
		gl.vertexAttribPointer (normals_vp_loc, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_ground_plane_vn_vbo);
		gl.vertexAttribPointer (normals_vn_loc, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays (gl.TRIANGLES, 0, 6);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_walls_vp_vbo);
		gl.vertexAttribPointer (normals_vp_loc, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer (gl.ARRAY_BUFFER, g_walls_vn_vbo);
		gl.vertexAttribPointer (normals_vn_loc, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays (gl.TRIANGLES, 0, g_walls_point_count);
	
		// SSAO PASS
		gl.bindFramebuffer (gl.FRAMEBUFFER, null);
		if (enable_blur) {
			gl.bindFramebuffer (gl.FRAMEBUFFER, g_ssao_fb);
		}
		gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.useProgram (ssao_shader);
		gl.enableVertexAttribArray (0);
		gl.enableVertexAttribArray (1);
		gl.activeTexture (gl.TEXTURE0);
		gl.bindTexture (gl.TEXTURE_2D, g_normals_fb_texture);
		gl.activeTexture (gl.TEXTURE1);
		gl.bindTexture (gl.TEXTURE_2D, g_depth_fb_texture);
		gl.bindBuffer (gl.ARRAY_BUFFER, ss_quad_vp_vbo);
		gl.vertexAttribPointer (ssao_vp_loc, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer (gl.ARRAY_BUFFER, ss_quad_vt_vbo);
		gl.vertexAttribPointer (ssao_vt_loc, 2, gl.FLOAT, false, 0, 0);
		gl.drawArrays (gl.TRIANGLES, 0, 6);
	}
	
	// BLUR PASS
	if (enable_blur) {
		gl.bindFramebuffer (gl.FRAMEBUFFER, null);
		gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
		gl.useProgram (blur_shader);
		gl.enableVertexAttribArray (0);
		gl.enableVertexAttribArray (1);
	
		gl.activeTexture (gl.TEXTURE0);
		gl.bindTexture (gl.TEXTURE_2D, g_ssao_fb_texture);
		gl.activeTexture (gl.TEXTURE1);
		gl.bindTexture (gl.TEXTURE_2D, phong_fb_texture);
	
		gl.bindBuffer (gl.ARRAY_BUFFER, ss_quad_vp_vbo);
		gl.vertexAttribPointer (blur_vp_loc, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer (gl.ARRAY_BUFFER, ss_quad_vt_vbo);
		gl.vertexAttribPointer (blur_vt_loc, 2, gl.FLOAT, false, 0, 0);
		gl.drawArrays (gl.TRIANGLES, 0, 6);
  }
    

        
        //g_zone_shader.use (gl);
	
	return true;
}

function get_mouse_coords(event){
    
    var element = g_canvas;
    var top = 0;
    var left = 0;
    while (element && element.tagName != 'BODY')
    {
            top += element.offsetTop;
            left += element.offsetLeft;
            element = element.offsetParent;
    }
    // adjust for scrolling
    left += window.pageXOffset;
    top -= window.pageYOffset;
    mouse_x = event.clientX - left;
    mouse_y = (event.clientY - top);
    // sometimes range is a few pixels too big
    if (mouse_x >= gl.viewportWidth) 
    {
            return;
    }
    if (mouse_y >= gl.viewportHeight) 
    {
            return;
    }
    
}



function main () {
	if (!init ()) {
		console.error ("error initialising");
		return;
	}
	g_last_time = (new Date).getTime ();
	console.log ("starting main loop");
	if (!update ()) {
		console.error ("error updating scene");
	}
}


function state_booleans(){
    
    console.log("can_create_zone: " + can_create_zone);
    console.log("can_select_zone: " + can_select_zone);
    console.log("can_create_path: " + can_create_path);
    console.log("zone_selected: " + zone_selected);
    console.log("path_connected: " + path_connected);
    console.log("can_save_path: " + can_save_path);
    console.log("g_zone_is_being_built: " + g_zone_is_being_built);   
   
}