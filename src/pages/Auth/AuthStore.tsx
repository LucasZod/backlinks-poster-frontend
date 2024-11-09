import axios from 'axios'
import { createSimpleStore } from 'react-simple-reducer'
import { toast } from 'react-toastify'

export const AuthStore = createSimpleStore(
  {
    loading: false,
    token: '',
  },
  {
    getLoginStarted(state) {
      state.loading = true
    },
    getLoginSuccess(state, token: string) {
      state.loading = false
      state.token = token
    },
    getLoginError(state) {
      state.loading = false
    },
  },
  {
    thunks: {
      getAuthLogin({ userName, password, cb }: { userName: string; password: string; cb: () => void }) {
        return async (dispatch: any) => {
          try {
            dispatch(AuthStore.actions.getLoginStarted())
            const token = await axios
              .post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
                { userName, password },
                {
                  withCredentials: true,
                }
              )
              .then((res) => res.data)

            dispatch(AuthStore.actions.getLoginSuccess(token))
            cb()
          } catch (error) {
            toast.error('Usuário ou senha inválidos')
            dispatch(AuthStore.actions.getLoginError())
          }
        }
      },
    },
  }
)
