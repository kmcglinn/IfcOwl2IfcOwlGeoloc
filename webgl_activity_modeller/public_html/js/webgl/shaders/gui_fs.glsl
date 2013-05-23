precision mediump float;

varying vec2 st;

uniform sampler2D tex;

void main () {
	gl_FragColor = texture2D (tex, vec2 (0.5, 0.5));
}
