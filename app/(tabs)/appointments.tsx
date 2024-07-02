import { View, Text, StyleSheet } from "react-native";

const AppointmentsPage = () => {
    return (
        <View style={styles.container}>
            <Text>Appointment Page</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
});

export default AppointmentsPage;