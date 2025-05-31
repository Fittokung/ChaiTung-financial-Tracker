// app/(tabs)/profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedName = await AsyncStorage.getItem('profile_name');
      const storedImage = await AsyncStorage.getItem('profile_image');
      if (storedName) setName(storedName);
      if (storedImage) setImageUri(storedImage);
    };
    loadData();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await AsyncStorage.setItem('profile_image', uri);
    }
  };

  const saveName = async () => {
    await AsyncStorage.setItem('profile_name', name);
    alert('Saved!');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={{ color: '#999' }}>Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Button title="Save Profile" onPress={saveName} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    padding: 8,
    fontSize: 16,
  },
});

export default ProfileScreen;
