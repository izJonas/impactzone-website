const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    // ...
    plugins: [
        new CopyPlugin([
            {
                from: path.resolve(__dirname, '/PATH-TO/images/menu/img.svg'),
                to: path.resolve(__dirname, '/dist/images/menu/img.svg')
            },
        ]),
    ],
    // ...
};