var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,

        };
        res.writeHead(200,headers);
        res.end();
    }
});
var path = require('path');
var {PythonShell} = require('python-shell');
PythonShell.defaultOptions = { scriptPath: './python'}
var htmlOptionsEpochs =  process.env.EPOCHS;

app.get('/', function (req, res) {
    if(htmlOptionsEpochs == 50){
        res.sendFile(path.join(__dirname+'/index_reverse_50.html'));
    }
    else{
        res.sendFile(path.join(__dirname+'/index.html'))
    }
});

io.on('connection', function(client) {
    console.log('User Connected');
    client.on('join', function(data) {
        console.log(data);
        client.emit('socketstatus', 'User is connected to english to german translator');
    })

    client.on('launch', function(data) {
        console.log(data);
        var {order, epochs} = data;
        var args = [order, epochs];
        var pyShell = new PythonShell('trainmodel.py',{args});
        pyShell.on('message', function (message) {
            console.log(message);
            client.emit('launchResult', message);
        });

        pyShell.end(function (err) {
            if (err){
                throw err;
            };
        client.emit('launchFinished', 'Launch Complete');
        })
})

    client.on('evaluate', function(data) {
        console.log(data);
        var pyShell = new PythonShell('evaluatemodel.py');
        pyShell.on('message', function (message) {
            console.log(message);
            client.emit('evaluateResult', message);
        });

        pyShell.end(function (err) {
            if (err){
                throw err;
            };
        client.emit('evaluateFinished', 'Evaluation Complete');
        })
    })
})

// app.get('/launch',function (req, res) {
//     console.log("launch request recieved")
//     var pyShell = new PythonShell('trainmodel.py');
//     var results = [];
//     pyShell.on('message', function (message) {
//         // received a message sent from the Python script (a simple "print" statement)
//         console.log(message);
//         results.push(message);
//       });

//       pyShell.end(function (err) {
//         if (err){
//             throw err;
//         };
//         console.log('process completed')
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//         res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
//         res.send(results);
//     });
// })

// app.get('/evaluate',function (req, res) {
//     var pyShell = new PythonShell('evaluatemodel.py');
//     var results = [];
//     pyShell.on('message', function (message) {
//         // received a message sent from the Python script (a simple "print" statement)
//         console.log(message);
//         results.push(message);
//       });

//       pyShell.end(function (err) {
//         if (err){
//             throw err;
//         };
        
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//         res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
//         res.send(results);
//     });
// })

var port = 8080
server.listen(port, '0.0.0.0');
console.log("listening on port "+port);