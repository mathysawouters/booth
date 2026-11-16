import { type RefObject, useRef } from 'react';
import { type EmitterSubscription, Keyboard, type ScrollViewInstance } from 'react-native';

export function useWhenKeyboardShown() {
  const pending = useRef<EmitterSubscription | null>(null);

  return function whenKeyboardShown(action: () => void) {
    pending.current?.remove();
    pending.current = null;
    if (Keyboard.isVisible()) {
      action();
      return;
    }
    pending.current = Keyboard.addListener('keyboardDidShow', () => {
      pending.current?.remove();
      pending.current = null;
      action();
    });
  };
}

export function useScrollToEndOnKeyboard(scroll: RefObject<ScrollViewInstance | null>) {
  const whenKeyboardShown = useWhenKeyboardShown();
  return () => whenKeyboardShown(() => scroll.current?.scrollToEnd());
}
