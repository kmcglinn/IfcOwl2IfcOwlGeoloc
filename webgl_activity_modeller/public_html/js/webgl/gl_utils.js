// download a file from a URL and return a string when finished
function _get_string_from_URL (url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open ("GET", url, false);
  xmlhttp.send ();
  return xmlhttp.responseText;
}

function _compile_shader (url, type) {
	console.log ("compiling shader type " + type + " url:" + url);
	var shader_str = _get_string_from_URL (url);
	var shader_idx;
	if ("vertex" == type) {
		shader_idx = gl.createShader (gl.VERTEX_SHADER);
	} else {
		shader_idx = gl.createShader (gl.FRAGMENT_SHADER);
	}
	gl.shaderSource (shader_idx, shader_str);
	gl.compileShader (shader_idx); // compile shader code in WebGL
	if (!gl.getShaderParameter (shader_idx, gl.COMPILE_STATUS)) {
		console.error ("ERROR: GL shader type " + type + " did not compile. url: " + url);
		console.log ("info log follows:\n" + gl.getShaderInfoLog (shader_idx));
		return -1;
	}
	return shader_idx;
}

function _link_sp (sp_idx) {
	console.log ("linking shader programme");
	gl.linkProgram (sp_idx); // link shader programme
	// check if link was successful
	if (!gl.getProgramParameter (sp_idx, gl.LINK_STATUS)) {
		console.error ("error linking shader programme index " + sp_idx);
		console.log ("info log follows:\n" + gl.GetProgramInfoLog (sp_idx));
		return false;
	}
	return true;
}

function _print_all_shader_info (sp_idx) {
	console.log ("all shader info:");
  var att_sh_c = gl.getProgramParameter (sp_idx, gl.ATTACHED_SHADERS);
  console.log ("-num attached shaders: " + att_sh_c);
  var actatt_sh_c = gl.getProgramParameter (sp_idx, gl.ACTIVE_ATTRIBUTES);
  console.log ("-num active attributes: " + actatt_sh_c);
  for (var i = 0; i < actatt_sh_c; i++) {
    var act_info = gl.getActiveAttrib (sp_idx, i);
    // note: this isnt valid for arrays
    var location = gl.getAttribLocation (sp_idx, act_info.name);
    console.log (" location: " + location + " name: " + act_info.name + "type: " + act_info.type + " size: " + act_info.size);
  }
  var actuni_sh_c = gl.getProgramParameter (sp_idx, gl.ACTIVE_UNIFORMS);
  console.log ("-num active uniforms: " + actuni_sh_c);
  for (var i = 0; i < actuni_sh_c; i++) {
    var act_info = gl.getActiveUniform (sp_idx, i);
    // note: this isnt valid for arrays
    var location = gl.getUniformLocation (sp_idx, act_info.name);
    console.log (" location: " + location + " name: " + act_info.name + "type: " + act_info.type + " size: " + act_info.size);
  }
}

// load some default shaders
function load_shaders (vertex_shader_url, fragment_shader_url) {
	var vs = _compile_shader (vertex_shader_url, "vertex");
	if (vs < 0) {
		console.error ("error creating shader programme");
		return -1;
	}
	var fs = _compile_shader (fragment_shader_url, "fragment");
	if (fs < 0) {
		console.error ("error creating shader programme");
		return -1;
	}
  var sp_idx = gl.createProgram (); // create 2-stage shader programme
  gl.attachShader (sp_idx, vs); // attach compiled shader to program
  gl.attachShader (sp_idx, fs); // attach compiled shader to program
  if (!_link_sp (sp_idx)) {
  	console.error ("error creating shader programme");
  	return -1;
  }
  _print_all_shader_info (sp_idx);
  return sp_idx;
}

// create some default geometry
function create_vbo (array) {
  var vb_idx = gl.createBuffer (); // create an emtpy buffer in WebGL
  gl.bindBuffer (gl.ARRAY_BUFFER, vb_idx); // "bind" buffer in GL state machine
  // copy the array of points into the buffer with WebGL (onto the video card)
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array (array), gl.STATIC_DRAW);
  return vb_idx;
}
