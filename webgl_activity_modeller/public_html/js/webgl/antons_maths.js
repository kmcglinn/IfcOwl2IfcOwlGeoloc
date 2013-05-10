/*
JavaScript Matrix Maths
Dr Anton Gerdelan <gerdela@scss.tcd.ie>
Trinity College Dublin, Ireland
First version 11 Oct 2012

Good to know: JS has a Math. object;
var x = Math.PI; // Returns PI
var y = Math.sqrt(16); // Returns the square root of 16
http://www.w3schools.com/jsref/jsref_obj_math.asp

cross product - is it upside down? or is my sheet diagram upside down?
*/

/*---------------------------------VECTOR FUNCTIONS-------------------------------------
NOTES:
* vectors are just JS arrays, there is no 'vector' object type

* assuming that vec3 (3-element JS array) is the 'working' type, and vec4 is only used
when multiplying vector by a 4d matrix.

* therefore all the functions here are for 3d vectors - it's usually a mistake to do
maths with 4d vectors anyway.
*/

// returns scalar value holding length of a 3d vector
// warning: uses square root
function length_vec3 (v) {
	return Math.sqrt (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function length_vec4 (v) {
	return Math.sqrt (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
}

// returns scalar value holding squared length (not actual length) of a 3d vector
// does not use square root. Can be compared to other squared lengths
function length2_vec3 (v) {
	return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}

// normalise a 3d vector and return the result as a 3-element array
function normalise_vec3 (v) {
	var length = length_vec3 (v);
	return [v[0] / length, v[1] / length, v[2] / length];
}

// normalise a 4d vector and return the result. probably a mistake to normalise a v4!
function normalise_vec4 (v) {
	var length = length_vec4 (v);
	return [v[0] / length, v[1] / length, v[2] / length, v[3] / length];
}

// return scalar that is a + b of 2 vec3s
function add_vec3 (a, b) {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

// return scalar that is a - b of 2 vec3s
function sub_vec3 (a, b) {
	//return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

// return scalar that is dot product of 2 vec3s
function dot_vec3 (a, b) {
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// return vec3 that is cross product of 2 vec3s; a x b
function cross_vec3 (a, b) {
	var x = a[1] * b[2] - a[2] * b[1];
	var y = a[2] * b[0] - a[0] * b[2];
	var z = a[0] * b[1] - a[1] * b[0];
	return [x, y, z];
}

// extend a vec3 array into a vec4 array (just a short-hand as in GLSL)
function vec4 (vec3, w) {
	return [vec3[0], vec3[1], vec3[2], w];
}

// shorten a vec4 array into a vec3 array (just a short-hand as in GLSL)
function vec3 (vec4) {
	return [vec4[0], vec4[1], vec4[2]];
}

/*---------------------------------MATRIX FUNCTIONS-------------------------------------
NOTES:
* matrices are just JS arrays. stored in a 2d array in this order:
00 01 02 03
04 05 06 07
08 09 10 11
12 13 14 15
* this means that you have to TRANSPOSE them before you send them to the GPU, but it
makes them more natural to edit by hand

* you need to transpose this when sending in uniforms because GL likes the memory to be
in columns. the transpose parameter in uniform() doesn't seem to work.

* matrices are multiplied IN COLUMN ORDER like this:
a b c d   |x|   |ax + bx + cx + dx|
e f g h   |y|   |ey + fy + gy + hy|
i j k l * |z| = |iz + jz + kz + lz|
m n o p   |w|   |mw + nw + ow + pw|
*/

// print a matrix to the console in a nice, formatted way
function print_mat4 (m) {
	console.log ("[" + (m[0]).toPrecision(3) + "][" + (m[1]).toPrecision(3) + "][" + (m[2]).toPrecision(3) + "][" + (m[3]).toPrecision(3) + "]");
	console.log ("[" + (m[4]).toPrecision(3) + "][" + (m[5]).toPrecision(3) + "][" + (m[6]).toPrecision(3) + "][" + (m[7]).toPrecision(3) + "]");
	console.log ("[" + (m[8]).toPrecision(3) + "][" + (m[9]).toPrecision(3) + "][" + (m[10]).toPrecision(3) + "][" + (m[11]).toPrecision(3) + "]");
	console.log ("[" + (m[12]).toPrecision(3) + "][" + (m[13]).toPrecision(3) + "][" + (m[14]).toPrecision(3) + "][" + (m[15]).toPrecision(3) + "]");
}

// create an zeroed matrix
function zero_mat4 () {
 return [
 0.0, 0.0, 0.0, 0.0,
 0.0, 0.0, 0.0, 0.0,
 0.0, 0.0, 0.0, 0.0,
 0.0, 0.0, 0.0, 0.0
 ];
}

// create an identity matrix
function identity_mat4 () {
 return [
 1.0, 0.0, 0.0, 0.0,
 0.0, 1.0, 0.0, 0.0,
 0.0, 0.0, 1.0, 0.0,
 0.0, 0.0, 0.0, 1.0
 ];
}

// returns a 4d vector (4-element js array) by doing COLUMN-ORDER multiplication
function mult_mat4_vec4 (m, v) {
	var x = m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3];
	var y = m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3];
	var z = m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3];
	var w = m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3];
	return [x, y, z, w];
}

// returns a 4d matrix (16 element js array) by doing COLUMN-ORDER matrix * matrix
function mult_mat4_mat4 (a, b) {
	var r = zero_mat4 ();
	var r_index = 0;
	for (row = 0; row < 4; row++) {
		for (col = 0; col < 4; col++) {
			var sum = 0.0;
			for (i = 0; i < 4; i++) {
				sum += a[i + row * 4] * b[col + i * 4];
			}
			r[r_index] = sum;
			r_index++;
		}
	}
	return r;
}

/*
 0  1  2  3
 4  5  6  7
 8  9 10 11
12 13 14 15

a b c d
e f g h
i j k l
m n o p

0 4 8  12
1 5 9  13
2 6 10 14
3 7 11 15
*/

// returns a scalar value with the determinant for a 4x4 matrix
// see http://www.euclideanspace.com/maths/algebra/matrix/functions/determinant/fourD/index.htm
function determinant_mat4 (m) {
	return m[3] * m[6] * m[9] * m[12] -
					m[2] * m[7] * m[9] * m[12] -
					m[3] * m[5] * m[10] * m[12] +
					m[1] * m[7] * m[10] * m[12] +
					m[2] * m[5] * m[11] * m[12] -
					m[1] * m[6] * m[11] * m[12] -
					m[3] * m[6] * m[8] * m[13] +
					m[2] * m[7] * m[8] * m[13] +
					m[3] * m[4] * m[10] * m[13] -
					m[0] * m[7] * m[10] * m[13] -
					m[2] * m[4] * m[11] * m[13] +
					m[0] * m[6] * m[11] * m[13] +
					m[3] * m[5] * m[8] * m[14] -
					m[1] * m[7] * m[8] * m[14] -
					m[3] * m[4] * m[9] * m[14] +
					m[0] * m[7] * m[9] * m[14] +
					m[1] * m[4] * m[11] * m[14] -
					m[0] * m[5] * m[11] * m[14] -
					m[2] * m[5] * m[8] * m[15] +
					m[1] * m[6] * m[8] * m[15] +
					m[2] * m[4] * m[9] * m[15] -
					m[0] * m[6] * m[9] * m[15] -
					m[1] * m[4] * m[10] * m[15] +
					m[0] * m[5] * m[10] * m[15];
}

// returns a 16-element array that is the inverse of a 16-element array (4x4 matrix)
// see http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
function inverse_mat4 (m) {
	var det = determinant_mat4 (m);
	// there is no inverse if determinant is zero (not likely unless scale is broken)
	if (0.0 == det) {
		console.error ("warning. matrix has no determinant. can not invert");
		return m;
	}
	var inv_det = 1.0 / det;
	return [
					inv_det * (m[6] * m[11] * m[13] - m[7] * m[10] * m[13] + m[7] * m[9] * m[14] - m[5] * m[11] * m[14] - m[6] * m[9] * m[15] + m[5] * m[10] * m[15]),
					inv_det * (m[3] * m[10] * m[13] - m[2] * m[11] * m[13] - m[3] * m[9] * m[14] + m[1] * m[11] * m[14] + m[2] * m[9] * m[15] - m[1] * m[10] * m[15]),
					inv_det * (m[2] * m[7] * m[13] - m[3] * m[6] * m[13] + m[3] * m[5] * m[14] - m[1] * m[7] * m[14] - m[2] * m[5] * m[15] + m[1] * m[6] * m[15]),
					inv_det * (m[3] * m[6] * m[9] - m[2] * m[7] * m[9] - m[3] * m[5] * m[10] + m[1] * m[7] * m[10] + m[2] * m[5] * m[11] - m[1] * m[6] * m[11]),
					inv_det * (m[7] * m[10] * m[12] - m[6] * m[11] * m[12] - m[7] * m[8] * m[14] + m[4] * m[11] * m[14] + m[6] * m[8] * m[15] - m[4] * m[10] * m[15]),
					inv_det * (m[2] * m[11] * m[12] - m[3] * m[10] * m[12] + m[3] * m[8] * m[14] - m[0] * m[11] * m[14] - m[2] * m[8] * m[15] + m[0] * m[10] * m[15]),
					inv_det * (m[3] * m[6] * m[12] - m[2] * m[7] * m[12] - m[3] * m[4] * m[14] + m[0] * m[7] * m[14] + m[2] * m[4] * m[15] - m[0] * m[6] * m[15]),
					inv_det * (m[2] * m[7] * m[8] - m[3] * m[6] * m[8] + m[3] * m[4] * m[10] - m[0] * m[7] * m[10] - m[2] * m[4] * m[11] + m[0] * m[6] * m[11]),
					inv_det * (m[5] * m[11] * m[12] - m[7] * m[9] * m[12] + m[7] * m[8] * m[13] - m[4] * m[11] * m[13] - m[5] * m[8] * m[15] + m[4] * m[9] * m[15]),
					inv_det * (m[3] * m[9] * m[12] - m[1] * m[11] * m[12] - m[3] * m[8] * m[13] + m[0] * m[11] * m[13] + m[1] * m[8] * m[15] - m[0] * m[9] * m[15]),
					inv_det * (m[1] * m[7] * m[12] - m[3] * m[5] * m[12] + m[3] * m[4] * m[13] - m[0] * m[7] * m[13] - m[1] * m[4] * m[15] + m[0] * m[5] * m[15]),
					inv_det * (m[3] * m[5] * m[8] - m[1] * m[7] * m[8] - m[3] * m[4] * m[9] + m[0] * m[7] * m[9] + m[1] * m[4] * m[11] - m[0] * m[5] * m[11]),
					inv_det * (m[6] * m[9] * m[12] - m[5] * m[10] * m[12] - m[6] * m[8] * m[13] + m[4] * m[10] * m[13] + m[5] * m[8] * m[14] - m[4] * m[9] * m[14]),
					inv_det * (m[1] * m[10] * m[12] - m[2] * m[9] * m[12] + m[2] * m[8] * m[13] - m[0] * m[10] * m[13] - m[1] * m[8] * m[14] + m[0] * m[9] * m[14]),
					inv_det * (m[2] * m[5] * m[12] - m[1] * m[6] * m[12] - m[2] * m[4] * m[13] + m[0] * m[6] * m[13] + m[1] * m[4] * m[14] - m[0] * m[5] * m[14]),
					inv_det * (m[1] * m[6] * m[8] - m[2] * m[5] * m[8] + m[2] * m[4] * m[9] - m[0] * m[6] * m[9] - m[1] * m[4] * m[10] + m[0] * m[5] * m[10])
					];
}

// returns a 16-element array flipped on the main diagonal
function transpose_mat4 (m) {
	return [
		m[0], m[4], m[8], m[12],
		m[1], m[5], m[9], m[13],
		m[2], m[6], m[10], m[14],
		m[3], m[7], m[11], m[15]
	];
}

// returns a copy of a matrix
function copy_mat4 (m) {
	return [
	m[0], m[1], m[2], m[3],
	m[4], m[5], m[6], m[7],
	m[8], m[9], m[10], m[11],
	m[12], m[13], m[14], m[15]
	];
}

/*--------------------------------AFFINE MATRIX FUNCTIONS-----------------------------*/

// translate a 4d matrix with xyz array
function translate_mat4 (m, v) {
	var m_t = identity_mat4 ();
	m_t[3] = v[0];
	m_t[7] = v[1];
	m_t[11] = v[2];
	return mult_mat4_mat4 (m_t, m);
}

// rotate around x axis by an angle in degrees
function rotate_x_mat4_deg (m, deg) {
	// convert to radians
	var rad = deg * 0.017453; //(360.0 / (2.0 * Math.PI));
	var m_r = identity_mat4 ();
	m_r[5] = Math.cos (rad);
	m_r[6] = -Math.sin (rad);
	m_r[9] = Math.sin (rad);
	m_r[10] = Math.cos (rad);
	return mult_mat4_mat4 (m_r, m);
}

// rotate around y axis by an angle in degrees
function rotate_y_mat4_deg (m, deg) {
	// convert to radians
	var rad = deg * 0.017453; //(360.0 / (2.0 * Math.PI));
	var m_r = identity_mat4 ();
	m_r[0] = Math.cos (rad);
	m_r[2] = Math.sin (rad);
	m_r[8] = -Math.sin (rad);
	m_r[10] = Math.cos (rad);
	return mult_mat4_mat4 (m_r, m);
}

// rotate around z axis by an angle in degrees
function rotate_z_mat4_deg (m, deg) {
	// convert to radians
	var rad = deg * 0.017453; //(360.0 / (2.0 * Math.PI));
	var m_r = identity_mat4 ();
	m_r[0] = Math.cos (rad);
	m_r[1] = -Math.sin (rad);
	m_r[4] = Math.sin (rad);
	m_r[5] = Math.cos (rad);
	return mult_mat4_mat4 (m_r, m);
}

// scale a matrix by [x, y, z]
function scale_mat4 (m, v) {
	var a = identity_mat4 ();
	a[0] = v[0];
	a[5] = v[1];
	a[10] = v[2];
	return mult_mat4_mat4 (a, m);
}

/*------------------------------3D SCENE MATRIX FUNCTIONS-----------------------------*/

// returns a view matrix using the opengl lookAt style. COLUMN ORDER.
function look_at (cam_pos, targ_pos, up) {
	// inverse translation
	var p = identity_mat4 ();
	p = translate_mat4 (p, [-cam_pos[0], -cam_pos[1], -cam_pos[2]]);
	// distance vector
	var d = sub_vec3 (targ_pos, cam_pos);
	// forward vector
	var f = normalise_vec3 (d);
	// right vector
	var r = cross_vec3 (f, up);
	// real up vector
	var u = cross_vec3 (r, f);
	var ori = identity_mat4 ();
	ori[0] = r[0];
	ori[1] = r[1];
	ori[2] = r[2];
	ori[4] = u[0];
	ori[5] = u[1];
	ori[6] = u[2];
	ori[8] = -f[0];
	ori[9] = -f[1];
	ori[10] = -f[2];
	return mult_mat4_mat4 (ori, p);
}

// returns a perspective function mimicing the opengl projection style. COLUMN ORDER
function perspective (fovy, aspect, near, far) {
	var fov_rad = fovy * 0.017453;
	var range = Math.tan (fov_rad / 2.0) * near;
	var sx = (2.0 * near) / (range * aspect + range * aspect);
	var sy = near / range;
	var sz = -(far + near) / (far - near);
	var pz = -(2.0 * far * near) / (far - near);
	var m = zero_mat4 (); // make sure bottom-right corner is zero
	m[0] = sx;
	m[5] = sy;
	m[10] = sz;
	m[11] = pz;
	m[14] = -1.0;
	return m;
}


