const fs = require('fs');
const path = require('path');
const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(pathStyles, {withFileTypes: true}, function(error, files) {
    let result = [];
    if (error) console.log(error);

    fs.writeFile(pathBundle, '', function(error) {
        if (error) console.log(error);
    });

    for (let i = 0; i < files.length; i++) {
        if (files[i].isFile() && path.extname(files[i].name) === '.css') {
            fs.readFile(path.join(pathStyles, files[i].name), 'utf-8', function (error, data) {
                if (error) console.log(error);
                result.push(data);
                fs.appendFile(pathBundle, data, function(err) {
                    if (err) console.log(err);
                });
              });
        }
    }

})

