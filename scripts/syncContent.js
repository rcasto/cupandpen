const {
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential,
    ContainerSASPermissions
} = require('@azure/storage-blob');
const shell = require('shelljs');
const config = require('../config.json');

const localFolder = 'content';
const expirationTimeInMs = 300000; // 5 minutes

const sharedKeyCredential = new StorageSharedKeyCredential(config.storageAccount.account, config.storageAccount.key);

const sasQueryParameters = generateBlobSASQueryParameters({
    containerName: config.storageAccount.container,
    permissions: ContainerSASPermissions.parse("racwdl"),
    expiresOn: new Date(Date.now() + expirationTimeInMs)
}, sharedKeyCredential);

const syncCommand = `azcopy sync "${localFolder}" "https://${config.storageAccount.account}.blob.core.windows.net/${config.storageAccount.container}?${sasQueryParameters.toString()}" --recursive --delete-destination=true`;
shell.exec(syncCommand, (code, stdout, stderr) => {
    console.log('Exit code:', code);
    if (code !== 0) {
        console.log(`Error: ${stderr}`);
    } else {
        console.log(stdout);
    }
});
