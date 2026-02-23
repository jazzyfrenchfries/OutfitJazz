import { View, Text, Image, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function Saved() {
  const [liked, setLiked] = useState<any[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadLiked = async () => {
      const stored = await AsyncStorage.getItem('likedOutfits');
      if (stored) {
        setLiked(JSON.parse(stored));
      }
    };
    if (isFocused) loadLiked();
  }, [isFocused]);

  return (
    <FlatList
      data={liked}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 18 }}>Saved Outfit</Text>
          {item.top && <Image source={{ uri: item.top.image }} style={{ width: 100, height: 100 }} />}
          {item.bottom && <Image source={{ uri: item.bottom.image }} style={{ width: 100, height: 100 }} />}
          {item.footwear && <Image source={{ uri: item.footwear.image }} style={{ width: 100, height: 100 }} />}
          {item.accessory && <Image source={{ uri: item.accessory.image }} style={{ width: 100, height: 100 }} />}

        </View>
      
      )}
    />
  );
}