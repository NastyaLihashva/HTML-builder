const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, function (err, files) {
    if (err) {
      console.log(err);
    } else {
        files.forEach(item => {
            if (item.isFile()) {
                fs.stat(path.join(__dirname, 'secret-folder', item.name), (error, stats) => { 
                    if (error) { 
                        console.log(error); 
                      } 
                      else { 
                        let name = item.name.split('.').slice(0, -1).join('.');
                        let lenExt = path.extname(item.name).length;
                        console.log(name + ' - ' + path.extname(item.name).slice(1, lenExt) + ' - ' + stats.size + ' Bytes');
                      }
                });
            }
        });
    }
  });