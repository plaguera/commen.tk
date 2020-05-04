require('dotenv').config();
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const DIRECTORY_TO_UPLOAD = 'public';
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

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
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: key, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, (err: Error, data: any) => {
        if (err) throw err;
        console.log(`✅ File uploaded successfully. ${data.Location}`);
    });
};