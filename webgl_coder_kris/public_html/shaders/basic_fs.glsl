precision mediump float;

varying vec4 n_eye;

// from http://marcinignac.com/experiments/ssao/v01/index.html
vec4 packDepth(const in float depth) {
	const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
	const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
	vec4 res = fract(depth * bit_shift);
	res -= res.xxyz * bit_mask;
	return res;    		
}

void main () {
	/*vec4 depth = packDepth (n_eye.w);
	gl_FragColor = depth;*/
	gl_FragColor = vec4 ((n_eye.xyz) * 0.5, n_eye.w);
}
