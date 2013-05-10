attribute vec3 vp, vn;

uniform mat4 proj_mat, view_mat;

varying vec3 p_eye, n_eye;

void main () {
	p_eye = vec3 (view_mat * vec4 (vp, 1.0));
	n_eye = vec3 (view_mat * vec4 (vn, 0.0));
	gl_Position =  proj_mat * vec4 (p_eye, 1.0);
}
