// these suckers store results of successful intersection tests
var intersection_point_wor = undefined;
var intersection_distance = undefined;

/* takes mouse cursor position in pixels,
   does an intersection with an imaginary ground plane,
   and returns an xyz normal vector in world coordinate space */
function get_mouse_ray_wor (mouse_x, mouse_y) {
	// get canvas for width and height in pixels
	var canvas = document.getElementById ("glcanvas"); // get canvas using DOM
	
	// VIEWPORT -> NDC -> CLIP	

	var x_nds = (2.0 * mouse_x) / canvas.width - 1.0; // scaling into range -1:1
	var y_nds = 1.0 - (2.0 * mouse_y) / canvas.height; // flip y axis as well as scaling
	/* IMPORTANT NOTE: w component here MUST be == 1 or it won't multiply with the inverse */
	var ray_clip = [x_nds, y_nds, -1.0, 1.0]; // z component pointing forwards (-1.0)
	//console.log ("ray_clip = " + ray_clip);
	
	// CLIP -> VIEW
	var ray_eye = mult_mat4_vec4 (inverse_mat4 (g_cam.mProjMat), ray_clip);
	ray_eye[3] = 0.0;
	//console.log ("ray_eye = " + ray_eye);
	
	// VIEW -> WORLD
	var ray_wor = mult_mat4_vec4 (inverse_mat4 (g_cam.mViewMat), ray_eye);
	var n = normalise_vec3 (vec3 (ray_wor));
	//console.log ("ray_wor = " + n);
	// done. return result
	return n;
}

/*! tests a ray (defined as a world origin and a direction vector)
		against a plane (defined as a facing direction and an offset along this facing from world origin),
		returns true if hit,
		and then updates the intersection_point_wor variable */
function ray_plane (ray_direction, ray_origin, plane_normal, plane_offset) {
	// work out denominator of the distance function
	var denom = dot_vec3 (ray_direction, plane_normal);
	// if zero this means plane is perpendicular to ray and will not hit. also would cause
	// a divide-by-zero error
	if (0.0 == denom) {
		//console.log ("RAY MISSED - PERPENDICULAR TO PLANE");
		return false;
	}
	// work out numerator of distance function
	var numer = dot_vec3 (ray_origin, plane_normal);
	numer = numer + plane_offset;
	// get distance of intersection along ray, from ray origin
	var t = -numer / denom;
	//console.log ("t = -(" + numer + " / " + denom + ") = " + t);
	// check if intersection was behind ray origin
	if (0.0 >= t) {
		return false;
	}
	// okay, we know how far away the hit was, so set the position
	intersection_distance = t;
	//console.log ("t = " + t);
	//console.log ("ray orig = " + ray_origin);
	//console.log ("ray direction = " + ray_direction);
	intersection_point_wor = [
	ray_origin[0] + ray_direction[0] * t,
	ray_origin[1] + ray_direction[1] * t,
	ray_origin[2] + ray_direction[2] * t
	];
	return true;
}

function ray_sphere (ray_direction, ray_origin, sphere_origin, sphere_radius) {
	var o_m_c = sub_vec3 (ray_origin, sphere_origin);
	var b = dot_vec3 (ray_direction, o_m_c);
	var c = dot_vec3 (o_m_c, o_m_c) - sphere_radius * sphere_radius;
	// check for miss
	if (b * b - c < 0) {
		//console.log ("ray missed sphere");
		return false;
	}
	//console.log ("ray HIT sphere");
	return true;
}

