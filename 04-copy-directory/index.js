const fs = require('fs/promises');
const path = require('path');

async function copyDir(files, files_copy) {
    try {
        await fs.mkdir(files_copy, { recursive: true });
        const filesArr = await fs.readdir(files, {withFileTypes: true});
        const filesCopyArr = await fs.readdir(files_copy, {withFileTypes: true});

        for (let i = 0; i < filesArr.length; i++) {
            if (filesArr[i].isFile()) {
                const originalPath = path.join(files, filesArr[i].name);
                const copyPath = path.join(files_copy, filesArr[i].name);
                await fs.copyFile(originalPath, copyPath);
            }
        }

        for (let i = 0; i < filesCopyArr.length; i++) {
            const copyPath = path.join(files_copy, filesCopyArr[i].name);
            if (!filesArr.some(f => f.name === filesCopyArr[i].name)) {
                await fs.unlink(copyPath);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'))