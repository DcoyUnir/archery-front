<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <span class="font-medium ml-2">Made by <a href="https://danielcoy.com" target="_blank" rel="noopener">Daniel
                Coy</a></span>
    </div>
</template>
<style lang="scss" scoped></style>
