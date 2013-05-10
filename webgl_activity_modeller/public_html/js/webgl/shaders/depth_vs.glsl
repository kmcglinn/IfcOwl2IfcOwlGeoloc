attribute vec3 vp;

uniform mat4 proj_mat, view_mat;

varying float depth;

void main () {
	vec4 p_eye = view_mat * vec4 (vp, 1.0);
	float f = 100.0;
	float n = 0.1;
	depth = (-p_eye.z - n) / (f - n);
	gl_Position = proj_mat * p_eye;
}
