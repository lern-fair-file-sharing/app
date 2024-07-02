import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../utils/Colors';

interface AppointmentCardProps {
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    isNow?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ startTime, endTime, title, description, isNow }) => {
    if (isNow) {
        return (
            <View style={styles.joincard}>
                <Text style={styles.timedark}>{`${startTime} - ${endTime}`}</Text>
                <View style={styles.info}>
                    <Text style={styles.titledark}>{title}</Text>
                    <Text style={styles.descriptiondark}>{description}</Text>
                    <TouchableOpacity style={styles.joinbutton}>
                        <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Videochat beitreten</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.card}>
            <Text style={styles.time}>{`${startTime} - ${endTime}`}</Text>
            <View style={styles.info}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    joincard: {
        backgroundColor: Colors.primary,
        borderRadius: 8,
        padding: 10,
        marginBottom: 24,
    },
    timedark: {
        fontSize: 14,
        color: Colors.background,
    },
    titledark: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.background,
    },
    descriptiondark: {
        fontSize: 14,
        color: Colors.background,
    },
    joinbutton: {
        backgroundColor: Colors.yellow,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        margin: 10,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 8,
        padding: 10,
        marginBottom: 24,

    },
    time: {
        fontSize: 14,
        color: Colors.primary,
    },
    info: {
        marginTop: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    description: {
        fontSize: 14,
        color: Colors.primary,
    },
});

export default AppointmentCard;
