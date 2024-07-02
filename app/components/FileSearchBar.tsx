import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FileCardType } from "../types/FileTypes";
import { searchFilesByKeyword } from '../utils/ServerRequests';
import Colors from '../utils/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';


type SearchBarProps = {
    callback: () => void;
    setSearchResultHandler: (files: FileCardType[]) => void;
};

const FileSearchBar: React.FunctionComponent<SearchBarProps> = (props: SearchBarProps) => {
    const [search, setSearch] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const updateSearch = async (search: string) => {
        setSearch(search);
        if (search.length < 3) {
            return;
        }
        const results = await searchFilesByKeyword(search);

        if (results) {
            props.setSearchResultHandler(results);
        }
    };

    return (
        <View style={[styles.searchContainer, { borderColor: isFocused ? Colors.yellow : Colors.gray }]}>
            <FontAwesome name="search" size={22} color={isFocused ? Colors.yellow : Colors.gray} />
            <TextInput
                style={styles.searchInput}
                placeholder="Durchsuchen..."
                placeholderTextColor={Colors.gray}
                onChangeText={updateSearch}
                value={search}
                onFocus={() => {
                    setIsFocused(true);
                    props.callback();
                }}
                onBlur={() => {
                    setIsFocused(false);
                    setSearch("");
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        paddingLeft: 10,
        backgroundColor: "white",
        borderColor: Colors.lightGray,
        borderRadius: 8,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        backgroundColor: "transparent",
        borderWidth: 0,
        height: 40,
        paddingLeft: 10,
        color: Colors.gray,
    },
});

export default FileSearchBar;
