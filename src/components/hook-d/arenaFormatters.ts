type TimestampMode = "date" | "time" | "relative"
type RoundLabelStyle = "short" | "long"

const DEFAULT_DECIMALS: Record<string, number> = {
  USDC: 2,
  XLM: 7,
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function toFiniteNumber(value: number | string): number {
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function toNonNegativeInt(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.floor(value))
}

function padTwo(value: number): string {
  return String(value).padStart(2, "0")
}

export function formatCryptoAmount(
  amount: number | string,
  currency: string,
  decimals?: number
): string {
  const normalizedCurrency = currency.trim().toUpperCase()
  const precision =
    typeof decimals === "number" && Number.isFinite(decimals)
      ? Math.max(0, Math.floor(decimals))
      : (DEFAULT_DECIMALS[normalizedCurrency] ?? 2)

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(toFiniteNumber(amount))

  return normalizedCurrency ? `${formatted} ${normalizedCurrency}` : formatted
}

export function truncateAddress(
  address: string,
  headChars = 4,
  tailChars = 4
): string {
  const safeHead = toNonNegativeInt(headChars)
  const safeTail = toNonNegativeInt(tailChars)

  if (!address) return ""
  if (address.length <= safeHead + safeTail) return address
  if (safeHead === 0 && safeTail === 0) return address
  if (safeHead === 0) return `...${address.slice(-safeTail)}`
  if (safeTail === 0) return `${address.slice(0, safeHead)}...`

  return `${address.slice(0, safeHead)}...${address.slice(-safeTail)}`
}

export function formatTimestamp(ms: number, mode: TimestampMode): string {
  if (!Number.isFinite(ms)) return ""

  const date = new Date(ms)
  if (Number.isNaN(date.getTime())) return ""

  if (mode === "relative") {
    const diffMs = Date.now() - date.getTime()
    const isFuture = diffMs < 0
    const absMs = Math.abs(diffMs)

    const seconds = Math.floor(absMs / 1000)
    if (seconds < 60) return isFuture ? `in ${seconds}s` : `${seconds}s ago`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return isFuture ? `in ${minutes}m` : `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return isFuture ? `in ${hours}h` : `${hours}h ago`

    const days = Math.floor(hours / 24)
    return isFuture ? `in ${days}d` : `${days}d ago`
  }

  if (mode === "time") {
    return `${padTwo(date.getHours())}:${padTwo(date.getMinutes())}:${padTwo(
      date.getSeconds()
    )}`
  }

  return `${padTwo(date.getDate())} ${MONTHS[date.getMonth()]} ${padTwo(
    date.getHours()
  )}:${padTwo(date.getMinutes())}`
}

export function formatRoundLabel(
  current: number,
  total?: number,
  style: RoundLabelStyle = "short"
): string {
  const currentRound = toNonNegativeInt(current)
  const totalRounds =
    typeof total === "number" && Number.isFinite(total)
      ? toNonNegativeInt(total)
      : undefined

  if (style === "short") return `R${currentRound}`

  const longLabel = `ROUND ${padTwo(currentRound)}`
  return totalRounds ? `${longLabel} / ${totalRounds}` : longLabel
}

export function formatPercent(value: number, showSign = false): string {
  const safeValue = Number.isFinite(value) ? value : 0
  const numberPart = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(showSign ? Math.abs(safeValue) : safeValue)

  if (!showSign) return `${numberPart}%`
  if (safeValue > 0) return `+${numberPart}%`
  if (safeValue < 0) return `-${numberPart}%`
  return `${numberPart}%`
}
