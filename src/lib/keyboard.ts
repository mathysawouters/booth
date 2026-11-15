import { type RefObject, useRef } from 'react';
import { type EmitterSubscription, Keyboard, type ScrollViewInstance } from 'react-native';

export function useScrollToEndOnKeyboard(scroll: RefObject<ScrollViewInstance | null>) {
  const pending = useRef<EmitterSubscription | null>(null);

  return function scrollToEndOnKeyboard() {
    pending.current?.remove();
    pending.current = null;
    if (Keyboard.isVisible()) {
      scroll.current?.scrollToEnd();
      return;
    }
    pending.current = Keyboard.addListener('keyboardDidShow', () => {
      pending.current?.remove();
      pending.current = null;
      scroll.current?.scrollToEnd();
    });
  };
}
