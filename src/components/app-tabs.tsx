import { NativeTabs } from 'expo-router/native-tabs';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={Colors.white}
      indicatorColor={Colors.green}
      iconColor={{ default: Colors.gray, selected: Colors.greenDeep }}
      labelStyle={{ default: { color: Colors.gray }, selected: { color: Colors.greenDeep } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sun.max" md="today" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="book">
        <NativeTabs.Trigger.Label>Book</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book" md="menu_book" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="family">
        <NativeTabs.Trigger.Label>Family</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.3" md="group" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
