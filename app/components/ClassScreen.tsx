import { StyleSheet, ScrollView, Keyboard, RefreshControl, TouchableOpacity, Text, View, Platform, ToastAndroid, Alert, TextInput, Modal, Image, KeyboardAvoidingView } from "react-native";
import FileList from "./FileList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import React, { useEffect, useState, useLayoutEffect, useCallback, useRef } from "react";
import { getFolderContent, uploadFile, createFolder } from "../utils/ServerRequests";
import { FolderCardType, FileCardType } from "../types/FileTypes";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../utils/Colors";
import { getCurrentDateTimeString, PERSONAL_SPACE_FOLDER_NAME, pickFileFromDevice } from "../utils/utils";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import Popover from "react-native-popover-view";
import Feather from "@expo/vector-icons/Feather";


export type RootStackParamList = {
    ClassListScreen: undefined,
    ClassScreen: { title: string };
};


const ClassScreen = (props: NativeStackScreenProps<RootStackParamList, "ClassScreen">) => {
    const navigation = useNavigation();
    const chatContentRef = useRef<ScrollView>(null);

    const courseFolderURL = `/remote.php/dav/files/${process.env.EXPO_PUBLIC_USER}/${encodeURI(props.route.params?.title)}/`;

    const [attachPopupIsVisible, setAttachPopupIsVisible] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessageType []>([]);
    const [currentMessage, setCurrentMessage] = useState<string | undefined>();

    type ChatMessageType = {
        sender: string,
        content: string,
        time: string,
        type: MessageType
    }

    enum MessageType {
        TEXT,
        IMAGE,
        FILE
    }

    const fileMessageIconLight = require("../../assets/basic-file-icon-light.png");

    useLayoutEffect(() => {
        navigation.setOptions({
            title: decodeURI(props.route.params?.title),
        });
    }, [navigation]);

    useEffect(() => {
        // Always scroll to the end when a new message enters the chat
        if (chatContentRef.current) {
            chatContentRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    useEffect(() => {
        setMessages([
            {
                sender: "Mary",
                content: "Schickt mir gerne eure Lösung wenn ihr fertig seid.\nLG Mary",
                time: "23:07",
                type: MessageType.TEXT
            }
        ]);
    }, []);

    const uploadFileHandler = async () => {
        pickFileFromDevice().then((uploadedFileData) => {
            if (uploadedFileData) {
                return uploadFile(uploadedFileData.blob, `${courseFolderURL}${encodeURI(uploadedFileData.fileName)}`)
                .then((status) => {
                    if (status) {
                        return uploadedFileData.fileName;
                    }
                });
            }
        }).then((fileName) => {
            if (fileName) {            
                const newMessage: ChatMessageType = {
                    sender: "self",
                    content: fileName,
                    time: getSendTime(),
                    type: MessageType.FILE
                }
                setMessages([...messages, newMessage]);
            }
        }).catch((error) => {
            Alert.alert("Error!" + error);
        }).finally(() => {
            setAttachPopupIsVisible(false);
        });   
    }

    const uploadImageHandler = async (localFileURI: string, fileName: string) => {
        fetch(localFileURI)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`FILE error - status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                uploadFile(blob, `${courseFolderURL}${encodeURI(fileName)}`);
            })
            .then(() => {
                const newMessage: ChatMessageType = {
                    sender: "self",
                    content: localFileURI,
                    time: getSendTime(),
                    type: MessageType.IMAGE
                }
                setMessages([...messages, newMessage]);
            })
            .catch(error => {
                throw error;
            });
    }

    const handleImagePick = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access media library is required!");
            return;
        }
      
        const pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
        if (!pickerResult.canceled) {
            const imageExtension = pickerResult.assets[0].mimeType?.split("/")[1];
            let imageFileName = `${getCurrentDateTimeString()}.${imageExtension}`;
            uploadImageHandler(pickerResult.assets[0].uri, imageFileName);
        }
        setAttachPopupIsVisible(false);
    };

    const handleCameraPress = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera is required!");
            return;
        }
      
        const pickerResult = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
        if (!pickerResult.canceled) {
            const imageExtension = pickerResult.assets[0].mimeType?.split("/")[1];
            let imageFileName = `${getCurrentDateTimeString()}.${imageExtension}`;
            uploadImageHandler(pickerResult.assets[0].uri, imageFileName);
        }
        setAttachPopupIsVisible(false);
    };

    const createTextBubbles = () => {
        return messages.map((message: ChatMessageType, idx: number) => {
            let ownMessage = message.sender === "self";
            return (
                <View
                    style={[styles.chatRow, {alignItems: ownMessage ? "flex-end" : "flex-start"}]}
                    key={idx}
                >
                    <View
                        style={[styles.chatBubble, {backgroundColor: ownMessage ? Colors.primary : Colors.lightGray}]}
                    >
                        {
                            message.sender !== "self" ?
                                <Text style={styles.senderName}>{message.sender}</Text>
                            : null
                        }
                        {
                            message.type === MessageType.IMAGE ?
                                <Image
                                    style={styles.imageMessage}
                                    source={{ uri: message.content }}
                                    resizeMode="cover"
                                />
                            : message.type === MessageType.FILE ?
                                <View style={styles.fileMessage}>
                                    <Image
                                        style={styles.fileMessageIcon}
                                        source={fileMessageIconLight}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.fileName}>{message.content}</Text>
                                </View>
                            :
                                <Text style={[styles.chatText, , !ownMessage ? styles.darkText : null]}>{message.content}</Text>
                        }
                        
                        <Text style={[styles.chatTime, !ownMessage ? styles.darkText : null]}>{message.time}</Text>
                    </View>
                </View>
            );
        });
    }

    const getSendTime = () => {
        const now = new Date();  
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    const [keyboardIsVisible, setKeyboardIsVisible] = useState<boolean>(false);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <View style={[
                styles.container,
                {
                    paddingBottom: Platform.OS === "ios" && keyboardIsVisible ? 100 : null
                }
            ]}>
                <View style={styles.chatContainer}>
                    <ScrollView
                        style={styles.chatContent}
                        ref={chatContentRef}
                        onContentSizeChange={() => chatContentRef.current?.scrollToEnd({ animated: true })}
                    >
                        {createTextBubbles()}
                    </ScrollView>
                    <View style={styles.sendMessageContainer}>
                        <View style={styles.chatInputContainer}>
                            <TextInput
                                style={styles.chatInputField}
                                placeholder="Nachricht schreiben..."
                                multiline={true}
                                placeholderTextColor={Colors.secondary}
                                value={currentMessage}
                                onChangeText={(s) => { setCurrentMessage(s) }}
                                onFocus={() => setKeyboardIsVisible(true)}
                                onBlur={() => setKeyboardIsVisible(false)}
                            />
                            <View style={styles.attachButtons}>
                                <Popover
                                    isVisible={attachPopupIsVisible}
                                    onRequestClose={() => setAttachPopupIsVisible(false)}
                                    animationConfig={{
                                        duration: 300
                                    }}
                                    from={(
                                        <TouchableOpacity style={styles.attachButton} onPress={() => setAttachPopupIsVisible(true)}>
                                            <Ionicons name="attach" size={30} color={Colors.secondary} />
                                        </TouchableOpacity>
                                    )}>
                                    <View style={styles.settingModal}>
                                        <TouchableOpacity style={styles.settingButton} onPress={() => handleImagePick()}>
                                            <Feather name="image" size={25} color={Colors.primary} />
                                            <Text style={styles.settingText}>BILD</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.settingButton} onPress={() => uploadFileHandler()}>
                                            <Feather name="file-text" size={25} color={Colors.primary} />
                                            <Text style={styles.settingText}>DATEI</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Popover>

                                <TouchableOpacity style={styles.attachButton} onPress={() => handleCameraPress()}>
                                    <Feather name="camera" size={23} color={Colors.secondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <TouchableOpacity style={styles.sendButton} onPress={() => {
                            if (!currentMessage) {
                                return;
                            }

                            const newMessage: ChatMessageType = {
                                sender: "self",
                                content: currentMessage,
                                time: getSendTime(),
                                type: MessageType.TEXT
                            }
                            setMessages([...messages, newMessage]);
                            setCurrentMessage(undefined);
                        }}>
                            <Ionicons name="send" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>          
            </View>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 24,
    },
    sendMessageContainer: {
        display: "flex",
        maxHeight: 125,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
        gap: 10,
    },
    chatInputContainer: {
        flex: 1,
        height: "100%",
        borderRadius: 8,
        backgroundColor: Colors.lightGray,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 10
    },
    chatInputField: {
        flex: 1,
        textAlignVertical: "center",
        height: "100%",
        color: "black",
        paddingVertical: 10,
        paddingLeft: 5,
        fontSize: 15,
    },
    attachButtons: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    attachButton: {
        width: 30,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    sendButton: {
        height: 50,
        width: 50,
        borderRadius: 8,
        backgroundColor: Colors.yellow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.surface,
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
    chatContainer: {
        flex: 1,
        display: "flex",
        gap: 10,
    },
    chatContent: {
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    chatRow: {
        marginBottom: 10,
        display: "flex",
    },
    chatBubble: {
        maxWidth: "90%",
        borderRadius: 8,
        padding: 12,
        gap: 5
    },
    chatText: {
        color: "white",
        fontSize: 15
    },
    senderName: {
        width: "100%",
        fontSize: 13,
        color: Colors.secondary,
        fontWeight: "bold",
    },
    chatTime: {
        width: "100%",
        fontSize: 10,
        color: "white",
        fontWeight: "bold",
        marginLeft: "auto",
        opacity: 0.5
    },
    darkText: {
        color: Colors.primary
    },
    imageMessage: {
        height: 225,
        aspectRatio: 1,
        borderRadius: 4,
    },
    fileMessage: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        padding: 15,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 4
    },
    fileMessageIcon: {
        width: 30,
        height: 30,
    },
    fileName: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        maxWidth: "85%",
    }
})

export default ClassScreen;