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
var can_select_zone = false;
var can_create_path = false;
var zone_selected = false;

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
function PathNode(id, p1X, p1Y, p1Z){
    
    this.id = id;
    this.p1X = p1X;
    this.p1Y = p1Y;
    this.p1Z = p1Z;
        
}

PathNode.prototype.getInfo = function(){
    
        return 'Zone type: ' + this.type + '. Zone id: ' + this.id + 'Position 1 x, y, z: ' + this.p1X + ' : ' + this.p1Y + ' : ' + this.p1Z ;
        
}

function createTestZone(){
    //type, id, originX, originY, originZ, width, length, isSquare, height
    zone_activity_array[0] = new Zone('Activity', 0, 0,0,0,  0,0,0);
    
}
// @end-Kris-Code
function init () {
    

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
	init_zones();
        init_paths();
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
                if(can_select_zone){
                    
                    get_mouse_coords(event);

                    //alert('mouse down: ' + mouse_x + ', ' + mouse_y);
                    var ray = get_mouse_ray_wor (mouse_x, mouse_y);
                    // plane intersection
                    if (ray_plane (ray, g_cam.mWC_Pos, [0, 1, 0], 0)) {
                        //console.log ("ray hit");
                    } else {
                        //console.log ("ray missed somehow");
                    }
                    
                    for(var i = 1; i<zone_activity_array.length;i++)
                    {
//                        alert(intersection_point_wor_x);
//                        alert(zone_activity_array[i].p1X);
                        if(((intersection_point_wor_x>zone_activity_array[i].p1X)&&(intersection_point_wor_y>zone_activity_array[i].p1Y))
                            &&((intersection_point_wor_x<zone_activity_array[i].p2X)&&(intersection_point_wor_y<zone_activity_array[i].p2Y)))
                        {
                            // when in loop of several sensors; deslect previous and select new
                            //alert('zone_selected()');
                            current_activity_zone = zone_activity_array[i];
                            zone_selected = true;
    
                        } 
                        else                     
                        {
                            //alert('zone_deselected()');
                        }
                    }

                }
                if(can_create_zone){
                    
                    if (g_zone_is_being_built) {
                            return;
                    }
                    // note that the following are offset by the page - so the top-left pixel has value
                    // of around 8,8. so next we will subtract document, window, etc. offset (grr...)

                    // recursively get location within parent(s)
                    get_mouse_coords(event);

                    //alert('mouse down: ' + mouse_x + ', ' + mouse_y);
                    var ray = get_mouse_ray_wor (mouse_x, mouse_y);
                    // plane intersection
                    if (ray_plane (ray, g_cam.mWC_Pos, [0, 1, 0], 0)) {
                        //console.log ("ray hit");
                    } else {
                        //console.log ("ray missed somehow");
                    }
                 
                    current_activity_zone.id = guid();
                    current_activity_zone.p1X = intersection_point_wor_x;
                    current_activity_zone.p1Y = intersection_point_wor_y;
                    current_activity_zone.p1Z = intersection_point_wor_z;
 
                    current_activity_zone.p2X = intersection_point_wor_x;
                    current_activity_zone.p2Y = intersection_point_wor_y;
                    current_activity_zone.p2Z = intersection_point_wor_z;

                    g_zone_is_being_built = true;

                }
                if(event.which===3)
                    
                {
                    
                    if(can_create_path)
                    {
                        save_path();

                    } 
                    
                    if(can_create_zone)
                    {
                        
                        
                    }
                    
                }
        }

	g_canvas.onmousemove = function (event) {
            if(can_create_zone||can_create_path){
                
        	if (g_zone_is_being_built||can_create_path) {
                    //console.log(can_create_path);
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
                    //console.log ("move move: " + g_mouse_x + " " + g_mouse_y);
		}
            }
	}
        // do at document level so if dragging and mouse goes out window, can still let go of box
	document.onmouseup = function (event) {
            
            // note that the following are offset by the page - so the top-left pixel has value
            // of around 8,8. so next we will subtract document, window, etc. offset (grr...)
            if(can_create_zone)
            {
                // recursively get location within parent(s)
                get_mouse_coords(event);

                console.log ('mouse down: ' + mouse_x + ', ' + mouse_y);
                get_mouse_ray_wor (mouse_x, mouse_y);
                // plane intersection 
                current_activity_zone.p2X = intersection_point_wor_x;
                current_activity_zone.p2Y = intersection_point_wor_y;
                current_activity_zone.p2Z = intersection_point_wor_z;
                g_zone_is_being_built = false;
                zone_selected = true;
                //alert(zone_activity_array[0].getInfo())
                //console.log ("zone end = " + last_intersection_point);
            }
            if(can_create_path)
            {
                // recursively get location within parent(s)
                get_mouse_coords(event);
                get_mouse_ray_wor (mouse_x, mouse_y);

                // plane intersection 
                current_path_node_array[current_path_node_array.length-1] = new PathNode(current_path_node.id, current_path_node.p1X, current_path_node.p1Y, current_path_node.p1Z);
                current_path_node_array.push(current_path_node);
                console.log("CURRENT PATH NODE ARRAY LENGTH" + current_path_node_array.length);
//                previous_path_node.p1X = intersection_point_wor_x;
//                previous_path_node.p1X = intersection_point_wor_y;
//                previous_path_node.p1X = intersection_point_wor_z;
                
                g_zone_is_being_built = false;
                //alert(zone_activity_array[0].getInfo())
                //console.log ("zone end = " + last_intersection_point);
            }
            
	}
               
        //init_zones();
	console.log ("initialisation done");
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
                    draw_path();
                 
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
function init_zones () {
    
    //createTestZone();
    zone_shader = load_shaders (zone_vs_url, zone_fs_url);
    zone_P_loc = gl.getUniformLocation (zone_shader, "P");
    zone_V_loc = gl.getUniformLocation (zone_shader, "V");
        
}

