import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppointmentCard from './AppointmentPageCard';
import Colors from '../utils/Colors';


interface Participant {
    id: string;
    image: string;
  }
interface Appointment {
    id: string;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    isNow?: boolean;
    participants?: Participant[];
}

interface DateSectionProps {
    date: string;
    appointments: Appointment[];
}

const daysOfWeek = ['Su', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    return {
        dayOfWeek,
        day: day < 10 ? '0' + day : day.toString(),
    };
};

const DateSection: React.FC<DateSectionProps> = ({ date, appointments }) => {
    const { dayOfWeek, day } = formatDate(date);
    return (
        <View style={styles.section}>
            <View style={styles.circle}>
                <Text style={styles.dateText}>{dayOfWeek}</Text>
                <Text style={styles.dateText}>{day}</Text>
            </View>
            <View style={styles.appointments}>
                {appointments.map((appointment) => (
                    <AppointmentCard
                        key={appointment.id}
                        startTime={appointment.startTime}
                        endTime={appointment.endTime}
                        title={appointment.title}
                        description={appointment.description}
                        isNow={appointment.isNow}
                        participants={appointment.participants}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 6,
    },
    circle: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    dateText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    appointments: {
        flex: 1,
    },
});

export default DateSection;
