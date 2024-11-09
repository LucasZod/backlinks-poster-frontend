import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const useAuthCheck = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios
          .get(`${import.meta.env.VITE_BACKEND_URL}/auth/check`, {
            withCredentials: true,
          })
          .then((res) => res.data)

        if (!response.authenticated) {
          throw new Error('Token inválido')
        }
      } catch (error) {
        navigate('/')
      }
    }

    checkAuth()
  }, [navigate])
}

export default useAuthCheck
