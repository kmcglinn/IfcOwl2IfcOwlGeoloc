function init () {
	var canvas = document.getElementById ("gl_canvas"); // get canvas using DOM
  gl = WebGLUtils.setupWebGL (canvas); // hook up WebGL to the canvas
  gl = WebGLDebugUtils.makeDebugContext (gl, throwOnGLError);
  gl.clearColor (0.6, 0.6, 0.8, 1.0); // make background red when cleared
  g_cam = new Camera (45, 935 / 400, 0.1, 100, [-12, 15, 11], [0, -2, -1]);
  load_shaders ();
  initWalls ();
  init_geometry ();
  $('#chartViz').hide();
  var model_mat = transpose_mat4 (scale_mat4 (identity_mat4 (), [.25, .25, .25]));
	g_shader.setUniformMat4ByLocation (gl, model_mat_loc, model_mat);
	
	load_grid_shaders ();
	load_zone_shaders ();
	load_sensor_shaders ();
	
	g_grid_shader.use (gl);
	//g_grid_shader.setUniformMat4ByLocation (gl, grid_model_mat_loc, model_mat);
  init_grid ();
  init_zone ();
  // load the sensor VBO
  init_sensors ();
  
	// add keyboard handling callbacks
	document.onkeydown = function (event) {
		currentlyPressedKeys[event.keyCode] = true;
	}
	document.onkeyup = function (event) {
		currentlyPressedKeys[event.keyCode] = false;
	}
	
	// add mouse clicks - but only when inside canvas area
	canvas.onmousedown = function (event) {
		// if mouse held don't keep restarting this
		if (g_zone_is_being_built) {
			return;
		}
		// note that the following are offset by the page - so the top-left pixel has value
		// of around 8,8. so next we will subtract document, window, etc. offset (grr...)
    
    // recursively get location within parent(s)
		var element = canvas;
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
   	console.log ("zone start point = " + intersection_point_wor);
    g_zone_model_mat = translate_mat4 (identity_mat4 (), intersection_point_wor);
    g_zone_pos = intersection_point_wor;
    g_zone_shader.use (gl);
		//g_zone_shader.setUniformMat4ByLocation (gl, zone_model_mat_loc, transpose_mat4 (g_zone_model_mat));
		g_zone_is_being_built = true;
		
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
	}
	
	canvas.onmousemove = function (event) {
		if (g_zone_is_being_built) {
			var element = canvas;
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
		//	console.log ("move move: " + g_mouse_x + " " + g_mouse_y);
		}
	}
	
	// do at document level so if dragging and mouse goes out window, can still let go of box
	document.onmouseup = function (event) {
		g_zone_is_being_built = false;
		console.log ("zone end = " + last_intersection_point);
	}
}

// verbose glError output
function throwOnGLError (err, funcName, args) {
  console.error (WebGLDebugUtils.glEnumToString (err) + " was caused by call to: " + funcName);
}

function load_shaders () {
	g_shader = new ShaderProgramme (gl);
  g_shader.loadVertexShaderFromURL (gl, "basic_vs.glsl");
  g_shader.loadFragmentShaderFromURL (gl, "basic_fs.glsl");
  g_shader.link (gl);
  model_mat_loc = g_shader.getUniformLocation (gl, "modelMat");
  view_mat_loc = g_shader.getUniformLocation (gl, "viewMat");
  proj_mat_loc = g_shader.getUniformLocation (gl, "projMat");
  g_shader.use (gl);
  g_shader.setUniformMat4ByLocation (gl, model_mat_loc, identity_mat4 ());
  g_shader.setUniformMat4ByLocation (gl, view_mat_loc, transpose_mat4 (g_cam.mViewMat));
  g_shader.setUniformMat4ByLocation (gl, proj_mat_loc, transpose_mat4 (g_cam.mProjMat));
}

function load_grid_shaders () {
	g_grid_shader = new ShaderProgramme (gl);
  g_grid_shader.loadVertexShaderFromURL (gl, "grid_vs.glsl");
  g_grid_shader.loadFragmentShaderFromURL (gl, "grid_fs.glsl");
  g_grid_shader.link (gl);
  grid_model_mat_loc = g_grid_shader.getUniformLocation (gl, "modelMat");
  grid_view_mat_loc = g_grid_shader.getUniformLocation (gl, "viewMat");
  grid_proj_mat_loc = g_grid_shader.getUniformLocation (gl, "projMat");
  grid_sampler_loc = g_grid_shader.getUniformLocation (gl, "tex");
  g_grid_shader.use (gl);
  g_shader.setUniformMat4ByLocation (gl, grid_model_mat_loc, identity_mat4 ());
  g_grid_shader.setUniformMat4ByLocation (gl, grid_view_mat_loc, transpose_mat4 (g_cam.mViewMat));
  g_grid_shader.setUniformMat4ByLocation (gl, grid_proj_mat_loc, transpose_mat4 (g_cam.mProjMat));
  g_grid_shader.setUniformIntByLocation(gl, grid_sampler_loc, 0); // texture location 0 in shader
}

