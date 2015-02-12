
//var s;
//input = document.getElementById('input-msg');
function connect(){
	do{
		var name = prompt('what is your name?').trim()
	}while(name == '')

	s = io();
	s.emit('new user', {name: name, sender: 0, age: 23});
	listen();
	getElements();
}

function sendMsg(){
	var msg = input.value.trim()
	//alert(msg)
	s.emit('send msg', msg);
	input.value = '';
	input.focus();
	update_msg(msg, 'my');
}

function update_msg(content, msg_type){
	var msg_item = document.createElement('div');
	msg_item.innerHTML = content;
	if(msg_type == 'my')
		msg_item.className = 'my-msg msg'
	else if(msg_type == 'other')
		msg_item.className = 'other-msg msg'
	else if(msg_type == 'join')
		msg_item.className = 'join-msg msg'
	else if(msg_type == 'left')
		msg_item.className = 'left-msg msg'
	board.appendChild(msg_item);
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