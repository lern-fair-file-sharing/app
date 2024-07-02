export interface PropfindResponseType {
    "d:multistatus": {
        "d:response": {
            "d:href": string,
            "d:propstat": {
                "d:prop": {
                    "d:getlastmodified": string,
                    "d:getcontentlength": string,
                    "d:getcontenttype": string,
                    "oc:permissions": string,
                    "d:resourcetype": string,
                    "d:getetag": string,
                    "oc:fileid": string,
                    "oc:size": string,
                    "oc:tags": string,
                    "nc:has-preview": string,
                    "oc:favorite": string,
                    "oc:comments-unread": string,
                    "oc:owner-display-name": string,
                    "oc:share-types": string
                },
                "d:status": string
            }
        }
    }[]
}

export interface PropSearchResponseType {
    "d:multistatus": {
        "d:response": {
            "d:href": string,
            "d:propstat": {
                "d:prop": {
                    "oc:fileid": string,
                    "d:displayname": string,
                    "d:getcontenttype": string,
                    "d:getetag": string,
                    "oc:size": string,
                    "oc:tags": string,
                    "d:getlastmodified": string,
                    "d:resourcetype": string,
                    "nc:system-tags"?: any,
                },
                "d:status": string
            }
        }
    }[]
}

export interface TagsResponseType {
    "d:multistatus": {
        "d:response": {
            "d:href": string,
            "d:propstat": {
                "d:prop": {
                    "oc:id": string,
                    "oc:displayname": string,
                    "oc:user-visible": boolean,
                    "oc:user-assignable": boolean,
                    "oc:can-assign": boolean,
                },
                "d:status": string
            }
        }
    }[]
}