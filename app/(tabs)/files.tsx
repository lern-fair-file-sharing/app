import React, { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, View, Text, ScrollView, RefreshControl } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FileList from "../components/FileList";
import FileViewButton from "../components/FileViewButton";
import { FileCardType, FolderCardType } from "../types/FileTypes";
import FolderContentScreen, { RootStackParamList } from "../components/FolderContentScreen";
import Colors from "../utils/Colors";
import { getFolderContent, searchLatestFiles } from "../utils/ServerRequests";
import { getTimeFrame, LastModified, PERSONAL_SPACE_FOLDER_NAME } from "../utils/utils";
import FileSearchBar from "../components/FileSearchBar";
import { FileView } from "../types/FileViewTypes";
import { Keyboard, TouchableWithoutFeedback } from 'react-native';


const FilesTabScreen = () => {
    const [fileView, setFileView] = useState<FileView>(FileView.Activity);
    const [allFolders, setAllFolders] = useState<FolderCardType[]>( [] as FolderCardType[]);
    const [allFiles, setAllFiles] = useState<FileCardType[]>( [] as FileCardType[]);
    const [latestFiles, setLatestFiles] = useState<FileCardType[]>( [] as FileCardType[]);
    
    const [searchResult, setSearchResult] = useState<FileCardType[]>([] as FileCardType[]);

    const setSearchResultHandler = (results: FileCardType[]) => {
        setSearchResult(results);
    };

    const setFileViewHandler = (view: FileView) => {
        setSearchResult([]);
        fetchLatestFiles();
        fetchFolderContent();
        setFileView(view);
    };
    const FILE_URL = `/remote.php/dav/files/${process.env.EXPO_PUBLIC_USER}/`;

    const personalFolderToTop = (folders: FolderCardType[]) => {
        const index = folders.findIndex(folder => decodeURIComponent(folder.folderName) === PERSONAL_SPACE_FOLDER_NAME);

        if (index !== -1) {
            const [personalSpaceFolder] = folders.splice(index, 1);
            folders.unshift(personalSpaceFolder);
        }

        return folders;
    }

    // Fetch all root level files and folders
    const fetchFolderContent = async () => {
        const content = await getFolderContent(FILE_URL);
        if (content) {
            setAllFiles(content.files);

            let folders = personalFolderToTop(content.folders);
            setAllFolders(folders);
        }
    };
    
    const fetchLatestFiles = async () => {
        const results = await searchLatestFiles();
        if (results) {
            setLatestFiles(results);
        }
    };

    // Fetch latest files and all root level files and folders
    const fetchAllData = () => {
        fetchFolderContent();
        fetchLatestFiles();
    }

    // Refetch data on refresh
    const onRefresh = useCallback(() => { fetchAllData() }, []);

    useEffect(() => {
        fetchAllData();
    }, []);

    const renderFileListSection = (title: string, files: FileCardType[]) => (
        <View style={styles.fileActivitySection}>
            <Text style={styles.fileActivityTime}>{title}:</Text>
            <FileList folders={[]} files={files} refreshFunction={fetchAllData} />
        </View>
    );

    const fileTimeCategorization = () => {
        // Split files into groups based on their last-modified time
        const categorizedFiles = latestFiles.reduce((accumulator: any, file: FileCardType) => {
            const timeFrame = getTimeFrame(file.lastModified);

            switch (timeFrame) {
                case LastModified.LAST_THREE_HOURS:
                    accumulator.lastThreeHours.push(file);
                    break;
                case LastModified.TODAY:
                    accumulator.today.push(file);
                    break;
                case LastModified.THIS_WEEK:
                    accumulator.thisWeek.push(file);
                    break;
                default:
                    break;
            }

            return accumulator;
        }, {
            lastThreeHours: [],
            today: [],
            thisWeek: []
        });

        const lastThreeHoursFiles = categorizedFiles.lastThreeHours;
        const todayFiles = categorizedFiles.today;
        const thisWeekFiles = categorizedFiles.thisWeek;

        if (lastThreeHoursFiles.length === 0 && todayFiles.length === 0 && thisWeekFiles.length === 0) {
            return <Text style={styles.fileActivityTime}>No recent activity!</Text>
        }

        return (
            <ScrollView
                style={styles.timeBasedFileActivities}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} />
                }
            >
                {lastThreeHoursFiles.length > 0 ? renderFileListSection("Letzte 3 Stunden", lastThreeHoursFiles) : null}
                {todayFiles.length > 0 ? renderFileListSection("Heute", todayFiles) : null}
                {thisWeekFiles.length > 0 ? renderFileListSection("Diese Woche", thisWeekFiles) : null}
            </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.fileViews}>
                    <FileViewButton
                        active={fileView === FileView.Activity}
                        text="Aktivität"
                        callback={() => {
                            Keyboard.dismiss();
                            setFileViewHandler(FileView.Activity);
                        }}
                        icon={Ionicons}
                        iconName="notifications"
                    />
                    <FileViewButton
                        active={fileView === FileView.Courses}
                        text="Kurse"
                        callback={() => {
                            Keyboard.dismiss();
                            setFileViewHandler(FileView.Courses);
                        }}
                        icon={FontAwesome}
                        iconName="group"
                    />
                </View>

                <FileSearchBar
                        callback={() => setFileViewHandler(FileView.Search)}
                        setSearchResultHandler={setSearchResultHandler}
                />

                <View
                    style={{
                        borderBottomColor: Colors.lightGray,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />

                {
                    fileView === FileView.Activity ? fileTimeCategorization() :
                        fileView === FileView.Search ? (
                            <ScrollView
                                style={styles.courseFolderSection}
                                refreshControl={
                                    <RefreshControl refreshing={false} onRefresh={onRefresh} />
                                }
                            >
                                <FileList folders={[]} files={searchResult} />
                            </ScrollView>
                        )
                            : (
                                <ScrollView
                                    style={styles.courseFolderSection}
                                    refreshControl={
                                        <RefreshControl refreshing={false} onRefresh={onRefresh} />
                                    }
                                >
                                    <FileList folders={allFolders} files={allFiles} refreshFunction={fetchAllData} />
                                </ScrollView>
                            )
                }
            </View>
        </View>
    );
};


const Stack = createNativeStackNavigator<RootStackParamList>();

const FilesPage = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="FilesTabScreen"
                component={FilesTabScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="FolderContentScreen"
                component={FolderContentScreen}
            />
        </Stack.Navigator>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 24,
    },
    fileViews: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        gap: 24,
    },
    fileActivitySection: {
        marginBottom: 10,
        gap: 7
    },
    fileActivityTime: {
        color: Colors.lightGray
    },
    courseFolderSection: {
    },
});


export default FilesPage;
