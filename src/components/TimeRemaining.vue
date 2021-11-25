<template>
    <div class="m-4">
        <div class="py-2 bg-blue-500 rounded timebar" :style="compiledStyle"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { GameState, useStore, timeLimit } from '../store'

    export default defineComponent({
        name: 'TimeRemaining',
        setup () {
            const store = useStore()

            const timeLeft = computed(() => store.state.timeLeft)
            const compiledStyle = computed(() => {
                return {
                    width: (timeLeft.value / timeLimit * 100) + '%'
                }
            })

            return {
                timeLeft,
                compiledStyle
            }
        }
    })
</script>

<style scoped>
    .timebar {
        transition: width 1s linear;
    }
</style>
