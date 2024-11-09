import { DetailedHTMLProps, LabelHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../utils/cn'
import { useField } from 'formik'
import InputMask from 'inputmask'
import React from 'react'

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  classNameContainer?: string
  label?: string
  isFocus?: boolean
  isError?: boolean
  isSuccess?: boolean
  isWarning?: boolean
  isLabelShrink?: boolean
  mask?: string
}

export const Input = ({ isLabelShrink, classNameContainer, mask, ...props }: InputProps) => {
  const ref = useRef<any>(null)
  const [isFocus, setIsFocus] = useState(false)
  const hasValue = useMemo(() => !!props.value, [props.value])

  useEffect(() => {
    if (!mask) {
      InputMask({ mask: '' }).mask(ref.current)
      return
    }
    const maskStyle: Record<string, any> = {}
    if (mask === 'cpf') maskStyle['mask'] = '999.999.999-99[9]'
    else if (mask === 'cnpj') maskStyle['mask'] = '99.999.999/9999-99'
    else maskStyle['mask'] = ''

    InputMask(maskStyle).mask(ref.current)
  }, [mask])

  useEffect(() => {
    if (hasValue) setIsFocus(true)
  }, [hasValue])

  const handleSetFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    setIsFocus(true)
    props?.onFocus?.(event)
  }

  const handleSetBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    if (hasValue) return
    setIsFocus(false)
    props?.onBlur?.(event)
  }

  return (
    <Container classNameContainer={classNameContainer}>
      <Layout>
        <Label isFocus={isFocus} isError={props.isError} label={props.label} isLabelShrink={isLabelShrink} />
        <InputText ref={ref} {...props} onFocus={handleSetFocus} onBlur={handleSetBlur} isFocus={isFocus} />
      </Layout>
    </Container>
  )
}

type ContainerProps = DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  classNameContainer?: string
}
const Container = ({ children, ...props }: ContainerProps) => {
  return <div className={cn('relative w-full', props.classNameContainer)}>{children}</div>
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

const InputText = React.forwardRef<HTMLInputElement, InputProps>(
  ({ isFocus, isError, isSuccess, isWarning, disabled, ...props }, ref) => {
    const inputStyle = getInputStyle({ isFocus, isError, isSuccess, isWarning, disabled })

    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          `h-10 rounded border border-ground text-primary outline-none transition-colors duration-150 disabled:border-none pl-3`,
          props.className,
          inputStyle
        )}
      />
    )
  }
)
InputText.displayName = 'InputText'

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

export const InputFormik = ({ ...props }: InputProps) => {
  if (!props.name) throw new Error('O nome é obrigatório')
  const [field, meta] = useField(props.name!)
  const isError = !!meta.error && !!meta.touched

  return (
    <Input
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
