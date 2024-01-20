const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');
const pathProjectDist = path.join(__dirname, 'project-dist');
const pathProjectDistAssets = path.join(pathProjectDist, 'assets');
const pathAssets = path.join(__dirname, 'assets');
const pathComponents = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'style.css');

fs.mkdir(pathProjectDist, { recursive: true }, err => {
    if (err) console.log(err);
});

fs.mkdir(pathProjectDistAssets, { recursive: true }, err => {
    if (err) console.log(err);
});

async function copyDir(files, files_copy) {
    try {
        const filesArr = await fsPromises.readdir(files, { withFileTypes: true });
        const filesCopyArr = await fsPromises.readdir(files_copy, { withFileTypes: true });

        for (const file of filesArr) {
            if (file.isFile()) {
                const originalPath = path.join(files, file.name);
                const copyPath = path.join(files_copy, file.name);
                await fsPromises.copyFile(originalPath, copyPath);
            }
        }

        for (const fileCopy of filesCopyArr) {
            const copyPath = path.join(files_copy, fileCopy.name);
            if (!filesArr.some(f => f.name === fileCopy.name)) {
                await fsPromises.unlink(copyPath);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function copyAssets() {
    try {
        const assetsFiles = await fsPromises.readdir(pathAssets, { withFileTypes: true });

        for (const asset of assetsFiles) {
            const assetPath = path.join(pathAssets, asset.name);
            const assetDistPath = path.join(pathProjectDistAssets, asset.name);

            if (asset.isDirectory()) {
                await fsPromises.mkdir(assetDistPath, { recursive: true });
                await copyDir(assetPath, assetDistPath);
            } else {
                await fsPromises.copyFile(assetPath, assetDistPath);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

copyAssets();

async function changeTemplate() {
    try {
        const template = fsPromises.readFile(path.join(__dirname, 'template.html'));
        let templateText = (await template).toString();
        const components = await fsPromises.readdir(pathComponents, { withFileTypes: true });
        let component = '';
        for (let i = 0; i < components.length; i++) {
            if (components[i].isFile() && path.extname(components[i].name)=== '.html') {
                component = await fsPromises.readFile(path.join(pathComponents, components[i].name));
                templateText = templateText.replace(`{{${components[i].name.slice(0, -5)}}}`, component.toString());
            }
        }
        fsPromises.writeFile(path.join(pathProjectDist, 'index.html'), templateText);
    } catch(error) {
        console.log(error);
    }
}
changeTemplate();

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