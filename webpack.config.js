const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    //devtool: 'source-map',
    watch: true,
    entry: {
      'app': 'src/index.js'
    },

    output: {
        filename: './js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                        outputPath: 'img',
                        name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
            // Apply rule for fonts files
            test: /\.(woff|woff2|ttf|otf|eot)$/,
            use: [
                    {
                        // Using file-loader too
                        loader: "file-loader",
                        options: {
                        outputPath: 'fonts',
                        name: '[name].[ext]'
                        }
                    }
                ]
            }            
        ]
      
    },
    
    resolve: {
      modules: [
        __dirname,
        'node_modules',
      ],
    },

    devtool: false,
    
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer()
                ]
            }
        }),
        new MiniCssExtractPlugin({
            filename: './css/[name].style-bundle.css'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html', //source
            filename: 'index.html'  //destination
        }),
        new CopyPlugin([
            { from: 'src/anim', to: 'anim' }
        ]),
        new webpack.SourceMapDevToolPlugin({})
    ],

    devServer: {
        //publicPath: '/dist/',
        //contentBase: path.resolve(__dirname, 'src'),
        //watchContentBase: true,
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3333
    }
    
    
  };