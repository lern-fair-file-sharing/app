import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, StyleSheet } from "react-native";

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{ 
            tabBarInactiveTintColor: "#2B4B51",
            tabBarActiveTintColor: "#2B4B51"
            }}>
            <Tabs.Screen name="index" options={{
                headerTitle: "",
                headerTitleAlign: "center",
                headerTintColor: "white",
                headerStyle: {
                    backgroundColor: "#2B4B51",
                },
                title: "Start",
                tabBarIcon: ({ focused, color }) => (
                    <View style={{
                      borderRadius: 50,
                      backgroundColor: focused ? "#2B4B51" : "transparent",
                      padding: 6,
                    }}>
                      <Ionicons size={22} name="home-outline" color={focused ? "white" : color} />
                    </View>
                ),
                headerLeft: () => <Ionicons size={22} name="settings" color={"white"} style={styles.settingsIcon} />,
                headerRight: () => (
                    <View style={styles.headerIconsRight}>
                        <Ionicons size={26} name="help-circle-outline" color={"white"}/>
                        <Ionicons size={22} name="notifications" color={"white"} />
                    </View>
                ),
                headerShadowVisible: false
            }} />
            <Tabs.Screen name="appointments" options={{
                headerTitle: "Termine",
                headerTitleAlign: "center",
                headerTintColor: "white",
                headerStyle: {
                    backgroundColor: "#2B4B51"
                },
                title: "Termine",
                tabBarIcon: ({ focused, color }) => (
                    <View style={{
                        borderRadius: 50,
                        backgroundColor: focused ? "#2B4B51" : "transparent",
                        padding: 6
                    }}>
                        <Ionicons size={22} name="calendar-outline" color={focused ? "white" : color} />
                    </View>
                ),
                headerShadowVisible: false
            }} />
            <Tabs.Screen name="chat" options={{
                headerTitle: "Chat",
                headerTitleAlign: "center",
                headerTintColor: "white",
                headerStyle: {
                    backgroundColor: "#2B4B51"
                },
                title: "Chat",
                tabBarIcon: ({ focused, color }) => (
                    <View style={{
                        borderRadius: 50,
                        backgroundColor: focused ? "#2B4B51" : "transparent",
                        padding: 6
                    }}>
                        <Ionicons size={22} name="chatbox-outline" color={focused ? "white" : color} />
                    </View>
                ),
                headerShadowVisible: false
            }} />
            <Tabs.Screen name="classes" options={{
                headerTitle: "Kurse",
                headerTitleAlign: "center",
                headerTintColor: "white",
                headerStyle: {
                    backgroundColor: "#2B4B51"
                },
                title: "Kurse",
                tabBarIcon: ({ focused, color }) => (
                    <View style={{
                        borderRadius: 50,
                        backgroundColor: focused ? "#2B4B51" : "transparent",
                        padding: 6
                    }}>
                        <Ionicons size={22} name="people-outline" color={focused ? "white" : color} />
                    </View>
                ),
                headerShadowVisible: false
            }} />
            <Tabs.Screen name="files" options={{
                headerTitle: "Dateien",
                headerTitleAlign: "center",
                headerTintColor: "white",
                headerStyle: {
                    backgroundColor: "#2B4B51"
                },
                title: "Dateien",
                tabBarIcon: ({ focused, color }) => (
                    <View style={{
                        borderRadius: 50,
                        backgroundColor: focused ? "#2B4B51" : "transparent",
                        padding: 6
                    }}>
                        <Ionicons size={22} name="folder-outline" color={focused ? "white" : color} />
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