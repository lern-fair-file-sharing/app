import { FolderCardType, FileCardType, FileListType, FileTagType } from "../types/FileTypes";
import { PropfindResponseType, PropSearchResponseType, TagsResponseType } from "../types/ResponseTypes";
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

    const raw = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n <d:propfind xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\" xmlns:nc=\"http://nextcloud.org/ns\">\r\n   <d:prop>\r\n     <d:getlastmodified/>\r\n     <d:getcontentlength/>\r\n     <d:getcontenttype/>\r\n     <oc:permissions/>\r\n     <d:resourcetype/>\r\n     <d:getetag/>\r\n     <oc:fileid />\r\n     <oc:permissions />\r\n     <oc:size />\r\n     <oc:tags />\r\n     <d:getcontentlength />\r\n     <nc:has-preview />\r\n     <oc:favorite />\r\n     <oc:comments-unread />\r\n     <oc:owner-display-name />\r\n     <oc:share-types />\r\n  <nc:system-tags />\r\n   </d:prop>\r\n </d:propfind>";

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
                        //console.log(element["d:propstat"][0]["d:prop"][0]);

                        let tags: FileTagType[] = [];
                        if (element["d:propstat"][0]["d:prop"][0]["nc:system-tags"].length !== 0) {
                           if (element["d:propstat"][0]["d:prop"][0]["nc:system-tags"][0]["nc:system-tag"] !== undefined) {
                                element["d:propstat"][0]["d:prop"][0]["nc:system-tags"][0]["nc:system-tag"].forEach((tag: any) => {
                                    let tagObject: FileTagType = {
                                        tagName: tag["_"],
                                        tagID: parseInt(tag["$"]["oc:id"])
                                    }
                                    tags.push(tagObject);
                                });
                            };
                          }
                        

                        let file: FileCardType = {
                            fileName: path.substring(path.lastIndexOf("/") + 1),
                            fileType: element["d:propstat"][0]["d:prop"][0]["d:getcontenttype"][0],
                            fileID: parseInt(element["d:propstat"][0]["d:prop"][0]["oc:fileid"][0]),
                            fileURL: path,
                            lastModified: element["d:propstat"][0]["d:prop"][0]["d:getlastmodified"][0],
                            fileTags: tags
                        };
                        fileList.files.push(file);
                    }

                });
            });
            return fileList
        })
        .catch((error) => console.error(error));
};

export const searchLatestFiles = async (): Promise<FileCardType[] | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("content-Type", "text/xml");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);


    const FILE_AMOUNT = 20;
    const raw = "<d:searchrequest xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\">\r\n     <d:basicsearch>\r\n         <d:select>\r\n             <d:prop>\r\n                 <oc:fileid/>\r\n                 <d:displayname/>\r\n                 <d:getcontenttype/>\r\n                 <d:getetag/>\r\n                 <oc:tags/>\r\n                 <d:getlastmodified/>\r\n                 <d:resourcetype/>\r\n             </d:prop>\r\n         </d:select>\r\n         <d:from>\r\n             <d:scope>\r\n                 <d:href>" + userpath + "</d:href>\r\n                 <d:depth>infinity</d:depth>\r\n             </d:scope>\r\n         </d:from>\r\n         <d:where>\r\n             <d:not>\r\n                 <d:is-collection/>\r\n             </d:not>\r\n         </d:where>\r\n         <d:orderby>\r\n            <d:order>\r\n                <d:prop>\r\n                    <d:getlastmodified/>\r\n                </d:prop>\r\n                <d:descending/>\r\n             </d:order>\r\n         </d:orderby>\r\n         <d:limit>\r\n           <d:nresults>" + FILE_AMOUNT + "</d:nresults>\r\n         </d:limit>\r\n    </d:basicsearch>\r\n</d:searchrequest>";

    const requestOptions = {
        method: "SEARCH",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    let fileList: FileCardType[] = [];

    return fetch(machineURL + "/remote.php/dav", requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => {
            parseString(result, function (err: any, result: any) {
                result as PropSearchResponseType;
                result["d:multistatus"]["d:response"].forEach((element: any) => {
                    let file: FileCardType = {
                        fileName: element["d:propstat"][0]["d:prop"][0]["d:displayname"][0],
                        fileType: element["d:propstat"][0]["d:prop"][0]["d:getcontenttype"][0],
                        fileID: parseInt(element["d:propstat"][0]["d:prop"][0]["oc:fileid"][0]),
                        fileURL: element["d:href"][0],
                        lastModified: element["d:propstat"][0]["d:prop"][0]["d:getlastmodified"][0],
                        fileTags: []
                    };
                    fileList.push(file);
                });
            });
            return fileList;
        })
        .catch((error) => console.error(error));
};

