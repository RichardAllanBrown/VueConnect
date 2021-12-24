
<template>
    <div class="md:container md:mx-auto px-4">
        <h1 class="text-2xl m-2">Vue Connect</h1>
        <p class="m-2">A simple replica of the wall from only connect. Select a wall and try to solve it before the time runs out.</p>
        <ul class="mx-8 list-disc">
            <li v-for="w in walls">
                <router-link class="no-underline hover:underline text-purple-600" 
                            :to="{ name: 'wall', params: { wallId: w.id } }">{{ w.name }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { useStore } from '../store'

    export default defineComponent({
        name: 'HomePage',
        setup () {
            const store = useStore()

            const walls = computed(() => store.state.gameDefinitions)

            return {
                walls
            }
        }
    })
</script>
