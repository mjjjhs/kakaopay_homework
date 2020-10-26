const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDevelopment = process.env.NODE_ENV || 'development';
const publicPrefix = 'public';
module.exports = (env) => {
    let optimization = {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    };
    if( isDevelopment !== 'development') {
        optimization = {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            },
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    terserOptions: {
                        warnings: false,
                        compress: {
                            warnings: false,
                            unused: true,
                        },
                        ecma: 6,
                        mangle: true,
                        unused: true,
                    },
                    sourceMap: true
                })
            ]
        };
    }

    return {
        devtool: 'source-map',
        entry: {
            kakaopay_homework: './src/kakaopay-homework/index.tsx'
        } ,
        devServer: {
            hot: true,
            contentBase: path.resolve(__dirname, publicPrefix),
            index: "index.html",
            port: 8080,
            stats: {
                color: true
            }
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: ['node_modules'],
            plugins: [
                // Adds support for installing with Plug'n'Play, leading to faster installs and adding
                // guards against forgotten dependencies and such.
                PnpWebpackPlugin
            ]
        },
        resolveLoader: {
            plugins: [
                // Also related to Plug'n'Play, but this time it tells webpack to load its loaders
                // from the current package.
                PnpWebpackPlugin.moduleLoader(module)
            ]
        },
        output: {
            path: path.resolve(__dirname, publicPrefix),
            filename: isDevelopment === 'development' ? '[name].bundle.js' : '[name].[contenthash].bundle.js'
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    parser: {
                        requireEnsure: false
                    }
                },
                {
                    test: /\.(js)$/,
                    include: [
                        path.resolve(__dirname, 'src')
                    ],
                    exclude: [
                        path.resolve(__dirname, 'node_modules')
                    ],
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ]
                },
                {
                    test: /\.(tsx|ts)$/,
                    include: [
                        path.resolve(__dirname, 'src')
                    ],
                    exclude: [
                        path.resolve(__dirname, 'node_modules')
                    ],
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    use: ["source-map-loader"],
                    enforce: "pre"
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader',
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        'file-loader',
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        isDevelopment === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                        "css-loader"
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // fallback to style-loader in development
                        isDevelopment === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevelopment === 'development'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            // new webpack.DefinePlugin({
            //     ENV: JSON.stringify(env)
            // }),
            new HtmlWebPackPlugin({
                title: isDevelopment === 'development' ? '카카오페이과제_dev' : '카카오페이과제_prod',
                minify: true,
                favicon: '',
                meta: {
                    'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
                    // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                    'theme-color': '#4285f4'
                    // Will generate: <meta name="theme-color" content="#4285f4">
                },
                showErrors: true,
                template: './html/index.html', // html/index.html 파일을 읽는다.
                filename: 'index.html' // output으로 출력할 파일은 index.html 이다.
            }),
            new MiniCssExtractPlugin({
                filename: isDevelopment === 'development' ? '[name].css' : '[name].[contenthash].css',
                chunkFilename: isDevelopment === 'development' ? '[id].css' : '[id].[contenthash].css'
            }),
            new CleanWebpackPlugin()
        ],
        optimization
    };
}