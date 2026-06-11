import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

function createClient() {
  return new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_KEY!,
      secretAccessKey: process.env.S3_SECRET!,
    },
    // Necessário para MinIO e outros provedores S3-compatíveis que usam path-style URLs
    forcePathStyle: true,
  })
}

export async function uploadFile({ key, body, contentType }: { key: string; body: Buffer; contentType: string }) {
  const client = createClient()
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
  return `${process.env.S3_PUBLIC_URL}/${key}`
}

export async function deleteFile({ key }: { key: string }) {
  const client = createClient()
  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
    }),
  )
}
