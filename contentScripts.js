const {
    generateBlobSASQueryParameters,
    SharedKeyCredential,
    ContainerSASPermissions
} = require('@azure/storage-blob');
const shell = require('shelljs');

const account = "cupandpen";
const accountKey = "MFgRtBFNvfMl8tYN089zBbfIxMbg7AppTCmGx8GxEpG8T/3JI3WqTaMjPv3gA37sPPP1KNTu0l6OlJKwh4Zj+g==";
const containerName = `content`;
const localFolder = 'content';
const expirationTimeInMs = 300000; // 5 minutes

const sharedKeyCredential = new SharedKeyCredential(account, accountKey);

const containerSasPermissions = new ContainerSASPermissions();
containerSasPermissions.add = true;
containerSasPermissions.create = true;
containerSasPermissions.write = true;
containerSasPermissions.read = true;
containerSasPermissions.list = true;
containerSasPermissions.delete = true;

const sasQueryParameters = generateBlobSASQueryParameters({
    containerName,
    permissions: containerSasPermissions.toString(),
    expiryTime: new Date(Date.now() + expirationTimeInMs)
}, sharedKeyCredential);

const syncCommand = `azcopy sync "${localFolder}" "https://${account}.blob.core.windows.net/${containerName}?${sasQueryParameters.toString()}" --recursive --delete-destination=true`;
shell.exec(syncCommand, (code, stdout, stderr) => {
    console.log('Exit code:', code);
    if (code !== 0) {
        console.log(`Error: ${stderr}`);
    } else {
        console.log(stdout);
    }
});