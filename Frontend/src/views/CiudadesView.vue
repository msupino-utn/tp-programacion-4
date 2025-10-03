<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>Ciudades</h1>
          <button 
            class="btn btn-primary" 
            @click="mostrarModalAgregar"
            :disabled="loading"
          >
            <i class="fas fa-plus"></i> Agregar Ciudad
          </button>
        </div>

        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
          </div>
          <p class="mt-2">Cargando ciudades...</p>
        </div>

        <div v-if="!loading" class="card">
          <div class="card-body">
            <div v-if="ciudades.length === 0" class="text-center py-4">
              <p class="text-muted">No hay ciudades registradas</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ciudad in ciudades" :key="ciudad.id">
                    <td>{{ ciudad.nombre }}</td>
                    <td>
                      <button 
                        class="btn btn-sm btn-outline-primary me-2"
                        @click="editarCiudad(ciudad)"
                        :disabled="loading"
                      >
                        <i class="fas fa-edit"></i> Editar
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        @click="abrirModalEliminar(ciudad)"
                        :disabled="loading"
                      >
                        <i class="fas fa-trash"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalCiudad" tabindex="-1" aria-labelledby="modalCiudadLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCiudadLabel">
              {{ modoEdicion ? 'Editar Ciudad' : 'Agregar Ciudad' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarCiudad">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="nombre" 
                  v-model="ciudadSeleccionada.nombre"
                  :disabled="loading"
                  required
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="loading">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="guardarCiudad"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ modoEdicion ? 'Actualizar' : 'Agregar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal fade" id="modalEliminar" tabindex="-1" aria-labelledby="modalEliminarLabel" aria-hidden="true" ref="modalEliminar">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalEliminarLabel">Confirmar eliminación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>
              ¿Seguro que deseas eliminar la ciudad
              <strong v-if="ciudadSeleccionada.nombre">"{{ ciudadSeleccionada.nombre }}"</strong>?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="loading">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="confirmarEliminar" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div class="toast align-items-center text-bg-danger border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true" ref="toast">
        <div class="d-flex">
          <div class="toast-body">
            {{ toastMensaje }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
      <div class="toast align-items-center text-bg-success border-0" role="alert" aria-live="polite" aria-atomic="true" ref="toastSuccess">
        <div class="d-flex">
          <div class="toast-body">
            {{ toastMensajeSuccess }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Modal, Toast } from 'bootstrap'
import { ciudadesApi } from '../composables/ciudadesApiService'

const ciudades = ref([])
const loading = ref(false)
const modoEdicion = ref(false)
const toastMensaje = ref('')
const toastMensajeSuccess = ref('')
const modal = ref(null)
const modalEliminar = ref(null)
const toast = ref(null)
const toastSuccess = ref(null)
const ciudadSeleccionada = reactive({
  id: 0,
  nombre: ''
})

const cargarCiudades = async () => {
  loading.value = true

  try {
    ciudades.value = await ciudadesApi.getAll()
  } catch (err) {
    mostrarToast(err.message)
  } finally {
    loading.value = false
  }
}

const mostrarModalAgregar = () => {
  modoEdicion.value = false
  limpiarCiudadSeleccionada()
  abrirModal()
}

const editarCiudad = (ciudad) => {
  modoEdicion.value = true
  ciudadSeleccionada.id = ciudad.id
  ciudadSeleccionada.nombre = ciudad.nombre
  abrirModal()
}

const abrirModalEliminar = (ciudad) => {
  ciudadSeleccionada.id = ciudad.id
  ciudadSeleccionada.nombre = ciudad.nombre
  const instance = Modal.getOrCreateInstance(modalEliminar.value)
  instance.show()
}

const cerrarModalEliminar = () => {
  const instance = Modal.getOrCreateInstance(modalEliminar.value)
  instance.hide()
}

const confirmarEliminar = async () => {
  loading.value = true

  try {
    await ciudadesApi.delete(ciudadSeleccionada.id)

    await cargarCiudades()

    limpiarCiudadSeleccionada()
    
    mostrarToastSuccess('Ciudad eliminada correctamente.')

    cerrarModalEliminar()
  } catch (err) {
    mostrarToast(err.message)
  } finally {
    loading.value = false
  }
}

const guardarCiudad = async () => {
  if (!ciudadSeleccionada.nombre.trim()) {
    return
  }

  loading.value = true
  
  try {
    if (modoEdicion.value) {
      await ciudadesApi.update(ciudadSeleccionada.id, { nombre: ciudadSeleccionada.nombre })
    } else {
      await ciudadesApi.create({ nombre: ciudadSeleccionada.nombre })
    }
    
    await cargarCiudades()

    limpiarCiudadSeleccionada()
    
    mostrarToastSuccess(modoEdicion.value ? 'Ciudad actualizada correctamente.' : 'Ciudad creada correctamente.')
    
    cerrarModal()
  } catch (err) {
    mostrarToast(err.message)
  } finally {
    loading.value = false
  }
}

const limpiarCiudadSeleccionada = () => {
  ciudadSeleccionada.id = 0
  ciudadSeleccionada.nombre = ''
}

const abrirModal = () => {
  const instance = Modal.getOrCreateInstance(modal.value)
  instance.show()
}

const cerrarModal = () => {
  const modalInstance = Modal.getOrCreateInstance(modal.value)
  modalInstance.hide();
}

const mostrarToast = (texto) => {
  toastMensaje.value = texto
  const instance = Toast.getOrCreateInstance(toast.value, { autohide: true, delay: 4000 })
  instance.show()
}

const mostrarToastSuccess = (texto) => {
  toastMensajeSuccess.value = texto
  const instance = Toast.getOrCreateInstance(toastSuccess.value, { autohide: true, delay: 3000 })
  instance.show()
}

onMounted(() => {
  cargarCiudades()
})
</script>

