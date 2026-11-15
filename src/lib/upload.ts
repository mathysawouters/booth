import type { StorageId } from '@/lib/types';

export async function upload(uploadUrl: string, uri: string, fallbackType: string): Promise<StorageId> {
  const blob = await (await fetch(uri)).blob();
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': blob.type || fallbackType },
    body: blob,
  });
  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
  const { storageId } = (await response.json()) as { storageId: StorageId };
  return storageId;
}
