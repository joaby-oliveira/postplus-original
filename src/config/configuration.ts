export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'app_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'example',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.S3_BUCKET,
    region: process.env.DEFAULT_REGION || 'us-east-1',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'sua-chave-secreta-aqui',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  }
}); 