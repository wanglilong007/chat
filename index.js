var express = require('express')
var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var http = require('http');

app.use(express.static(__dirname + '/public'))

function hotal(){
	this.rooms = [];
	this.room_number = 0;
	this.total_num = 0;
}

hotal.prototype.add_room = function(room){
	this.rooms.push(room);
	this.room_number++;
}

hotal.prototype.get_room_num = function(){
	return this.rooms.length;
}

hotal.prototype.get_a_room = function(member, condition){
	var unfull_room;

	if (this.rooms.length == 0){
		unfull_room = new room(this, this.room_number);
		this.add_room(unfull_room);
		console.log('no room, create a room')
		return unfull_room;
	}

	if (typeof condition === 'function') {
		for (var i = this.rooms.length - 1; i >= 0; i--) {
			if(condition(member, this.rooms[i])){
				unfull_room = this.rooms[i];
				console.log('search a room, join the room')
				break;
			}		
		};
	} else {
		return;
	}

	if (i == -1) {
		unfull_room = new room(this, this.room_number);
		this.add_room(unfull_room);
		console.log('do not searched a room, create a new room')
	};
	return unfull_room;
}

function get_unfull_room (member, room) {
	if (room.get_member_num() < 2)
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

function room(hotal, room_number){
	this.hotal = hotal;
	this.members = [];
	this.room_number = room_number;
}

room.prototype.join_member = function(member){
	member.socket.room_id = this.room_number;
	this.members.push(member);
	this.hotal.total_num++;
	member.socket.join(this.room_number.toString());
}

room.prototype.rm_member_by_socket_id = function(socket_id){
	var rm_member;
	for (var i = this.members.length - 1; i >= 0; i--) {
		if (this.members[i].socket.id == socket_id){
			//delete members[i];
			this.hotal.total_num--;
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

function get_pos () {
	// body...
	var options = {
	  hostname: 'api.map.baidu.com',
	  port: 80,
	  path: '/location/ip?ak=G7n5tzw3PunoezFUy1yG6XR0',
	  method: 'GET',
	  headers: {
	    'Content-Type': 'application/json',
	    'Referer': 'http://120.24.62.105:3000/'
	  }
	};

	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
	    console.log(chunk);
	  });
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	// write data to request body
	//req.write(postData);
	req.end();
}

app_hotal = new hotal();

io.on('connection', function(socket){
	socket.on('send msg', function(data){
		//console.log(data)
		socket.to(socket.room_id).emit('new msg', data)
		//console.log(socket.rooms)
	})
	socket.on('new user', function(data){
		//每个人保存他对应的socketid，每个socket保存他所在的房间号
		var member = data;
		//assign a unfull room
		var room = app_hotal.get_a_room(member, get_unfull_room);
		var room_id = room.room_number.toString();
		// set socket as an attribute of this member
		member.socket = socket;
		//add the member to the room
		room.join_member(member);
		//console.log(socket);
		member_info = {
			msg: member.name,
			room_num: room.get_member_num(),
		}

		socket.emit('user join', member_info)
		socket.to(room_id).emit('user join', member_info)
		socket.emit('number change', app_hotal.total_num);
		socket.broadcast.emit('number change', app_hotal.total_num);
		//console.log(member_info)
		//get_pos();
	})

	socket.on('get position', function (data) {
		// body...
		if (data.from == 'ip') {
			var options = {
			  hostname: 'api.map.baidu.com',
			  port: 80,
			  path: '/location/ip?ak=G7n5tzw3PunoezFUy1yG6XR0&ip=120.24.62.105',
			  method: 'GET',
			  headers: {
			    'Content-Type': 'application/json',
			    'Referer': 'http://120.24.62.105:3000/'
			  }
			};

			var req = http.request(options, function(res) {
			  console.log('STATUS: ' + res.statusCode);
			  console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  res.on('data', function (chunk) {
			    //console.log('BODY: ' + chunk);
			    data = JSON.parse(chunk)
			    //console.log(typeof data)
			    //console.log(data.address);
			    var address = {address: data.address}
				socket.emit('position', address);
				socket.to(socket.room_id).emit('position', address)
				//console.log(address);
			  });
			});

			req.on('error', function(e) {
			  console.log('problem with request: ' + e.message);
			});
			// write data to request body
			//req.write(postData);
			req.end();
		}	
		else {
			var address = {address: data.result.formatted_address}
			socket.emit('position', address);
			socket.to(socket.room_id).emit('position', address)
			console.log(address);
		}
			
	})

	socket.on('typing', function () {
		// body...
		socket.to(socket.room_id).emit('typing');
	})

	socket.on('stop typing', function () {
		// body...
		socket.to(socket.room_id).emit('stop typing');
	})

	  // when the user disconnects.. perform this
    socket.on('disconnect', function () {
    	if (socket.room_id == undefined) return;
    	//console.log('disconnect')

    	var room_number = socket.room_id;
    	var socket_id = socket.id
    	//根据房间号，返回房间
    	var room = app_hotal.get_room_by_number(room_number);
    	//console.log('searched the room')
    	//根据socketid，从房间找到要离开的人
    	var member = room.rm_member_by_socket_id(socket_id);
    	//console.log('removed the person')
    	//通知此人离开
    	member_info = {
			msg: '对方',
			room_num: room.get_member_num()
		}
    	socket.to(room_number).emit('user left', member_info);
    	socket.emit('number change', app_hotal.total_num);
    	socket.broadcast.emit('number change', app_hotal.total_num);
    	//console.log('emited leave')
  	});
})

server.listen(3000)
console.log('listen 3000')
