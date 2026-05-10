import StatusBadge from '../StatusBadge'
import type { VacationRequest } from './types'

type ValidatorRequestsTableProps = {
  requests: VacationRequest[]
  isLoading: boolean
  activeRejectId: number | null
  rejectComments: Record<number, string>
  onApprove: (requestId: number) => void
  onOpenReject: (requestId: number) => void
  onRejectCommentChange: (
    requestId: number,
    value: string,
  ) => void
  onConfirmReject: (
    requestId: number,
    comments: string,
  ) => void
}

export default function ValidatorRequestsTable({
  requests,
  isLoading,
  activeRejectId,
  rejectComments,
  onApprove,
  onOpenReject,
  onRejectCommentChange,
  onConfirmReject,
}: ValidatorRequestsTableProps) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 text-gray-600">
          <tr>
            <th className="px-3 py-2 font-medium">
              Employee
            </th>
            <th className="px-3 py-2 font-medium">
              Start
            </th>
            <th className="px-3 py-2 font-medium">
              End
            </th>
            <th className="px-3 py-2 font-medium">
              Reason
            </th>
            <th className="px-3 py-2 font-medium">
              Validator Comment
            </th>
            <th className="px-3 py-2 font-medium">
              Status
            </th>
            <th className="px-3 py-2 font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => {
            const isRejectOpen = activeRejectId === request.id

            return (
              <tr
                key={request.id}
                className="border-b border-gray-100 align-top"
              >
                <td className="px-3 py-2">
                  {request.user?.name ?? '-'}
                </td>
                <td className="px-3 py-2">
                  {request.startDate}
                </td>
                <td className="px-3 py-2">
                  {request.endDate}
                </td>
                <td className="px-3 py-2">
                  {request.reason || '-'}
                </td>
                <td className="px-3 py-2">
                  {request.comments || '-'}
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => onApprove(request.id)}
                      disabled={request.status !== 'Pending'}
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => onOpenReject(request.id)}
                      disabled={request.status !== 'Pending'}
                    >
                      Reject
                    </button>

                    {isRejectOpen ? (
                      <div className="space-y-2">
                        <textarea
                          className="w-full rounded-md border border-gray-300 px-2 py-1"
                          rows={2}
                          placeholder="Reason for rejection (required)"
                          value={
                            rejectComments[request.id] || ''
                          }
                          onChange={(event) =>
                            onRejectCommentChange(
                              request.id,
                              event.target.value,
                            )
                          }
                        />

                        <button
                          type="button"
                          className="w-full rounded-md bg-gray-800 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-700"
                          onClick={() =>
                            onConfirmReject(
                              request.id,
                              rejectComments[request.id] || '',
                            )
                          }
                        >
                          Confirm Reject
                        </button>
                      </div>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {!isLoading && requests.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">
          No requests found for this filter.
        </p>
      ) : null}
    </div>
  )
}
