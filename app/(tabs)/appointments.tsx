import React from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import DateSection from '../components/dateSection';
import AddButton from '../components/addAppointmentButton';
import Colors from '../utils/Colors';

interface Appointment {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
}

const appointments: Appointment[] = [
    { id: '1', date: '2024-06-24', startTime: '10:00 Uhr', endTime: '12:00 Uhr', title: 'Math Lesson', description: 'Chapter 5: Algebra' },
    { id: '2', date: '2024-06-24', startTime: '1:00 Uhr', endTime: '3:00 Uhr', title: 'History Class', description: 'World War II' },
    { id: '3', date: '2024-06-25', startTime: '11:00 Uhr', endTime: '1:00 Uhr', title: 'Science Experiment', description: 'Physics Lab' },
    // Add more appointments as needed
];

const CalendarPage: React.FC = () => {
    const groupedAppointments = appointments.reduce((acc: { [key: string]: Appointment[] }, appointment) => {
        acc[appointment.date] = acc[appointment.date] ? [...acc[appointment.date], appointment] : [appointment];
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <View style={styles.calendar}>
            <Text style={styles.monthText}>Juli</Text>
            <View style={styles.monthDivider} />
            <ScrollView>
                {Object.keys(groupedAppointments).map((date) => (
                    <DateSection key={date} date={date} appointments={groupedAppointments[date]} />
                ))}
            </ScrollView>
            </View>
            <AddButton onPress={() => console.log('Add new appointment')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    calendar: {
        margin: 24,
    },
    monthText: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: 'bold',
    },
    monthDivider: {
        height: 2,
        backgroundColor: Colors.yellow,
    },
});

export default CalendarPage;
