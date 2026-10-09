import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 合併 class，後面的 Tailwind class 會蓋掉前面衝突的
export function cn (...inputs) {
  return twMerge(clsx(inputs))
}

export function valueUpdater (updaterOrValue, ref) {
  ref.value
    = typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue
}
