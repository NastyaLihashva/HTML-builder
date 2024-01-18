const fs = require('fs');
const path = require('path');
const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
let { stdin, exit } = require('process');

console.log('Привет! Введите текст:');

stdin.on("data", function(chunk) {
    if (chunk.toString().trim() === 'exit') {
        console.log('Пока!');
        exit();
    } else {
        stream.write(chunk);
    }
})

process.on('SIGINT', function() {
    console.log('Пока!');
    exit();
});