require('dotenv').config();
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

/**
 * Is @file a directory
 * @param file 
 */
const isDirectory = (file: string) => fs.statSync(file).isDirectory();

/**
 * Returns the list of directories in @file
 * @param file 
 */
const getDirectories = (file: string) => fs.readdirSync(file).map(name => path.join(file, name)).filter(isDirectory);

/**
 * Is @file a file
 * @param file 
 */
const isFile = (file: string) => fs.statSync(file).isFile();

/**
 * Returns the list of files in @file
 * @param file 
 */
const getFiles = (file: string) => fs.readdirSync(file).map(name => path.join(file, name)).filter(isFile);

/**
 * Returns the list of files (full path) in @file and its subdirectories.
 * @param file 
 */
function getFilesRecursively(file: string) {
    let dirs = getDirectories(file);
    let files = dirs
        .map(dir => getFilesRecursively(dir)) // go through each directory
        .reduce((a, b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
    return files.concat(getFiles(file));
};

/**
 * Upload @fileName file to S3 bucket and use @key as its bucket path and name.
 * Content-Type metadata is set for Javascript and CSS files so that browsers can use them properly.
 * @param fileName 
 * @param key 
 */
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

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    s3.upload(params, (err: Error, data: any) => {
        if (err) throw err;
        console.log(`✅ File uploaded successfully. ${data.Location}`);
    });
};

const DIRECTORY_TO_UPLOAD = 'public';

/**
 * Recursively get the files in @DIRECTORY_TO_UPLOAD and upload them to S3 Bucket.
 * Key of every file is its relative path to @DIRECTORY_TO_UPLOAD
 */
getFilesRecursively(DIRECTORY_TO_UPLOAD).forEach((file: string) => {
    uploadFileToS3(file, file.replace(DIRECTORY_TO_UPLOAD + '/', ''))
});