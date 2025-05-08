<template>
    <div class="flex mt-4">
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Agregar habitación</div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2 w-full">
                    <label for="hotel">Hotel</label>
                    <Dropdown v-model="form.hotel_id" :options="hoteles" optionLabel="nombre" optionValue="id"
                        placeholder="Selecciona un hotel" class="w-full" />
                </div>

                <div class="flex flex-col gap-2 w-full">
                    <label for="tipo">Tipo de habitación</label>
                    <Dropdown id="tipo" v-model="form.tipo" :options="tipos" placeholder="Selecciona tipo"
                        class="w-full" />
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2 w-full">
                    <label for="acomodacion">Acomodación</label>
                    <Dropdown id="acomodacion" v-model="form.acomodacion" :options="acomodaciones"
                        placeholder="Selecciona acomodación" class="w-full" />
                </div>

                <div class="flex flex-col gap-2 w-full">
                    <label for="cantidad">Cantidad</label>
                    <InputNumber id="cantidad" v-model="form.cantidad" :min="1" placeholder="Ej: 10" class="w-full" />
                </div>
            </div>

            <div>
                <Button label="Guardar Habitación" icon="pi pi-plus" class="p-button-success w-full md:w-auto"
                    :loading="loading" :disabled="loading" @click="crearHabitacion" />
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * Componente de formulario para crear habitaciones.
 * Permite seleccionar un hotel, tipo, acomodación y cantidad.
 * Aplica reglas de validación según el tipo de habitación.
 */

import { ref, onMounted, watch } from 'vue'
import { useHotelesStore } from '@/stores/hotels'
import { useHabitacionesStore } from '@/stores/habitaciones'
import { useToast } from 'primevue/usetoast'
import api from '@/api/axios'
import { storeToRefs } from 'pinia'

import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

// Servicio de notificaciones (PrimeVue Toast)
const toast = useToast()

// Store de hoteles
const store = useHotelesStore()

// Store de las habitaciones
const storeHabitaciones = useHabitacionesStore()

const { hoteles } = storeToRefs(store)

/**
 * Tipos disponibles de habitaciones.
 * @type {import('vue').Ref<string[]>}
 */
const tipos = ref(['ESTANDAR', 'JUNIOR', 'SUITE'])

/**
 * Formulario reactivo con los datos de la habitación a registrar.
 * @type {import('vue').Ref<{ hotel_id: number|null, tipo: string, acomodacion: string, cantidad: number }>}
 */
const form = ref({
    hotel_id: null,
    tipo: '',
    acomodacion: '',
    cantidad: 1
})

/**
 * Mapeo de acomodaciones válidas por tipo de habitación.
 * @type {Record<string, string[]>}
 */
const tipoToAcomodaciones = {
    ESTANDAR: ['SENCILLA', 'DOBLE'],
    JUNIOR: ['TRIPLE', 'CUÁDRUPLE'],
    SUITE: ['SENCILLA', 'DOBLE', 'TRIPLE']
}

/**
 * Lista reactiva de acomodaciones válidas según tipo seleccionado.
 * @type {import('vue').Ref<string[]>}
 */
const acomodaciones = ref([])

// Actualiza las acomodaciones cuando se selecciona el tipo
watch(
    () => form.value.tipo,
    (nuevo) => {
        acomodaciones.value = tipoToAcomodaciones[nuevo] || []
        form.value.acomodacion = ''
    }
)


// Estado de carga para el botón
const loading = ref(false)


/**
 * Envía el formulario para crear una habitación y muestra notificaciones.
 * @async
 * @returns {Promise<void>}
 */
const crearHabitacion = async () => {
    try {
        loading.value = true
        await storeHabitaciones.crearHabitacion(form.value)
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Habitación registrada correctamente', life: 3000 })
        form.value = { hotel_id: null, tipo: '', acomodacion: '', cantidad: 1 }
        await store.fetchHoteles()
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.error || 'No se pudo registrar la habitación',
            life: 4000
        })
    } finally {
        loading.value = false
    }
}

// Carga la lista de hoteles disponibles al montar el componente
onMounted(async () => {
    await store.fetchHoteles()
})
</script>
