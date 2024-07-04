import React from 'react';
import { Platform } from 'react-native';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../utils/Colors';


interface TagBadgeProps {
    name: string;
    color: string;
}

const TagBadge = (props: TagBadgeProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.tagText}>{props.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: Colors.secondary,
        borderRadius: 100,
        paddingHorizontal: 10,
        opacity: 0.75,
        height: 20
    },
    tagText: {
        color: "rgba(0, 0, 0, 0.75)",
        fontWeight: "bold",
        fontSize: 13,
        marginTop: Platform.OS === "ios" ? 2 : 0
    }
});

export default TagBadge;
