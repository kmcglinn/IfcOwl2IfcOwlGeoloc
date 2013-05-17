// create a new virtual camera object
function Camera (fov_deg, aspect, nearClip, farClip, wc_pos, direction) {
	this.mFOV_deg = fov_deg;
	this.mAspect = aspect;
	this.mNearClip = nearClip;
	this.mFarClip = farClip;
	this.mWC_Pos = wc_pos;
	this.mCurrentYaw_deg = 0;
	this.mCurrentPitch_deg = 0;

        this.m_heading = 0.0; // yaw to heading
	this.m_attitude = 45.0; // pitch to attitude
	this.m_inv_T = inverse_mat4 (
		translate_mat4 (identity_mat4 (), this.mWC_Pos)
	);
	var qa = quat (this.m_attitude, [1, 0, 0]);
	qa = normalise_quat (qa);
	var R = quat_to_mat4 (qa);
	
	// these vectors keep track of camera orientation to allow cam-relative moves
	this.m_forward = mult_mat4_vec4 (R, [0, 0, -1, 0]);
	this.m_right = mult_mat4_vec4 (R, [1, 0, 0, 0]);
	
	this.m_inv_R = inverse_mat4 (R);
	this.mViewMat = mult_mat4_mat4 (this.m_inv_R, this.m_inv_T); 
	this.mProjMat = perspective (this.mFOV_deg, this.mAspect, this.mNearClip, this.mFarClip);
	
	this.setPos = function (wc_pos) {
		this.mWC_Pos = wc_pos;

                if (this.mWC_Pos[1] < 0) {
			this.mWC_Pos[1] = 0;
		}
		this.m_inv_T = inverse_mat4 (
			translate_mat4 (identity_mat4 (), this.mWC_Pos)
		);
		this.mViewMat = mult_mat4_mat4 (this.m_inv_R, this.m_inv_T);
	}
	
	this.moveBy = function (wc_dist) {
		var pos = [0, 0, 0];
		pos[0] = wc_dist[0] + this.mWC_Pos[0];
		pos[1] = wc_dist[1] + this.mWC_Pos[1];
		pos[2] = wc_dist[2] + this.mWC_Pos[2];
		//alert("new pos: " + pos[0] + ", " + pos[1] + ", " + pos[2])
		
		this.setPos (pos);
	}
	
//	this.moveInCamDirBy = function (wc_dist) {
	this.move_cam_relative_forward_by = function (wc_dist) {
		var pos = [0, 0, 0];
//		pos[0] = wc_dist * this.mDirection[0] + this.mWC_Pos[0];
//		pos[1] = wc_dist * this.mDirection[1] + this.mWC_Pos[1];
//		pos[2] = wc_dist * this.mDirection[2] + this.mWC_Pos[2];
		//alert("new pos: " + pos[0] + ", " + pos[1] + ", " + pos[2])
		pos[0] = -wc_dist[2] * this.m_forward[0] + this.mWC_Pos[0];
		pos[1] = -wc_dist[2] * this.m_forward[1] + this.mWC_Pos[1];
		pos[2] = -wc_dist[2] * this.m_forward[2] + this.mWC_Pos[2];
		console.log (this.mWC_Pos);
		this.setPos (pos);
	}
	
//	this.slideCamBy = function (wc_dist) {
//		var sideVec = cross_vec3 (this.mDirection, [0, 1, 0]); // NOTE didn't work in var v = cross (1,2) format
	this.move_cam_relative_sideways_by = function (wc_dist) {
		var sideVec = cross_vec3 (this.m_forward, [0, 1, 0]);
		var pos = [0, 0, 0];
//		pos[0] = wc_dist * sideVec[0] + this.mWC_Pos[0];
//		pos[1] = wc_dist * sideVec[1] + this.mWC_Pos[1];
//		pos[2] = wc_dist * sideVec[2] + this.mWC_Pos[2];
		//alert("slide dir = " + sideVec[0] + " " + sideVec[1] + " " + sideVec[2]);
		//alert("new pos: " + pos[0] + ", " + pos[1] + ", " + pos[2])
		pos[0] = wc_dist[0] * this.m_right[0] + this.mWC_Pos[0];
		pos[1] = wc_dist[0] * this.m_right[1] + this.mWC_Pos[1];
		pos[2] = wc_dist[0] * this.m_right[2] + this.mWC_Pos[2];
                
		this.setPos (pos);
	}
	
//	this.deltaYaw = function (yaw) {
//		var yawmat = rotate_y_deg (mat4.identity (), -yaw); // oppose mouse direction with -ve yaw
//		this.mDirection = mult_mat4_vec3 (yawmat, this.mDirection);
//		this.setPos (this.mWC_Pos);
//	}
	this.change_attitude = function (deg_per_s, seconds) {
		var deg = deg_per_s * seconds;
		this.m_attitude += deg;
		var qa = quat (this.m_attitude, [1, 0, 0]);
		var qh = quat (this.m_heading, [0, 1, 0]);
		var q = mult_q_q (qa, qh);
		q = normalise_quat (q);
		
		var R = quat_to_mat4 (q);
	
		// these vectors keep track of camera orientation to allow cam-relative moves
		this.m_forward = mult_mat4_vec4 (R, [0, 0, -1, 0]);
		this.m_right = mult_mat4_vec4 (R, [1, 0, 0, 0]);
		
		this.m_inv_R = inverse_mat4 (R);
		this.mViewMat = mult_mat4_mat4 (this.m_inv_R, this.m_inv_T);
	}
	
	this.change_heading = function (deg_per_s, seconds) {
		var deg = deg_per_s * seconds;
		this.m_heading += deg;
		var qa = quat (this.m_attitude, [1, 0, 0]);
		var qh = quat (this.m_heading, [0, 1, 0]);
		var q = mult_q_q (qa, qh);
		q = normalise_quat (q);
		var R = quat_to_mat4 (q);
	
		// these vectors keep track of camera orientation to allow cam-relative moves
		this.m_forward = mult_mat4_vec4 (R, [0, 0, -1, 0]);
		this.m_right = mult_mat4_vec4 (R, [1, 0, 0, 0]);
		
		this.m_inv_R = inverse_mat4 (R);
		this.mViewMat = mult_mat4_mat4 (this.m_inv_R, this.m_inv_T);
        }
}
