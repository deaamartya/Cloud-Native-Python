const path = require('path');

module.exports = {
    mode: 'development',
    entry: './static/main.jsx',
    output: {
        path: path.join(__dirname, '/static/build/'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [
                    path.resolve(__dirname, "node_modules/")
                ],
                loader: "babel-loader",
                options: {
                    presets: ["react"]
                },
            }
        ]
    }
};