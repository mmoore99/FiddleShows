<script setup>
    import { ref, reactive, computed, onMounted } from "vue";

    const props = defineProps({
        modelValue: {
            type: String,
            default: ""
        }
    });
    const emit = defineEmits(["update:modelValue", "submit"]);

    const state = reactive({});

    onMounted(async () => {

    });

    function myFunction() {

    }

    const computedFunction = computed(() => {
        return true;
    });

    defineExpose({});

</script>

<template>
    <div id="" style="width: 100%; height: 100%; background-color: mediumpurple">
        <span style="display: block;">News Slide</span>
        <span style="display: block;">News Slide</span>
        <span style="display: block;">News Slide</span>
    </div>

</template>

<style scoped>
    #container {
        text-align: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }
</style>

<style>

</style>
