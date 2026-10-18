import { gambarFallback, gambarUrl, type Gambar } from '~/content/gambar'

/**
 * Gambar situs: hotlink Unsplash dengan dimensi eksplisit (mencegah layout
 * shift), lazy-loading secara default, dan overlay gradien memakai token tema
 * agar tetap menyatu pada mode terang maupun gelap.
 *
 * Bila hotlink Unsplash gagal dimuat, `onError` menggantinya sekali dengan
 * gambar cadangan picsum; bila cadangan juga gagal, gambar dibiarkan tanpa
 * sumber agar teks alternatif tetap terbaca.
 *
 * Rasio tampilan diatur oleh elemen pembungkus (mis. `aspect-[4/3]`).
 */
export default function Photo({
  image,
  width,
  height,
  className = '',
  priority = false,
  overlay = true,
}: {
  image: Gambar
  width: number
  height: number
  className?: string
  priority?: boolean
  overlay?: boolean
}) {
  return (
    <div className={`relative overflow-hidden bg-[var(--card)] ${className}`}>
      <img
        src={gambarUrl(image, width, height)}
        width={width}
        height={height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={(event) => {
          const element = event.currentTarget
          if (element.dataset.fallback === 'picsum') {
            element.removeAttribute('src')
            return
          }
          element.dataset.fallback = 'picsum'
          element.src = gambarFallback(image.id, width, height)
        }}
        className="h-full w-full object-cover"
      />
      {overlay && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-[var(--paper)] via-transparent to-transparent opacity-40"
        />
      )}
    </div>
  )
}
