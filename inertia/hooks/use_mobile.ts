import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Deteksi lebar layar mobile tanpa setState di dalam effect.
 * Memakai useSyncExternalStore: nilai awal dan setiap perubahan datang dari
 * media query, sehingga tidak ada render berantai.
 */
function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
