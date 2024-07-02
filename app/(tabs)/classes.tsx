import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Colors from '../utils/Colors';
import ClassCard from '../components/classCard';
import { getFolderContent } from '../utils/ServerRequests';
import { FolderCardType } from "../types/FileTypes";
import { PERSONAL_SPACE_FOLDER_NAME } from "../utils/utils";
import ClassScreen, { RootStackParamList } from '../components/ClassScreen';
import { useNavigation } from 'expo-router';


interface CourseCardDataType {
    time: string;
    title: string;
    members: string;
    year: string;
    status: string;
    imageUrl: string;
}


const ClassListScreen = () => {
    const navigation = useNavigation();
    const [courseData, setCourseData] = useState<CourseCardDataType[]>([]);

    useEffect(() => {
        getCourseData();
    }, []);

    const getCourseData = async () => {
        // Infer folders from nextcloud folder structure
        // This will no be the case in a real scenario of course
        const ROOT_URL = `/remote.php/dav/files/${process.env.EXPO_PUBLIC_USER}/`;

        const content = await getFolderContent(ROOT_URL);
        if (content) {
            let courseFolders = content.folders.filter((folder: FolderCardType) => {
                return decodeURI(folder.folderName) !== PERSONAL_SPACE_FOLDER_NAME
            });

            const allCourseCardData: CourseCardDataType[] = [];
            courseFolders.forEach((courseFolder: FolderCardType) => {
                allCourseCardData.push({
                    time: "Freitag, 16:00",
                    title: decodeURI(courseFolder.folderName),
                    members: "3 von 10 Plätzen belegt",
                    year: "8. Klasse",
                    status: "Privat",
                    imageUrl: "https://picsum.photos/200",
                })
            });
            setCourseData(allCourseCardData);
        }
        else {
            Alert.alert("Couldn't fetch course folders!")
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.list}>
                <View>
                    {courseData.map((course, index) => (
                        <ClassCard
                            key={index}
                            time={course.time}
                            title={course.title}
                            members={course.members}
                            year={course.year}
                            status={course.status}
                            imageUrl={course.imageUrl}
                            onPress={() => navigation.push("ClassScreen", { title: course.title })}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};


const Stack = createNativeStackNavigator<RootStackParamList>();

const ClassesPage = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ClassListScreen"
                component={ClassListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ClassScreen"
                component={ClassScreen}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: Colors.background,
    },
    list: {
        flex: 1,
        margin: 24,
    }
});

export default ClassesPage;