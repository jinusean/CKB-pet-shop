/* eslint @typescript-eslint/no-var-requires: "off" */

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

module.exports = {
    entry: './src/ui/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/dist')
    },
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new Dotenv(),
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/ui/app.ejs',
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            // http: 'stream-http',
            // https: 'https-browserify',
            // os: 'os-browserify/browser',
            process: 'process/browser',
            // vm: 'vm-browserify',
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json'],
        fallback: {
            assert: require.resolve('assert'),
            crypto: require.resolve('crypto-browserify'),
            fs: false,
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            process: require.resolve('process/browser'),
            stream: require.resolve('stream-browserify'),
            vm: require.resolve('vm-browserify')
        }
    },

    devServer: {
        port: 4000,
        compress: true,
        historyApiFallback: true
    },

    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    },
                    {
                        loader: 'sass-loader' // compiles Sass to CSS
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader'
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js\.map$/, loader: 'source-map-loader' },

            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.build.json',
                    projectReferences: true,
                    transpileOnly: true
                }
            }
        ]
    }
}
