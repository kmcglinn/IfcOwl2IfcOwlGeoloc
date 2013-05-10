precision mediump float;

varying float depth;

// from http://marcinignac.com/experiments/ssao/v01/index.html
vec4 packDepth(const in float depth) {
	const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
	const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
	vec4 res = fract(depth * bit_shift);
	res -= res.xxyz * bit_mask;
	return res;    		
}

void main () {
	gl_FragColor = packDepth (depth);
}
