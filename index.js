var express = require('express')
var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

app.use(express.static(__dirname + '/public'))

io.on('connection', function(socket){
	socket.on('connect', function(data){
		console.log(data)
	})
	console.log(socket.id)
})

server.listen(3000)
console.log('listen 3000')
