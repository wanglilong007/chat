var express = require('express')
var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(express.static(__dirname + '/public'))

io.on('connection', function(socket){
	socket.on('send msg', function(data){
		console.log(data)
		socket.broadcast.emit('new msg', data)
	})
	socket.on('new user', function(data){
		console.log(data)
		socket.broadcast.emit('user join', data)
	})
	console.log(socket.id)
})

server.listen(3000)
console.log('listen 3000')
