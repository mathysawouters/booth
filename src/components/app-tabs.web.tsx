import {
  Tabs,
  TabList,
  TabSlot,
  TabTrigger,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import type { ComponentRef, Ref } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <TabBar>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Today</TabButton>
          </TabTrigger>
          <TabTrigger name="book" href="/book" asChild>
            <TabButton>Book</TabButton>
          </TabTrigger>
          <TabTrigger name="family" href="/family" asChild>
            <TabButton>Family</TabButton>
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}

function TabBar(props: TabListProps) {
  return (
    <View {...props} style={styles.bar}>
      <View style={styles.inner}>
        <Text style={styles.brand}>Little Legends</Text>
        {props.children}
      </View>
    </View>
  );
}

function TabButton({ children, isFocused, ref, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      ref={ref as unknown as Ref<ComponentRef<typeof Pressable>>}
      style={[styles.tab, isFocused && styles.tabFocused]}>
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  brand: {
    color: Colors.black,
    fontSize: 22,
    fontWeight: '900',
    marginRight: 'auto',
  },
  tab: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  tabFocused: {
    borderColor: Colors.black,
  },
  tabLabel: {
    color: Colors.gray,
    fontSize: 18,
    fontWeight: '700',
  },
  tabLabelFocused: {
    color: Colors.black,
  },
});
