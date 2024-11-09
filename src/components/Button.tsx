import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { cn } from '../utils/cn'
import { Show } from './Show'

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  loading?: boolean
}

export const Button = ({ loading, ...props }: ButtonProps) => {
  return (
    <React.Fragment>
      <ButtonContainer {...props} loading={loading} />
    </React.Fragment>
  )
}

const ButtonContainer = ({ children, loading, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        `flex h-10 rounded-md items-center disabled:bg-slate-400 justify-center bg-primary p-3 font-semibold text-white outline-none transition-color duration-300 hover:brightness-95 disabled:hover:brightness-100`,
        props.className
      )}
    >
      <Show when={!loading}>{children}</Show>
      <Show when={!!loading}>
        <Loading />
      </Show>
    </button>
  )
}

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="animate-spin rounded-full h-6 w-6 border-4 border-t-transparent border-white"></div>
    </div>
  )
}
