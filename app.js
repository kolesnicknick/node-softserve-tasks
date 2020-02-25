const path = require('path');
const http = require('http');
const fs = require('fs');
const uuid = require('uuid/v4');

const server = http.createServer((req, res) => {
    req.setEncoding('utf8');
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    }).on('end', () => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Content-Type', 'application/json');
    
        if (req.url === '/tasks') {
            fs.readdir(path.join(__dirname, 'tasks'), (err, tasks) => {
                if (err) { throw err; }
                let responseBody = [];
                tasks.forEach(task => {
                    responseBody.push(JSON.parse(fs.readFileSync(path.join(__dirname, 'tasks', task), 'UTF-8')));
                });

                res.end(JSON.stringify(responseBody), 'UTF-8');
                return;
            });
        }
    
        if (req.url === '/tasks' && req.method === 'POST') {
            let data = new Uint8Array(Buffer.from(body));
            console.log(`${req.url} ${req.method} BODY: ${body}`)
    
            fs.writeFile(path.join(__dirname, 'tasks', `${uuid().split('-')[0]}.json`), data, (err) => {
                if (err) { throw err; }
                res.end(`New task created `);
                return;
            });
        }
    });

    
})

const PORT = process.env.port || 4724
server.listen(PORT, () => console.log('Running server on port ' + PORT));