var express = require('express')
var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(express.static(__dirname + '/public'))

function hotal(){
	this.rooms = [];
	this.room_number = 0;
}

hotal.prototype.add_room = function(room){
	this.rooms.push(room);
	this.room_number++;
}

hotal.prototype.del_room = function() {
	// body...
}

hotal.prototype.get_room_num = function(){
	return this.rooms.length;
}

hotal.prototype.get_a_room = function(member, condition){
	var unfull_room;

	if (this.rooms.length == 0){
		unfull_room = new room(this.room_number);
		this.add_room(unfull_room);
		console.log('no room')
		return unfull_room;
	}

	if (typeof condition === 'function') {
		for (var i = this.rooms.length - 1; i >= 0; i--) {
			if(condition(member, this.rooms[i])){
				unfull_room = this.rooms[i];
				console.log('search a room')
				break;
			}		
		};
	} else {
		return;
	}

	if (i == -1) {
		unfull_room = new room(this.room_number);
		this.add_room(unfull_room);
		console.log('do not searched a room')
	};
	return unfull_room;
}

function get_unfull_room (member, room) {
	if (room.get_member_num() != 2)
		return true;
}

function get_other_gender_room (member, room) {
	if (room.get_member_num() == 1 && room.members[0].gender != member.gender)
		return true;
}

function get_near_other_gender_room (member, room) {
	if (get_other_gender_room(member, room) && abs(member.position - room.members[0].position) <= 1000)
		return true;
}

hotal.prototype.get_room_by_number = function (number) {
	// body...
	for (var i = this.rooms.length - 1; i >= 0; i--) {
		if(this.rooms[i].room_number == number) {
			console.log('room_number = ' + this.rooms[i].room_number)
			return this.rooms[i];
		}
	};
}

function room(room_number){
	//this.hotal = hotal;
	this.members = [];
	this.room_number = room_number;
}

room.prototype.join_member = function(member){
	this.members.push(member);
}

room.prototype.rm_member_by_socket_id = function(socket_id){
	var rm_member;
	for (var i = this.members.length - 1; i >= 0; i--) {
		if (this.members[i].socket_id == socket_id){
			//delete members[i];
			return	this.members.splice(i, 1);
		}		
	};
}

room.prototype.get_member_num = function(){
	return this.members.length;
}

room.prototype.is_full = function(number){
	return this.members.length == number;
}

function member (socket_id, name, age, gender) {
	// body...
	this.socket_id = socket_id;
	this.name = name;
	this.age = age;
	this.gender = gender;
}

app_hotal = new hotal();

io.on('connection', function(socket){
	socket.on('send msg', function(data){
		//console.log(data)
		socket.to(socket.room_id).emit('new msg', data)
		console.log(socket.rooms)
	})
	socket.on('new user', function(data){
		//每个人保存他对应的socketid，每个socket保存他所在的房间号
		var member = data;
		member.socket_id = socket.id;
		var room = app_hotal.get_a_room(member, get_unfull_room);
		var room_id = room.room_number.toString();
		socket.join(room_id);
		socket.room_id = room_id;
		room.join_member(member);
		socket.emit('user join', member.name)
		socket.to(room_id).emit('user join', member.name)
		console.log(member)
	})

	  // when the user disconnects.. perform this
    socket.on('disconnect', function () {
    	if (socket.room_id == undefined) return;

    	var room_number = socket.room_id;
    	var socket_id = socket.id
    	//根据房间号，返回房间
    	var room = app_hotal.get_room_by_number(room_number);
    	//根据socketid，从房间找到要离开的人
    	var member = room.rm_member_by_socket_id(socket_id);
    	//通知此人离开
    	socket.to(room_number).emit('user left', member[0].name);
  	});
})

server.listen(3000)
console.log('listen 3000')