export const searchFilesByKeyword = async (keyword: String): Promise<FileCardType[] | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("content-Type", "text/xml");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);


    const raw = "<d:searchrequest xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\">\r\n     <d:basicsearch>\r\n         <d:select>\r\n             <d:prop>\r\n                 <oc:fileid/>\r\n                 <d:displayname/>\r\n                 <d:getcontenttype/>\r\n                 <d:getetag/>\r\n                 <oc:size/>\r\n                 <oc:tags/>\r\n                 <d:getlastmodified/>\r\n                 <d:resourcetype/>\r\n             </d:prop>\r\n         </d:select>\r\n         <d:from>\r\n             <d:scope>\r\n                 <d:href>" + userpath + "</d:href>\r\n                 <d:depth>infinity</d:depth>\r\n             </d:scope>\r\n         </d:from>\r\n         <d:where>\r\n             <d:like>\r\n                <d:prop>\r\n                    <d:displayname/>\r\n                </d:prop>\r\n                <d:literal>%" + keyword + "%</d:literal>\r\n            </d:like>\r\n         </d:where>\r\n         <d:orderby/>\r\n    </d:basicsearch>\r\n</d:searchrequest>";

    const requestOptions = {
        method: "SEARCH",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    let fileList: FileCardType[] = [];

    return fetch(machineURL + "/remote.php/dav", requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => {
            if (result === undefined) {
                return [];
            }
            else {
                parseString(result, function (err: any, result: any) {
                    result as PropSearchResponseType;
                    result["d:multistatus"]["d:response"].forEach((element: any) => {
                        let file: FileCardType = {
                            fileName: element["d:propstat"][0]["d:prop"][0]["d:displayname"][0],
                            fileType: element["d:propstat"][0]["d:prop"][0]["d:getcontenttype"][0],
                            fileID: parseInt(element["d:propstat"][0]["d:prop"][0]["oc:fileid"][0]),
                            fileURL: element["d:href"][0],
                            lastModified: element["d:propstat"][0]["d:prop"][0]["d:getlastmodified"][0],
                            fileTags: []
                        };
                        fileList.push(file);
                    });
                });
                return fileList;
            }
        })
        .catch((error) => { return [] as FileCardType[]; });
};

