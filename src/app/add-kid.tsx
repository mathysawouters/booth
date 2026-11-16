import { router } from 'expo-router';

import { KidForm } from '@/components/kid-form';

export default function AddKidScreen() {
  return (
    <KidForm title="Who's joining us?" closeIcon="close" closeLabel="Close" onClose={() => router.back()} onSaved={() => router.back()} />
  );
}
