const path = require('path');

module.exports = {
    entry: '/static/main.js',
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