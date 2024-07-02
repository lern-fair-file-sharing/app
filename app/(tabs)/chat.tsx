import { View, Text, StyleSheet } from "react-native";

const ChatPage = () => {
    return (
        <View style={styles.container}>
            <Text>Chat Page</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
});

export default ChatPage;