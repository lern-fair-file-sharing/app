export interface FolderCardType {
    folderName: string,
    folderURL: string,
}

export interface FileCardType {
    fileName: string,
    fileType: string,
    fileURL: string,
    fileID: number,
    lastModified: string,
    fileTags?: FileTagType[]
}

export interface FileListType {
    folders: FolderCardType[],
    files: FileCardType[],
    refreshFunction?: () => void
}

export interface FileTagType {
    tagName: string,
    tagID: number
}