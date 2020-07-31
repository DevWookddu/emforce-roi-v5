/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');

const PREFIX = process.env.NODE_ENV === 'beta' ? 'beta-' : '';

const DEPLOY_BUCKET_NAME = `${PREFIX}analytics.emforce.co.kr`;

const ENV = dotenv.config({
  path: path.resolve(__dirname, '.env.aws'),
});

const s3 = new AWS.S3({
  accessKeyId: ENV.aws_access_key_id,
  secretAccessKey: ENV.aws_secret_access_key,
});

const jsFile = fs.readFileSync(
  path.resolve(__dirname, 'dist', `${PREFIX}analytics.js`),
  'utf8'
);

const params = {
  Bucket: DEPLOY_BUCKET_NAME,
  Key: 'conversion/v5/analytics.js',
  Body: jsFile,
  ContentType: 'text/javascript',
};

s3.upload(params, (err) => {
  if (err) {
    throw err;
  }
  console.warn(`File uploaded successfully.`);
});
