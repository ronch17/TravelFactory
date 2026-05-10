import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { mainRoute } from '../lib/MainRoute'
import { useUsers } from './useUsers'
import type {
  RequestStatus,
  StatusFilter,
  ValidatorUser,
  VacationRequest,
} from '../components/validator/types'

export const statusFilters: StatusFilter[] = [
  'All',
  'Pending',
  'Approved',
  'Rejected',
]

type UiState = {
  statusFilter: StatusFilter
  error: string
  activeRejectId: number | null
}

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    return message ?? fallback
  }

  return fallback
}

async function fetchRequests(statusFilter: StatusFilter) {
  const response = await mainRoute.get('/requests', {
    params:
      statusFilter === 'All'
        ? {}
        : { status: statusFilter },
  })

  return response.data as VacationRequest[]
}

export function useValidatorState() {
  const {
    users,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers()

  const validators = useMemo(
    () =>
      users.filter(
        (user): user is ValidatorUser => user.role === 'Validator',
      ),
    [users],
  )

  const [selectedValidatorId, setSelectedValidatorId] =
    useState('')

  const effectiveValidatorId =
    selectedValidatorId ||
    (validators[0] ? String(validators[0].id) : '')

  const [requests, setRequests] = useState<VacationRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [ui, setUi] = useState<UiState>({
    statusFilter: 'All',
    error: '',
    activeRejectId: null,
  })
  const [rejectComments, setRejectComments] = useState<
    Record<number, string>
  >({})

  const updateUi = useCallback(
    <K extends keyof UiState>(key: K, value: UiState[K]) => {
      setUi((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    [],
  )

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await fetchRequests(ui.statusFilter)
      setRequests(data)
      updateUi('error', '')
    } catch (error: unknown) {
      updateUi(
        'error',
        getErrorMessage(error, 'Failed loading requests'),
      )
    } finally {
      setIsLoading(false)
    }
  }, [ui.statusFilter, updateUi])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRequests()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [loadRequests])

  const updateStatus = useCallback(
    async (
      requestId: number,
      status: RequestStatus,
      comments = '',
    ) => {
      try {
        await mainRoute.patch(`/requests/${requestId}/status`, {
          status,
          comments,
        })

        await loadRequests()
        updateUi('activeRejectId', null)

        setRejectComments((prev) => ({
          ...prev,
          [requestId]: '',
        }))

        updateUi('error', '')
      } catch (error: unknown) {
        updateUi(
          'error',
          getErrorMessage(error, 'Failed updating request'),
        )
      }
    },
    [loadRequests, updateUi],
  )

  const approveRequest = useCallback(
    async (requestId: number) => {
      await updateStatus(requestId, 'Approved')
    },
    [updateStatus],
  )

  const confirmRejectRequest = useCallback(
    async (requestId: number, comments: string) => {
      await updateStatus(requestId, 'Rejected', comments)
    },
    [updateStatus],
  )

  const setRejectComment = useCallback(
    (requestId: number, value: string) => {
      setRejectComments((prev) => ({
        ...prev,
        [requestId]: value,
      }))
    },
    [],
  )

  return {
    usersLoading,
    usersError,
    validators,
    effectiveValidatorId,
    selectedValidatorId,
    setSelectedValidatorId,
    statusFilters,
    statusFilter: ui.statusFilter,
    setStatusFilter: (value: StatusFilter) =>
      updateUi('statusFilter', value),
    requests,
    isLoading,
    error: ui.error,
    activeRejectId: ui.activeRejectId,
    setActiveRejectId: (value: number | null) =>
      updateUi('activeRejectId', value),
    rejectComments,
    setRejectComment,
    approveRequest,
    confirmRejectRequest,
  }
}
