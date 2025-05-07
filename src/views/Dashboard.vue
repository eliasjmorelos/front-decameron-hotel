<template>
    <div class="p-fluid p-grid p-dir-col p-3">
        <div class="p-grid p-nogutter p-justify-between p-mb-3">
            <!-- Formulario Hotel -->
            <div class="p-col-12 p-md-6 p-pr-md-2">
                <div class="card">
                    <HotelForm />
                </div>
            </div>

            <!-- Formulario Habitación -->
            <div class="p-col-12 p-md-6 p-pl-md-2">
                <div class="card">
                    <HabitacionForm />
                </div>
            </div>
        </div>

        <!-- Lista de hoteles -->
        <div class="card">
            <h2 class="p-mb-3">Hoteles registrados</h2>
            <div v-if="store.loading" class="p-text-secondary">Cargando hoteles...</div>
            <div v-else-if="store.hoteles.length === 0">No hay hoteles registrados.</div>
            <Accordion :multiple="true" v-else>
                <AccordionTab v-for="hotel in store.hoteles" :key="hotel.id" :header="`${hotel.nombre} (${hotel.ciudad}) - ${hotel.numero_habitaciones} habs`">
                    <ul class="p-pl-3">
                        <li v-for="h in hotel.habitaciones" :key="h.id" class="flex items-center justify-between p-2 border-b">
                            <span>{{ h.tipo }} – {{ h.acomodacion }}: {{ h.cantidad }} habs</span>
                            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="confirmarEliminar(h.id)" />
                            <Button icon="pi pi-pencil" class="p-button-warning p-button-sm p-mr-2" @click="abrirDialogoEdicion(h)" />
                        </li>
                    </ul>
                </AccordionTab>
            </Accordion>
        </div>
        <Dialog v-model:visible="dialogVisible" header="Editar habitación" modal :style="{ width: '50%', maxWidth: '600px' }" closable:true>
            <div class="p-fluid">
                <div class="p-field">
                    <label for="cantidad">Cantidad de habitaciones</label>
                    <InputNumber id="cantidad" v-model="formEdicion.cantidad" :min="1" class="w-full" />
                </div>

                <div class="p-mt-3 flex justify-end gap-2">
                    <Button label="Cancelar" icon="pi pi-times" class="p-button-secondary" @click="dialogVisible = false" />
                    <Button label="Guardar" icon="pi pi-check" class="p-button-success" @click="guardarEdicion" />
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useHotelesStore } from '@/stores/hotels';
import HotelForm from '@/components/HotelForm.vue';
import HabitacionForm from '@/components/HabitacionForm.vue';
import { useToast } from 'primevue/usetoast';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { useConfirm } from 'primevue/useconfirm';
import api from '@/api/axios';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';

const toast = useToast();
const store = useHotelesStore();
const confirm = useConfirm();
onMounted(() => store.fetchHoteles());

const confirmarEliminar = (habitacionId) => {
    confirm.require({
        message: '¿Deseas eliminar esta habitación?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        accept: async () => {
            console.log('Eliminando habitación con ID:', habitacionId);
            try {
                const response = await api.delete(`/habitaciones/${habitacionId}`);
                console.log('Respuesta de eliminación:', response);
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Habitación eliminada', life: 3000 });
                await store.fetchHoteles();
            } catch (error) {
                console.error('Error al eliminar habitación:', error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 });
            }
        }
    });
};

const dialogVisible = ref(false);
const formEdicion = ref({ id: null, cantidad: 1 });

const abrirDialogoEdicion = (habitacion) => {
    formEdicion.value = { id: habitacion.id, cantidad: habitacion.cantidad };
    dialogVisible.value = true;
};

const guardarEdicion = async () => {
    try {
        const response = await api.put(`/habitaciones/${formEdicion.value.id}`, {
            cantidad: formEdicion.value.cantidad
        });

        console.log('Respuesta de edición:', response);
        toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Cantidad modificada correctamente', life: 3000 });
        dialogVisible.value = false;
        await store.fetchHoteles();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.error || 'No se pudo editar la habitación', life: 6000 });
    }
};
</script>
