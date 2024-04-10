import path from 'path';
import { Handler, Event, Context } from 'aws-lambda';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { StartExecutionCommand } from '@aws-sdk/client-sfn';
import { s3Client, sfnClient } from '../../libs/serviceClients';
import * as mongoDB from 'mongodb';

interface DBCertificate {
  readonly importFile: string;
}
const dbCertificate: DBCertificate = {
  importFile: path.join(__dirname, './global-bundle.pem'),
};

const client: mongoDB.MongoClient = new mongoDB.MongoClient(
  'mongodb://brillioDevs:brillioDevs12345@hydration-cluster.cluster-ctppn9ftjg3b.us-east-1.docdb.amazonaws.com:27017/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
  { sslCA: dbCertificate.importFile }
);

const collections: { games?: mongoDB.Collection } = {};

export const handler: Handler = async (event: Event, context: Context) => {
  const metaData = event.Records[0];
  const mainBucketParams = {
    Bucket: metaData.s3.bucket.name,
    Key: metaData.s3.object.key,
  };

  const chunks = [];

  try {
    // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
    const stream = await s3Client.send(new GetObjectCommand(mainBucketParams));

    // Converting stream to a string.
    const data = await stream.Body.transformToString();
    const chunkSize = 100000;
    const records = JSON.parse(data).items;

    const totalChunks =
      Math.floor(records.length / chunkSize) +
      (records.length % chunkSize ? 1 : 0);
    const objectName = metaData.s3.object.key.split('.');

    for (let i = 1; i <= totalChunks; i++) {
      const chunk = records.splice(0, chunkSize);

      console.log('---->Chunk-', i, ': ', chunk.length);

      const chunkBucketParams = {
        Bucket: process.env.CHUNKS_BUCKET,
        Key: objectName[0] + '-' + i + '.' + objectName[1],
        Body: Buffer.from(JSON.stringify(chunk)),
        fileName: objectName[0],
        ContentEncoding: 'base64',
        ContentType: 'application/json',
      };

      try {
        await s3Client.send(new PutObjectCommand(chunkBucketParams));
        delete chunkBucketParams.Body;
        chunks.push(chunkBucketParams);
      } catch (uploadError) {
        console.log(
          'Error while uploading ',
          objectName[0] + '-' + i + '.' + objectName[1],
          ':',
          uploadError
        );

        return {
          statusCode: 400,
          body: JSON.stringify(
            {
              message: `Error while uploading ${objectName[0]}-${i}.${objectName[0]}`,
              error: uploadError,
            },
            null,
            2
          ),
        };
      }
    }
  } catch (error) {
    console.log(
      'Error while retriving details from ',
      metaData.s3.bucket.name,
      'for ',
      metaData.s3.object.key,
      ':',
      error
    );

    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: `Error while retriving details from ${metaData.s3.bucket.name} for ${metaData.s3.object.key}`,
          error,
        },
        null,
        2
      ),
    };
  }

  try {
    await client.connect();

    const db: mongoDB.Db = client.db('sample-database');

    const gamesCollection: mongoDB.Collection =
      db.collection('sample-collection');
    collections.games = gamesCollection;
    console.log(
      `Successfully connected to database: ${db.databaseName} and collection: ${gamesCollection.collectionName}`
    );

    //Insert a single document
    await collections.games.insertOne({ hello: 'Amazon DocumentDB' });
  } catch (error) {
    console.log('Error connecting to document DB:: ', error);
  }

  const stateMachineInput = {
    'processing-start-time': new Date().toISOString(),
    data: { chunks },
  };

  const stateMachineParams = {
    stateMachineArn: process.env.STATE_MACHINE_ARN,
    input: JSON.stringify(stateMachineInput),
  };

  try {
    const command = new StartExecutionCommand(stateMachineParams);
    const response = await sfnClient.send(command);

    console.log('State Machine executed successfully! ', response);
  } catch (triggerError) {
    console.log('Error while triggering state machine ', triggerError);
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: `Error while triggering state machine ${triggerError}`,
          error: triggerError,
        },
        null,
        2
      ),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `State Machine has been Executed Successfully!`,
      },
      null,
      2
    ),
  };
};
