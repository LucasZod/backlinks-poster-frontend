import { DetailedHTMLProps, LabelHTMLAttributes, useEffect, useMemo, useState } from 'react'
import { cn } from '../utils/cn'
import { useField } from 'formik'

interface TextAreaProps
  extends DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  classNameContainer?: string
  label?: string
  isFocus?: boolean
  isError?: boolean
  isSuccess?: boolean
  isWarning?: boolean
  isLabelShrink?: boolean
}

export const TextArea = ({ isLabelShrink, ...props }: TextAreaProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const hasValue = useMemo(() => !!props.value, [props.value])

  useEffect(() => {
    if (hasValue) setIsFocus(true)
  }, [hasValue])

  const handleSetFocus = (event: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    setIsFocus(true)
    props?.onFocus?.(event)
  }

  const handleSetBlur = (event: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    if (hasValue) return
    setIsFocus(false)
    props?.onBlur?.(event)
  }

  return (
    <Container>
      <Layout>
        <Label isFocus={isFocus} isError={props.isError} label={props.label} isLabelShrink={isLabelShrink} />
        <TextAreaInput {...props} onFocus={handleSetFocus} onBlur={handleSetBlur} isFocus={isFocus} />
      </Layout>
    </Container>
  )
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-full">{children}</div>
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

interface LabelProps extends DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  label?: string
  isFocus?: boolean
  isError?: boolean
  isSuccess?: boolean
  isWarning?: boolean
  disabled?: boolean
  isLabelShrink?: boolean
}

const Label = ({ label, isFocus, disabled, isError, isSuccess, isWarning, isLabelShrink }: LabelProps) => {
  const inputStyle = getLabelStyle({ isFocus, isError, isSuccess, isWarning, disabled })

  return (
    <label
      className={cn(
        'pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 rounded-md !bg-white px-1 text-primarySoft transition-all duration-300 ease-in-out',
        inputStyle,
        {
          'left-3 top-[0.5px] text-xs': isFocus || isLabelShrink,
        }
      )}
    >
      {label}
    </label>
  )
}

const getLabelStyle = ({
  isFocus,
  isError,
  isSuccess,
  isWarning,
  disabled,
}: {
  isFocus?: boolean
  isError?: boolean
  isSuccess?: boolean
  isWarning?: boolean
  disabled?: boolean
}) => {
  if (isFocus && !disabled && !isError && !isSuccess && !isWarning) return ''
  if (isSuccess && !disabled) return 'bg-success bg-opacity-20'
  if (isError && !disabled) return 'border-error border bg-error bg-opacity-20'
  if (isWarning && !disabled) return 'bg-alert bg-opacity-20'
  return ''
}

const TextAreaInput = ({ isFocus, isError, isSuccess, isWarning, disabled, ...props }: TextAreaProps) => {
  const inputStyle = getInputStyle({ isFocus, isError, isSuccess, isWarning, disabled })

  return (
    <textarea
      {...props}
      className={cn(
        `h-10 pt-2 rounded border border-ground text-primary outline-none transition-colors duration-150 disabled:border-none pl-3`,
        props.className,
        inputStyle
      )}
    />
  )
}

const getInputStyle = ({
  isFocus,
  isError,
  isSuccess,
  isWarning,
  disabled,
}: {
  isFocus?: boolean
  isError?: boolean
  isSuccess?: boolean
  isWarning?: boolean
  disabled?: boolean
}) => {
  if (isFocus && !disabled && !isError && !isSuccess && !isWarning) return 'border-secondary'
  if (isSuccess && !disabled) return 'border-success bg-success bg-opacity-20'
  if (isError && !disabled) return 'border-error bg-error bg-opacity-20'
  if (isWarning && !disabled) return 'border-alert bg-alert bg-opacity-20'
  return ''
}

export const TextAreaFormik = ({ ...props }: TextAreaProps) => {
  if (!props.name) throw new Error('O nome é obrigatório')
  const [field, meta] = useField(props.name!)
  const isError = !!meta.error && !!meta.touched

  return (
    <TextArea
      {...field}
      {...props}
      isError={isError}
      onChange={(e) => {
        props?.onChange?.(e)
        field.onChange({ target: { name: props.name, value: e.target.value } })
      }}
    />
  )
}
