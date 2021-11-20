<template>
    <div class="text-xl h-16 m-4 flex items-center justify-center rounded" 
        :class="backgroundColorClass"
        @click="showGroup = true">
            <span v-if="showGroup">{{ name }}</span>
            <span v-else>Click to reveal</span>
    </div>    
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    const visibleColourClass = ["bg-blue-300", "bg-violet-300", "bg-pink-300", "bg-amber-300"];
    const lockedColourClasses = ["bg-blue-400", "bg-violet-400", "bg-pink-400", "bg-amber-400"];

    export default defineComponent({
        name: 'WallGroups',
        props: {
            name: { type: String, required: true },
            groupId: {type: Number, required: true },
        },
        data () {
            return {
                showGroup: false
            }
        },
        computed: {
            backgroundColorClass () {
                if (this.showGroup) {
                    return visibleColourClass[this.groupId];
                }
                return lockedColourClasses[this.groupId];
            }
        }
    });
</script>
