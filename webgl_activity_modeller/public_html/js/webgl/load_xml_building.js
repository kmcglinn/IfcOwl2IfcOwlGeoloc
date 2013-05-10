var g_walls_point_count = 0;
// index of the vertex points (vp) and vertex normals (vn) vertex buffer objects
var g_walls_vp_vbo, g_walls_vn_vbo;

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
		walls_vp_array.push (x1);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y1);
		walls_vp_array.push (x2);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y2);
		// second triangle
		walls_vp_array.push (x1);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y1);
		walls_vp_array.push (x2);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y2);
		walls_vp_array.push (x2);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y2);
		
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
		walls_vp_array.push (x1);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y1);
		walls_vp_array.push (x2);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y2);
		
		walls_vp_array.push (x1);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y1);
		walls_vp_array.push (x2);
		walls_vp_array.push (3.0);
		walls_vp_array.push (y2);
		walls_vp_array.push (x2);
		walls_vp_array.push (0.0);
		walls_vp_array.push (y2);
		
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
	console.log ("walls generated with " + g_walls_point_count + " vertices");
	console.log ("first point position was " + walls_vp_array[0] + ", " + walls_vp_array[1] + ", " + walls_vp_array[2]);
	return true;
}
