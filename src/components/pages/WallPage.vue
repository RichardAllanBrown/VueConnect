
<template>
    <div class="md:container md:mx-auto px-4">
        <h1 class="text-3xl m-4">Time to solve the wall</h1>
        <p class="m-4">Find the related groups of 4 items before the time runs out</p>

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
            <div class="col-span-4 content-center" v-if="gameNotStarted">
                <div class="m-4">
                    <button type="button" class="btn bg-blue-500 hover:bg-blue-300 w-full text-lg text-blue-50 py-2 px-4 rounded" @click="startGame">Start Game</button>
                </div>
            </div>
            <template v-else>
                <div class="col-span-1">
                    <LivesCounter></LivesCounter>
                </div>
                <div class="col-span-3">
                    <TimeRemaining></TimeRemaining>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { GameState, useStore } from '../../store'
    import WallWord from '../WallWord.vue'
    import LivesCounter from '../LivesCounter.vue'
    import TimeRemaining from '../TimeRemaining.vue'

    export default defineComponent({
        name: 'WallPage',
        components: { WallWord, LivesCounter, TimeRemaining },
        props: {
            wallId: { type: String, required: true }
        },
        setup (props) {
            const store = useStore()

            const orderedGameWords = computed(() => store.getters.orderedGameWords)
            const gameNotStarted = computed(() => store.state.gameState == GameState.NotStarted)
            const livesLeft = computed(() => store.state.lives)
            const showLivesLeft = computed(() => store.getters.showLivesLeft)

            const toggleWord = e => store.commit('toggleWord', e)
            const startGame = () => store.commit('startGame')

            store.commit('loadDefinedGame', props.wallId)

            return {
                orderedGameWords,
                gameNotStarted,
                livesLeft,
                showLivesLeft,
                toggleWord,
                startGame
            }
        }
    })
</script>
