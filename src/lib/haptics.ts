import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function tapHaptic() {
  if (Platform.OS !== 'web') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export function popHaptic() {
  if (Platform.OS !== 'web') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export function successHaptic() {
  if (Platform.OS !== 'web') {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}
