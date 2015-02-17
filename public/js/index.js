
//var s;
var input, board, total_number, room_number;
//input = document.getElementById('input-msg');

function init (argument) {
	document.onkeydown=quickSendMsg;
	listen();
	getElements();
	input.focus();
}
function connect(){
	var name = prompt('随便起个名字');
	if (name == null || name.trim() == '')
		name = '无名'
	s = io();
	s.emit('new user', {name: name, gender: 0, age: 23});
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
	get_pos();
}

function quickSendMsg (e) {
	var currKey = 0;
	var et = e || window.event ;
　　 currKey=et.keyCode||et.which||et.charCode;
　　 var keyName = String.fromCharCode(currKey);
　　 //alert("按键码: " + currKey + " 字符: " + keyName); 
	if (currKey != 13) return;
    sendMsg();
}

function update_msg(content, msg_type){
	var msg_block = document.createElement('div');
	var msg_item = document.createElement('div');
	var msg = document.createTextNode(content.msg);
	//msg_item.innerHTML = content.msg;
	msg_item.appendChild(msg)
	if(msg_type == 'my'){
		msg_item.className = 'my-msg-item msg-item';
		msg_block.className = 'msg'
		msg_block.appendChild(msg_item);	
	}
	else if(msg_type == 'other'){
		msg_item.className = 'other-msg-item msg-item';
		msg_block.className = 'msg'
		msg_block.appendChild(msg_item);
	}	
	else if(msg_type == 'join'){
		msg_block.innerHTML = content.msg + ' 加入';
		update_room_number(content.room_num)
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
}

function update_online_number (data) {
	// body...
	total_number.innerHTML = data;
}

function update_room_number (data) {
	// body...
	room_number.innerHTML = data;
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
	alert(error);
}

function locationSuccess (position) {
	// body...
	var ak = '?ak=G7n5tzw3PunoezFUy1yG6XR0';
	var baidu_api = '&http://api.map.baidu.com/geocoder/v2/';
	var location= '&location=' + position.coords.latitude + ',' + position.coords.longitude;
	alert(location);
	var callback = '&callback=render_pos';
	var url = baidu_api + ak + callback + position + '&output=json&pois=0'
	//http://api.map.baidu.com/geocoder/v2/?ak=E4805d16520de693a3fe707cdc962045&callback=renderReverse&location=39.983424,116.322987&output=json&pois=1
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.onreadystatechange = function () {
		// body...
		if (xhr.readystate === 4 && xhr.status === 200) {
			console.log('seccess');
			alert('seccess');
		}
	}
	xhr.send(null);
}

function render_pos (argument) {
	// body...
	console.log('call back');
	alert('callback');
}
window.onload = connect;