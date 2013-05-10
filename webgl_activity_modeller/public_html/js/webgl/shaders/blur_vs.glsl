attribute vec3 vp;
attribute vec2 vt;

varying vec2 st;

void main () {
	st = vt;
	gl_Position =  vec4 (vp, 1.0);
}
