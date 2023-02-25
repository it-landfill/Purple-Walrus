"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.util = void 0;
const AWS = require("aws-sdk");
const s3SigV4Client = new AWS.S3({ signatureVersion: "v4", region: process.env.S3_PERSISTENCE_REGION });
var util;
(function (util) {
    function getS3PreSignedUrl(s3ObjectKey) {
        const bucketName = process.env.S3_PERSISTENCE_BUCKET;
        const s3PreSignedUrl = s3SigV4Client.getSignedUrl("getObject", {
            Bucket: bucketName,
            Key: s3ObjectKey,
            Expires: 60 * 1 // the Expires is capped for 1 minute
        });
        console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
        return s3PreSignedUrl;
    }
})(util = exports.util || (exports.util = {}));
