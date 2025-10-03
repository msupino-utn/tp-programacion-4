import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/atletas',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const atletasApi = {
  async getAll() {
    try {
      const response = await api.get('/')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al obtener atletas:', error.response?.data)
        throw new Error(error.response?.data)
      } else {
        console.error('Error al obtener atletas:', error)
        throw new Error('Ocurrió un error inesperado al cargar los atletas')
      }
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/${id}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al obtener atleta:', error.response?.data)
        throw new Error(error.response?.data)
      } else {
        console.error('Error al obtener atleta:', error)
        throw new Error('Ocurrió un error inesperado al cargar el atleta')
      }
    }
  },

  async getByCiudad(ciudadId) {
    try {
      const response = await api.get(`/ciudad/${ciudadId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al obtener atletas por ciudad:', error.response?.data)
        throw new Error(error.response?.data)
      } else {
        console.error('Error al obtener atletas por ciudad:', error)
        throw new Error('Ocurrió un error inesperado al cargar los atletas de la ciudad')
      }
    }
  },

  async create(atleta) {
    try {
      const response = await api.post('/', atleta)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al crear atleta:', error.response?.data)
        throw new Error(error.response?.data)
      } else {
        console.error('Error al crear atleta:', error)
        throw new Error('Ocurrió un error inesperado al crear el atleta')
      }
    }
  },

  async update(id, atleta) {
    try {
      const response = await api.put(`/${id}`, atleta)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al actualizar atleta:', error.response?.data)
        throw new Error(error.response?.data)
      } else {
        console.error('Error al actualizar atleta:', error)
        throw new Error('Ocurrió un error inesperado al actualizar el atleta')
      }
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/${id}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al eliminar atleta: ", error.response?.data);
        throw new Error(error.response?.data);
      } else {
        console.error("Error al eliminar atleta: ", error);
        throw new Error("Ocurrió un error inesperado al eliminar el atleta");
      }
    }
  }
}
