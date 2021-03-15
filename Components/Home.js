import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import BookCard from './BookCard';

export default function Home() {
  return (

    <ScrollView contentContainerStyle={styles.container}>
      <BookCard/>
      <BookCard/>
      <BookCard/>
      <BookCard/>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});