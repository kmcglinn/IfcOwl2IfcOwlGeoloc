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

var enable_only_phong = false;
var enable_phong = true;
var enable_ssao = true;
var enable_blur = true;

var g_canvas; //stores canvas id
var gl = undefined; // webgl context
var g_cam;

var g_ground_plane_vp_vbo, g_ground_plane_vn_vbo;


var g_zone_is_being_built = false;

//Stuff for zone
var draw_activity_zones = true;
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
/*
 * 
 * @Kris Code
 * Function to load in zones from ontology
 */
var zone_activity_array = new Array();
function load_zones(){
    
    //This code needs to be written
    
}


function createTestZone(){
    //type, id, originX, originY, originZ, width, length, isSquare, height
    zone_activity_array[0] = new Zone('Activity', 12345, 1,1,1,  1,1,  true,  1);
    
}

function init () {
    
        createTestZone();
//        alert(zone_activity_array[0].getInfo());

	g_canvas = document.getElementById ("glcanvas");
	gl = WebGLUtils.setupWebGL (g_canvas);
	if (!gl) {
		console.error ("could not get webgl context");
		return false;
	}
	
	gl.depthFunc (gl.LESS);
	gl.enable (gl.DEPTH_TEST);
	gl.cullFace (gl.BACK);
	gl.frontFace (gl.CCW);
	gl.enable (gl.CULL_FACE); // enable culling
	gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // 1 minus alpha is what we want
	
	gl.clearColor (0.0, 0.0, 0.0, 1.0);
	
	var pos = [-49.44, 75.60, 55.52];
	g_cam = new Camera (45.0, g_canvas.width / g_canvas.height, 0.1, 100.0, pos, [0, -2, -1]);
	
	// SCREEN SPACE QUAD
	var ss_quad_vp = [
		-1, -1, 0,
		 1, -1, 0,
		 1,  1, 0,
		 1,  1, 0,
		-1,  1, 0,
		-1, -1, 0
	];
	var ss_quad_vt = [
		0, 0,
		1, 0,
		1, 1,
		1, 1,
		0, 1,
		0, 0
	];
	ss_quad_vp_vbo = create_vbo (ss_quad_vp);
	ss_quad_vt_vbo = create_vbo (ss_quad_vt);

	// ground plane geometry TODO add normals
	var ground_plane_vp = [
		-100.0, 0.0, -100.0,
		-100.0, 0.0,  100.0,
		 100.0, 0.0,  100.0,
		 100.0, 0.0,  100.0,
		 100.0, 0.0, -100.0,
		-100.0, 0.0, -100.0
	];
	var ground_plane_vn = [
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0
	];
	g_ground_plane_vp_vbo = create_vbo (ground_plane_vp);
	g_ground_plane_vn_vbo = create_vbo (ground_plane_vn);
	
	// PHONG PASS VARIABLES
	phong_shader = load_shaders (phong_vs_url,phong_fs_url); // prepare a shader programme
	phong_proj_mat_loc = gl.getUniformLocation (phong_shader, "proj_mat");
	phong_view_mat_loc = gl.getUniformLocation (phong_shader, "view_mat");
	phong_vp_loc = gl.getAttribLocation (phong_shader, "vp");
	phong_vn_loc = gl.getAttribLocation (phong_shader, "vn");
	phong_fb = gl.createFramebuffer ();
	gl.bindFramebuffer (gl.FRAMEBUFFER, phong_fb);
	phong_fb_texture = gl.createTexture ();
	gl.bindTexture (gl.TEXTURE_2D, phong_fb_texture);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, g_canvas.width, g_canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.framebufferTexture2D (gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, phong_fb_texture, 0);
	var phong_fb_renderbuffer = gl.createRenderbuffer ();
	gl.bindRenderbuffer (gl.RENDERBUFFER, phong_fb_renderbuffer);
	gl.renderbufferStorage (gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, g_canvas.width, g_canvas.height);
	gl.framebufferRenderbuffer (gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, phong_fb_renderbuffer);
	gl.bindTexture (gl.TEXTURE_2D, null); // unbind to avoid read-write feedback horror
	gl.bindRenderbuffer (gl.RENDERBUFFER, null); // unbind to avoid read-write feedback horror
	gl.bindFramebuffer (gl.FRAMEBUFFER, null); // unbind to render back to default buffer
	
	// DEPTH PASS VARIABLES	
	depth_shader = load_shaders (depth_vs_url, depth_fs_url); // prepare a shader programme
	depth_vp_loc = gl.getAttribLocation (depth_shader, "vp");
	depth_view_mat_loc = gl.getUniformLocation (depth_shader, "view_mat");
	depth_proj_mat_loc = gl.getUniformLocation (depth_shader, "proj_mat");
	// DEPTH FB
	g_depth_framebuffer = gl.createFramebuffer ();
	gl.bindFramebuffer (gl.FRAMEBUFFER, g_depth_framebuffer);
	g_depth_fb_texture = gl.createTexture ();
	gl.bindTexture (gl.TEXTURE_2D, g_depth_fb_texture);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// null (last param) means load no data in yet. it still allocates space though. 
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, g_canvas.width, g_canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.framebufferTexture2D (gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, g_depth_fb_texture, 0);
	// same dimensions as colour buffer TODO can i make this 16 a 32?
	var depth_fb_renderbuffer = gl.createRenderbuffer ();
	gl.bindRenderbuffer (gl.RENDERBUFFER, depth_fb_renderbuffer);
	gl.renderbufferStorage (gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, g_canvas.width, g_canvas.height);
	gl.framebufferRenderbuffer (gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth_fb_renderbuffer);
	gl.bindTexture (gl.TEXTURE_2D, null); // unbind to avoid read-write feedback horror
	gl.bindRenderbuffer (gl.RENDERBUFFER, null); // unbind to avoid read-write feedback horror
	gl.bindFramebuffer (gl.FRAMEBUFFER, null); // unbind to render back to default buffer
	
	// NORMALS PASS VARIABLES
	normals_shader = load_shaders (normals_vs_url, normals_fs_url); // prepare a shader programme
	vp_loc = gl.getAttribLocation (normals_shader, "vp");
	vn_loc = gl.getAttribLocation (normals_shader, "vn");
	view_mat_loc = gl.getUniformLocation (normals_shader, "view_mat");
	proj_mat_loc = gl.getUniformLocation (normals_shader, "proj_mat");
	// fb
	g_normals_framebuffer = gl.createFramebuffer ();
	gl.bindFramebuffer (gl.FRAMEBUFFER, g_normals_framebuffer);
	// create texture to attach
	g_normals_fb_texture = gl.createTexture ();
	gl.bindTexture (gl.TEXTURE_2D, g_normals_fb_texture);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// null (last param) means load no data in yet. it still allocates space though. 
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, g_canvas.width, g_canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.framebufferTexture2D (gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, g_normals_fb_texture, 0);
	// create and attach depth buffer
	var renderbuffer = gl.createRenderbuffer ();
	gl.bindRenderbuffer (gl.RENDERBUFFER, renderbuffer);
	// same dimensions as colour buffer TODO can i make this 16 a 32?
	gl.renderbufferStorage (gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, g_canvas.width, g_canvas.height);
	gl.framebufferRenderbuffer (gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
	gl.bindTexture (gl.TEXTURE_2D, null); // unbind to avoid read-write feedback horror
	gl.bindRenderbuffer (gl.RENDERBUFFER, null); // unbind to avoid read-write feedback horror
	gl.bindFramebuffer (gl.FRAMEBUFFER, null); // unbind to render back to default buffer
	
	// SSAO shader
	ssao_shader = load_shaders (ssao_vs_url, ssao_fs_url); // prepare a shader programme
	ssao_vp_loc = gl.getAttribLocation (ssao_shader, "vp");
	ssao_vt_loc = gl.getAttribLocation (ssao_shader, "vt");
	ssao_inv_proj_mat_loc = gl.getUniformLocation (ssao_shader, "inv_proj_mat");
	ssao_tex_loc = gl.getUniformLocation (ssao_shader, "tex");
	ssao_depth_tex_loc = gl.getUniformLocation (ssao_shader, "depth_tex");
	gl.useProgram (ssao_shader);
	gl.uniform1i (ssao_tex_loc, 0);
	gl.uniform1i (ssao_depth_tex_loc, 1);
	// fb
	g_ssao_fb = gl.createFramebuffer ();
	gl.bindFramebuffer (gl.FRAMEBUFFER, g_ssao_fb);
	g_ssao_fb_texture = gl.createTexture ();
	gl.bindTexture (gl.TEXTURE_2D, g_ssao_fb_texture);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// null (last param) means load no data in yet. it still allocates space though. 
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, g_canvas.width, g_canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.framebufferTexture2D (gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, g_ssao_fb_texture, 0);
	// same dimensions as colour buffer TODO can i make this 16 a 32?
	var ssao_fb_renderbuffer = gl.createRenderbuffer ();
	gl.bindRenderbuffer (gl.RENDERBUFFER, ssao_fb_renderbuffer);
	gl.renderbufferStorage (gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, g_canvas.width, g_canvas.height);
	gl.framebufferRenderbuffer (gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ssao_fb_renderbuffer);
	gl.bindTexture (gl.TEXTURE_2D, null); // unbind to avoid read-write feedback horror
	gl.bindRenderbuffer (gl.RENDERBUFFER, null); // unbind to avoid read-write feedback horror
	gl.bindFramebuffer (gl.FRAMEBUFFER, null); // unbind to render back to default buffer

	// BLUR PASS VARIABLES
	blur_shader = load_shaders (blur_vs_url, blur_fs_url); // prepare a shader programme
	blur_vp_loc = gl.getAttribLocation (blur_shader, "vp");
	blur_vt_loc = gl.getAttribLocation (blur_shader, "vt");
	blur_ssao_texture_loc = gl.getUniformLocation (blur_shader, "ssao_tex");
	blur_phong_texture_loc = gl.getUniformLocation (blur_shader, "phong_tex");
	gl.useProgram (blur_shader);
	gl.uniform1i (blur_ssao_texture_loc, 0);
	gl.uniform1i (blur_phong_texture_loc, 1);
	
	if (!create_walls_from_xml (walls_xml_url)) {
		console.error ("error creating walls from xml, url: " + walls_xml_url);
	}
	//init_zone ();
	// BOM callbacks
	// add keyboard handling callbacks
	document.onkeydown = function (event) {
		currentlyPressedKeys[event.keyCode] = true;
	}
	document.onkeyup = function (event) {
		currentlyPressedKeys[event.keyCode] = false;
	}
        
        	// add mouse clicks - but only when inside canvas area
	g_canvas.onmousedown = function (event) {
                //alert("Mouse down...MOUSE DOWN!")
		// if mouse held don't keep restarting this
		if (g_zone_is_being_built) {
			return;
		}
		// note that the following are offset by the page - so the top-left pixel has value
		// of around 8,8. so next we will subtract document, window, etc. offset (grr...)
    
                // recursively get location within parent(s)
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
		var mouse_x = event.clientX - left;
		var mouse_y = (event.clientY - top);
		// sometimes range is a few pixels too big
		if (mouse_x >= gl.viewportWidth) {
			return;
		}
		if (mouse_y >= gl.viewportHeight) {
			return;
		}
    
                //console.log ('mouse down: ' + mouse_x + ', ' + mouse_y);
                var ray = get_mouse_ray_wor (mouse_x, mouse_y);
                // plane intersection
                if (ray_plane (ray, g_cam.mWC_Pos, [0, 1, 0], 0)) {
                    //console.log ("ray hit");
                } else {
                    //console.log ("ray missed somehow");
                }
                //alert ("zone start point = " + intersection_point_wor);
//                g_zone_model_mat = translate_mat4 (identity_mat4 (), intersection_point_wor);
//                g_zone_pos = intersection_point_wor;
//                alert(g_zone_pos[0]);
                zone_activity_array[0].p1X = intersection_point_wor[0];
                zone_activity_array[0].p1Y = intersection_point_wor[1];
                zone_activity_array[0].p1Z = intersection_point_wor[2];
                //g_zone_shader.use (gl);
                //g_zone_shader.setUniformMat4ByLocation (gl, zone_model_mat_loc, transpose_mat4 (g_zone_model_mat));
                g_zone_is_being_built = true;
/*
                // do ray-sphere intersection test
                var width = -11.0110 - -11.578;
                var length = 1.4870 - 0.0774;
                var sphere_origin = [-11.578 + width / 2, 0.3, 0.0774 + length / 2];
                if (ray_sphere (ray, g_cam.mWC_Pos, sphere_origin, length / 2)) {
                        // when in loop of several sensors; deslect previous and select new

                        // change colour of monkey!
                        g_sensor_shader.use (gl);
                        g_sensor_shader.setUniformVec3ByLocation (gl, g_sensor_colour_loc, [1.0, 0.5, 0.0]);
                        room001_selected ();
                        $('#chartViz').show();

                } else {
                        g_sensor_shader.use (gl);
                        g_sensor_shader.setUniformVec3ByLocation (gl, g_sensor_colour_loc, [0.0, 0.5, 1.0]);
                        room001_deselected ();
                        $('#chartViz').hide();

                }
            */
        }

	g_canvas.onmousemove = function (event) {
		if (g_zone_is_being_built) {
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
			if (g_mouse_x >= gl.viewportWidth) {
				return;
			}
			if (g_mouse_y >= gl.viewportHeight) {
				return;
			}
			console.log ("move move: " + g_mouse_x + " " + g_mouse_y);
		}
	}
        // do at document level so if dragging and mouse goes out window, can still let go of box
	document.onmouseup = function (event) {
            
            // note that the following are offset by the page - so the top-left pixel has value
            // of around 8,8. so next we will subtract document, window, etc. offset (grr...)

            // recursively get location within parent(s)
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
            var mouse_x = event.clientX - left;
            var mouse_y = (event.clientY - top);
            // sometimes range is a few pixels too big
            if (mouse_x >= gl.viewportWidth) {
                    return;
            }
            if (mouse_y >= gl.viewportHeight) {
                    return;
            }

            //console.log ('mouse down: ' + mouse_x + ', ' + mouse_y);
            var ray = get_mouse_ray_wor (mouse_x, mouse_y);
            // plane intersection
            if (ray_plane (ray, g_cam.mWC_Pos, [0, 1, 0], 0)) {
                //console.log ("ray hit");
            } else {
                //console.log ("ray missed somehow");
            }

            zone_activity_array[0].p2X = intersection_point_wor[0];
            zone_activity_array[0].p2Y = intersection_point_wor[1];
            zone_activity_array[0].p2Z = intersection_point_wor[2];
            g_zone_is_being_built = false;
            alert(zone_activity_array[0].getInfo())
            //console.log ("zone end = " + last_intersection_point);
	}
	console.log ("initialisation done");
	return true;
}

function render () {

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
                
                if (draw_activity_zones){
            
                    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
                    //gl.enable(gl.DEPTH_TEST);
                    // draw activity zones
                    //gl.enable (gl.BLEND); // enable transp
                    //gl.disable (gl.CULL_FACE); // disable culling, so they can be dragged negatively too
                    //g_zone_shader.use (gl);
                    //gl.enableVertexAttribArray (0);
//                    zone_vp_vbo_idx = gl.createBuffer ();
//                    gl.bindBuffer (gl.ARRAY_BUFFER, zone_vp_vbo_idx);
//                    var zone_points = [
//                        1000,0.1,0,
//                        0,0.1,0,
//                        0,0.1,1000,
//                        0,0.1,1000,
//                        1000,0.1,1000,
//                        1000,0.1,0
//                    ];
//                    gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (zone_points), gl.STATIC_DRAW);
//                    gl.bindBuffer (gl.ARRAY_BUFFER, zone_vp_vbo_idx); // switch to this vertex buffer
//                    gl.vertexAttribPointer (0, 3, gl.FLOAT, false, 0, 0); // use its data for zeroth shader attribute
//                    gl.drawArrays (gl.TRIANGLES, 0, 6); // draw the geometry
                    
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

function bind_zone (arrayPos) {
	zone_vp_vbo_idx = gl.createBuffer ();
	gl.bindBuffer (gl.ARRAY_BUFFER, zone_vp_vbo_idx);
	var zone_points = [
		1,0.1,0,
		0,0.1,0,
		0,0.1,1,
		0,0.1,1,
		1,0.1,1,
		1,0.1,0
	];
	gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (zone_points), gl.STATIC_DRAW);
}


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
		document.getElementById('para_fps').innerHTML = fps.toFixed(2);
	}
	// compute time steps
	while (g_step_time_accum > step_size) {
		g_step_time_accum -= step_size;
		var camMove = [0, 0, 0];
		var camspeed = 20.0;
		// keys listed by code: http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants
		if (currentlyPressedKeys[87] == true) { // w
			camMove[2] = -1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
			updateMove = true;
		}
		if (currentlyPressedKeys[83] == true) { // s
			camMove[2] = 1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
			updateMove = true;
		}
		if (currentlyPressedKeys[65] == true) { // a
			camMove[0] = -1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
			updateMove = true;
		}
		if (currentlyPressedKeys[68] == true) { // d
			camMove[0] = 1.0 * camspeed * step_size;
			g_cam.moveBy (camMove);
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
		if (updateMove) {
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
			document.getElementById ('para_cam_pos').innerHTML =
				"campos = " + g_cam.mWC_Pos[0].toFixed(2) + ", "
				+ g_cam.mWC_Pos[1].toFixed(2) + ", " + g_cam.mWC_Pos[2].toFixed(2);
			updateMove = false;
		}
        /*              
                // show dragging-out of zone with mouse is still held
                if (g_zone_is_being_built) {
                //if(true){
                    // recursively get location within parent(s)
                    var ray = get_mouse_ray_wor (g_mouse_x, g_mouse_y);
                    //alert(ray);
                    // plane intersection
                    if (ray_plane (ray, g_cam.mWC_Pos, [0, 1, 0], 0)) {
                      //var m = scale_mat4 (identity_mat4 (), add_vec3 ([0,0.1,0], sub_vec3 (intersection_point_wor, g_zone_pos)));
                      //m = mult_mat4_mat4 (g_zone_model_mat, m);
                      //g_zone_shader.use (gl);
                            //g_zone_shader.setUniformMat4ByLocation (gl, zone_model_mat_loc, transpose_mat4 (m));
                    }
                }
        */
	}
	
	// render once and request re-draw of canvas
	if (!render ()) {
		console.error ("error rendering scene");
		return false;
	}
	window.requestAnimFrame(update, g_canvas);
	return true;
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
