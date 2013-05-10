attribute vec3 vp, vn;

uniform mat4 proj_mat, view_mat;

varying vec4 n_eye;

void main () {
	vec4 p_eye = view_mat * vec4 (vp, 1.0);
	n_eye.xyz = vec3 (view_mat * vec4 (vn, 0.0));
	float f = 250.0;
	float n = 0.1;
	n_eye.w = (-p_eye.z - n) / (f - n);
	gl_Position = proj_mat * p_eye;
}
