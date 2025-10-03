import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/ciudades',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const ciudadesApi = {
  async getAll() {
    try {
      const response = await api.get('/')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al obtener ciudades:', error.response?.data)
        throw new Error(error.response?.data)
      } else {
        console.error('Error al obtener ciudades:', error)
        throw new Error('Ocurrió un error inesperado al cargar las ciudades')
      }
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/${id}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al obtener ciudad:', error.response?.data)
        throw new Error(error.response?.data)
      } else {
        console.error('Error al obtener ciudad:', error)
        throw new Error('Ocurrió un error inesperado al cargar la ciudad')
      }
    }
  },

  async create(ciudad) {
    try {
      const response = await api.post('/', ciudad)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al crear ciudad:', error.response?.data)
        throw new Error(error.response?.data)
      } else {
        console.error('Error al crear ciudad:', error)
        throw new Error('Ocurrió un error inesperado al crear la ciudad')
      }
    }
  },

  async update(id, ciudad) {
    try {
      const response = await api.put(`/${id}`, ciudad)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al actualizar ciudad:', error.response?.data)
        throw new Error(error.response?.data)
      } else {
        console.error('Error al actualizar ciudad:', error)
        throw new Error('Ocurrió un error inesperado al actualizar la ciudad')
      }
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/${id}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al eliminar ciudad: ", error.response?.data);
        throw new Error(error.response?.data);
      } else {
        console.error("Error al eliminar ciudad: ", error);
        throw new Error("Ocurrió un error inesperado al eliminar la ciudad");
      }
    }
  }
}
