<template>
    <div class="text-xl h-32 m-4 flex items-center justify-center" 
        :class="backgroundColorClass">            
            <span>{{ word }}</span>
    </div>
    
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { WordInGameState } from '../store';

    const selectedColourClass = "bg-red-200";
    const lockedColourClasses = ["bg-blue-300", "bg-violet-300", "bg-pink-300", "bg-amber-300"];
    const defaultColourClass = "bg-gray-200"

    export default defineComponent({
        name: 'WallWord',
        props: {
            word: String,
            state: Number,
            groupId: Number,
        },
        computed: {
            backgroundColorClass () {
                switch (this.state) {
                    case WordInGameState.Selected: return selectedColourClass;
                    case WordInGameState.Locked: return lockedColourClasses[this.groupId];
                    default: return defaultColourClass;
                }
            }
        }
    });
</script>
