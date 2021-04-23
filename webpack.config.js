var nodeExternals = require('webpack-node-externals');
const path = require('path')


module.exports = {
    entry: ['./app.js'],
    target: 'node', // in order to ignore built-in modules like path, fs, etc. 
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder 

    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    }
}