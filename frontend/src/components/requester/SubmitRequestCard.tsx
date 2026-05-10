import { useState } from 'react'
import type { FormState } from '../../pages/Requester'

type RequesterUser = {
  id: number
  name: string
}

type SubmitRequestCardProps = {
  requesters: RequesterUser[]
  effectiveUserId: string
  setSelectedUserId: React.Dispatch<
    React.SetStateAction<string>
  >
  onSubmit: (form: FormState) => Promise<void>
  submitMessage: string
  error: string
  isSubmitting: boolean
  usersLoading: boolean
  usersError: string
}

function useFormFields<T>(initialValues: T) {
  const [fields, setFields] = useState(initialValues)

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target

    setFields((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return {
    fields,
    setFields,
    handleChange,
  }
}

export default function SubmitRequestCard({
  requesters,
  effectiveUserId,
  setSelectedUserId,
  onSubmit,
  submitMessage,
  error,
  isSubmitting,
  usersLoading,
  usersError,
}: SubmitRequestCardProps) {
  const {
    fields: form,
    setFields: setForm,
    handleChange,
  } = useFormFields<FormState>({
    startDate: '',
    endDate: '',
    reason: '',
  })

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    await onSubmit(form)

    setForm({
      startDate: '',
      endDate: '',
      reason: '',
    })
  }

  return (
    <article className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
      <h2 className="text-lg font-semibold text-gray-900">
        Submit Request
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Requester interface
      </p>

      <form
        className="mt-5 space-y-4"
        onSubmit={handleSubmit}
      >
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">
            Requester
          </span>

          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={effectiveUserId}
            onChange={(event) =>
              setSelectedUserId(event.target.value)
            }
            required
          >
            {requesters.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">
            Start Date
          </span>

          <input
            type="date"
            name="startDate"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">
            End Date
          </span>

          <input
            type="date"
            name="endDate"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">
            Reason (optional)
          </span>

          <textarea
            name="reason"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
            value={form.reason}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting || !effectiveUserId}
        >
          {isSubmitting
            ? 'Submitting...'
            : 'Submit Vacation Request'}
        </button>
      </form>

      {submitMessage ? (
        <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {submitMessage}
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {usersLoading ? (
        <p className="mt-2 text-sm text-gray-500">
          Loading users...
        </p>
      ) : null}

      {usersError ? (
        <p className="mt-2 text-sm text-red-600">
          {usersError}
        </p>
      ) : null}
    </article>
  )
}