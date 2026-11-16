import { router } from 'expo-router';

import { KidForm } from '@/components/kid-form';

export default function AddKidScreen() {
  return (
    <KidForm title="Add a kid" closeIcon="close" closeLabel="Close" onClose={() => router.back()} onSaved={() => router.back()} />
  );
}
