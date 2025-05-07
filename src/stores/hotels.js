import { defineStore } from 'pinia';
import api from '../api/axios';

export const useHotelesStore = defineStore('hoteles', {
    state: () => ({
        hoteles: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchHoteles() {
            this.loading = true;
            try {
                const res = await api.get('/hoteles');
                this.hoteles = res.data;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al cargar hoteles';
            } finally {
                this.loading = false;
            }
        },
        async crearHotel(data) {
            await api.post('/hoteles', data);
            await this.fetchHoteles();
        }
    }
});
