import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../utils/Colors';

interface AppointmentCardProps {
    startTime: string;
    endTime: string;
    title: string;
    description: string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ startTime, endTime, title, description }) => {
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
