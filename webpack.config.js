const path = require('path');

module.exports = {
    mode: 'development', // or 'production'
    entry: './public/js/game.js', // Adjust the path to your entry point file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // Other webpack configuration...
};
