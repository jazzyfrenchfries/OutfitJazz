import { useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import { supabase } from '../../lib/supabase';

type ClothingItem = {
  id: string;
  name: string;
  image: string;
  colour: string;
  category: 'top' | 'bottom' | 'footwear' | 'accessory';
};

export default function Wardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);

  const loadWardrobe = async () => {
    const stored = await AsyncStorage.getItem('wardrobe');
    if (stored) setItems(JSON.parse(stored));
  };

  useFocusEffect(
    React.useCallback(() => {
      loadWardrobe();
    }, [])
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wardrobe</Text>
      <Button
  title="Delete All Items"
  onPress={async () => {
    await AsyncStorage.removeItem('wardrobe'); 
    setItems([]); 
  }}
/>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
             <Button
  title="Delete"
  onPress={async () => {
    const stored = await AsyncStorage.getItem('wardrobe');
    if (stored) {
      const wardrobeItems = JSON.parse(stored);
      const updatedItems = wardrobeItems.filter((i: ClothingItem) => i.id !== item.id);
      await AsyncStorage.setItem('wardrobe', JSON.stringify(updatedItems));
      setItems(updatedItems);
    }
  }}
/>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    margin: 8,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  image: { width: 120, height: 120, borderRadius: 12, marginBottom: 10 },
  name: { fontWeight: '500' },
  category: { fontSize: 12, color: '#000000' },
    container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#9dafb5',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
});