function load_zone_shaders () {
	g_zone_shader = new ShaderProgramme (gl);
  g_zone_shader.loadVertexShaderFromURL (gl, "zone_vs.glsl");
  g_zone_shader.loadFragmentShaderFromURL (gl, "zone_fs.glsl");
  g_zone_shader.link (gl);
  zone_model_mat_loc = g_zone_shader.getUniformLocation (gl, "modelMat");
  zone_view_mat_loc = g_zone_shader.getUniformLocation (gl, "viewMat");
  zone_proj_mat_loc = g_zone_shader.getUniformLocation (gl, "projMat");
  g_zone_shader.use (gl);
  g_zone_shader.setUniformMat4ByLocation (gl, zone_model_mat_loc, identity_mat4 ());
  g_zone_shader.setUniformMat4ByLocation (gl, zone_view_mat_loc, transpose_mat4 (g_cam.mViewMat));
  g_zone_shader.setUniformMat4ByLocation (gl, zone_proj_mat_loc, transpose_mat4 (g_cam.mProjMat));
}

function load_sensor_shaders () {
	g_sensor_shader = new ShaderProgramme (gl);
  g_sensor_shader.loadVertexShaderFromURL (gl, "sensor_vs.glsl");
  g_sensor_shader.loadFragmentShaderFromURL (gl, "sensor_fs.glsl");
  g_sensor_shader.link (gl);
  g_sensor_model_mat_loc = g_sensor_shader.getUniformLocation (gl, "modelMat");
  g_sensor_view_mat_loc = g_sensor_shader.getUniformLocation (gl, "viewMat");
  g_sensor_proj_mat_loc = g_sensor_shader.getUniformLocation (gl, "projMat");
  g_sensor_colour_loc = g_sensor_shader.getUniformLocation (gl, "colour");
  g_sensor_shader.use (gl);
  
  var model = identity_mat4 ();
  var width = -11.0110 - -11.578;
	var length = 1.4870 - 0.0774;
  model = scale_mat4 (identity_mat4 (), [width / 2, 0.3, length / 2]);
  model = translate_mat4 (model, [-11.578 + width / 2, 0.3, 0.0774 + length / 2]);
  
  g_sensor_shader.setUniformMat4ByLocation (gl, g_sensor_model_mat_loc, transpose_mat4 (model));
  g_sensor_shader.setUniformMat4ByLocation (gl, g_sensor_view_mat_loc, transpose_mat4 (g_cam.mViewMat));
  g_sensor_shader.setUniformMat4ByLocation (gl, g_sensor_proj_mat_loc, transpose_mat4 (g_cam.mProjMat));
  g_sensor_shader.setUniformVec3ByLocation (gl, g_sensor_colour_loc, [0, 0.5, 1.0]);
}

function initWalls(){
	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET","beeld1.xml",false);
	xmlhttp.send();
	xmlDoc=xmlhttp.responseXML;
	var x=xmlDoc.getElementsByTagName("wall");
	var i;
	var n = 1; //NIMBUS
	var yMod = 0;
	var xMod = 0;
	// adds a line (not a line strip) of 3d points to an array
	for (i=0;i<x.length;i=i+1) { 
		var x1 = -((x[i].getElementsByTagName("x1")[0].childNodes[0].nodeValue)*n)+ xMod;
		var y1 = ((x[i].getElementsByTagName("y1")[0].childNodes[0].nodeValue)*n)+ yMod;
		var x2 = -((x[i].getElementsByTagName("x2")[0].childNodes[0].nodeValue)*n)+ xMod;
		var y2 = ((x[i].getElementsByTagName("y2")[0].childNodes[0].nodeValue)*n)+ yMod;
		array_of_points.push (x1);
		array_of_points.push (0.0);
		array_of_points.push (y1);
		array_of_points.push (x1);
		array_of_points.push (3.0);
		array_of_points.push (y1);
		array_of_points.push (x2);
		array_of_points.push (0.0);
		array_of_points.push (y2);
		
		array_of_points.push (x1);
		array_of_points.push (3.0);
		array_of_points.push (y1);
		array_of_points.push (x2);
		array_of_points.push (3.0);
		array_of_points.push (y2);
		array_of_points.push (x2);
		array_of_points.push (0.0);
		array_of_points.push (y2);
		
		var a = [x1, 3.0, y1];
		var b = [x1, 0.0, y1];
		var c = [x2, 0.0, y2];
		var edge1 = sub_vec3 (a, b);
		var edge2 = sub_vec3 (c, a);
		var normal = cross_vec3 (edge1, edge2);
		normal = normalise_vec3 (normal);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
	}
	// build back-faces onto every wall for 2-sided lighting
	for (i=0;i<x.length;i=i+1) { 
		var x1 = -((x[i].getElementsByTagName("x2")[0].childNodes[0].nodeValue)*n)+ xMod;
		var y1 = ((x[i].getElementsByTagName("y2")[0].childNodes[0].nodeValue)*n)+ yMod;
		var x2 = -((x[i].getElementsByTagName("x1")[0].childNodes[0].nodeValue)*n)+ xMod;
		var y2 = ((x[i].getElementsByTagName("y1")[0].childNodes[0].nodeValue)*n)+ yMod;
		array_of_points.push (x1);
		array_of_points.push (0.0);
		array_of_points.push (y1);
		array_of_points.push (x1);
		array_of_points.push (3.0);
		array_of_points.push (y1);
		array_of_points.push (x2);
		array_of_points.push (0.0);
		array_of_points.push (y2);
		
		array_of_points.push (x1);
		array_of_points.push (3.0);
		array_of_points.push (y1);
		array_of_points.push (x2);
		array_of_points.push (3.0);
		array_of_points.push (y2);
		array_of_points.push (x2);
		array_of_points.push (0.0);
		array_of_points.push (y2);
		
		var a = [x1, 3.0, y1];
		var b = [x1, 0.0, y1];
		var c = [x2, 0.0, y2];
		var edge1 = sub_vec3 (a, b);
		var edge2 = sub_vec3 (c, a);
		var normal = cross_vec3 (edge1, edge2);
		normal = normalise_vec3 (normal);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
		normals_array.push (normal[0]);normals_array.push (normal[1]);normals_array.push (normal[2]);
	}
	
	point_count = array_of_points.length;
}

