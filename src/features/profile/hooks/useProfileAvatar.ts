import { useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export function useProfileAvatar(initialUri: string | null) {
  const [profileImageUri, setProfileImageUri] = useState<string | null>(initialUri);
  const photoBottomSheetRef = useRef<BottomSheetModal>(null);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setPermissionModalVisible(true);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const handleImageSelection = () => {
    photoBottomSheetRef.current?.present();
  };

  return {
    profileImageUri,
    setProfileImageUri,
    photoBottomSheetRef,
    permissionModalVisible,
    setPermissionModalVisible,
    pickImage,
    takePhoto,
    handleImageSelection,
  };
}
