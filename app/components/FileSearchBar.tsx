import { useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, Text, StyleSheet, Platform } from 'react-native';
import FileCard from "../components/FileCard";
import { FileCardType } from "../types/FileTypes";
import { searchFilesByKeyword } from '../utils/ServerRequests';
import { color } from '@rneui/base';
import Colors from '../utils/Colors';


type SearchBarProps = {
  callback: () => void;
  setSearchResultHandler: (files: FileCardType[]) => void;
};

const FileSearchBar: React.FunctionComponent<SearchBarProps> = (props: SearchBarProps) => {
  const [search, setSearch] = useState("");

  const updateSearch = async (search: string) => {
    setSearch(search);
    if (String(search).length < 3) {
      return;
    }
    var results = await searchFilesByKeyword(search);

    if (results && results !== undefined) {
      props.setSearchResultHandler(results);
    }
  };

  return (
    <SearchBar
      placeholder="Type Here..."
      onChangeText={updateSearch}
      value={search}
      containerStyle={styles.searchContainer}
      inputContainerStyle={styles.searchInput}
      onFocus={() => props.callback()}
      onBlur={() => setSearch("")}
    />
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    height: 40,
    padding: 0,
    backgroundColor: "white",
    borderColor: "#AFBBBE",
    borderRadius: 100,
    borderWidth: 1,
  },
  searchInput: {
    height: 40,
    backgroundColor: 'transparent',
  }
});

export default FileSearchBar;