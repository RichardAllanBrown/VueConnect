<template>
    <div class="m-4">
        <span class="pull-right">Time Left: {{ timeLeft }}</span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { GameState, useStore } from '../store'

    export default defineComponent({
        name: 'TimeRemaining',
        setup () {
            const store = useStore()

            const timeLeft = computed(() => store.state.timeLeft)

            return {
                timeLeft,
            }
        }
    })
</script>