
import * as dotenv from 'dotenv';


const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.dev';

dotenv.config({ path: envFile });

export default () => ({
    bucketName: process.env.AWS_BUCKET_NAME as string,
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
})