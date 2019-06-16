const {
    generateBlobSASQueryParameters,
    SharedKeyCredential,
    ContainerSASPermissions
} = require('@azure/storage-blob');

const account = "cupandpen";
const accountKey = "MFgRtBFNvfMl8tYN089zBbfIxMbg7AppTCmGx8GxEpG8T/3JI3WqTaMjPv3gA37sPPP1KNTu0l6OlJKwh4Zj+g==";
const containerName = `content`;

const sharedKeyCredential = new SharedKeyCredential(account, accountKey);

var containerSasPermissions = new ContainerSASPermissions();
containerSasPermissions.add = true;
containerSasPermissions.create = true;
containerSasPermissions.write = true;
containerSasPermissions.read = true;
containerSasPermissions.list = true;
containerSasPermissions.delete = true;

const sasQueryParameters = generateBlobSASQueryParameters({
    containerName,
    permissions: containerSasPermissions.toString(),
    expiryTime: new Date(Date.now() + 1800000)
}, sharedKeyCredential);

console.log(sasQueryParameters.toString());