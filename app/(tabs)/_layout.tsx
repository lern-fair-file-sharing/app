import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, StyleSheet } from "react-native";
import Colors from "../utils/Colors";
import { LogBox } from "react-native"

LogBox.ignoreAllLogs(true);


const TabsLayout = () => {
    return (
        <Tabs screenOptions={{ 
            tabBarInactiveTintColor: Colors.primary,
            tabBarActiveTintColor: Colors.primary,
            tabBarLabelStyle: {
                fontSize: 10,
                margin: 5,
                marginTop: -5,
                fontWeight: "500",
            }
        }}>
            <Tabs.Screen name="index" options={{
                headerShown: false,
                title: "Start",
                tabBarIcon: ({ focused, color }) => (
                    <View style={{
                    }}>
                        <Ionicons size={22} name={focused ? "home" : "home-outline"} color={color} />
                    </View>
                ),
                headerShadowVisible: false
            }} />
            <Tabs.Screen name="appointments" options={{
                headerShown: false,
                title: "Termine",
                tabBarIcon: ({ focused, color }) => (
                    <View style={{
                    }}>
                        <Ionicons size={22} name={focused ? "calendar" : "calendar-outline"} color={color} />
                    </View>
                ),
                headerShadowVisible: false
            }} />
            <Tabs.Screen name="classes" options={{
                headerShown: false,
                title: "Kurse",
                tabBarIcon: ({ focused, color }) => (
                    <View style={{
                    }}>
                        <Ionicons size={22} name={focused ? "people" : "people-outline"} color={color} />
                    </View>
                ),
                headerShadowVisible: false
            }} />
            <Tabs.Screen name="files" options={{
                headerShown: false,
                title: "Dateien",
                tabBarIcon: ({ focused, color }) => (
                    <View style={{
                    }}>
                        <Ionicons size={22} name={focused ? "folder" : "folder-outline"} color={color} />
                    </View>
                ),
                headerShadowVisible: false
            }} />
        </Tabs>
    )
};

const styles = StyleSheet.create({
    settingsIcon: {
        marginLeft: 20
    },
    headerIconsRight: {
        flexDirection: "row",
        gap: 15,
        marginRight: 20
    }
})

export default TabsLayout;