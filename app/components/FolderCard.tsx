import { StyleSheet, Text, Image, TouchableOpacity, View, Platform, ToastAndroid, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../utils/Colors";
import { FolderCardType } from "../types/FileTypes";
import { PERSONAL_SPACE_FOLDER_NAME } from "../utils/utils";

import Popover from "react-native-popover-view";
import { Entypo } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { AntDesign } from "@expo/vector-icons";
import { deleteItem } from "../utils/ServerRequests";


const pdfPreviewImage = require("../../assets/folder-icon.png");

interface FolderCardProps extends FolderCardType {
    navigation?: any,
    cardRemovalHandler: () => void
}

const FolderCard = (props: FolderCardProps) => {

    const [settingsPopupVisible, setSettingsPopupVisible] = useState<boolean>(false);
    const [deletable, setDeleteable] = useState<boolean>(false);

    useEffect(() => {
        // Folders are deletable if they are subfolders of the persona-space folder
        const peronalSpacepath = `/files/${process.env.EXPO_PUBLIC_USER}/${PERSONAL_SPACE_FOLDER_NAME}/`;

        setDeleteable(
            decodeURI(props.folderURL).includes(peronalSpacepath) &&
            !decodeURI(props.folderURL).endsWith(peronalSpacepath)
        );
    }, []);

    const handleFolderPress = async() => {
        props.navigation.push("FolderContentScreen", { folderURL: props.folderURL, folderName: props.folderName });
    }

    const handleDeleteFolder = () => {
        deleteItem(props.folderURL)
            .then(_ => {
                setSettingsPopupVisible(false);
                if (Platform.OS === "android") {
                    ToastAndroid.show("Folder deleted!", ToastAndroid.SHORT);
                } else {
                    Alert.alert("Folder deleted!");
                }
                props.cardRemovalHandler();
            })
            .catch(error => {
                Alert.alert("Deletion Failed!", `An error occurred while deleting the file.`);
            })
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => { handleFolderPress() }}
        >
            <Image
                style={styles.folderIcon}
                source={pdfPreviewImage} 
                resizeMode="contain"
            />
            <Text style={styles.folderName}>{decodeURIComponent(props.folderName)}</Text>

            {deletable ?
                <Popover
                    isVisible={settingsPopupVisible}
                    onRequestClose={() => setSettingsPopupVisible(false)}
                    animationConfig={{
                        duration: 300
                    }}
                    from={(
                        <TouchableOpacity style={styles.openSettingsButton} onPress={() => setSettingsPopupVisible(true)}>
                            <Entypo name="dots-three-vertical" size={20} color={Colors.primary} />
                        </TouchableOpacity>
                    )}>
                    <View style={styles.settingModal}>
                        <TouchableOpacity style={styles.settingButton} onPress={() => handleDeleteFolder()}>
                            <AntDesign name="delete" size={25} color={Colors.primary} />
                            <Text style={styles.settingText}>LÖSCHEN</Text>
                        </TouchableOpacity>
                    </View>
                </Popover>
            : 
                <View style={{flex: 1}} />
            }

        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        alignItems: "center",
        minHeight: 60,
        width: "100%",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.surfaceOutline,
        display: "flex",
        flexDirection: "row",
        padding: 5,
        paddingLeft: 10,
        gap: 10,
    },
    folderIcon: {
        flex: 1,
        height: "45%",
    },
    folderName: {
        flex: 6,
        fontSize: 15,
        color: Colors.primary,
    },
    openSettingsButton: {
        flex: 1,
        alignItems: "center",
    },
    settingModal: {
        width: 250,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 10
    },
    settingButton: {
        flex: 1,
        borderRadius: 3,
        height: 75,
        backgroundColor: Colors.surface,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },
    settingText: {
        fontWeight: "bold",
        color: Colors.primary,
        fontSize: 17
    }
});

export default FolderCard;