// create some default geometry
function init_geometry () {
	vp_vbo_idx = gl.createBuffer (); // create an emtpy buffer in WebGL
	gl.bindBuffer (gl.ARRAY_BUFFER, vp_vbo_idx); // "bind" buffer in GL state machine
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (array_of_points), gl.STATIC_DRAW);
	vn_vbo_idx = gl.createBuffer (); // create an emtpy buffer in WebGL
  gl.bindBuffer (gl.ARRAY_BUFFER, vn_vbo_idx); // "bind" buffer in GL state machine
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (normals_array), gl.STATIC_DRAW);
}

function init_grid () {
	// create vertex points buffer from 2 triangles
	grid_vp_vbo_idx = gl.createBuffer ();
	gl.bindBuffer (gl.ARRAY_BUFFER, grid_vp_vbo_idx);
	var grid_size = 25.0;
	var grid_points = [
		grid_size,0,-grid_size,
		-grid_size,0,-grid_size,
		-grid_size,0,grid_size,
		-grid_size,0,grid_size,
		grid_size,0,grid_size,
		grid_size,0,-grid_size
	];
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (grid_points), gl.STATIC_DRAW);
  // create vertex texture coords buffer
  grid_vt_vbo_idx = gl.createBuffer ();
	gl.bindBuffer (gl.ARRAY_BUFFER, grid_vt_vbo_idx);
	var scale_factor = 100.0; // amount of times to repeat tile over grid surface
	var texture_points = [
		scale_factor, scale_factor,
		0.0, scale_factor,
		0.0, 0.0,
		
		0.0, 0.0, 
		scale_factor, 0.0,
		scale_factor, scale_factor
	];
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (texture_points), gl.STATIC_DRAW);
  
  var ext = gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
	if (!ext) {
		ext = gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
	}
  
  // load texture
  grid_texture = gl.createTexture ();
  var image = new Image ();
  image.onload = function () {
		gl.bindTexture (gl.TEXTURE_2D, grid_texture);
		gl.pixelStorei (gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // bi-linear filtering
		gl.texParameteri (gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // tri-linear filtering
		gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, grid_texture);
	}
	image.src = "grid_texture.png";
	//image.src = "dungeonDoor.png";
}

function init_zone () {
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

function init_sensors () {
	// fetch json file
	var json = null;
	var xmlhttp = new XMLHttpRequest ();
	xmlhttp.onreadystatechange = function() {
		// if response code is correct
		if (xmlhttp.readyState == 4) {
			// read a JSON format file to auto-create the object. add opening and closing parantheses
			json = eval ("(" + xmlhttp.responseText + ")");
			
			// create VBOs
			sensor_vp_vbo_idx = gl.createBuffer (); // create an emtpy buffer in WebGL
			gl.bindBuffer (gl.ARRAY_BUFFER, sensor_vp_vbo_idx); // "bind" buffer in GL state machine
			gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (json.mVertexPoints), gl.STATIC_DRAW);
			sensor_point_count = json.mVertexPoints.length / 3;
			
			sensor_vn_vbo_idx = gl.createBuffer (); // create an emtpy buffer in WebGL
			gl.bindBuffer (gl.ARRAY_BUFFER, sensor_vn_vbo_idx); // "bind" buffer in GL state machine
			gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (json.mVertexNormals), gl.STATIC_DRAW);
		}
	}
	xmlhttp.open ("GET", "cube.json", false);
	xmlhttp.send ();
}
