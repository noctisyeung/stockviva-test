import path from 'path';
import dotenv from 'dotenv';
import { Configuration, DefinePlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';

dotenv.config({ path: path.join(__dirname, '.env') });

const config: Configuration = {
  entry: { main: './src/index.ts' },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  watch: process.env.NODE_ENV === 'development',
  devtool:
    process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  plugins: [
    new NodemonPlugin({ nodeArgs: ['--inspect'] }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@controllers': path.resolve(__dirname, 'src/controllers'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@custom-types': path.resolve(__dirname, 'src/types'),
    },
  },
  externals: [nodeExternals()],
};

export default config;
