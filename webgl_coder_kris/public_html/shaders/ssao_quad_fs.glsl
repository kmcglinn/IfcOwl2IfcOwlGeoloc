precision mediump float;

varying vec2 st;
uniform mat4 inv_proj_mat;
uniform sampler2D tex, depth_tex;

// TODO make these uniforms
float width = 800.0;
float height = 600.0;

float unpackDepth(const in vec4 rgba_depth) {
	const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
	float depth = dot(rgba_depth, bit_shift);
	return depth;
}      

vec3 pos_from_depth (vec2 coord) {
	// ANTON average depth
	float d = unpackDepth ( texture2D(depth_tex, coord));//texture2D (tex, coord).a;
	// ANTON the 0.5 *2 thing seems to be causing an imbalance here
	//vec3 tray = mat3 (inv_proj_mat) *	vec3 ((coord.s) * 2.0, (coord.t) * 2.0, 1.0);
	vec3 tray = mat3 (inv_proj_mat) *	vec3 (coord, 1.0);
	return tray * d;
}

vec3 read_normal (vec2 coord) {  
	return normalize (2.0 * texture2D (tex, coord).rgb - 1.0);  
}

// Ambient Occlusion form factor:
float aoFF (in vec3 ddiff, in vec3 cnorm, in float c1, in float c2) {
	vec3 vv = normalize (ddiff);
	float rd = length (ddiff);
	float v = (1.0 -	clamp (dot (read_normal (st + vec2 (c1, c2)),	-vv),	0.0, 1.0 ) ) *
	clamp (dot (cnorm, vv),	0.0, 1.0) * (1.0 - 1.0 / sqrt (1.0 / (rd * rd) + 1.0));
	return v;
}

void main () {
	//vec4 sample = texture2D (tex, st);
	
	// HACK
	/*vec4 ds = texture2D (depth_tex, st);
	float dephack = unpackDepth (ds);
	gl_FragColor = ds;// vec4 (dephack, dephack, dephack, 1.0);
	return;*/
	// END HACK

	vec3 n = read_normal (st);
	vec3 p = pos_from_depth (st);
	
	//initialize variables:
	float ao = 0.0;
	vec3 gi = vec3 (0.0, 0.0, 0.0);
	float incx = 1.0 / width * 0.1;
	float incy = 1.0 / height * 0.1;
	float pw = incx;
	float ph = incy;
	// ANTON replaced depth texture lookup with normal map alpha channel
	float cdepth = unpackDepth ( texture2D(depth_tex, st));//sample.a;
	
	//3 rounds of 8 samples each. 
	for (int i = 0; i < 3; ++i) {
		float npw = (pw + 0.0007) / cdepth;
		float nph = (ph + 0.0007) / cdepth;

		vec3 ddiff = pos_from_depth (st + vec2 (npw, nph)) - p;
		vec3 ddiff2 = pos_from_depth (st + vec2 (npw, -nph)) - p;
		vec3 ddiff3 = pos_from_depth (st + vec2 (-npw, nph)) - p;
		vec3 ddiff4 = pos_from_depth (st + vec2 (-npw, -nph)) - p;
		vec3 ddiff5 = pos_from_depth (st + vec2 (0, nph)) - p;
		vec3 ddiff6 = pos_from_depth (st + vec2 (0, -nph)) - p;
		vec3 ddiff7 = pos_from_depth (st + vec2 (npw, 0)) - p;
		vec3 ddiff8 = pos_from_depth (st + vec2 (-npw, 0)) - p;

		ao += aoFF (ddiff, n, npw, nph);
		ao += aoFF (ddiff2, n, npw, -nph);
		ao += aoFF (ddiff3, n, -npw, nph);
		ao += aoFF (ddiff4, n, -npw, -nph);
		ao += aoFF (ddiff5, n, 0.0, nph);
		ao += aoFF (ddiff6, n, 0.0, -nph);
		ao += aoFF (ddiff7, n, npw, 0.0);
		ao += aoFF (ddiff8, n, -npw, 0.0);

// ANTON commented out diffuse map blend
/*
		gi+=  giFF (ddiff, n, npw, nph) * texture (gdiffuse, st + vec2 (npw, nph)).rgb;
		gi+=  giFF (ddiff2, n, npw, -nph) * texture (gdiffuse, st + vec2 (npw, -nph)).rgb;
		gi+=  giFF (ddiff3, n, -npw, nph) * texture (gdiffuse, st + vec2 (-npw, nph)).rgb;
		gi+=  giFF (ddiff4, n, -npw, -nph) * texture (gdiffuse, st + vec2 (-npw, -nph)).rgb;
		gi+=  giFF (ddiff5, n, 0, nph) * texture (gdiffuse, st + vec2 (0, nph)).rgb;
		gi+=  giFF (ddiff6, n, 0, -nph) * texture (gdiffuse, st + vec2 (0, -nph)).rgb;
		gi+=  giFF (ddiff7, n, npw, 0) * texture (gdiffuse, st + vec2 (npw, 0)).rgb;
		gi+=  giFF (ddiff8, n, -npw, 0) * texture (gdiffuse, st + vec2 (-npw, 0)).rgb;
*/
		//increase sampling area:
		pw += incx;  
		ph += incy;    
	} 
	ao /= 24.0;
// ANTON commented out diffuse map blend
	/*gi /= 24.0;*/
// ANTON commented out diffuse map blend
	
	gl_FragColor = vec4 (vec3 (1.0) - vec3 (ao), 1.0);
}
