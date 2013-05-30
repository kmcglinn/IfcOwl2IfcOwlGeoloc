//var g_walls_point_count = 0;
//// index of the vertex points (vp) and vertex normals (vn) vertex buffer objects
//var g_walls_vp_vbo, g_walls_vn_vbo;
//
//// extract walls from xml and extrude into 3d model
//function create_walls_from_xml (url) {
//	console.log ("extruding walls from: " + url);
//
//	xmlhttp = new XMLHttpRequest ();
//	xmlhttp.open ("GET", url, false);
//	xmlhttp.send ();
//	xmlDoc = xmlhttp.responseXML;
//	var x = xmlDoc.getElementsByTagName ("wall");
//
//	// some arrays to hold per-vertex data
//	var walls_vp_array = new Array ();
//	var walls_vn_array = new Array ();
//        var wall_length = x.length;
//        console.log("WALL LENGTH: " + wall_length);
//        //wall_length = 1000;
//	// adds a line (not a line strip) of 3d points to an array
//	for (var i = 0; i < wall_length; i++) {
//		
//		// calculate vertices with extruded height of 3 units
//		var x1 = -x[i].getElementsByTagName ("x1")[0].childNodes[0].nodeValue;
//		var y1 = x[i].getElementsByTagName ("y1")[0].childNodes[0].nodeValue;
//		var x2 = -x[i].getElementsByTagName ("x2")[0].childNodes[0].nodeValue;
//		var y2 = x[i].getElementsByTagName ("y2")[0].childNodes[0].nodeValue;
//		// first triangle
//		walls_vp_array.push (x1);
//		walls_vp_array.push (0.0);
//		walls_vp_array.push (y1);
//		walls_vp_array.push (x1);
//		walls_vp_array.push (3.0);
//		walls_vp_array.push (y1);
//		walls_vp_array.push (x2);
//		walls_vp_array.push (0.0);
//		walls_vp_array.push (y2);
//		// second triangle
//		walls_vp_array.push (x1);
//		walls_vp_array.push (3.0);
//		walls_vp_array.push (y1);
//		walls_vp_array.push (x2);
//		walls_vp_array.push (3.0);
//		walls_vp_array.push (y2);
//		walls_vp_array.push (x2);
//		walls_vp_array.push (0.0);
//		walls_vp_array.push (y2);
//		
//		// calculate normal for wall
//		var a = [x1, 3.0, y1];
//		var b = [x1, 0.0, y1];
//		var c = [x2, 0.0, y2];
//		var edge1 = sub_vec3 (a, b);
//		var edge2 = sub_vec3 (c, a);
//		var normal = cross_vec3 (edge1, edge2);
//		normal = normalise_vec3 (normal);
//		
//		// put 3d normals for 6 vertices
//		for (var j = 0; j < 6; j++) {
//			walls_vn_array.push (normal[0]);
//			walls_vn_array.push (normal[1]);
//			walls_vn_array.push (normal[2]);
//		}
//	}
//	// build back-faces onto every wall for 2-sided lighting
//	for (var i = 0; i < wall_length; i++) {
//		var x1 = -x[i].getElementsByTagName("x2")[0].childNodes[0].nodeValue;
//		var y1 = x[i].getElementsByTagName("y2")[0].childNodes[0].nodeValue;
//		var x2 = -x[i].getElementsByTagName("x1")[0].childNodes[0].nodeValue;
//		var y2 = x[i].getElementsByTagName("y1")[0].childNodes[0].nodeValue;
//		walls_vp_array.push (x1);
//		walls_vp_array.push (0.0);
//		walls_vp_array.push (y1);
//		walls_vp_array.push (x1);
//		walls_vp_array.push (3.0);
//		walls_vp_array.push (y1);
//		walls_vp_array.push (x2);
//		walls_vp_array.push (0.0);
//		walls_vp_array.push (y2);
//		
//		walls_vp_array.push (x1);
//		walls_vp_array.push (3.0);
//		walls_vp_array.push (y1);
//		walls_vp_array.push (x2);
//		walls_vp_array.push (3.0);
//		walls_vp_array.push (y2);
//		walls_vp_array.push (x2);
//		walls_vp_array.push (0.0);
//		walls_vp_array.push (y2);
//		
//		var a = [x1, 3.0, y1];
//		var b = [x1, 0.0, y1];
//		var c = [x2, 0.0, y2];
//		var edge1 = sub_vec3 (a, b);
//		var edge2 = sub_vec3 (c, a);
//		var normal = cross_vec3 (edge1, edge2);
//		normal = normalise_vec3 (normal);
//		// put 3d normals for 6 vertices
//		for (var j = 0; j < 6; j++) {
//			walls_vn_array.push (normal[0]);
//			walls_vn_array.push (normal[1]);
//			walls_vn_array.push (normal[2]);
//		}
//	}
//	g_walls_point_count = walls_vp_array.length / 3;
//	
//	// create GL vertex buffers
//	console.log ("creating walls vertex point vbo");
//	g_walls_vp_vbo = create_vbo (walls_vp_array);
//	console.log ("creating walls vertex normals vbo");
//	g_walls_vn_vbo = create_vbo (walls_vn_array);
//	console.log ("walls generated with " + g_walls_point_count + " vertices");
//	console.log ("first point position was " + walls_vp_array[0] + ", " + walls_vp_array[1] + ", " + walls_vp_array[2]);
//	return true;
//}
var g_walls_vs_url = "shaders/basic_vs.glsl";
var g_walls_fs_url = "shaders/basic_fs.glsl";
var g_walls_xml_url = "cad_xml/smart_homes_cad.xml";

