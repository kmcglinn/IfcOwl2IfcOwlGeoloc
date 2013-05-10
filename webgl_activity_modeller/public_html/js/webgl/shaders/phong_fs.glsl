precision mediump float;

uniform mat4 view_mat;

varying vec3 p_eye, n_eye;

vec3 e_light_pos = vec3 (0.0, -50.0, -40.0);
vec3 s = normalize (e_light_pos - p_eye);
vec3 n = normalize (n_eye);

vec3 calc_diffuse () {
	vec3 Ld = vec3 (1.0, 0.9, 0.6);
	vec3 Kd = vec3 (0.5, 0.5, 0.5);
	
  float dot_prod = dot (s, n);
  dot_prod = max (dot_prod, 0.0);
  vec3 Id = Ld * Kd * dot_prod;
	return Id;
}

vec3 calc_spec () {

	vec3 Ls = vec3 (1.0, 1.0, 1.0);
	vec3 v = normalize (-p_eye);
	
	// blinn phong
	vec3 h = normalize (s + v);
	float dprod2 = dot (h, n);
	float Ns = 6.0;
	
	dprod2 = max (dprod2, 0.0);
	float power = pow (dprod2, Ns);
	vec3 Is = Ls * power;
	return Is;
}

void main () {
	gl_FragColor = vec4 (calc_diffuse () + calc_spec () , 1.0);//vec4 (calc_diffuse () + calc_spec (), 1.0);
}
