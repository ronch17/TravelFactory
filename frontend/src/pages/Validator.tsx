import ValidatorRequestsTable from '../components/validator/ValidatorRequestsTable'
import ValidatorToolbar from '../components/validator/ValidatorToolbar'
import { useValidatorState } from '../hooks/useValidatorState'

export function Validator() {
  const {
    usersLoading,
    usersError,
    validators,
    effectiveValidatorId,
    setSelectedValidatorId,
    statusFilters,
    statusFilter,
    setStatusFilter,
    requests,
    isLoading,
    error,
    activeRejectId,
    setActiveRejectId,
    rejectComments,
    setRejectComment,
    approveRequest,
    confirmRejectRequest,
  } = useValidatorState()

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <ValidatorToolbar
        validators={validators}
        effectiveValidatorId={effectiveValidatorId}
        statusFilter={statusFilter}
        statusFilters={statusFilters}
        onValidatorChange={setSelectedValidatorId}
        onStatusFilterChange={setStatusFilter}
      />

      {usersError ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {usersError}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {usersLoading || isLoading ? (
        <p className="mt-4 text-sm text-gray-500">
          Loading requests...
        </p>
      ) : null}

      <ValidatorRequestsTable
        requests={requests}
        isLoading={isLoading}
        activeRejectId={activeRejectId}
        rejectComments={rejectComments}
        onApprove={approveRequest}
        onOpenReject={setActiveRejectId}
        onRejectCommentChange={setRejectComment}
        onConfirmReject={confirmRejectRequest}
      />
    </section>
  )
}