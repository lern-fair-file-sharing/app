import { StyleSheet, Text, Pressable } from "react-native";
import Colors from "../utils/Colors";


interface FileViewButtonProps {
    active: boolean;
    text: string;
    callback: () => void;
    icon: React.ComponentType<{ name: string; size: number; color: string }>;
    iconName: string;
}

const FileViewButton = (props: FileViewButtonProps) => {

    const contentColor = props.active ? "white" : Colors.primary;

    return (
        <Pressable
            style={props.active ? styles.fileViewButton : styles.fileViewButtonInactive}
            onPress={props.callback}
        >
            <props.icon
                name={props.iconName}
                size={22}
                color={contentColor}
            />
            <Text
                style={{ fontWeight: "bold", color: contentColor, fontSize: 13}}
            >{props.text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    fileViewButton: {
        flex: 1,
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    fileViewButtonInactive: {
        flex: 1,
        backgroundColor: "transparent",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
});


export default FileViewButton;
