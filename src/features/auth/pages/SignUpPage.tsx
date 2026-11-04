import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { clearAuthError, registerOwnerUser } from '../authSlice'
import type { OwnerCreateRequest } from '../authTypes'

const initialForm: OwnerCreateRequest = {
  user: { username: '', password: '' },
  ownerName: '',
  nic: '',
  tel: '',
  address: '',
  workplace: '',
  jobTitle: '',
  email: '',
}

export function SignUpPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState<1 | 2>(1)

  function updateField(field: keyof Omit<OwnerCreateRequest, 'user'>, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    dispatch(clearAuthError())
  }

  function updateUserField(field: 'username' | 'password', value: string) {
    setForm((current) => ({ ...current, user: { ...current.user, [field]: value } }))
    dispatch(clearAuthError())
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (step === 1) {
      setStep(2)
      return
    }

    const result = await dispatch(registerOwnerUser(form))
    if (registerOwnerUser.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <section>
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Hostel Manager
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Create owner account</h1>
        <p className="mt-2 text-sm text-slate-500">
          {step === 1
            ? 'Set up your login details to get started.'
            : 'Tell us a little more about you and your hostel.'}
        </p>
      </div>

      <ol className="mb-8 flex items-start" aria-label="Signup progress">
        <StepIndicator step={1} currentStep={step} label="Account" />
        <li
          className={`mt-4 h-px flex-1 ${step === 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}
          aria-hidden="true"
        />
        <StepIndicator step={2} currentStep={step} label="Owner profile" />
      </ol>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-900">Secure your account</h2>
              <p className="mt-1 text-sm text-slate-500">
                Use these details whenever you sign in.
              </p>
            </div>
            <Field
              label="Username"
              value={form.user.username}
              onChange={(value) => updateUserField('username', value)}
              autoComplete="username"
              placeholder="Choose a username"
            />
            <Field
              label="Password"
              type="password"
              value={form.user.password}
              onChange={(value) => updateUserField('password', value)}
              autoComplete="new-password"
              placeholder="Create a strong password"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-900">Your owner profile</h2>
              <p className="mt-1 text-sm text-slate-500">
                These details help us manage your hostel account.
              </p>
            </div>
            <Field
              label="Owner name"
              value={form.ownerName}
              onChange={(value) => updateField('ownerName', value)}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            <Field
              label="NIC"
              value={form.nic}
              onChange={(value) => updateField('nic', value)}
              placeholder="123456789V or 200012345678"
              pattern="^([0-9]{9}[vVxX]|[0-9]{12})$"
              title="Enter 9 digits followed by V or X, or 12 digits."
            />
            <Field
              label="Contact number"
              value={form.tel}
              onChange={(value) => updateField('tel', value)}
              type="tel"
              placeholder="Enter your contact number"
              autoComplete="tel"
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => updateField('email', value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Field
              label="Address"
              value={form.address}
              onChange={(value) => updateField('address', value)}
              placeholder="Enter your residential address"
              autoComplete="street-address"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Workplace"
                value={form.workplace}
                onChange={(value) => updateField('workplace', value)}
                placeholder="Company or organization"
              />
              <Field
                label="Job title"
                value={form.jobTitle}
                onChange={(value) => updateField('jobTitle', value)}
                placeholder="Your role"
              />
            </div>
          </div>
        )}

        {step === 2 && error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {step === 1 ? 'Continue' : loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
          Sign in
        </Link>
      </p>
    </section>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  autoComplete?: string
  pattern?: string
  title?: string
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  pattern,
  title,
}: FieldProps) {
  const id = label.toLowerCase().replaceAll(' ', '-')

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={id}
        autoComplete={autoComplete}
        pattern={pattern}
        title={title}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  )
}

interface StepIndicatorProps {
  step: 1 | 2
  currentStep: 1 | 2
  label: string
}

function StepIndicator({ step, currentStep, label }: StepIndicatorProps) {
  const isActive = currentStep === step
  const isComplete = currentStep > step

  return (
    <li className="flex min-w-0 flex-col items-center gap-2">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
          isActive || isComplete
            ? 'bg-indigo-600 text-white'
            : 'border border-slate-300 bg-white text-slate-500'
        }`}
        aria-current={isActive ? 'step' : undefined}
      >
        {isComplete ? '✓' : step}
      </span>
      <span
        className={`text-xs font-medium ${
          isActive ? 'text-indigo-600' : 'text-slate-500'
        }`}
      >
        {label}
      </span>
    </li>
  )
}
