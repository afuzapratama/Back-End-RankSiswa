// backend/src/config/s3.js
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: process.env.AWS_USE_PATH_STYLE_ENDPOINT === 'true',
});

module.exports = s3;
