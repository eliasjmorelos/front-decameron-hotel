import { defineStore } from 'pinia'
import api from '../api/axios'

/**
 * Pinia store para gestionar los hoteles.
 * Incluye estado, carga de datos desde el backend y registro de nuevos hoteles.
 */
export const useHotelesStore = defineStore('hoteles', {
    /**
     * Estado reactivo del store.
     * @returns {{
     *   hoteles: Array<Object>,
     *   loading: boolean,
     *   error: string | null
     * }}
     */
    state: () => ({
        hoteles: [],
        loading: false,
        error: null
    }),

    actions: {
        /**
         * Obtiene la lista de hoteles desde el backend y actualiza el estado.
         * Maneja errores y estado de carga.
         * @async
         * @returns {Promise<void>}
         */
        async fetchHoteles() {
            this.loading = true
            try {
                const res = await api.get('/hoteles')
                this.hoteles = res.data
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al cargar hoteles'
            } finally {
                this.loading = false
            }
        },

        /**
         * Crea un nuevo hotel enviando los datos al backend y recarga la lista.
         * @async
         * @param {Object} data - Datos del hotel (nombre, ciudad, dirección, NIT, número de habitaciones).
         * @returns {Promise<void>}
         */
        async crearHotel(data) {
            await api.post('/hoteles', data)
            await this.fetchHoteles()
        }
    }
})
