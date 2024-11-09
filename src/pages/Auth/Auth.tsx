import React from 'react'
import { InputFormik } from '../../components/Input'
import { Button } from '../../components/Button'
import { FormikProvider, Form as FormFormik, useFormik, useFormikContext } from 'formik'
import { AuthStore } from './AuthStore'
import { AuthStore as Store } from './AuthStore'
import { useNavigate } from 'react-router-dom'

const initialValues = { userName: '', password: '' }
type InitialValues = typeof initialValues

export const Auth = () => {
  return (
    <AuthStore.Provider>
      <Container>
        <Layout>
          <Title />
          <Form>
            <UserName />
            <Password />
            <SignIn />
          </Form>
        </Layout>
      </Container>
    </AuthStore.Provider>
  )
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-ground min-h-dvh w-full flex flex-col">{children}</div>
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white max-w-[20.75rem] w-full shadow-lg m-auto flex flex-col gap-y-5 p-4 rounded-lg">
      {children}
    </div>
  )
}

const Title = () => {
  return <span className="text-2xl">Entrar</span>
}

const Form = ({ children }: { children: React.ReactNode }) => {
  const dispatch = Store.useDispatch()
  const navigate = useNavigate()
  const validate = (values: typeof initialValues) => {
    const error: { password?: string; userName?: string } = {}
    if (!values.password) error['password'] = 'O campo de senha é obrigatório'
    if (!values.userName) error['userName'] = 'O campo de nome de usuário é obrigatório'
    return error
  }

  const formik = useFormik({
    initialValues,
    validate,
    enableReinitialize: true,
    onSubmit: async (values) => {
      dispatch(
        Store.thunks.getAuthLogin({
          password: values.password,
          userName: values.userName,
          cb: () => navigate('/home'),
        })
      )
    },
  })
  return (
    <FormikProvider value={formik}>
      <FormFormik autoComplete="off">
        <fieldset className="flex flex-col gap-y-5">{children}</fieldset>
      </FormFormik>
    </FormikProvider>
  )
}

const UserName = () => {
  const formik = useFormikContext<InitialValues>()
  const isError = !!formik.errors?.['userName']
  return (
    <InputFormik
      name="userName"
      label="Nome de usuário"
      className="w-full h-[3.5rem]"
      placeholder="Informe seu nome de usuário"
      isLabelShrink
      isError={isError}
    />
  )
}

const Password = () => {
  const formik = useFormikContext<InitialValues>()
  const isError = !!formik.errors?.['password']
  return (
    <InputFormik
      name="password"
      label="Senha"
      type="password"
      className="w-full h-[3.5rem]"
      placeholder="Informe sua senha"
      isLabelShrink
      isError={isError}
    />
  )
}

const SignIn = () => {
  const formik = useFormikContext<InitialValues>()
  const { loading } = Store.useState()
  return (
    <Button loading={loading} disabled={!formik.isValid} type="submit" className="font-medium rounded-md">
      ACESSAR MINHA CONTA
    </Button>
  )
}
