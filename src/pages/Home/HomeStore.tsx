import axios from 'axios'
import { createSimpleStore } from 'react-simple-reducer'
import { toast } from 'react-toastify'
import { CustomerDto } from '../../dtos/Customer.dto'
import { createSelector } from 'reselect'

export const HomeStore = createSimpleStore(
  {
    isModalVisible: false,
    loading: false,
    searchInput: '',
    customers: [] as CustomerDto[],
    customerEdit: null as CustomerDto | null,
    customerHistory: null as CustomerDto | null,
    loadingCampaign: false,
  },
  {
    setIsModalVisible(state, isModalVisible) {
      if (!isModalVisible) {
        state.customerEdit = null
      }
      state.isModalVisible = isModalVisible
    },
    createCustomerStarted(state) {
      state.loading = true
    },
    createCustomerSuccess(state) {
      state.loading = false
    },
    createCustomerError(state) {
      state.loading = false
    },
    setSearchInput(state, searchInput) {
      state.searchInput = searchInput
    },
    getCustomersStarted(state) {
      state.loading = true
    },
    getCustomersSuccess(state, customers: CustomerDto[]) {
      state.loading = false
      state.customers = customers
    },
    getCustomersError(state) {
      state.loading = false
    },
    setCustomerEdit(state, customer: CustomerDto | null) {
      state.customerEdit = customer
      state.isModalVisible = true
    },
    setCustomerHistory(state, customer) {
      state.customerHistory = customer
    },
    createCampaignStarted(state) {
      state.loadingCampaign = true
    },
    createCampaignSuccess(state) {
      state.loadingCampaign = false
    },
    createCampaignError(state) {
      state.loadingCampaign = false
    },
  },
  {
    thunks: {
      getCustomers() {
        return async (dispatch) => {
          try {
            dispatch(HomeStore.actions.getCustomersStarted())
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customer`, {
              withCredentials: true,
            })
            dispatch(HomeStore.actions.getCustomersSuccess(response.data))
          } catch (error: any) {
            const errorMessage = error?.response?.data?.message ?? 'Erro ao buscar clientes, tente novamente mais tarde'
            toast.error(errorMessage)
            dispatch(HomeStore.actions.getCustomersError())
          }
        }
      },
      createCustomer({
        name,
        cpfCnpj,
        backLinks,
        keyWords,
        cb,
      }: {
        name: string
        cpfCnpj: string
        backLinks: string[]
        keyWords: string[]
        cb: () => void
      }) {
        return async (dispatch) => {
          try {
            dispatch(HomeStore.actions.createCustomerStarted())
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/customer/create`,
              {
                name,
                cpfCnpj,
                backLinks,
                keyWords,
              },
              {
                withCredentials: true,
              }
            )
            dispatch(HomeStore.actions.createCustomerSuccess())
            toast.success('Cliente criado com sucesso')
            cb()
          } catch (error: any) {
            const errorMessage = error?.response?.data?.message ?? 'Erro ao criar cliente, tente novamente mais tarde'
            toast.error(errorMessage)
            dispatch(HomeStore.actions.createCustomerError())
          }
        }
      },
      updateCustomer({
        id,
        name,
        cpfCnpj,
        backLinks,
        keyWords,
        cb,
      }: {
        id: number
        name: string
        cpfCnpj: string
        backLinks: string[]
        keyWords: string[]
        cb: () => void
      }) {
        return async (dispatch) => {
          try {
            dispatch(HomeStore.actions.createCustomerStarted())
            await axios.put(
              `${import.meta.env.VITE_BACKEND_URL}/customer/update/${id}`,
              {
                name,
                cpfCnpj,
                newBackLinks: backLinks,
                newKeyWords: keyWords,
              },
              {
                withCredentials: true,
              }
            )
            dispatch(HomeStore.actions.createCustomerSuccess())
            toast.success('Cliente atualizado com sucesso')
            cb()
          } catch (error: any) {
            const errorMessage =
              error?.response?.data?.message ?? 'Erro ao atualizar cliente, tente novamente mais tarde'
            toast.error(errorMessage)
            dispatch(HomeStore.actions.createCustomerError())
          }
        }
      },
      createCampaign(customerId: number, cb?: () => void) {
        return async (dispatch) => {
          try {
            dispatch(HomeStore.actions.createCampaignStarted())
            const { message } = await axios
              .post(`${import.meta.env.VITE_BACKEND_URL}/campaign/create/${customerId}`, null, {
                withCredentials: true,
              })
              .then((res) => res.data)
            dispatch(HomeStore.actions.createCampaignSuccess())
            cb?.()
            toast.success(message)
          } catch (error: any) {
            const errorMessage = error?.response?.data?.message ?? 'Erro ao criar campanha, tente novamente mais tarde'
            toast.error(errorMessage)
            dispatch(HomeStore.actions.createCampaignError())
          }
        }
      },
    },
  }
)

export type IState = ReturnType<typeof HomeStore.useState>

export const getFilteredCustomers = createSelector(
  (s: IState) => s.customers,
  (s: IState) => s.searchInput,
  (customers, searchInput) => {
    const normalizedSearchInput = searchInput.toLowerCase().replace(/[^0-9a-z]/g, '')
    return customers.filter((customer) => {
      const normalizedCustomerName = customer.name.toLowerCase()
      const normalizedCustomerCpfCnpj = customer.cpfCnpj.replace(/[^0-9]/g, '')
      return (
        normalizedCustomerName.includes(normalizedSearchInput) ||
        normalizedCustomerCpfCnpj.includes(normalizedSearchInput)
      )
    })
  }
)
