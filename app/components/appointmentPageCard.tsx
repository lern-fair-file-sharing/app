import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../utils/Colors';

interface Participant {
    id: string;
    image: string;
}
interface AppointmentCardProps {
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    isNow?: boolean;
    participants?: Participant[];
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ startTime, endTime, title, description, isNow, participants = [] }) => {
    const renderParticipants = () => {
        const displayedParticipants = participants.slice(0, 2);
        const extraParticipantsCount = participants.length - 2;


        return (
            <View style={styles.participantsContainer}>
                {displayedParticipants.map((participant) => (
                    <Image key={participant.id} source={{ uri: participant.image }} style={styles.participantImage} />
                ))}
                {extraParticipantsCount > 0 && (
                    <View style={styles.extraParticipants}>
                        <Text style={styles.extraParticipantsText}>{`+${extraParticipantsCount}`}</Text>
                    </View>
                )}
            </View>
        );
    };

    if (isNow) {
        return (
            <View style={styles.joincard}>
                <View style={styles.cardHeader}>
                <Text style={styles.timedark}>{`${startTime} - ${endTime}`}</Text>
                {participants.length > 0 && renderParticipants()}
                </View> 
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
            <View style={styles.cardHeader}>
                <Text style={styles.time}>{`${startTime} - ${endTime}`}</Text>
                {participants.length > 0 && renderParticipants()}
            </View>
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
        marginVertical: 10,
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      participantImage: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginLeft: -8,

      },
      extraParticipants: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -8,
      },
      extraParticipantsText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
      },
});

export default AppointmentCard;
