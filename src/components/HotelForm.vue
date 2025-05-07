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
                    <InputNumber id="habitaciones" v-model="hotel.numero_habitaciones" :min="1" placeholder="Ej: 30" class="w-full" />
                </div>
            </div>

            <div>
                <Button label="Registrar Hotel" icon="pi pi-save" class="p-button-success w-full md:w-auto" @click="crearHotel" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useHotelesStore } from '@/stores/hotels';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

const toast = useToast();
const store = useHotelesStore();

const hotel = reactive({
    nombre: '',
    direccion: '',
    ciudad: '',
    nit: '',
    numero_habitaciones: 1
});

const crearHotel = async () => {
    try {
        await store.crearHotel(hotel);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Hotel registrado correctamente', life: 3000 });
        Object.assign(hotel, { nombre: '', direccion: '', ciudad: '', nit: '', numero_habitaciones: 1 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'No se pudo registrar el hotel', life: 4000 });
    }
};
</script>
