var express = require('express');
var app = express();
var path = require('path');
var {PythonShell} = require('python-shell');
PythonShell.defaultOptions = { scriptPath: './python'}
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/launch',function (req, res) {
    var pyShell = new PythonShell('trainmodel.py');
    var results = [];
    pyShell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
        results.push(message);
      });

      pyShell.end(function (err) {
        if (err){
            throw err;
        };
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
        res.send(results);
    });
})

app.get('/evaluate',function (req, res) {
    var pyShell = new PythonShell('evaluatemodel.py');
    var results = [];
    pyShell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
        results.push(message);
      });

      pyShell.end(function (err) {
        if (err){
            throw err;
        };
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
        res.send(results);
    });
})

app.post('/reverse',function (req, res) {
    
})

app.get('/epochs/:total',function (req, res) {
    
})

app.listen(8080);
console.log("listening on port 3000");