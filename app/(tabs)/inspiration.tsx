import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

type ClothingItem = {
  id: string;
  name: string;
  image: string;
  category: 'top' | 'bottom' | 'footwear' | 'accessory';
  colour: string;
};
type Outfit = {
  top?: ClothingItem;
  bottom?: ClothingItem;
  footwear?: ClothingItem;
  accessory?: ClothingItem;
};
export default function Inspiration() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [outfit, setOutfit] = useState<{
    
    top?: ClothingItem;
    bottom?: ClothingItem;
    footwear?: ClothingItem;
    accessory?: ClothingItem;
  }>({});

  const isFocused = useIsFocused();

  useEffect(() => {
    const loadWardrobe = async () => {
      const stored = await AsyncStorage.getItem('wardrobe');
      if (stored) {
        const parsed: ClothingItem[] = JSON.parse(stored);
        setItems(parsed);
      }
    };
    if (isFocused) loadWardrobe();
  }, [isFocused]);

  const randomItem = (array: ClothingItem[]) => {
    if (!array || array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
  };

  const generateOutfit = async () => {
  const tops = items.filter(i => i.category === 'top');
  const bottoms = items.filter(i => i.category === 'bottom');
  const footwears = items.filter(i => i.category === 'footwear');
  const accessories = items.filter(i => i.category === 'accessory');

  if (!tops.length || !bottoms.length || !footwears.length) {
    alert('Please add at least one top, bottom, and footwear item.');
    return;
  }

  let bestOutfit: Outfit | null = null;
  let bestScore = -1;

  for (let i = 0; i < 10; i++) {
    const candidate: Outfit = {
      top: randomItem(tops),
      bottom: randomItem(bottoms),
      footwear: randomItem(footwears),
      accessory: randomItem(accessories),
    };

    const score = await calculateScore(candidate);

    if (score > bestScore) {
      bestScore = score;
      bestOutfit = candidate;
    }
  }

  if (bestOutfit) {
    setOutfit(bestOutfit);
    setCurrentScore(bestScore);
  }
};

  const calculateScore = async (outfit: Outfit) => {
  let score = 0;
  if (outfit.top?.colour === outfit.bottom?.colour) score += 2;
  if (outfit.top?.colour === outfit.footwear?.colour) score += 2;
  if (outfit.bottom?.colour === outfit.footwear?.colour) score += 2;

  if (outfit.accessory) {
    if (outfit.accessory.colour === outfit.top?.colour) score += 1;
    if (outfit.accessory.colour === outfit.bottom?.colour) score += 1;
    if (outfit.accessory.colour === outfit.footwear?.colour) score += 1;
  }
  const storedItems = await AsyncStorage.getItem('itemScores');
  const itemScores = storedItems ? JSON.parse(storedItems) : {};

  [outfit.top, outfit.bottom, outfit.footwear, outfit.accessory]
    .filter(Boolean)
    .forEach(item => {
      score += (itemScores[item.id] || 0) * 3;
    });

  return score;
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Outfit</Text>
      <Button title="Generate Outfit" onPress={generateOutfit} />

     
      {outfit.top && (
        <View style={styles.item}>
          <Text style={styles.text}>Top: {outfit.top.name} ({outfit.top.colour})</Text>
          <Image source={{ uri: outfit.top.image }} style={styles.image} />
        </View>
      )}
      {outfit.bottom && (
        <View style={styles.item}>
          <Text style={styles.text}>Bottom: {outfit.bottom.name} ({outfit.bottom.colour})</Text>
          <Image source={{ uri: outfit.bottom.image }} style={styles.image} />
        </View>
      )}
      {outfit.footwear && (
        <View style={styles.item}>
          <Text style={styles.text}>Footwear: {outfit.footwear.name} ({outfit.footwear.colour})</Text>
          <Image source={{ uri: outfit.footwear.image }} style={styles.image} />
        </View>
      )}
      {outfit.accessory && (
        <View style={styles.item}>
          <Text>Accessory: {outfit.accessory.name} ({outfit.accessory.colour})</Text>
          <Image source={{ uri: outfit.accessory.image }} style={styles.image} />
        </View>
      )}
      {outfit.top && (
          <Text style={{ fontSize: 18, marginTop: 10 }}>
             ⭐ Style Score: {currentScore}</Text>
      )}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Like This Outfit"
          onPress={async () => {
  if (!outfit.top && !outfit.bottom && !outfit.footwear) return;


  const storedLiked = await AsyncStorage.getItem('likedOutfits');
  const likedOutfits = storedLiked ? JSON.parse(storedLiked) : [];
  likedOutfits.push({
    ...outfit,
    score: currentScore,
    date: new Date().toISOString(),
  });
  await AsyncStorage.setItem('likedOutfits', JSON.stringify(likedOutfits));
  const storedScores = await AsyncStorage.getItem('itemScores');
  const itemScores = storedScores ? JSON.parse(storedScores) : {};

  [outfit.top, outfit.bottom, outfit.footwear, outfit.accessory]
    .filter((item): item is ClothingItem => item !== undefined)
    .forEach(item => {
      itemScores[item.id] = (itemScores[item.id] || 0) + 1;
    });

  await AsyncStorage.setItem('itemScores', JSON.stringify(itemScores));

  alert("Outfit liked!");
}}
/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { marginVertical: 10, alignItems: 'center' },
  image: { width: 120, height: 120, borderRadius: 12, marginTop: 5 },
  text: { fontSize: 16, marginBottom: 5, color: '#ffffff' },
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
