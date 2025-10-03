<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>Atletas</h1>
          <button 
            class="btn btn-primary" 
            @click="mostrarModalAgregar"
            :disabled="loading"
          >
            <i class="fas fa-plus"></i> Agregar Atleta
          </button>
        </div>

        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
          </div>
          <p class="mt-2">Cargando atletas...</p>
        </div>

        <div v-if="!loading" class="card">
          <div class="card-body">
            <div v-if="atletas.length === 0" class="text-center py-4">
              <p class="text-muted">No hay atletas registrados</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Posición</th>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Tiempo</th>
                    <th>Ciudad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                 <tbody>
                   <tr v-for="atleta in atletas" :key="atleta.id">
                     <td>
                       <span v-if="atleta.posicion > 3" :class="getBadgeClass(atleta)">{{ atleta.posicion }}</span>
                       <span v-else :class="getBadgeClass(atleta)" class="badge ms-1">
                         <i class="fas fa-trophy"></i> {{ getPosicionTexto(atleta.posicion) }}
                       </span>
                     </td>
                     <td>{{ atleta.dni }}</td>
                     <td>
                       <strong v-if="atleta.posicion <= 3">{{ atleta.nombre }}</strong>
                       <span v-else>{{ atleta.nombre }}</span>
                     </td>
                     <td>{{ atleta.tiempo }}</td>
                     <td>{{ atleta.ciudadNombre}}</td>
                     <td>
                       <button 
                         class="btn btn-sm btn-outline-primary me-2"
                         @click="editarAtleta(atleta)"
                         :disabled="loading"
                       >
                         <i class="fas fa-edit"></i> Editar
                       </button>
                       <button 
                         class="btn btn-sm btn-outline-danger"
                         @click="abrirModalEliminar(atleta)"
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

    <div class="modal fade" id="modalAtleta" tabindex="-1" aria-labelledby="modalAtletaLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalAtletaLabel">
              {{ modoEdicion ? 'Editar Atleta' : 'Agregar Atleta' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarAtleta" class="needs-validation" novalidate ref="formRef">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="dni" class="form-label">DNI *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="dni" 
                      v-model="atletaSeleccionado.dni"
                      :disabled="loading"
                      required
                      min="1"
                    >
                    <div class="invalid-feedback">
                      El DNI es obligatorio.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="nombre" 
                      v-model="atletaSeleccionado.nombre"
                      :disabled="loading"
                      required
                    >
                    <div class="invalid-feedback">
                      El nombre es obligatorio.
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="tiempo" class="form-label">Tiempo *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="tiempo" 
                      v-model="atletaSeleccionado.tiempo"
                      :disabled="loading"
                      placeholder="Ej: 1h 20m 15s"
                      required
                    >
                    <div class="invalid-feedback">
                      El tiempo es obligatorio.
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="posicion" class="form-label">Posición *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="posicion" 
                      v-model="atletaSeleccionado.posicion"
                      :disabled="loading"
                      required
                      min="1"
                    >
                    <div class="invalid-feedback">
                      La posición es obligatoria.
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="ciudadId" class="form-label">Ciudad *</label>
                <select 
                  class="form-select" 
                  id="ciudadId" 
                  v-model="atletaSeleccionado.ciudadId"
                  :disabled="loading"
                  required
                >
                  <option value="">Selecciona una ciudad</option>
                  <option 
                    v-for="ciudad in ciudades" 
                    :key="ciudad.id" 
                    :value="ciudad.id"
                  >
                    {{ ciudad.nombre }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  La ciudad es obligatoria.
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="loading">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="guardarAtleta"
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
              ¿Seguro que deseas eliminar al atleta
              <strong v-if="atletaSeleccionado.nombre">"{{ atletaSeleccionado.nombre }}"</strong>?
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
import { atletasApi } from '../composables/atletasApiService'
import { ciudadesApi } from '../composables/ciudadesApiService'

const formRef = ref(null)
const atletas = ref([])
const ciudades = ref([])
const loading = ref(false)
const modoEdicion = ref(false)
const toastMensaje = ref('')
const toastMensajeSuccess = ref('')
const modal = ref(null)
const modalEliminar = ref(null)
const toast = ref(null)
const toastSuccess = ref(null)
const atletaSeleccionado = reactive({
  id: 0,
  dni: '',
  nombre: '',
  tiempo: '',
  posicion: '',
  ciudadId: ''
})

const getPosicionTexto = (posicion) => {
  if (posicion === 1) return '1° Lugar'
  if (posicion === 2) return '2° Lugar' 
  if (posicion === 3) return '3° Lugar'
  return ''
}

const getBadgeClass = (atleta) => {
  if (atleta.posicion === 1) return 'badge bg-gold text-dark fw-bold'
  if (atleta.posicion === 2) return 'badge bg-silver text-dark fw-bold'
  if (atleta.posicion === 3) return 'badge bg-bronze text-white fw-bold'
  return 'badge bg-primary'
}

const cargarAtletas = async () => {
  loading.value = true

  try {
    atletas.value = await atletasApi.getAll()
  } catch (err) {
    mostrarToast(err.message)
  } finally {
    loading.value = false
  }
}

const cargarCiudades = async () => {
  try {
    ciudades.value = await ciudadesApi.getAll()
  } catch (err) {
    mostrarToast('Error al cargar las ciudades')
  }
}

const mostrarModalAgregar = () => {
  modoEdicion.value = false
  limpiarAtletaSeleccionado()
  abrirModal()
}

const editarAtleta = (atleta) => {
  modoEdicion.value = true
  atletaSeleccionado.id = atleta.id
  atletaSeleccionado.dni = atleta.dni
  atletaSeleccionado.nombre = atleta.nombre
  atletaSeleccionado.tiempo = atleta.tiempo
  atletaSeleccionado.posicion = atleta.posicion
  atletaSeleccionado.ciudadId = atleta.ciudadId
  abrirModal()
}

const abrirModalEliminar = (atleta) => {
  atletaSeleccionado.id = atleta.id
  atletaSeleccionado.nombre = atleta.nombre
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
    await atletasApi.delete(atletaSeleccionado.id)

    await cargarAtletas()

    limpiarAtletaSeleccionado()
    
    mostrarToastSuccess('Atleta eliminado correctamente.')

    cerrarModalEliminar()
  } catch (err) {
    mostrarToast(err.message)
  } finally {
    loading.value = false
  }
}

const guardarAtleta = async () => {
  const form = formRef.value;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  loading.value = true
  
  try {
    const atletaData = {
      dni: parseInt(atletaSeleccionado.dni),
      nombre: atletaSeleccionado.nombre,
      tiempo: atletaSeleccionado.tiempo,
      posicion: parseInt(atletaSeleccionado.posicion),
      ciudadId: parseInt(atletaSeleccionado.ciudadId)
    }

    if (modoEdicion.value) {
      await atletasApi.update(atletaSeleccionado.id, atletaData)
    } else {
      await atletasApi.create(atletaData)
    }
    
    await cargarAtletas()

    limpiarAtletaSeleccionado()
    
    mostrarToastSuccess(modoEdicion.value ? 'Atleta actualizado correctamente.' : 'Atleta creado correctamente.')
    
    cerrarModal()
  } catch (err) {
    mostrarToast(err.message)
  } finally {
    loading.value = false
  }
}

const limpiarAtletaSeleccionado = () => {
  atletaSeleccionado.id = 0
  atletaSeleccionado.dni = ''
  atletaSeleccionado.nombre = ''
  atletaSeleccionado.tiempo = ''
  atletaSeleccionado.posicion = ''
  atletaSeleccionado.ciudadId = ''
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

onMounted(async () => {
  await Promise.all([
    cargarAtletas(),
    cargarCiudades()
  ])

  modal.value.addEventListener("hidden.bs.modal", () => {
    formRef.value.reset();
    formRef.value.classList.remove("was-validated");
  });
})
</script>

<style scoped>
.bg-gold {
  background-color: #ffd700 !important;
}

.bg-silver {
  background-color: #c0c0c0 !important;
}

.bg-bronze {
  background-color: #cd7f32 !important;
}
</style>
