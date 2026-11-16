import { router } from 'expo-router';

import { KidForm } from '@/components/kid-form';

export default function OnboardingScreen() {
  return (
    <KidForm
      title="Who's your little legend?"
      closeIcon="arrow-back"
      closeLabel="Back"
      onClose={() => router.back()}
      askParentName
    />
  );
}
