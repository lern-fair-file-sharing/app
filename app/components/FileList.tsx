import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FileCardType, FolderCardType, FileListType } from "../types/FileTypes";
import FileCard from "./FileCard";
import FolderCard from "./FolderCard";


const FileList = (props: FileListType) => {
    const navigation = useNavigation();

    const [files, setFiles] = useState<FileCardType[]>([]);
    const [folders, setFolders] = useState<FolderCardType[]>([]);

    useEffect(() => {
        setFiles(props.files);
        setFolders(props.folders);
        
    }, [props.files, props.folders]);

    const cardRemovalHandler = () => {
        props.refreshFunction ? props.refreshFunction() : null
    }

    return (
        <View style={styles.container}>
            {folders.map((folderData: FolderCardType) => (
                <FolderCard
                    key={folderData.folderURL}
                    folderName={folderData.folderName}
                    folderURL={folderData.folderURL}
                    navigation={navigation}
                    cardRemovalHandler={cardRemovalHandler}
                />
            ))}
            {files.map((fileData: FileCardType) => (
                <FileCard
                    key={fileData.fileURL}
                    fileName={fileData.fileName}
                    fileType={fileData.fileType}
                    fileURL={fileData.fileURL}
                    lastModified={fileData.lastModified}
                    fileTags={fileData.fileTags}
                    cardRemovalHandler={cardRemovalHandler}
                    fileID={fileData.fileID}
                />
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        height: "100%",
        display: "flex",
        gap: 7,
        marginBottom: 30,   
    },
});

export default FileList;