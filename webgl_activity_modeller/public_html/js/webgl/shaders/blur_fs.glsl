precision mediump float;

varying vec2 st;

uniform sampler2D ssao_tex, phong_tex;

// TODO make these uniforms
float width = 800.0;
float height = 600.0;

vec3 ambient_light () {
	vec3 La = vec3 (1.0, 1.0, 1.0);

	// 3x3 kernel for SSAO texture sampling
/*	vec2 kernel_sts[9];
	float s = 1.0 / width;
	float t = 1.0 / height;
	// left column
	kernel_sts[0] = vec2 (st.s - s, st.t + t);
	kernel_sts[1] = vec2 (st.s - s, st.t);
	kernel_sts[2] = vec2 (st.s - s, st.t - t);
	// middle column
	kernel_sts[3] = vec2 (st.s, st.t + t);
	kernel_sts[4] = vec2 (st.s, st.t);
	kernel_sts[5] = vec2 (st.s, st.t - t);
	// right column
	kernel_sts[6] = vec2 (st.s + s, st.t + t);
	kernel_sts[7] = vec2 (st.s + s, st.t);
	kernel_sts[8] = vec2 (st.s + s, st.t - t);
	// blur SSAO map
	vec3 sample = vec3 (0.0, 0.0, 0.0);
	for (int i = 0; i < 9; i++) {
		sample += texture2D (ssao_tex, kernel_sts[i]).rgb;
	}
	sample /= 9.0;*/
	// apply ambient light colour using sample as coefficient of reflection
	return La * texture2D (ssao_tex, st).rgb;
}

void main () {
	vec3 Ia = ambient_light ();
	vec3 Ids = texture2D (phong_tex, st).rgb;
	gl_FragColor = vec4 (Ids * 0.5 + Ia * 0.75, 1.0);
}
