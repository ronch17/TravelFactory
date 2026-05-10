const badgeColorsByStatus: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
}

function StatusBadge({ status }: { status: string }) {
  const classes = badgeColorsByStatus[status] ?? 'bg-gray-200 text-gray-700'

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  )
}

export default StatusBadge
