
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });
};

module.exports = {
    options: {
        pretty: true,
        data: {
            require: require
        }
    }
};