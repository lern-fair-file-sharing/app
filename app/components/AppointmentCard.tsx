import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import Colors from "../utils/Colors";

type ItemProps = {
    days: number,
    classTitle: string
};

const AppointmentCard = ({days, classTitle}: ItemProps) => {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../../assets/appointmentImage.jpg")}/>
            <View style={styles.card}>
                <View style={styles.timer}>
                    <Image style={styles.clockImage} source={require("../../assets/clock.png")}/>
                    <Text style={styles.textTimer1}>Startet: </Text>
                    <Text style={styles.textTimer2}>In {days} Tagen</Text>
                </View>
                <Text style={styles.text}>{classTitle}</Text>
                <View style={styles.buttons}>
                    <Pressable style={styles.button1}>
                        <Text style={styles.buttonText1}>Mehr Infos</Text>
                    </Pressable>
                    <Pressable style={styles.button2}>
                        <Text style={styles.buttonText2}>Videochat beitreten</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    image: {
        width: "auto",
        height: 160,
        resizeMode: "cover",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    clockImage :{
        width: 40,
        height: 40,
        resizeMode: "cover",
        marginRight: 10
    },
    card: {
        backgroundColor: Colors.surface,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 16,
        paddingBottom: 40,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    timer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30
    },
    textTimer1: {
        color:Colors.primary,
        fontWeight: "500"
    },
    textTimer2: {
        color:Colors.secondary,
        fontWeight: "700"
    },
    text: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: "700"
    },
    buttons: {
        alignItems: "center",
        alignSelf: "center",
        marginTop: 40,
        flex: 1,
        width: "100%"
    },
    button1: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: Colors.yellow,
        borderRadius: 4,
        width: "100%"
    },
    buttonText1: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: "500",
        alignSelf: "center"
    },
    button2: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#bbbfc2",
        borderRadius: 4,
        marginTop: 16,
        width:"100%",
    },
    buttonText2: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: "500",
        alignSelf: "center"
    }
})

export default AppointmentCard;