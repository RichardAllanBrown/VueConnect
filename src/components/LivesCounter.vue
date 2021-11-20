<template>
    <div v-if="showLivesLeft">
        <transition-group name="fade" tag="div" class="mx-4 inline-flex flex-row">
            <div  v-for="i in livesLeft" :key="i" class="h-12 w-12 bg-red-500 rounded-full m-2"></div>
        </transition-group>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { useStore } from '../store'

    export default defineComponent({
        name: 'LivesCounter',
        setup () {
            const store = useStore()

            const livesLeft = computed(() => store.state.lives)
            const showLivesLeft = computed(() => store.getters.showLivesLeft)

            return {
                livesLeft,
                showLivesLeft,
            }
        }
    })
</script>

<style>
    .fade-leave-active,
    .fade-enter-active {
        transition: opacity 0.4s ease;
    }

    .fade-leave-to,
    .fade-enter-to {
        opacity: 0;
    }
</style>
