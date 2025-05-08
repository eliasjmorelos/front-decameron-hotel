import { defineStore } from 'pinia'
import api from '../api/axios'

/**
 * Pinia store para gestionar las habitaciones.
 * Permite crear nuevas habitaciones y maneja estado de carga y errores.
 */
export const useHabitacionesStore = defineStore('habitaciones', {
    /**
     * Estado reactivo del store.
     * @returns {{
     *   loading: boolean,
     *   error: string | null
     * }}
     */
    state: () => ({
        loading: false,
        error: null
    }),

    actions: {
        /**
         * Envía una solicitud al backend para registrar una nueva habitación.
         * No actualiza el estado local porque se asume que se gestionará desde el store de hoteles.
         *
         * @async
         * @param {{
         *   hotel_id: number,
         *   tipo: 'ESTANDAR' | 'JUNIOR' | 'SUITE',
         *   acomodacion: 'SENCILLA' | 'DOBLE' | 'TRIPLE' | 'CUÁDRUPLE',
         *   cantidad: number
         * }} data - Datos de la habitación a registrar
         * @returns {Promise<void>}
         */
        async crearHabitacion(data) {
            try {
                this.loading = true
                await api.post('/habitaciones', data)
                this.error = null
            } catch (err) {
                this.error = err.response?.data?.error || 'Error al crear habitación'
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})
