import AWS from "aws-sdk";

AWS.config.update({
  signatureVersion: "v4",
  region: process.env.AWS_S3_REGION,
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

export const getSignedUrlForProfilePic = async (
  key: string,
  extension: string
) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `profile_pictures/${key}.${extension}`,
      Expires: 60 * 60 * 24 * 7,
      ContentType: `image/${extension}`,
    };

    const url = await s3.getSignedUrlPromise("putObject", params);
    return url;
  } catch (e) {
    return null;
  }
};

export const getSignedUrlForInventoryPic = async (
  key: string,
  extension: string
) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `inventory_pics/${key}.${extension}`,
      Expires: 60 * 60 * 24 * 7,
      ContentType: `image/${extension}`,
    };

    const url = await s3.getSignedUrlPromise("putObject", params);
    return url;
  } catch (e) {
    return null;
  }
};
