<template>
    <span v-if="showLivesLeft">Lives: {{ livesLeft }}</span>    
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { GameState, useStore } from '../store'

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