import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import Colors from '../utils/Colors';

const calenderAddIcon = require('../../assets/calendar_add.png');

interface AddButtonProps {
    onPress: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Image 
                source={calenderAddIcon}
                style={{ width: 25, height: 25 }}
                resizeMode='contain'
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 10,
    },
});

export default AddButton;
