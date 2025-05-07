<template>
    <div class="flex mt-4">
        <div class="card flex flex-col gap-4 w-full">
            <div class="font-semibold text-xl">Agregar habitación</div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2 w-full">
                    <label for="hotel">Hotel</label>
                    <Dropdown v-model="form.hotel_id" :options="hoteles" optionLabel="nombre" optionValue="id" placeholder="Selecciona un hotel" class="w-full" />
                </div>

                <div class="flex flex-col gap-2 w-full">
                    <label for="tipo">Tipo de habitación</label>
                    <Dropdown id="tipo" v-model="form.tipo" :options="tipos" placeholder="Selecciona tipo" class="w-full" />
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex flex-col gap-2 w-full">
                    <label for="acomodacion">Acomodación</label>
                    <Dropdown id="acomodacion" v-model="form.acomodacion" :options="acomodaciones" placeholder="Selecciona acomodación" class="w-full" />
                </div>

                <div class="flex flex-col gap-2 w-full">
                    <label for="cantidad">Cantidad</label>
                    <InputNumber id="cantidad" v-model="form.cantidad" :min="1" placeholder="Ej: 10" class="w-full" />
                </div>
            </div>

            <div>
                <Button label="Guardar Habitación" icon="pi pi-plus" class="p-button-success w-full md:w-auto" @click="crearHabitacion" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useHotelesStore } from '@/stores/hotels';
import { useToast } from 'primevue/usetoast';
import api from '@/api/axios';
import { storeToRefs } from 'pinia';

import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

const toast = useToast();
const store = useHotelesStore();
const { hoteles } = storeToRefs(store);
const tipos = ref(['ESTANDAR', 'JUNIOR', 'SUITE']);

const form = ref({
    hotel_id: null,
    tipo: '',
    acomodacion: '',
    cantidad: 1
});

const tipoToAcomodaciones = {
    ESTANDAR: ['SENCILLA', 'DOBLE'],
    JUNIOR: ['TRIPLE', 'CUÁDRUPLE'],
    SUITE: ['SENCILLA', 'DOBLE', 'TRIPLE']
};

const acomodaciones = ref([]);

watch(
    () => form.value.tipo,
    (nuevo) => {
        acomodaciones.value = tipoToAcomodaciones[nuevo] || [];
        form.value.acomodacion = '';
    }
);

const crearHabitacion = async () => {
    try {
        await api.post('/habitaciones', form.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Habitación registrada correctamente', life: 3000 });
        form.value = { hotel_id: null, tipo: '', acomodacion: '', cantidad: 1 };
        await store.fetchHoteles();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.error || 'No se pudo registrar la habitación', life: 4000 });
    }
};

onMounted(async () => {
    await store.fetchHoteles();
    hoteles.value = store.hoteles;
});
</script>
