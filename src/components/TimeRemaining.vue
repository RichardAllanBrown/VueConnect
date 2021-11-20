<template>
    <div class="m-4">
        <span>Time Left</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { GameState, useStore } from '../store'

    export default defineComponent({
        name: 'TimeRemaining',
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