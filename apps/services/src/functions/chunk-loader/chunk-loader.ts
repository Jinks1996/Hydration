import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
  Context,
} from 'aws-lambda';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { s3Client, sqsClient } from '../../libs/serviceClients';

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const mainBucketParams = {
    Bucket: event.parcel.Bucket,
    Key: event.parcel.Key,
  };
  try {
    // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
    const stream = await s3Client.send(new GetObjectCommand(mainBucketParams));

    // Convert the ReadableStream to a string.
    const data = await stream.Body.transformToString();
    const records = JSON.parse(data);

    const batches =
      Math.floor(records.length / 10) + (records.length % 10 ? 1 : 0);
    console.log('---batches -->', batches);

    for (let i = 1; i <= batches; i++) {
      const batch = records.splice(
        0,
        records.length < 10 ? records.length : 10
      );

      const queueParams = {
        QueueUrl: process.env.QUEUE_URL,
        Entries: [],
      };

      batch.forEach((el) => {
        el.fileName = Math.random() * 10 ** 15;
        el.timestamp = new Date().getTime();
        queueParams.Entries.push({
          Id: Math.floor(Math.random() * 10 ** 18),
          MessageBody: JSON.stringify(el),
        });
      });

      try {
        await sqsClient.send(new SendMessageBatchCommand(queueParams));
        // callback(null, response);
      } catch (uploadError) {
        console.log('Error while pushing to the queue :', uploadError);
      }
    }
  } catch (error) {
    console.log(
      'Error while retriving details from ',
      event.parcel.Bucket,
      'for ',
      event.parcel.Key,
      ':',
      error
    );
  }
};