function init_paths() {
    
    //createTestZone();
    path_shader = load_shaders (path_vs_url, path_fs_url);
    path_P_loc = gl.getUniformLocation (path_shader, "P");
    path_V_loc = gl.getUniformLocation (path_shader, "V");
        
}
function delete_zone(){
    
    //alert(zone_activity_array.length);
    var exists = false;
    for(var i = 1;  i< zone_activity_array.length; i++){
        
        if(zone_activity_array[i].id==current_activity_zone.id){
            console.log("DELETING ZONE: " + current_activity_zone.id + " at position: " + i)
            console.log("Array length (before splice)" + zone_activity_array.length);
            zone_activity_array.splice(i,1);
            delete_zone_sparql(current_activity_zone.id);
            current_activity_zone = new Zone('Activity', 0, 0,0,0,  0,0,0);
            console.log("Array length (after splice)" + zone_activity_array.length);
            exists = true;
            zone_selected = false;
        }
  
    }
    if(exists == false)
    {
        alert("No Zone with that i.d. exists (you must select a zone)")
    }
    
    //This is temporary to fix bug...should be improved!!!
    //query_zones(exists);
    
//    alert("Number of Zone Points: " + zone_points.length);
}

function save_path(){
    var r=confirm("Do you wish to save this path?");
    if (r==true)
    {
        sparql_update_path();
        var temp_path_node; 
        for(var i = 0; i < current_path_node_array; i++)
        {
            temp_path_node = new PathNode();
            temp_path_node.id = current_path_node_array[i].id;
            temp_path_node.p1X = current_path_node_array[i].p1X;
            temp_path_node.p1Y= current_path_node_array[i].p1Y;
            temp_path_node.p1Z = current_path_node_array[i].p1Z;
            path_node_array.push(temp_path_node);        
        }
        alert(path_node_array.length);
    }//END OF IF
    else
    {
        return; //End function
    }//END OF ELSE
    
    can_create_path = false;
    current_path_node_array = new Array();
    previous_path_node = new PathNode();
    current_path_node = new PathNode();


}

