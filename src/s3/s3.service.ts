import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_ENDPOINT,
      s3ForcePathStyle: true,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('aws.s3.bucket'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return uploadResult.Location;
  }
} 