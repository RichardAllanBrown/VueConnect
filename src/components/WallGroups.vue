<template>
    <div class="grid grid-cols-4">
        <div class="col-span-4">
            <h2 class="text-xl m-4">Groups</h2>
            <router-link class="no-underline hover:underline text-purple-600 m-4" :to="{ name: 'home' }">Select another wall</router-link>
        </div>
        <WallGroup v-for="g in wallGroups"
                    :key="g.groupId"
                    :groupId="g.groupId"
                    :name="g.name">
        </WallGroup>
    </div>
</template>

<script lang="ts">
    import WallGroup from './WallGroup.vue'
    import { defineComponent, computed } from 'vue'
    import { useStore } from '../store'

    export default defineComponent({
        name: 'WallGroups',
        components: { WallGroup },
        setup() {
            const store = useStore()

            const wallGroups = computed(() => store.getters.groups)

            return {
                wallGroups
            }
        },
    });
</script>
