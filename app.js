const path = require('path');
const http = require('http');
const fs = require('fs');
const uuid = require('uuid/v4');

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        console.log(req.method);
    }

    if (req.url === '/tasks') {
        fs.readdir(path.join(__dirname, 'tasks'), (err, tasks) => {
            if (err) { throw err; }
            let responseBody = [];
            tasks.forEach(task => {
                responseBody.push(JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks', task), 'UTF-8')));
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseBody), 'UTF-8');
        });
    }

    if (req.url === '/tasks' && req.method === 'POST') {
        let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convert Buffer to string
            });
            req.on('end', () => {
                console.log(body);
                res.end('ok');
            });
        
        fs.writeFile(path.join(__dirname, 'tasks', `${uuid}.json`), body, (err) => {
            if (err) { throw err; }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(`New task created `);
        });
    }


    if (req.url === '/tasks/:id' && req.method === 'GET') {
        //return task by id
    }
})


const PORT = process.env.port || 4724
server.listen(PORT, () => console.log('Running server on port ' + PORT));