var g_walls_point_count = 0;
// index of the vertex points (vp) and vertex normals (vn) vertex buffer objects
var g_walls_vp_vbo, g_walls_vn_vbo, g_walls_edge_vbo;

// shader programme index
var g_walls_shader = undefined;
// locations of attributes in shader programme
var g_walls_vp_loc, g_walls_vn_loc, g_walls_edge_loc;
// locations of uniforms in shader programme
var g_walls_view_mat_loc, g_walls_proj_mat_loc, g_walls_colour_loc;

function init_walls () {
	console.log ("initialising walls");
	
	g_walls_shader = load_shaders (g_walls_vs_url, g_walls_fs_url);
	
	g_walls_vp_loc = gl.getAttribLocation (g_walls_shader, "vp");
	g_walls_vn_loc = gl.getAttribLocation (g_walls_shader, "vn");
	g_walls_edge_loc = gl.getAttribLocation (g_walls_shader, "edge");
	
	g_walls_view_mat_loc = gl.getUniformLocation (g_walls_shader, "view_mat");
	g_walls_proj_mat_loc = gl.getUniformLocation (g_walls_shader, "proj_mat");
	g_walls_colour_loc = gl.getUniformLocation (g_walls_shader, "colour");
	
	if (!_create_walls_from_xml (g_walls_xml_url)) {
		console.error ("error creating walls from xml, url: " + g_walls_xml_url);
	}
	
	// assumes cam is already init
	update_wall_cam_mats ();
	
	console.log ("walls initialised");
}

