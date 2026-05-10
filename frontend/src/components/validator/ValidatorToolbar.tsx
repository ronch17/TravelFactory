import type { ChangeEvent } from 'react'
import type {
  StatusFilter,
  ValidatorUser,
} from './types'

type ValidatorToolbarProps = {
  validators: ValidatorUser[]
  effectiveValidatorId: string
  statusFilter: StatusFilter
  statusFilters: StatusFilter[]
  onValidatorChange: (value: string) => void
  onStatusFilterChange: (value: StatusFilter) => void
}

export default function ValidatorToolbar({
  validators,
  effectiveValidatorId,
  statusFilter,
  statusFilters,
  onValidatorChange,
  onStatusFilterChange,
}: ValidatorToolbarProps) {
  const handleValidatorChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    onValidatorChange(event.target.value)
  }

  const handleStatusChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    onStatusFilterChange(event.target.value as StatusFilter)
  }

  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Validation Dashboard
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Review and decide vacation requests
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-gray-700">
            Validator
          </span>

          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={effectiveValidatorId}
            onChange={handleValidatorChange}
          >
            {validators.map((validator) => (
              <option
                key={validator.id}
                value={validator.id}
              >
                {validator.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-gray-700">
            Filter by Status
          </span>

          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            {statusFilters.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
