import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function tapHaptic() {
  if (Platform.OS !== 'web') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}
