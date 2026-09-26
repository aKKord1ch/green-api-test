import styles from './Avatar.module.css'

const GRADIENTS = [
  ['#ff8a65', '#ff5277'],
  ['#ffc048', '#ff8f3f'],
  ['#6be3a4', '#28b485'],
  ['#5ed1ff', '#3a8bff'],
  ['#a58bff', '#6c5cff'],
  ['#ff7fc8', '#c85cff'],
]

interface AvatarProps {
  /** Строка, из которой берутся инициалы и цвет. */
  name: string
  size?: number
}

function hash(value: string): number {
  let result = 0
  for (const char of value) result = (result * 31 + char.charCodeAt(0)) | 0
  return Math.abs(result)
}

function getInitials(name: string): string {
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, '').trim().split(/\s+/)
  if (/^\d+$/.test(words[0] ?? '')) return words[0].slice(-2)
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

export function Avatar({ name, size = 48 }: AvatarProps) {
  const [from, to] = GRADIENTS[hash(name) % GRADIENTS.length]

  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  )
}
