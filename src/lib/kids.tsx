import { useQuery } from 'convex/react';
import { createContext, use, useState, type ReactNode } from 'react';

import type { Kid, KidId } from '@/lib/types';
import { api } from '../../convex/_generated/api';

const KidContext = createContext<{ selected: KidId | null; select: (id: KidId) => void }>({
  selected: null,
  select: () => {},
});

export function KidProvider({ children }: { children: ReactNode }) {
  const [selected, select] = useState<KidId | null>(null);
  return <KidContext value={{ selected, select }}>{children}</KidContext>;
}

export function useKids() {
  const { selected, select } = use(KidContext);
  const kids = useQuery(api.kids.myKids) as Kid[] | undefined;
  const kid = kids?.find((k) => k._id === selected) ?? kids?.[0] ?? null;
  return { kids, kid, select };
}
