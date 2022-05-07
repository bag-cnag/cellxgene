# Check if possible to get data from S3 storage

# modify 3TR-client to allow upload of .h5ad
# modify 3TR-server to add the file ending to the ceph key

https://github.com/DataBiosphere/cellxgene-fargate/blob/6f41e88e40826c6c1d382e5222ac2d5373a953a7/terraform/cellxgene.tf.json.template.py

Set ENV Vars using vscode .launch.json
"env": {
        "AWS_ACCESS_KEY_ID": "KEY",
        "AWS_SECRET_ACCESS_KEY": "SECRET",
      },

Expected Error:
ClientError('An error occurred (403) when calling the HeadBucket operation: Forbidden')

You'll get a 403 whenever you don't have access to the bucket
https://github.com/aws/aws-cli/issues/1689


For testing it with CEPH
https://www.redhat.com/en/blog/https-ization-ceph-object-storage-public-endpoint

Or how could I get the CEPH public endpoint?

https://docs.axway.com/bundle/TransferCFT_38_UsersGuide_allOS_en_HTML5/page/Content/administration/amazon_s3.html


Using Ceph storage with S3

Transfer CFT can write objects to the Ceph Storage Cluster using the Ceph Object Gateway and the S3 compatible API. The Ceph platform stores data as objects in storage pools on a distributed storage cluster.

To use the Ceph Storage Cluster via its S3 API, follow the S3 storage instructions on this page. Additionally, when implementing:

    Use the s3://http[s]://endpoint[:port]/bucket format for the workingdir.
    Example: s3://http://radosgw_address.net:7480/my_bucket, where 7480 is the CivetWeb default port on which the Ceph Object Gateway is running.