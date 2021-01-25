import { Injectable, Req, Res } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

// AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
// are from AWS account

const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class FileuploadService {
    constructor() {}

    async fileUpload(@Req() req, @Res() res) {
        try {
            this.upload(req, res, function(error) {
                if (error) { // Unknown error e.g. access denied.
                    console.log(error);
                    return res.status(500).json(`Failed to upload file: ${error}`);
                }
                if (!req.files[0]) { // Req body missing file
                    const errMessage = "No file found in the request body.";
                    console.log(errMessage);
                    return res.status(404).json(`Failed to upload file: ${errMessage}`);
                }
                return res.status(201).json(req.files[0].location);
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json(`Failed to upload file: ${error}`);
        }
    }

    upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.AWS_S3_BUCKET_NAME,
            acl: 'public-read',
            key: function(request, file, cb) {
                cb(null, `${Date.now().toString()} - ${file.originalname}`);
            },
        }),
    }).array('upload', 1);
}
