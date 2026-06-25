export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function formatRelativeTime(iso: string): string {
  try {
    const diffMs = Date.now() - new Date(iso).getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const fmt = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
    if (diffSec < 60) return fmt.format(-diffSec, 'seconds')
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return fmt.format(-diffMin, 'minutes')
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return fmt.format(-diffHour, 'hours')
    const diffDay = Math.floor(diffHour / 24)
    return fmt.format(-diffDay, 'days')
  } catch {
    return iso
  }
}
