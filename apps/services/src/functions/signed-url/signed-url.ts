import S3 from 'aws-sdk/clients/s3';
import { Handler, Event, Context } from 'aws-lambda';

export const handler: Handler = async (event: Event, context: Context) => {
  const s3 = new S3({
    apiVersion: process.env.API_VERSION,
    signatureVersion: 'v4',
  });

  const s3Params = {
    Bucket: event.body.bucketName,
    Key: event.body.fileName,
    Expires: 600,
    ContentType: `application.json`,
  };

  try {
    const uploadUrl = await s3.getSignedUrl('putObject', s3Params);

    console.log('uploadUrl', uploadUrl);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          uploadUrl,
        },
        null,
        2
      ),
    };
  } catch (e) {
    console.error('error while generating signed url', e);
  }
};