function save_zone(){
    
    var temp_zone = new Zone(current_activity_zone.type, current_activity_zone.id, current_activity_zone.p1X, current_activity_zone.p1Y, current_activity_zone.p1Z, current_activity_zone.p2X, current_activity_zone.p2Y, current_activity_zone.p2Z);
    zone_activity_array.push(temp_zone);
    update_zone(temp_zone);
    //alert(zone_activity_array.length);
    
    for(var i = 0;  i< zone_activity_array.length; i++){
        
        //alert(zone_activity_array[i].getInfo());
  
    }
    
//    alert("Number of Zone Points: " + zone_points.length);
}

Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

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
            }
            else 
            {
                can_select_zone = false;
            }
            if (currentlyPressedKeys[67] === true) //c
            { 
                if(zone_selected === true)
                {
                    can_create_path = true;
//                    console.log("SETTING FIRST NODE AS ORIGIN OF ZONE");
                    previous_path_node.p1X = midpoint(current_activity_zone.p1X, current_activity_zone.p2X);
                    previous_path_node.p1Y = midpoint(current_activity_zone.p1Y, current_activity_zone.p2Y);
                    previous_path_node.p1Z = midpoint(current_activity_zone.p1Z, current_activity_zone.p2Z);
                    if(current_path_node_array.length===0)
                    {
                        console.log("PATH NODE ARRAY WAS EMPTY");
                        current_path_node_array.push(previous_path_node);
                        current_path_node_array.push(current_path_node);
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
            if (currentlyPressedKeys[87] == true) 
            { // w
                camMove[2] = -1.0 * camspeed * step_size;
                g_cam.moveBy (camMove);
                updateMove = true;
            }
            if (currentlyPressedKeys[83] == true) 
            { // s
                camMove[2] = 1.0 * camspeed * step_size;
                g_cam.moveBy (camMove);
                updateMove = true;
            }
            if (currentlyPressedKeys[65] == true) 
            { // a
                    camMove[0] = -1.0 * camspeed * step_size;
                    g_cam.moveBy (camMove);
                    updateMove = true;
            }
            if (currentlyPressedKeys[68] == true) 
            { // d
                    camMove[0] = 1.0 * camspeed * step_size;
                    g_cam.moveBy (camMove);
                    updateMove = true;
            }
            if (currentlyPressedKeys[69] == true) 
            { // d
                    camMove[1] = -1.0 * camspeed * step_size;
                    g_cam.moveBy (camMove);
                    updateMove = true;
            }
            if (currentlyPressedKeys[81] == true) 
            { // d
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
                    document.getElementById ('para_cam_pos').innerHTML =
                            "campos = " + g_cam.mWC_Pos[0].toFixed(2) + ", "
                            + g_cam.mWC_Pos[1].toFixed(2) + ", " + g_cam.mWC_Pos[2].toFixed(2);
                    updateMove = false;
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
//                    console.log("SETTING CURRENT PATH NODE AS MOUSE POSITION");
//                    console.log("X = " + intersection_point_wor_x);
//                    console.log("Previous path X = " + previous_path_node.p1X); 
                    current_path_node.p1X = intersection_point_wor_x;
                    current_path_node.p1Y = intersection_point_wor_y;
                    current_path_node.p1Z = intersection_point_wor_z;

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
/*
 * @Kris Code - Controls display of zone form values
 */
function set_zone_form_values(){
    
    document.forms["zone_form"]["zone_id_name"].value = current_activity_zone.id;
    
    document.forms["zone_form"]["zone_x1"].value = current_activity_zone.p1X;
    document.forms["zone_form"]["zone_y1"].value = current_activity_zone.p1Y;
    document.forms["zone_form"]["zone_z1"].value = current_activity_zone.p1Z;
    
    document.forms["zone_form"]["zone_x2"].value = current_activity_zone.p2X;
    document.forms["zone_form"]["zone_y2"].value = current_activity_zone.p2Y;
    document.forms["zone_form"]["zone_z2"].value = current_activity_zone.p2Z;
    
}


/*
 * @Kris Code - Generates randon UUID (this needs to be improved)
 */
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

//function guid() {
//  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//         s4() + '-' + s4() + s4() + s4();
//}

function guid() {
  return s4() + s4() + '' + s4() + '' + s4() + '' +
         s4() + '' + s4() + s4() + s4();
}

function midpoint(p1, p2)
{
//    console.log("P1: " + p1);
//    console.log("P1 Float "+ parseFloat(p1));
    return (parseFloat(p1) + parseFloat(p2))/2;
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


