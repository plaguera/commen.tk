require('dotenv').config();
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const DIRECTORY_TO_UPLOAD = 'public';
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
//var cloudfront = new AWS.CloudFront();

const isDirectory = (file: string) => fs.statSync(file).isDirectory();
const getDirectories = (file: string) => fs.readdirSync(file).map(name => path.join(file, name)).filter(isDirectory);

const isFile = (file: string) => fs.statSync(file).isFile();
const getFiles = (file: string) => fs.readdirSync(file).map(name => path.join(file, name)).filter(isFile);

const getFilesRecursively = (file: string) => {
    let dirs = getDirectories(file);
    let files = dirs
        .map(dir => getFilesRecursively(dir)) // go through each directory
        .reduce((a, b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
    return files.concat(getFiles(file));
};

console.log(process.cwd());
var files = getFilesRecursively(DIRECTORY_TO_UPLOAD);
files.forEach((file: string) => {
    uploadFileToS3(file, file.replace(DIRECTORY_TO_UPLOAD + '/', ''))
});


function uploadFileToS3(fileName: string, key: string) {
    const fileContent = fs.readFileSync(fileName);

    var today = new Date();
    var onehourfromnow = new Date(today.getTime() + (60 * 60 * 1000));
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Expires: onehourfromnow,
        Key: key,
        Body: fileContent
    };

    const re = /(?:\.([^.]+))?$/;
    var contentType = re.exec(fileName)![1];
    if (contentType)
        switch(contentType) {
            case 'js': params['ContentType'] = 'application/javascript'; break;
            case 'css': params['ContentType'] = 'text/css'; break;
            default: break;
        }

    s3.upload(params, (err: Error, data: any) => {
        if (err) throw err;
        console.log(`✅ File uploaded successfully. ${data.Location}`);
    });
};