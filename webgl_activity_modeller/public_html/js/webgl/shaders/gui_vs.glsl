attribute vec2 vp;
attribute vec2 vt;

uniform mat4 model_mat;

varying vec2 st;

void main () {
	st = vt;
	gl_Position = model_mat * vec4 (vp, 0.0, 1.0);
}
