
<template>
    <div class="md:container md:mx-auto px-4">
        <h1>Time to solve the wall</h1>
        <p>Find the related groups of 4 items before the time runs out</p>

        <div class="grid grid-cols-4">
            <WallWord v-for="w in orderedGameWords" 
                 :key="w.word" 
                 :word="w.word" 
                 :state="w.wordState"
                 :groupId="w.groupId"
                 @click="toggleWord(w.word)">
            </WallWord>
        </div>
        <div class="grid grid-cols-4">
            <div class="col-span-1"><span v-if="showLivesLeft">Lives: {{ livesLeft }}</span></div>
            <div class="col-span-3">Time Left</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { useStore } from '../../store'
    import WallWord from '../WallWord.vue'

    export default defineComponent({
        name: 'WallPage',
        components: { WallWord },
        setup () {
            const store = useStore()

            const orderedGameWords = computed(() => store.getters.orderedGameWords)
            const livesLeft = computed(() => store.state.lives)
            const showLivesLeft = computed(() => store.getters.showLivesLeft)

            const toggleWord = e => store.commit('toggleWord', e)

            store.commit('loadDefinedGame', 0)

            return {
                orderedGameWords,
                toggleWord,
                livesLeft,
                showLivesLeft
            }
        }
    })
</script>
