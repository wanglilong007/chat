var express = require('express')
var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(express.static(__dirname + '/public'))

function hotal(){
	var rooms = [];
	var room_number = 0;

	this.add_room = function(room){
		rooms.push(room);
		room_number++;
	}

	this.del_room = function(room) {
		// body...
		rooms.pop(room);
	}

	this.get_room_num = function(){
		return rooms.length;
	}

	this.get_a_unfull_room = function(){
		var unfull_room;

		if (rooms.length == 0){
			unfull_room = new room(room_number);
			this.add_room(unfull_room);
			console.log('no room')
			return unfull_room;
		}

		for (var i = rooms.length - 1; i >= 0; i--) {
			if(!rooms[i].is_full(2)){
				unfull_room = rooms[i];
				console.log('search a room')
				break;
			}		
		};

		if (i == -1) {
			unfull_room = new room(room_number);
			this.add_room(unfull_room);
			console.log('do not searched a room')
		};
		return unfull_room;
	}

	this.get_room_by_number = function (number) {
		// body...
		for (var i = rooms.length - 1; i >= 0; i--) {
			if(rooms[i].room_number == number) {
				console.log('room_number = ' + rooms[i].room_number)
				return rooms[i];
			}
		};
	}
}

function room(room_number){
	//this.hotal = hotal;
	var members = [];
	this.room_number = room_number;
	this.join_member = function(member){
		members.push(member);
		//room_number++;
	}

	this.rm_member_by_socket_id = function(socket_id){
		console.log('function socket_id = ' + socket_id);
		var rm_member;
		for (var i = members.length - 1; i >= 0; i--) {
			if (members[i].socket_id == socket_id){
				rm_member = members[i];
				//delete members[i];
				members.splice(i, 1);
				return	rm_member;
			}		
		};
		//members.pop(member);
	}

	this.get_member_num = function(){
		return members.length;
	}

	this.is_full = function(number){
		//console.log(members.length)
		return members.length == number;
	}
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
		socket.to(socket.rooms[1]).emit('new msg', data)
		console.log(socket.rooms)
	})
	socket.on('new user', function(data){
		//console.log(data)
		var member = data;
		member.socket_id = socket.id;
		var room = app_hotal.get_a_unfull_room();
		var room_id = room.room_number.toString();
		socket.join(room.room_number);
		socket.room_id = room_id;
		room.join_member(member);
		socket.emit('user join', member.name)
		socket.to(room_id).emit('user join', member.name)
		console.log(member)
	})

	  // when the user disconnects.. perform this
    socket.on('disconnect', function () {
    // remove the username from global usernames list
    	console.log(socket.room_id)
    	var room_number = socket.room_id;
    	var socket_id = socket.id
    	console.log('socket_id = ' + socket_id)
    	console.log('socket number = ' + room_number)
    	var room = app_hotal.get_room_by_number(room_number);
    	console.log('room searched result = ' + room.room_number)
    	var member = room.rm_member_by_socket_id(socket_id);
    	socket.to(room_number.toString()).emit('user left', member.name);
  	});
	//console.log(socket.id)
	//rooms.push(socket.id)

	//console.log(data)
	//console.log(socket.rooms)
})

server.listen(3000)
console.log('listen 3000')
