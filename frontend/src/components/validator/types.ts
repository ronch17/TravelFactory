export type RequestStatus = 'Pending' | 'Approved' | 'Rejected'

export type StatusFilter = RequestStatus | 'All'

export type VacationRequest = {
  id: number
  startDate: string
  endDate: string
  reason?: string
  comments?: string
  status: RequestStatus
  user?: {
    name: string
  }
}

export type ValidatorUser = {
  id: number
  name: string
  role: string
}
