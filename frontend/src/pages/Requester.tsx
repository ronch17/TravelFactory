import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { mainRoute } from '../lib/MainRoute'
import { useUsers } from '../hooks/useUsers'

import SubmitRequestCard from '../components/requester/SubmitRequestCard'
import RequestsTable from '../components/requester/RequestsTable'

export type VacationRequest = {
  id: number
  startDate: string
  endDate: string
  reason?: string
  status: string
  comments?: string
}

export type FormState = {
  startDate: string
  endDate: string
  reason: string
}

export function Requester() {
  const getErrorMessage = (
    error: unknown,
    fallback: string,
  ) => {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { message?: string } | undefined)?.message
      return message ?? fallback
    }

    return fallback
  }

  const {
    users,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers()

  const requesters = useMemo(
    () => users.filter((user) => user.role === 'Requester'),
    [users],
  )

  const [selectedUserId, setSelectedUserId] =
    useState('')

  const effectiveUserId =
    selectedUserId ||
    (requesters[0] ? String(requesters[0].id) : '')

  const [requests, setRequests] = useState<
    VacationRequest[]
  >([])

  const [requestError, setRequestError] =
    useState('')

  const [submitMessage, setSubmitMessage] =
    useState('')

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [isLoadingRequests, setIsLoadingRequests] =
    useState(false)

  const loadRequests = useCallback(async () => {
    if (!effectiveUserId) {
      return
    }

    try {
      setIsLoadingRequests(true)

      const response = await mainRoute.get(
        '/requests',
        {
          params: {
            userId: effectiveUserId,
          },
        },
      )

      setRequests(response.data)

      setRequestError('')
    } catch (error: unknown) {
      setRequestError(getErrorMessage(error, 'Failed loading requests'))
    } finally {
      setIsLoadingRequests(false)
    }
  }, [effectiveUserId])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRequests()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadRequests])

  async function createRequest(form: FormState) {
    try {
      setSubmitMessage('')
      setIsSubmitting(true)

      await mainRoute.post('/requests', {
        userId: Number(effectiveUserId),
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason || undefined,
      })

      await loadRequests()

      setSubmitMessage(
        'Vacation request submitted successfully.',
      )

      setRequestError('')
    } catch (error: unknown) {
      setSubmitMessage('')
      setRequestError(getErrorMessage(error, 'Failed submitting request'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-5">
      <SubmitRequestCard
        requesters={requesters}
        effectiveUserId={effectiveUserId}
        setSelectedUserId={setSelectedUserId}
        onSubmit={createRequest}
        submitMessage={submitMessage}
        error={requestError}
        isSubmitting={isSubmitting}
        usersLoading={usersLoading}
        usersError={usersError}
      />

      <RequestsTable
        requests={requests}
        isLoading={isLoadingRequests}
      />
    </section>
  )
}