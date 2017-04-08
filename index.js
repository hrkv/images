"use strict";

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');

var { _directories,
      _extensions,
      _output } = require('./package.json');

// перезаписываем файл
fs.writeFileSync(_output, '');

// проверяем, что файл является картинкой - соответсвует одному из разрешений заданных в package.json
function checkExtension(directory) {
    return _extensions.indexOf(path.extname(directory)) !== -1;
}

// записываем размеры изображения в файл
function writeSize(directory) {
    if (checkExtension(directory)) {
        var { width, height } = sizeOf(directory);
        fs.appendFileSync(_output, `${width} ${height}\n`);
    }
}

_directories.forEach(directory => {
    try {
        fs.stat(directory, (err, stats) => {
            if (err) {
                throw new Error(err);
            }

            if (stats.isFile()) {
                writeSize(directory);
            } else if (stats.isDirectory()) {
                fs.readdir(directory, (err, files) => {
                    if (err) {
                        throw new Error(err);
                    }
                    files.forEach(file => writeSize(`${directory}/${file}`));
                })
            }
        });
    } catch(e) {
        console.error(e);
    }
});