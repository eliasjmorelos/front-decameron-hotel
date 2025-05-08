<template>
    <div class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Registrar nuevo hotel</div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2 w-full">
                    <label for="nombre">Nombre</label>
                    <InputText id="nombre" v-model="hotel.nombre" placeholder="Hotel Las Palmas" />
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <label for="direccion">Dirección</label>
                    <InputText id="direccion" v-model="hotel.direccion" placeholder="Cra 45 #12-11" />
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2 w-full">
                    <label for="ciudad">Ciudad</label>
                    <InputText id="ciudad" v-model="hotel.ciudad" placeholder="Cartagena" />
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <label for="nit">NIT</label>
                    <InputText id="nit" v-model="hotel.nit" placeholder="12345678-9" />
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2">
                    <label for="habitaciones">Número de habitaciones</label>
                    <InputNumber id="habitaciones" v-model="hotel.numero_habitaciones" :min="1" placeholder="Ej: 30"
                        class="w-full" />
                </div>
            </div>

            <div>
                <Button label="Registrar Hotel" icon="pi pi-save" class="p-button-success w-full md:w-auto"
                    :loading="loading" :disabled="loading" @click="crearHotel" />
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * Componente de formulario para registrar un nuevo hotel.
 * Permite ingresar nombre, dirección, ciudad, NIT y número de habitaciones.
 * Al guardar, se actualiza el store global y muestra notificaciones con PrimeVue Toast.
 */

import { reactive, ref } from 'vue'
import { useHotelesStore } from '@/stores/hotels'
import { useToast } from 'primevue/usetoast'

import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

// Servicio de notificaciones visuales
const toast = useToast()

// Store Pinia para gestión de hoteles
const store = useHotelesStore()

/**
 * Objeto reactivo que contiene los datos del nuevo hotel.
 * @type {import('vue').UnwrapNestedRefs<{
 *   nombre: string,
 *   direccion: string,
 *   ciudad: string,
 *   nit: string,
 *   numero_habitaciones: number
 * }>}
 */
const hotel = reactive({
    nombre: '',
    direccion: '',
    ciudad: '',
    nit: '',
    numero_habitaciones: 1
})

// Estado de carga para el botón
const loading = ref(false)

/**
 * Envía el formulario para registrar un nuevo hotel.
 * Muestra un Toast según el resultado.
 * @async
 * @returns {Promise<void>}
 */
const crearHotel = async () => {
    try {
        loading.value = true
        await store.crearHotel(hotel)
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Hotel registrado correctamente',
            life: 3000
        })
        // Reiniciar formulario
        Object.assign(hotel, {
            nombre: '',
            direccion: '',
            ciudad: '',
            nit: '',
            numero_habitaciones: 1
        })
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'No se pudo registrar el hotel',
            life: 4000
        })
    }finally {
        loading.value = false
    }
}
</script>