// extract walls from xml and extrude into 3d model
function create_walls_from_xml (url) {
	console.log ("extruding walls from: " + url);

	xmlhttp = new XMLHttpRequest ();
	xmlhttp.open ("GET", url, false);
	xmlhttp.send ();
	xmlDoc = xmlhttp.responseXML;
	var x = xmlDoc.getElementsByTagName ("wall");

	// some arrays to hold per-vertex data
	var walls_vp_array = new Array ();
	var walls_vn_array = new Array ();
	
	var edge_array = new Array ();

	// adds a line (not a line strip) of 3d points to an array
	for (var i = 0; i < x.length; i++) {
		
		// calculate vertices with extruded height of 3 units
		var x1 = -x[i].getElementsByTagName ("x1")[0].childNodes[0].nodeValue;
		var y1 = x[i].getElementsByTagName ("y1")[0].childNodes[0].nodeValue;
		var x2 = -x[i].getElementsByTagName ("x2")[0].childNodes[0].nodeValue;
		var y2 = x[i].getElementsByTagName ("y2")[0].childNodes[0].nodeValue;
		// first triangle
		walls_vp_array.push (x1);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y1);
		
		edge_array.push (0.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		walls_vp_array.push (x1);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y1);
		
		edge_array.push (0.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		walls_vp_array.push (x2);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y2);
		
		edge_array.push (1.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		// second triangle
		walls_vp_array.push (x1);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y1);
		
		edge_array.push (0.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		walls_vp_array.push (x2);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y2);
		
		edge_array.push (1.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		walls_vp_array.push (x2);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y2);
		
		edge_array.push (1.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		// calculate normal for wall
		var a = [x1, 3.0, y1];
		var b = [x1, 0.0, y1];
		var c = [x2, 0.0, y2];
		var edge1 = sub_vec3 (a, b);
		var edge2 = sub_vec3 (c, a);
		var normal = cross_vec3 (edge1, edge2);
		normal = normalise_vec3 (normal);
		
		// put 3d normals for 6 vertices
		for (var j = 0; j < 6; j++) {
			walls_vn_array.push (normal[0]);
			walls_vn_array.push (normal[1]);
			walls_vn_array.push (normal[2]);
		}
	}
	// build back-faces onto every wall for 2-sided lighting
	for (var i = 0; i < x.length; i++) {
		var x1 = -x[i].getElementsByTagName("x2")[0].childNodes[0].nodeValue;
		var y1 = x[i].getElementsByTagName("y2")[0].childNodes[0].nodeValue;
		var x2 = -x[i].getElementsByTagName("x1")[0].childNodes[0].nodeValue;
		var y2 = x[i].getElementsByTagName("y1")[0].childNodes[0].nodeValue;
		walls_vp_array.push (x1);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y1);
		
		edge_array.push (0.0); // left. 1.0 for right
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		walls_vp_array.push (x1);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y1);
		
		edge_array.push (0.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		walls_vp_array.push (x2);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y2);
		
		edge_array.push (1.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		walls_vp_array.push (x1);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y1);
		
		edge_array.push (0.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		walls_vp_array.push (x2);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y2);
		
		edge_array.push (1.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		walls_vp_array.push (x2);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y2);
		
		edge_array.push (1.0);
		edge_array.push (Math.sqrt ((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))); // length
		
		var a = [x1, 3.0, y1];
		var b = [x1, 0.0, y1];
		var c = [x2, 0.0, y2];
		var edge1 = sub_vec3 (a, b);
		var edge2 = sub_vec3 (c, a);
		var normal = cross_vec3 (edge1, edge2);
		normal = normalise_vec3 (normal);
		// put 3d normals for 6 vertices
		for (var j = 0; j < 6; j++) {
			walls_vn_array.push (normal[0]);
			walls_vn_array.push (normal[1]);
			walls_vn_array.push (normal[2]);
		}
	}
	g_walls_point_count = walls_vp_array.length / 3;
	
	// create GL vertex buffers
	console.log ("creating walls vertex point vbo");
	g_walls_vp_vbo = create_vbo (walls_vp_array);
	console.log ("creating walls vertex normals vbo");
	g_walls_vn_vbo = create_vbo (walls_vn_array);
	
	g_walls_edge_vbo = create_vbo (edge_array);
	
	console.log ("walls generated with " + g_walls_point_count + " vertices");
	console.log ("first point position was " + walls_vp_array[0] + ", " + walls_vp_array[1] + ", " + walls_vp_array[2]);
	return true;
}

function update_wall_cam_mats () {
	gl.useProgram (g_walls_shader);
	gl.uniformMatrix4fv (g_walls_view_mat_loc, false, transpose_mat4 (g_cam.mViewMat));
	gl.uniformMatrix4fv (g_walls_proj_mat_loc, false, transpose_mat4 (g_cam.mProjMat));
}

// 1. render scene to image
// 2. render normals to image
// 3. render quad using (1) and (2) to draw whole scene with outlines

function render_walls () {
	// draw the walls
	gl.useProgram (g_walls_shader);
	gl.uniform4f (g_walls_colour_loc, 0.9, 0.9, 0.8, 1.0);
	
	// NOTE: do not use 0,1,2 because this can change to 2,1,0
	gl.enableVertexAttribArray (g_walls_vp_loc);
	gl.enableVertexAttribArray (g_walls_vn_loc);
	gl.enableVertexAttribArray (g_walls_edge_loc);
	
	gl.bindBuffer (gl.ARRAY_BUFFER, g_walls_vp_vbo);
  gl.vertexAttribPointer (g_walls_vp_loc, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer (gl.ARRAY_BUFFER, g_walls_vn_vbo);
  gl.vertexAttribPointer (g_walls_vn_loc, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer (gl.ARRAY_BUFFER, g_walls_edge_vbo);
  gl.vertexAttribPointer (g_walls_edge_loc, 2, gl.FLOAT, false, 0, 0);
  
  gl.drawArrays (gl.TRIANGLES, 0, g_walls_point_count);
  
  gl.disableVertexAttribArray (g_walls_vp_loc);
  gl.disableVertexAttribArray (g_walls_vn_loc);
  gl.disableVertexAttribArray (g_walls_edge_loc);
}