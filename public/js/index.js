
//var s;
var input, board, total_number, room_number;
//input = document.getElementById('input-msg');

function init (argument) {
	document.onkeydown=quickSendMsg;
	listen();
	getElements();
	get_pos();
	//test_ajax('&location=22.648018,114.058367')
	input.focus();
}
function connect(){
	/*
	var name = prompt('随便起个名字');
	var pos = '';
	if (name == null || name.trim() == '')
		name = '无名'
	*/
	var name = '有人';
	s = io();
	s.emit('new user', {name: name});
	init();
}

function sendMsg(){
	var msg = input.value.trim()
	if (msg == '') return;
	//alert(msg)
	var data = {};
	data.msg = msg
	s.emit('send msg', data);
	input.value = '';
	update_msg(data, 'my');
	input.focus();
	//geocoder(114.058367, 22.648018);
	//test_ajax();
}

function quickSendMsg (e) {
	s.emit('typing');
	var currKey = 0;
	var et = e || window.event ;
　　 currKey=et.keyCode||et.which||et.charCode;
　　 //var keyName = String.fromCharCode(currKey);
　　 //alert("按键码: " + currKey + " 字符: " + keyName);
	s.emit('stop typing');
	if (currKey != 13) return;
    sendMsg();
}

function update_msg(content, msg_type){
	var msg_block = document.createElement('div');
	var msg_item = document.createElement('div');
	var msg = document.createTextNode(content.msg);
	//msg_item.innerHTML = content.msg;
	
	if(msg_type == 'my'){
		msg_item.className = 'my-msg-item msg-item';
		msg_block.className = 'msg'
		msg_item.appendChild(msg)
		msg_block.appendChild(msg_item);	
	}
	else if(msg_type == 'other'){
		msg_item.className = 'other-msg-item msg-item';
		msg_block.className = 'msg'
		msg_item.appendChild(msg)
		msg_block.appendChild(msg_item);
	}	
	else if(msg_type == 'join'){
		msg_block.innerHTML = content.msg + ' 加入';
		update_room_number(content.room_num)
		msg_block.className = 'join-msg msg'
	}
	else if(msg_type == 'position'){
		msg_block.innerHTML = '来自 ' + content.address;
		msg_block.className = 'join-msg msg'
	}
	else if(msg_type == 'left'){
		msg_block.innerHTML = content.msg + ' 离开';
		update_room_number(content.room_num)
		msg_block.className = 'left-msg msg'
	}		

	board.appendChild(msg_block);
	//crtl_item_number();
	board.scrollTop = board.scrollHeight;
}

function crtl_item_number()
{
	var all_msg = document.getElementsByClassName('msg');
	if(all_msg.length > 10)
		board.removeChild(all_msg[0]);
}

function getElements(){
	board = document.getElementsByClassName('msg-board')[0];
	input = document.getElementById('input-msg');
	total_number = document.getElementById('total-number');
	room_number = document.getElementById('room-number'); 
	type_info = document.getElementById('type-info');
}

function update_online_number (data) {
	// body...
	total_number.innerHTML = data;
}

function update_room_number (data) {
	// body...
	room_number.innerHTML = data;
}

function show_type_info () {
	// body...
	type_info.innerHTML = '对方正在输入...'
}

function hide_type_info () {
	// body...
	type_info.innerHTML = ''
}

function listen(){
	s.on('new msg', function(data){
		//alert(data);
		update_msg(data, 'other');
	});

	s.on('user join', function(data){
		//alert(data);
		update_msg(data, 'join');
	});

	s.on('user left', function(data){
		//alert(data);	
		update_msg(data, 'left');	
	});

	s.on('number change', function(data){
		//alert(data);
		update_online_number(data);
		//console.log(data);
	});

	s.on('position', function (data) {
		// body...
		update_msg(data, 'position');
	})

	s.on('typing', function () {
		// body...
		show_type_info();
	})

	s.on('stop typing', function () {
		// body...
		hide_type_info();
	})
}

function get_pos () {
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(locationSuccess, locationError,{
	        // 指示浏览器获取高精度的位置，默认为false
	        enableHighAcuracy: true,
	        // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
	        timeout: 5000,
	        // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
	        maximumAge: 3000
		    });
		}else{
		    alert("Your browser does not support Geolocation!");
	}
}

function locationError (error) {
	// body...
	get_pos_by_ip();
	switch(error.code) {
        case error.TIMEOUT:
            showError("A timeout occured! Please try again!");
            break;
        case error.POSITION_UNAVAILABLE:
            showError('We can\'t detect your location. Sorry!');
            break;
        case error.PERMISSION_DENIED:
            showError('Please allow geolocation access for this to work.');
            break;
        case error.UNKNOWN_ERROR:
            showError('An unknown error occured!');
            break;
    }
}

function showError (error) {
	// body...
	console.log(error);
	//alert(error);
}

function locationSuccess (position) {
	// body...
	var location= '&location=' + position.coords.latitude + ',' + position.coords.longitude;
	//geocoder(position.coords.longitude, position.coords.latitude);
	//alert(location);
	test_ajax(location)
}

function render_pos (data) {
	// body...
	//alert(argument);
	data.from = 'notip'
	console.log(data);
	//alert(data.result.formatted_address);
	s.emit('get position', data);
}

function test_ajax (pos_str) {
	// body...
	var ak = '?ak=G7n5tzw3PunoezFUy1yG6XR0';
	var baidu_api = 'http://api.map.baidu.com/geocoder/v2/';
	//var location = '&location=22.648018,114.058367';
	var location = pos_str;
	//alert(location);
	var callback = '&callback=render_pos';
	var url = baidu_api + ak + callback + location + '&output=json&pois=0'
	//http://api.map.baidu.com/geocoder/v2/?ak=E4805d16520de693a3fe707cdc962045&callback=renderReverse&
	//location=39.983424,116.322987&output=json&pois=1
	//alert(url)
	jsonp(url); 
}

function jsonp (url) {
	// body...
	var JSONP=document.createElement("script");  
    JSONP.type="text/javascript";  
    JSONP.src=url;
    document.getElementsByTagName("head")[0].appendChild(JSONP); 
}

function get_pos_by_ip () {
	//var url = 'http://api.map.baidu.com/location/ip?ak=G7n5tzw3PunoezFUy1yG6XR0';
	//jsonp(url);
	var data = {};
	data.from = 'ip'
	console.log(data);
	//alert(data.result.formatted_address);
	s.emit('get position', data);
}

function geocoder(longitude, latitude) {
    var MGeocoder;
    var address;
    var lnglatXY = new AMap.LngLat(longitude, latitude);
    //加载地理编码插件
    AMap.service(["AMap.Geocoder"], function() {        
        MGeocoder = new AMap.Geocoder({ 
            radius: 10,
            extensions: "all"
        });
        //逆地理编码
        MGeocoder.getAddress(lnglatXY, function(status, result){
        	if(status === 'complete' && result.info === 'OK'){
        		geocoder_CallBack(result);
        	}
        });
    });

	function geocoder_CallBack(data) {
	    var resultStr = "";
	    var poiinfo="";
	    //返回地址描述
	    address = data.regeocode.formattedAddress;
	    //console.log(address);
	    //alert(address);
	}
}
window.onload = connect;