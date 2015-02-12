
//var s;
//input = document.getElementById('input-msg');
function connect(){
	do{
		var name = prompt('what is your name?').trim()
	}while(name == '')

	s = io();
	s.emit('new user', {name: name, gender: 0, age: 23});
	listen();
	getElements();
}

function sendMsg(){
	var msg = input.value.trim()
	if (msg == '') return;
	//alert(msg)
	s.emit('send msg', msg);
	input.value = '';
	input.focus();
	update_msg(msg, 'my');
}

function quickSendMsg (e) {
	if (e.keyCode != 13) return;
    sendMsg();
}

function update_msg(content, msg_type){
	var msg_block = document.createElement('div');
	//var msg_item = document.createElement('span');
	msg_block.innerHTML = content;
	//msg_block.appendChild(msg_item)
	if(msg_type == 'my')
		msg_block.className = 'my-msg msg'
	else if(msg_type == 'other')
		msg_block.className = 'other-msg msg'
	else if(msg_type == 'join')
		msg_block.className = 'join-msg msg'
	else if(msg_type == 'left')
		msg_block.className = 'left-msg msg'
	board.appendChild(msg_block);
	crtl_item_number();
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

}
window.onload = connect;