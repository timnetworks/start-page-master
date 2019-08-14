/*
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2018 Jaume Fuster i Claris
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

// "Thus, programs must be written for people to read, and only incidentally for machines to execute."
// TODO: Commenting.

var step = 5; // Max direction x and y in pixels
var slep = 20; // Milliseconds between steps

var sites = document.getElementById("sites");
var direction = {
	"x": Math.floor(Math.random()*step),
	"y": Math.floor(Math.random()*step)
};

if (Math.floor(Math.random()*2)) {
	direction["x"] = -direction["x"];
}
if (Math.floor(Math.random()*2)) {
	direction["y"] = -direction["y"];
}

function move() {
	sp = sites.getBoundingClientRect();
	t = l = 0;
	if (sp.y <= 0 || sp.y + sp.height >= window.innerHeight) {
		direction["y"] = -(direction["y"]);
	}
	// Separated ifs for the extremelly rare case of epic moment corner boing extreme
	if (sp.x <= 0 || sp.x + sp.width >= window.innerWidth) {
		direction["x"] = -(direction["x"]);
	}
	sites.style.left = (parseFloat(sites.offsetLeft)+direction["x"]+l)+"px";
	sites.style.top = (parseFloat(sites.offsetTop)+direction["y"]+t)+"px";
}

var sick_movez = 0;

function bzz() {
	if (sick_movez != 0) {
		clearInterval(sick_movez);
		sick_movez = 0;
		sites.style.top = "50%";
		sites.style.left = "50%";
		//sites.style.opacity = "1";
		direction = {
			"x": Math.floor(Math.random()*(step*2))-step,
			"y": Math.floor(Math.random()*(step*2))-step
		};
	} else {
		sites.style.top = sites.offsetTop+"px";
		sites.style.left = sites.offsetLeft+"px";
		sick_movez = setInterval(move, slep);
		//sites.style.opacity = ".2";
	}
}

document.onkeydown = function(e) {
	if (e.key != "Tab") {
		document.getElementById("duck").focus();
	}
}

// Show IP Address

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */

function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }, noop); 

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

	// Usage

	getUserIP(function(ip){
		document.getElementById("ip").innerHTML = ip;
});