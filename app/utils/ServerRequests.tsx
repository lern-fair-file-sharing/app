import { FolderCardType, FileCardType, FileListType } from "../types/FileTypes";
import { PropfindResponseType, PropSearchResponseType } from "../types/ResponseTypes";
import * as FileSystem from "expo-file-system";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";
import * as Sharing from "expo-sharing";
var parseString = require("react-native-xml2js").parseString;


const host = Constants?.expoConfig?.hostUri
  ? Constants.expoConfig.hostUri.split(":")?.shift()
  : "unkown";

const machineURL = `http://${host}:${process.env.EXPO_PUBLIC_HOST_PORT}`
const user = process.env.EXPO_PUBLIC_USER; 
const userpath = "/files/" + user;



// This function is used to get the list of files and folders from the server
// The function returns a promise that resolves to a FileListType object
export const getFolderContent = async (directory: string): Promise<FileListType | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "text/plain");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const raw = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n <d:propfind xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\" xmlns:nc=\"http://nextcloud.org/ns\">\r\n   <d:prop>\r\n     <d:getlastmodified/>\r\n     <d:getcontentlength/>\r\n     <d:getcontenttype/>\r\n     <oc:permissions/>\r\n     <d:resourcetype/>\r\n     <d:getetag/>\r\n     <oc:fileid />\r\n     <oc:permissions />\r\n     <oc:size />\r\n     <oc:tags />\r\n     <d:getcontentlength />\r\n     <nc:has-preview />\r\n     <oc:favorite />\r\n     <oc:comments-unread />\r\n     <oc:owner-display-name />\r\n     <oc:share-types />\r\n   </d:prop>\r\n </d:propfind>";

    const requestOptions = {
        method: "PROPFIND",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    let fileList: FileListType = {
        folders: [],
        files: []
    };

    return fetch(machineURL + directory, requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => {
            parseString(result, function (err: any, result: any) {
                result as PropfindResponseType;
                result["d:multistatus"]["d:response"].forEach((element: any) => {
                    let path = element["d:href"][0];

                    if (path.endsWith("/")) {
                        if (path != directory) {
                            let folder: FolderCardType = {
                                folderName: path.substring(
                                    path.lastIndexOf("/", path.lastIndexOf("/") - 1) + 1,
                                    path.lastIndexOf("/")
                                ),
                                folderURL: path
                            };
                            fileList.folders.push(folder);
                        }
                    }
                    else {
                        let file: FileCardType = {
                            fileName: path.substring(path.lastIndexOf("/") + 1),
                            fileType: element["d:propstat"][0]["d:prop"][0]["d:getcontenttype"][0],
                            fileURL: path,
                            tags: element["d:propstat"][0]["d:prop"][0]["oc:tags"][0].split(","),
                            lastModified: element["d:propstat"][0]["d:prop"][0]["d:getlastmodified"][0]
                        };
                        fileList.files.push(file);
                    }

                });
            });
            return fileList
        })
        .catch((error) => console.error(error));
};

export const searchLatestFiles = async(): Promise<FileCardType[] | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("content-Type", "text/xml");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const raw = "<d:searchrequest xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\">\r\n     <d:basicsearch>\r\n         <d:select>\r\n             <d:prop>\r\n                 <oc:fileid/>\r\n                 <d:displayname/>\r\n                 <d:getcontenttype/>\r\n                 <d:getetag/>\r\n                 <oc:size/>\r\n                 <oc:tags/>\r\n                 <d:getlastmodified/>\r\n                 <d:resourcetype/>\r\n             </d:prop>\r\n         </d:select>\r\n         <d:from>\r\n             <d:scope>\r\n                 <d:href>" + userpath + "</d:href>\r\n                 <d:depth>infinity</d:depth>\r\n             </d:scope>\r\n         </d:from>\r\n         <d:where>\r\n             <d:not>\r\n                 <d:is-collection/>\r\n             </d:not>\r\n         </d:where>\r\n         <d:orderby>\r\n            <d:order>\r\n                <d:prop>\r\n                    <d:getlastmodified/>\r\n                </d:prop>\r\n                <d:descending/>\r\n             </d:order>\r\n         </d:orderby>\r\n         <d:limit>\r\n           <d:nresults>20</d:nresults>\r\n         </d:limit>\r\n    </d:basicsearch>\r\n</d:searchrequest>";

    const requestOptions = {
        method: "SEARCH",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    let fileList: FileCardType[] = [];

    return fetch(machineURL +"/remote.php/dav", requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => {
            parseString(result, function (err: any, result: any) {
                result as PropSearchResponseType;
                result["d:multistatus"]["d:response"].forEach((element: any) => {
                    let file: FileCardType = {
                        fileName: element["d:propstat"][0]["d:prop"][0]["d:displayname"][0],
                        fileType: element["d:propstat"][0]["d:prop"][0]["d:getcontenttype"][0],
                        fileURL: element["d:href"][0],
                        tags: element["d:propstat"][0]["d:prop"][0]["oc:tags"][0].split(","),
                        lastModified: element["d:propstat"][0]["d:prop"][0]["d:getlastmodified"][0]
                    };
                    fileList.push(file);
                });
            });
            return fileList;
        })
        .catch((error) => console.error(error));
};

