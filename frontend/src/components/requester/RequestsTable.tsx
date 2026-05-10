import StatusBadge from '../StatusBadge'
import type { VacationRequest } from '../../pages/Requester'

type RequestsTableProps = {
  requests: VacationRequest[]
  isLoading: boolean
}

export default function RequestsTable({
  requests,
  isLoading,
}: RequestsTableProps) {
  return (
    <article className="rounded-xl bg-white p-5 shadow-sm lg:col-span-3">
      <h2 className="text-lg font-semibold text-gray-900">
        My Requests
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Showing latest requests first
      </p>

      {isLoading ? (
        <p className="mt-4 text-sm text-gray-500">
          Loading requests...
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-600">
            <tr>
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
                Status
              </th>

              <th className="px-3 py-2 font-medium">
                Comments
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-gray-100"
              >
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
                  <StatusBadge status={request.status} />
                </td>

                <td className="px-3 py-2">
                  {request.comments || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading &&
        requests.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            No requests submitted yet.
          </p>
        ) : null}
      </div>
    </article>
  )
}