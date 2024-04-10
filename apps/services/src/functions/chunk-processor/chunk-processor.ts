import { Handler, Event, Context } from 'aws-lambda';
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../../libs/serviceClients';

export const handler: Handler = async (event: Event, context: Context) => {
  const messages = event.Records.map((record) => {
    const message = JSON.parse(record.body);

    return {
      PutRequest: {
        Item: {
          ...message,
          dateTime: new Date().toISOString(),
        },
      },
    };
  });

  try {
    const response = await ddbDocClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [process.env.HYDRATION_TABLE]: messages,
        },
      })
    );
    console.log('Response from DynamoDB :: ', response);
  } catch (error) {
    console.log('Error while logging to DB :: ', error);
  }
};