export const searchRoot = async (searchQuery: string): Promise<FileListType[] | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("content-Type", "text/xml");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

const raw = "<d:searchrequest xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\">\r\n     <d:basicsearch>\r\n         <d:select>\r\n             <d:prop>\r\n                 <oc:fileid/>\r\n                 <d:displayname/>\r\n                 <d:getcontenttype/>\r\n                 <d:getetag/>\r\n                 <oc:size/>\r\n                 <oc:tags/>\r\n                 <d:getlastmodified/>\r\n                 <d:resourcetype/>\r\n             </d:prop>\r\n         </d:select>\r\n         <d:from>\r\n             <d:scope>\r\n                 <d:href>/files/testuser</d:href>\r\n                 <d:depth>infinity</d:depth>\r\n             </d:scope>\r\n         </d:from>\r\n         <d:where>\r\n             <d:like>\r\n                <d:prop>\r\n                    <d:displayname/>\r\n                </d:prop>\r\n                <d:literal>"+searchQuery+"%</d:literal>\r\n            </d:like>\r\n         </d:where>\r\n         <d:orderby/>\r\n    </d:basicsearch>\r\n</d:searchrequest>";
    const requestOptions = {
        method: "SEARCH",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8080/remote.php/dav", requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}


export const fetchFile = async (fileURL: string): Promise<string | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const requestOptions: RequestInit = {
        method: "GET",
        headers: requestHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${machineURL}${fileURL}`, requestOptions);

        if (!response.ok) {
            throw new Error(`HTTP error - status: ${response.status}`);
        }

        const blob = await response.blob();

        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error(error);
    }
};


export const downloadFile = async (fileURL: string): Promise<boolean | void> => {
    try {
        const base64Data = await fetchFile(fileURL);
        if (!base64Data) {
            throw new Error("Failed to fetch file content");
        }

        const fileName = fileURL.split("/").pop();
        if (!fileName) {
            throw new Error("Invalid file URL");
        }

        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

            if (permissions.granted) {
                const directoryUri = permissions.directoryUri;
                const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, "application/octet-stream");

                await FileSystem.writeAsStringAsync(fileUri, base64Data.split(",")[1], {
                    encoding: FileSystem.EncodingType.Base64,
                });
            }
            else {
                await Sharing.shareAsync(base64Data, { mimeType: "application/octet-stream", dialogTitle: "Share the file" });
            }
        } else {
            const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(fileUri, base64Data.split(",")[1], {
                encoding: FileSystem.EncodingType.Base64,
            });

            await Sharing.shareAsync(fileUri, { mimeType: "application/octet-stream", dialogTitle: "Share the file" });
        }
        return true;
    } catch (error) {
        console.error('Download File Error:', error);
        return false;
    }
};

export const deleteItem = async (itemURL: string): Promise<boolean | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const requestOptions = {
        method: "DELETE",
        headers: requestHeaders,
        redirect: "follow"
    };

    return fetch(machineURL + itemURL, requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => { return true })
        .catch((error) => {
            console.error(error);
            return false
        });
}

export const createFolder = async (folderURL: string): Promise<boolean | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const requestOptions = {
        method: "MKCOL",
        headers: requestHeaders,
        redirect: "follow"
    };

    fetch(machineURL + folderURL, requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => { return true })
        .catch((error) => { console.error(error); return false });
}

export const uploadFile = async (file: Blob, location: String): Promise<boolean | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "text/plain");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const raw = file;

    const requestOptions = {
        method: "PUT",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(machineURL + location, requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => { return true })
        .catch((error) => {
            console.error(error); return false
        });
}
