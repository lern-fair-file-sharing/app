import { Text, StyleSheet, Image, Pressable } from 'react-native';
import Colors from '../utils/Colors';

type ItemProps = {
    subject: string
    name: string | null,
    headline: string,
    body: string,
    linkText: string
}

const ConfirmationCard = ({subject, name, headline, body, linkText}: ItemProps) => {
    return (
        <Pressable style={styles.container}>
            <Image style={{ alignSelf: 'flex-start'}} source={require("../../assets/book.png")}/>
            <Text style={styles.text1}>{subject}{name}</Text>
            <Text style={styles.confirmationText}>{headline}</Text>
            <Text style={styles.text3}>{body}</Text>
            <Text style={styles.text4}>{linkText}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        backgroundColor: Colors.primary,
        padding: 24,
        width: 288,
        borderRadius: 8,
        justifyContent: "flex-start",
    },
    text1: {
        color: Colors.onPrimary,
        fontWeight: "500",
        fontSize: 13
    },
    confirmationText: {
        fontWeight: "700",
        color: Colors.onPrimary,
        fontSize: 20,
        marginBottom: 20
    },
    text3: {
        fontWeight: "500",
        color: Colors.onPrimary,
        marginBottom: 20,
        fontSize: 13
    },
    text4: {
        fontWeight: "500",
        color: Colors.yellow,
        fontSize: 13
    }
})

export default ConfirmationCard;