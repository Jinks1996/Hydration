import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {Buffer} from 'buffer';

const Multipartupload = () => {
  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: "",
      secretAccessKey: "",
    },
  });

  const twentyFiveMB = 25 * 1024 * 1024;

  const createString = (size = twentyFiveMB) => {
    return "x".repeat(size);
  };

  const handleFileChange = async (event) => {
    try {
      console.log("file", event.target.files[0]);
      const file = event.target.files[0];
      const key = file.name;
      const bucketName = "multipart-upload-s3-test";
      const str = createString(file.size);
      const buffer = Buffer.from(str, "utf8");

      let uploadId;

      const multipartUpload = await s3Client.send(
        new CreateMultipartUploadCommand({
          Bucket: "multipart-upload-s3-test",
          Key: key,
        })
      );
      console.log("createMultipartUpload respnse", multipartUpload);

      uploadId = multipartUpload.UploadId;

      const uploadPromises = [];
      // Multipart uploads require a minimum size of 5 MB per part.
      const partSize = Math.ceil(buffer.length / 5);

      // Upload each part.
      for (let i = 0; i < 5; i++) {
        const start = i * partSize;
        const end = start + partSize;
        uploadPromises.push(
          s3Client
            .send(
              new UploadPartCommand({
                Bucket: bucketName,
                Key: key,
                UploadId: uploadId,
                Body: buffer.subarray(start, end),
                PartNumber: i + 1,
              })
            )
            .then((d) => {
              console.log("Part", i + 1, "uploaded");
              return d;
            })
        );
      }

      const uploadResults = await Promise.all(uploadPromises);

      console.log("upload parts", uploadResults);

      const finalResponse = await s3Client.send(
        new CompleteMultipartUploadCommand({
          Bucket: bucketName,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: uploadResults.map(({ ETag }, i) => ({
              ETag,
              PartNumber: i + 1,
            }))
          },
        })
      );

      console.log("finalResponse", finalResponse);

      return finalResponse;

      // Verify the output by downloading the file from the Amazon Simple Storage Service (Amazon S3) console.
      // Because the output is a 25 MB string, text editors might struggle to open the file.
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default Multipartupload;
