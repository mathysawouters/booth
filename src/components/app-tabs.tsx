import { NativeTabs } from 'expo-router/native-tabs';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={Colors.black}
      indicatorColor={Colors.line}
      iconColor={{ default: Colors.gray, selected: Colors.white }}
      labelStyle={{ default: { color: Colors.gray }, selected: { color: Colors.white } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="photo.stack" md="photo_library" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="friends">
        <NativeTabs.Trigger.Label>Friends</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.2" md="group" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
