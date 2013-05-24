/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function init () {
    
//        alert(zone_activity_array[0].getInfo());

	g_canvas = document.getElementById ("gl_canvas");
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
	
	gl.clearColor (1.0, 1.0, 1.0, 1.0);

	// camera gui buttons	
	init_gui ();
	
	camera_pos = [-49.44, 35.60, 55.52];
	g_cam = new Camera (45.0, g_canvas.width / g_canvas.height, 0.1, 100.0, camera_pos, [0, -2, -1]);
	
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
        /*
         * @KrisCode
         */
        init_floor();
        init_walls();
	init_zones();
        init_paths();

        console.log("Path Node Array Length = ");
        /*
         * @endkriscode
         */
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
		// cam gui
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
                //alert("Mouse down...MOUSE DOWN!")
                
		// if mouse held don't keep restarting this
                if(can_select_zone||can_select_path){
                    
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
                            current_path_node_array = new Array();
                            path_selected = false;
                            can_view_path_id = false;
    
                        } 
                        else                     
                        {
                            //alert('zone_deselected()');
                        }
                    }
//                    console.log("LENGTH: " + path_node_array.length);
                    for(var i = 0; i<path_node_array.length;i++)
                    {
//                        console.log("LENGTH: " + path_node_array[i].length);
                        for(var j = 0; j<path_node_array[i].length-2;j++)
                        {
                        
                            var polygon = new Polygon();
                            var point = new Point(path_node_array[i][j].p1X, path_node_array[i][j].p1Y-2);
                            polygon.add(point);
                            var point = new Point(path_node_array[i][j].p1X, path_node_array[i][j].p1Y+2);
                            polygon.add(point);
                            var point = new Point(path_node_array[i][j+1].p1X, path_node_array[i][j+1].p1Y+2);
                            polygon.add(point);
                            var point = new Point(path_node_array[i][j+1].p1X, path_node_array[i][j+1].p1Y-2);
                            polygon.add(point);
                            point = new Point(intersection_point_wor_x, intersection_point_wor_y);
//                            console.log(point.x);
//                            console.log(polygon.points.length);
//                            console.log("POS: " + j);
//                            console.log(path_node_array[i][j].id);
//                            console.log(path_node_array[i][j].p1X);
//                            console.log(path_node_array[i][j].p1Y);
//                            console.log(path_node_array[i][j+1].id);
//                            console.log(path_node_array[i][j+1].p1X);
//                            console.log(path_node_array[i][j+1].p1Y);
                            //console.log(current_path_node_array.id);
                            
                            if((polygon.pointInPoly(point)))
                            {
//                                console.log(current_path_node_array.length);
                                if(current_path_node_array.length===0)
                                {
//                                    console.log('Path Selected!!!');
                                    current_path_node_array = path_node_array[i];
                                    console.log(path_node_array[i][0].activity_zone_id);
                                    path_exit_id = current_path_node_array[0].activity_zone_id;
                                    path_entry_id = current_path_node_array[current_path_node_array.length-1].activity_zone_id;
                                    path_selected = true;
                                    can_view_path_id = true;
                                }
                                else if(current_path_node_array[0].path_id!==path_node_array[i][0].path_id)
                                {
//                                    console.log('Path Selected !!');
                                    current_path_node_array = path_node_array[i];
                                    path_exit_id = current_path_node_array[0].activity_zone_id;
                                    path_entry_id = current_path_node_array[current_path_node_array.length-1].activity_zone_id;
                                    path_selected = true;
                                    can_view_path_id = true;
                                }
                                current_activity_zone = new Array();
                                zone_selected = false;

                            } 
                            else                     
                            {
//                                console.log('No Path Selected!!!');
                            }
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
                 
                    current_activity_zone.id = create_simple_guid();
                    current_activity_zone.p1X = intersection_point_wor_x;
                    current_activity_zone.p1Y = intersection_point_wor_y;
                    current_activity_zone.p1Z = intersection_point_wor_z;
 
                    current_activity_zone.p2X = intersection_point_wor_x;
                    current_activity_zone.p2Y = intersection_point_wor_y;
                    current_activity_zone.p2Z = intersection_point_wor_z;

                    g_zone_is_being_built = true;

                }
//                if(event.which===3)
//                    
//                {
//                    
//                    if(can_create_path)
//                    {
//                        if(path_connected)
//                        {
//                            //save_path();
//                        }
//                        else 
//                        {
//                            alert("You must have selected an activity zone to connect to.")
//                        }
//
//                    } 
//                    
//                    if(can_create_zone)
//                    {
//                        
//                        
//                    }
//                    
//                }
        }

	g_canvas.onmousemove = function (event) {
		// cam gui
//		if (!g_mouse_down) {
//			return;
//		}
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
	
						// for cam gui
						g_mouse_down = false;
						g_height_clicky_held_down = false;
            
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
                
                if(!can_save_path)
                {
                    get_mouse_coords(event);
                    get_mouse_ray_wor (mouse_x, mouse_y);
                    current_path_node_array[current_path_node_array.length-1] = new PathNode(current_path_node.path_id, current_path_node.p1X, current_path_node.p1Y, current_path_node.p1Z, current_path_node.activity_path_id);                   
                    current_path_node_array.push(current_path_node);
                    console.log("CURRENT PATH NODE ARRAY LENGTH" + current_path_node_array.length);

                }
                else if(can_save_path)
                {         
                    //state_booleans();
                    //alert(currentlyPressedKeys[67]);
                    current_path_node_array[current_path_node_array.length-1] = new PathNode(current_path_node.path_id, current_path_node.p1X, current_path_node.p1Y, current_path_node.p1Z, current_path_node.activity_path_id);
                    save_path();
                    //can_create_path = false;
                    
                }

            }
            
	}
               
        //init_zones();
	console.log ("initialisation done");
	return true;
}