export const fetchFile = (fileURL: string): Promise<string | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const requestOptions: RequestInit = {
        method: "GET",
        headers: requestHeaders,
        redirect: "follow"
    };

    return fetch(`${machineURL}${fileURL}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error - status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        })
        .catch(error => {
            throw error;
        });
};


export const downloadFile = (fileURL: string): Promise<void> => {
    return fetchFile(fileURL)
        .then(base64Data => {
            if (!base64Data) {
                throw new Error("Failed to fetch file content");
            }

            const fileName = fileURL.split("/").pop()?.split("%20").join("-");
            if (!fileName) {
                throw new Error("Invalid file URL");
            }

            if (Platform.OS === "android") {
                return FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
                    .then(permissions => {
                        if (permissions.granted) {
                            const directoryUri = permissions.directoryUri;
                            return FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, "application/octet-stream")
                                .then(fileUri => {
                                    return FileSystem.writeAsStringAsync(fileUri, base64Data.split(",")[1], {
                                        encoding: FileSystem.EncodingType.Base64,
                                    });
                                })
                                .catch(error => {
                                    throw error;
                                });
                        } else {
                            Sharing.shareAsync(base64Data, { mimeType: "application/octet-stream", dialogTitle: "Share the file" });
                        }
                    })
                    .catch(error => {
                        throw error;
                    });
            } else {
                const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
                return FileSystem.writeAsStringAsync(fileUri, base64Data.split(",")[1], {
                    encoding: FileSystem.EncodingType.Base64,
                })
                    .then(() => {
                        return Sharing.shareAsync(fileUri, { mimeType: "application/octet-stream", dialogTitle: "Share the file" });
                    })
                    .catch(error => {
                        throw error;
                    });
            }
        })
        .catch(error => {
            console.error('Download File Error:', error);
            throw error;
        });
};

export const deleteItem = async (itemURL: string): Promise<void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);
    requestHeaders.append("If-none-match", "areyoukiddingmeapple");

    const requestOptions: RequestInit = {
        method: "DELETE",
        headers: requestHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(machineURL + itemURL, requestOptions);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw error;
    }
};


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

export const uploadFile = async (file: Blob, location: string): Promise<boolean | void> => {
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
        .then((response) => {return response.text()})
        .then(async (result) => { 
            let fileID: number
            await getFolderContent(location).then((response: void | FileListType) => {
                if (response) {
                    fileID = response.files[response.files.length - 1].fileID;
                }
            });
            

            return true })
        .catch((error) => {
            console.error(error); return false
    });
}


export const getAllSystemTags = async (): Promise<FileTagType[] | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "text/plain");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const raw = "<?xml version=\"1.0\"?>\r\n<d:propfind  xmlns:d=\"DAV:\" xmlns:oc=\"http://owncloud.org/ns\">\r\n	<d:prop>\r\n		<oc:id />\r\n		<oc:display-name />\r\n		<oc:user-visible />\r\n		<oc:user-assignable />\r\n		<oc:can-assign />\r\n	</d:prop>\r\n</d:propfind>";

    const requestOptions = {
        method: "PROPFIND",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    let tags: FileTagType[] = [];
    try {
        const response = await fetch(machineURL + "/remote.php/dav/systemtags/", requestOptions as RequestInit);
        const result = await response.text();
        parseString(result, function (err: any, result: any) {
            result["d:multistatus"]["d:response"].forEach((element: any) => {
                let tag: FileTagType = {
                    tagName: element["d:propstat"][0]["d:prop"][0]["oc:display-name"][0],
                    tagID: parseInt(element["d:propstat"][0]["d:prop"][0]["oc:id"][0])
                };
                if (tag.tagName !== "") {
                    tags.push(tag);
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
    return tags;
}

export const getAllFilesOfSystemTag = async (tagID: number): Promise<FileCardType[] | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "text/plain");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const raw = "<?xml version=\"1.0\"?>\r\n<oc:filter-files xmlns:d=\"DAV:\" xmlns:nc=\"http://nextcloud.org/ns\" xmlns:oc=\"http://owncloud.org/ns\" xmlns:ocs=\"http://open-collaboration-services.org/ns\">\r\n	<d:prop>\r\n        <oc:fileid />\r\n        <d:displayname/>\r\n        <d:getcontenttype/>\r\n        <d:getetag/>\r\n        <oc:size />\r\n        <oc:tags />\r\n        <d:getlastmodified/>\r\n        <d:resourcetype/>\r\n        <nc:system-tags />\r\n	</d:prop>\r\n    <oc:filter-rules>\r\n        <oc:systemtag>"+tagID.toString()+"</oc:systemtag>\r\n    </oc:filter-rules>\r\n</oc:filter-files>";

    const requestOptions = {
        method: "REPORT",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    let fileList: FileCardType[] = [];

    return fetch(machineURL + "/remote.php/dav"+ userpath, requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => {
            if (result === undefined) {
                return [];
            }
            else {
                parseString(result, function (err: any, result: any) {
                    result as PropSearchResponseType;
                    result["d:multistatus"]["d:response"].forEach((element: any) => {

                        let tags: FileTagType[] = [];
                        if (element["d:propstat"][0]["d:prop"][0]["nc:system-tags"]) {
                            element["d:propstat"][0]["d:prop"][0]["nc:system-tags"][0]["nc:system-tag"].forEach((tag: any) => {
                                let tagObject: FileTagType = {
                                    tagName: tag["_"],
                                    tagID: parseInt(tag["$"]["oc:id"])
                                }
                                tags.push(tagObject);
                            });
                        }

                        let file: FileCardType = {
                            fileName: element["d:propstat"][0]["d:prop"][0]["d:displayname"][0],
                            fileType: element["d:propstat"][0]["d:prop"][0]["d:getcontenttype"][0],
                            fileID: parseInt(element["d:propstat"][0]["d:prop"][0]["oc:fileid"][0]),
                            fileURL: element["d:href"][0],
                            lastModified: element["d:propstat"][0]["d:prop"][0]["d:getlastmodified"][0],
                            fileTags: tags
                        };
                        
                        fileList.push(file);
                    });
                });
                return fileList;
            }
        })
        .catch((error) => { return [] as FileCardType[]; });

}

export const createSystemTag = async (tagName: string): Promise<boolean | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const raw = JSON.stringify({
        "userVisible": true,
        "userAssignable": true,
        "canAssign": true,
        "name": tagName
    });

    const requestOptions = {
        method: "POST",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(machineURL + "/remote.php/dav/systemtags/", requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => { return true; console.log(result) })
        .catch((error) => { console.error(error); return false });
}

export const assignSystemTag = async (fileID: number, tag: FileTagType): Promise<boolean | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const raw = JSON.stringify({
        "id": tag.tagID.toString(),
        "userVisible": true,
        "userAssignable": true,
        "canAssign": true,
        "name": tag.tagName
    });

    const requestOptions = {
        method: "PUT",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(machineURL + "/remote.php/dav/systemtags-relations/files/" + fileID + "/" + tag.tagID.toString(), requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => { return true })
        .catch((error) => { console.error(error); return false });
}

export const deassignSystemTag = async (fileID: number, tag: FileTagType): Promise<boolean | void> => {
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");
    requestHeaders.append("Authorization", `Basic ${process.env.EXPO_PUBLIC_TOKEN}`);

    const raw = JSON.stringify({
        "id": tag.tagID.toString(),
        "userVisible": true,
        "userAssignable": true,
        "canAssign": true,
        "name": tag.tagName
    });

    const requestOptions = {
        method: "DELETE",
        headers: requestHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(machineURL + "/remote.php/dav/systemtags-relations/files/" + fileID + "/" + tag.tagID.toString(), requestOptions as RequestInit)
        .then((response) => response.text())
        .then((result) => { return true })
        .catch((error) => { console.error(error); return false });
}