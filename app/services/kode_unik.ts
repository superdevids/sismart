/**
 * Kode unik format agreed for the platform:
 *
 * - Siswa:    S + 2-digit entry year + 2-digit study program + 1-digit gender
 *             (1 = laki-laki, 0 = perempuan) + 3-digit sequence. Example: S26101001.
 * - Karyawan: K + 2-digit entry year + 1-digit gender + 3-digit sequence.
 *             Example: K261001.
 *
 * The sequence resets at the start of every academic year and starts at 001,
 * so 000 is not a valid sequence. Generating the sequence belongs to the
 * master-data module; this module only validates the shape of a code.
 */
export const KODE_UNIK_PATTERN = /^(?:S\d{4}[01](?!000)\d{3}|K\d{2}[01](?!000)\d{3})$/

export function isValidKodeUnik(value: string) {
  return KODE_UNIK_PATTERN.test(value)
}
