export function setLocalStorageItem(key: string, value: string) {
  localStorage?.setItem?.(key, value);
}

export function getLocalStorageItem(key: string) {
  return localStorage?.getItem?.(key);
}

export function clearLocalStorage() {
  localStorage?.clear?.();
}

export function removeLocalStorageItem(key: string) {
  localStorage.removeItem(key);
}
