import { StyleSheet, View, Text, Image, TouchableOpacity, ToastAndroid, Platform, Alert, Modal } from "react-native";
import Popover from "react-native-popover-view";
import { Entypo } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import Colors from "../utils/Colors";
import { fetchFile, downloadFile, deleteItem } from "../utils/ServerRequests";
import { FileCardType, FileTagType } from "../types/FileTypes";
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from "expo-intent-launcher";
import WebView from "react-native-webview";
import { hashString } from "../utils/utils";
import TagBadge from "./TagBadge";

const pdfPreviewImage = require("../../assets/pdf-icon.png");
const noPreviewImage = require("../../assets/basic-file-icon.png");

interface FileCardProps extends FileCardType {
    cardRemovalHandler: () => void
}

const FileCard = (props: FileCardProps) => {
    const [previewImage, setPreviewImage] = useState<{ uri: string | any }>();
    const [fileType, setFileType] = useState<string>("unknown");
    const [settingsPopupVisible, setSettingsPopupVisible] = useState<boolean>(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);
    const [webViewUri, setWebViewUri] = useState<string>("");
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    const FILE_BASE_URL = `/remote.php/dav/files/${process.env.EXPO_PUBLIC_USER}/`;

    useEffect(() => {
        if (props.fileType === "application/pdf") {
            const fetchPDF = async () => {
                try {
                    const base64PDF = await fetchFile(props.fileURL);
                    if (base64PDF) {
                        setPdfBase64(base64PDF);
                    } else {
                        console.error("Failed to fetch PDF.");
                    }
                } catch (error) {
                    console.error("Failed to fetch PDF. Error:", error);
                }
            };
            fetchPDF();
            setPreviewImage(pdfPreviewImage);
            setFileType("pdf");
        } else if (props.fileType.split("/")[0] === "image") {
            fetchImage();
            setFileType("image");
        } else {
            setPreviewImage(noPreviewImage);
        }
    }, [props.fileType, props.fileURL]);

    const fetchImage = async () => {
        const cacheDirectory = FileSystem.cacheDirectory + "images/";
        let fileName = props.fileURL.split("/").pop();
        if (!fileName) {
            return;
        }

        if (Platform.OS === "android") [
            fileName = hashString(fileName).toString()
        ]
        const fileUri = cacheDirectory + fileName;

        try {
            const dirInfo = await FileSystem.getInfoAsync(cacheDirectory);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(cacheDirectory, { intermediates: true });
            }

            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (fileInfo.exists) {
                setPreviewImage({ uri: fileUri });
                return;
            }

            const base64Image = await fetchFile(props.fileURL);
            if (base64Image) {
                await FileSystem.writeAsStringAsync(fileUri, base64Image.split(",")[1], { encoding: FileSystem.EncodingType.Base64 });
                setPreviewImage({ uri: fileUri });
            } else {
                console.error('Failed to fetch image: No data received.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownloadFile = () => {
        downloadFile(props.fileURL)
            .then(() => {
                setSettingsPopupVisible(false);
            })
            .catch(error => {
                console.error('Download File Error:', error);
                Alert.alert("Download Failed", "An unexpected error occurred while downloading the file.");
            });
    };

    const handleDeleteFile = () => {
        deleteItem(props.fileURL)
            .then(() => {
                setSettingsPopupVisible(false);
                if (Platform.OS === "android") {
                    ToastAndroid.show("File deleted!", ToastAndroid.SHORT);
                } else {
                    Alert.alert("File deleted!");
                }
                setIsDeleted(true);
                props.cardRemovalHandler();
            })
            .catch(error => {
                Alert.alert("Deletion Failed!", `An error occurred while deleting the file.`);
            });
    };

    const displayFile = async () => {
        if (fileType === "pdf" && pdfBase64) {
            try {
                const base64Prefix = "base64,";
                const base64Data = pdfBase64.includes(base64Prefix) ? pdfBase64.split(base64Prefix)[1] : pdfBase64;

                const localUri = `${FileSystem.documentDirectory}${props.fileName.replaceAll(" ", "_")}`;
                await FileSystem.writeAsStringAsync(localUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });

                if (Platform.OS === "android") {
                    const contentUri = await FileSystem.getContentUriAsync(localUri);
                    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
                        data: contentUri,
                        flags: 1,
                        type: "application/pdf"
                    });
                } else if (Platform.OS === "ios") {
                    const htmlContent = `
                        <!DOCTYPE html>
                        <html>
                            <body>
                                <embed width="100%" height="100%" src="data:application/pdf;base64,${base64Data}" type="application/pdf">
                            </body>
                        </html>
                    `;
                    setWebViewUri(htmlContent);
                    setIsPreviewVisible(true);
                }
            } catch (error) {
                console.error("Error opening PDF:", error);
                Alert.alert("Error", "Failed to open PDF file.");
            }
        } else if (fileType === "image") {
            setIsPreviewVisible(true);
        }
    };


    const getFileFolderPath = (): string => {
        let filePath = decodeURI(props.fileURL.replace(FILE_BASE_URL, "")).split("/");
        filePath.pop();
        return filePath.join("/");
    }

    if (isDeleted) {
        return null;
    }

    return (
        <TouchableOpacity style={styles.container} onPress={displayFile}>
            <Image
                style={fileType === "image" ? styles.filePreview : styles.pdfPreview}
                source={previewImage}
                resizeMode="contain"
            />
            <View style={styles.fileInfos}>
                <Text style={styles.fileName}>{decodeURIComponent(props.fileName)}</Text>
                <View style={styles.tagContainer}>
                    {
                        props.fileTags && props.fileTags.length > 0 ?
                            props.fileTags.map((tag: FileTagType, idx: number) => {
                                return <TagBadge key={idx} name={tag.tagName} color={"green"} />
                            })
                        :
                            <Text
                                style={styles.filePath}
                                numberOfLines={1}
                            >
                                {getFileFolderPath()}
                            </Text>
                    }
                </View>
            </View>

            <Popover
                isVisible={settingsPopupVisible}
                onRequestClose={() => setSettingsPopupVisible(false)}
                animationConfig={{
                    duration: 300
                }}
                from={(
                    <TouchableOpacity style={styles.openSettingsButton} onPress={() => { setSettingsPopupVisible(true) }}>
                        <Entypo name="dots-three-vertical" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                )}>
                <View style={styles.settingModal}>
                    <TouchableOpacity style={styles.settingButton} onPress={handleDownloadFile}>
                        <Feather name="download" size={25} color={Colors.primary} />
                        <Text style={styles.settingText}>DOWNLOAD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingButton} onPress={handleDeleteFile}>
                        <AntDesign name="delete" size={25} color={Colors.primary} />
                        <Text style={styles.settingText}>LÖSCHEN</Text>
                    </TouchableOpacity>
                </View>
            </Popover>

            {isPreviewVisible && (
                <Modal visible={isPreviewVisible} animationType="slide" transparent={true}>
                    <View style={styles.previewModal}>
                        {fileType === "image" ? (
                            <Image style={styles.imagePreview} source={previewImage} />
                        ) : fileType === "pdf" && Platform.OS === "ios" ? (
                            <>
                                <WebView
                                    useWebKit={true}
                                    originWhitelist={['*']}
                                    scrollEnabled={true}
                                    mediaPlaybackRequiresUserAction={true}
                                    source={{ html: webViewUri }}
                                />
                                <TouchableOpacity
                                    style={styles.downloadNoticeButton}
                                    onPress={() => {
                                        downloadFile(props.fileURL)
                                            .then(() => {
                                                setIsPreviewVisible(false);
                                            })
                                            .catch(error => {
                                                console.error('Download File Error:', error);
                                                Alert.alert("Download Failed", "An unexpected error occurred while downloading the file.");
                                            });
                                    }}
                                >
                                    <Text style={styles.noticeText}>PDF herunterladen, um alle Seiten zu sehen.</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text>Error loading file</Text>
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsPreviewVisible(false)}
                        >
                            <AntDesign name="closesquare" size={35} color={fileType === "pdf" ? Colors.primary : "#fff"} />
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        alignItems: "center",
        minHeight: 60,
        width: "100%",
        borderRadius: 8,
        borderWidth: 0,
        borderColor: Colors.surfaceOutline,
        display: "flex",
        flexDirection: "row",
        padding: 5,
        paddingLeft: 10,
        gap: 10,
    },
    filePreview: {
        flex: 1,
        aspectRatio: 1,
        objectFit: "cover",
        borderRadius: 3,
    },
    pdfPreview: {
        flex: 1,
        height: 35,
    },
    fileInfos: {
        flex: 6,
        display: "flex",
    },
    tagContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        gap: 5,
        overflow: "hidden",
    },
    filePath: {
        color: Colors.secondary,
        fontSize: 13,
    },
    fileName: {
        flex: 1,
        fontSize: 15,
        marginTop: Platform.OS === "ios" ? 3 : 0,
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
    },
    closeButton: {
        position: "absolute",
        top: 35,
        right: 35,
    },
    downloadNoticeButton: {
        position: "absolute",
        top: 35,
        left: 35,
        height: 35,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        display: "flex",
        paddingHorizontal: 10,
        justifyContent: "center"
    },
    noticeText: {
        color: "#fff"
    },
    closeButtonText: {
        color: Colors.surface,
        fontWeight: "bold",
    },
    imagePreview: {
        height: "75%",
        resizeMode: 'contain'
    },
    previewModal: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)"
    },
    pdfIOSPopup: {
        height: "100%"
    }
});

export default FileCard;