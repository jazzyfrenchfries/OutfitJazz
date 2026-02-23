import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { supabase } from '../lib/supabase';

export default function Add() {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'top' | 'bottom' | 'footwear' | 'accessory'>('top');
  const [colour, setColour] = useState('');
  const router = useRouter();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveItem = async () => {
  if (!image || !name || !colour) {
    Alert.alert('Error', 'Please provide a name, colour, and pick an image');
    return;
  }

  const { data, error } = await supabase
    .from('wardrobe')
    .insert([
      {
        name,
        image: image,
        category: selectedCategory,
        colour: colour.trim().toLowerCase(),
      }
    ]);

  if (error) {
    console.log("FULL ERROR:", error);
    Alert.alert('Error', error.message);
    return;
  }

  console.log("SUCCESS:", data);
  router.back();
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Item</Text>

      <TextInput
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Colour"
        value={colour}
        onChangeText={setColour}
        style={styles.input}
      />

      <Button title="Pick an Image" onPress={pickImage} />

      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}>
        <Picker.Item label="Top" value="top" />
        <Picker.Item label="Bottom" value="bottom" />
        <Picker.Item label="Footwear" value="footwear" />
        <Picker.Item label="Accessory" value="accessory" />
        </Picker>
      <Button title="Save Item" onPress={saveItem} />
    </View>
  );
}

const styles = StyleSheet.create({
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
  image: {
    width: 200,
    height: 200,
    marginTop: 15,
    borderRadius: 16,
  },
});
