import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface StorageState {
  deleteLocalStoreItem: (key: string) => void;
  deleteLocalStoreItems: (keys: string[]) => void;
  getLocalStoreItem: (key: string) => unknown;
}

export const useLocalStorageUtils = create<StorageState>()(
  subscribeWithSelector(() => ({
    deleteLocalStoreItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error deleting ${key}:`, error);
      }
    },

    deleteLocalStoreItems: (keys: string[]) => {
      const deletedKeys: string[] = [];

      keys.forEach((key) => {
        try {
          localStorage.removeItem(key);
          deletedKeys.push(key);
        } catch (error) {
          console.error(`Error deleting ${key}:`, error);
        }
      });
    },

    getLocalStoreItem: (key: string): unknown => {
      try {
        const item = localStorage.getItem(key);
        if (item === null) return null;
        return JSON.parse(item);
      } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return null;
      }
    },
  })),
);
