import React from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import DateSection from '../components/dateSection';
import AddButton from '../components/addAppointmentButton';
import Colors from '../utils/Colors';

interface Participant {
    id: string;
    image: string;
}
interface Appointment {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    isNow?: boolean;
    participants?: Participant[];
}

const appointments: Appointment[] = [
    {
        id: '1',
        date: '2024-07-05',
        startTime: '10:00 Uhr',
        endTime: '12:00 Uhr',
        title: 'Mathe bei Max Mustermann',
        description: 'Lektion 5: Algebra',
        isNow: true,
        participants: [
            { id: 'p1', image: 'https://picsum.photos/200' },
            { id: 'p2', image: 'https://avatars.githubusercontent.com/u/63316860?s=200&v=4' },
            { id: 'p3', image: 'https://picsum.photos/200' },
            { id: 'p4', image: 'https://picsum.photos/200' },
            { id: 'p5', image: 'https://picsum.photos/200' },
        ],
    },
    {
        id: '2',
        date: '2024-07-05',
        startTime: '1:00 Uhr',
        endTime: '3:00 Uhr',
        title: 'Englisch',
        description: 'Past Perfect Tense',
        participants: [
            { id: 'p1', image: 'https://avatars.githubusercontent.com/u/63316860?s=200&v=4' },
            { id: 'p2', image: 'https://picsum.photos/200' },
        ],
    },
    {
        id: '3',
        date: '2024-07-08',
        startTime: '11:00 Uhr',
        endTime: '1:00 Uhr',
        title: 'Deutsch',
        description: 'Sturm und Drang',
        participants: [
            { id: 'p1', image: 'https://avatars.githubusercontent.com/u/63316860?s=200&v=4' },
            { id: 'p2', image: 'https://picsum.photos/200' },
            { id: 'p3', image: 'https://picsum.photos/200' },
            { id: 'p4', image: 'https://picsum.photos/200' },
            { id: 'p5', image: 'https://picsum.photos/200' },
            { id: 'p6', image: 'https://picsum.photos/200' },
        ],
    },
    {
        id: '4',
        date: '2024-07-11',
        startTime: '1:00 Uhr',
        endTime: '3:00 Uhr',
        title: 'Mathe bei Max Mustermann',
        description: 'Lektion 5.1: Geometrie',
        participants: [
            { id: 'p1', image: 'https://avatars.githubusercontent.com/u/63316860?s=200&v=4' },
            { id: 'p2', image: 'https://picsum.photos/200' },
        ],
    },
    {
        id: '5',
        date: '2024-07-11',
        startTime: '11:00 Uhr',
        endTime: '1:00 Uhr',
        title: 'Deutsch',
        description: 'Leseübung',
        participants: [
            { id: 'p1', image: 'https://avatars.githubusercontent.com/u/63316860?s=200&v=4' },
            { id: 'p2', image: 'https://picsum.photos/200' },
            { id: 'p3', image: 'https://picsum.photos/200' },
            { id: 'p4', image: 'https://picsum.photos/200' },
            { id: 'p5', image: 'https://picsum.photos/200' },
            { id: 'p6', image: 'https://picsum.photos/200' },
        ],
    },
    {
        id: '6',
        date: '2024-07-12',
        startTime: '11:00 Uhr',
        endTime: '1:00 Uhr',
        title: 'Physik',
        description: 'Relativitätstheorie',
        participants: [
            { id: 'p1', image: 'https://avatars.githubusercontent.com/u/63316860?s=200&v=4' },
            { id: 'p2', image: 'https://picsum.photos/200' },
            { id: 'p3', image: 'https://picsum.photos/200' },
            { id: 'p4', image: 'https://picsum.photos/200' },
            { id: 'p5', image: 'https://picsum.photos/200' },
            { id: 'p6', image: 'https://picsum.photos/200' },
        ],
    },
    {
        id: '7',
        date: '2024-07-12',
        startTime: '1:00 Uhr',
        endTime: '3:00 Uhr',
        title: 'Mathe bei Max Mustermann',
        description: 'Lektion 5.1: Geometrie',
        participants: [
            { id: 'p1', image: 'https://avatars.githubusercontent.com/u/63316860?s=200&v=4' },
            { id: 'p2', image: 'https://picsum.photos/200' },
        ],
    },
    {
        id: '8',
        date: '2024-07-12',
        startTime: '11:00 Uhr',
        endTime: '1:00 Uhr',
        title: 'Physik',
        description: 'Relativitätstheorie',
        participants: [
            { id: 'p1', image: 'https://avatars.githubusercontent.com/u/63316860?s=200&v=4' },
            { id: 'p2', image: 'https://picsum.photos/200' },
            { id: 'p3', image: 'https://picsum.photos/200' },
            { id: 'p4', image: 'https://picsum.photos/200' },
            { id: 'p5', image: 'https://picsum.photos/200' },
            { id: 'p6', image: 'https://picsum.photos/200' },
        ],
    },
];

const AppointmentPage: React.FC = () => {
    const groupedAppointments = appointments.reduce((acc: { [key: string]: Appointment[] }, appointment) => {
        acc[appointment.date] = acc[appointment.date] ? [...acc[appointment.date], appointment] : [appointment];
        return acc;
    }, {});

    return (
        <View style={styles.container}>

            <ScrollView>
                <View style={styles.calendar}>
                    <Text style={styles.monthText}>Juli</Text>
                    <View style={styles.monthDivider} />
                    {Object.keys(groupedAppointments).map((date) => (
                        <DateSection key={date} date={date} appointments={groupedAppointments[date]} />
                    ))}
                </View>
            </ScrollView>

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

export default AppointmentPage;
