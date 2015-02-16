
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
}

function quickSendMsg (e) {
	var currKey = 0;
	var et = e || window.event ;
　　 currKey=et.keyCode||et.which||et.charCode;
　　 var keyName = String.fromCharCode(currKey);
　　 alert("按键码: " + currKey + " 字符: " + keyName); 
	if (currKey != 13) return;
    sendMsg();
}

function update_msg(content, msg_type){
	var msg_block = document.createElement('div');
	var msg_item = document.createElement('div');
	//var msg = document.createTextNode(content.msg);
	msg_item.innerHTML = content.msg;
	//msg_block.appendChild(msg_item)
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
window.onload = connect;