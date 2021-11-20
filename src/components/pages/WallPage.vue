
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
            <div class="col-span-4" v-if="gameNotStarted">
                <div class="m-4">
                    <button type="button" class="btn bg-blue-500 hover:bg-blue-300 w-full text-lg text-blue-50 py-2 px-4 rounded" @click="startGame">Start Game</button>
                </div>
            </div>
            <template v-else-if="gamePlaying">
                <div class="col-span-1">
                    <LivesCounter></LivesCounter>
                </div>
                <div class="col-span-3">
                    <TimeRemaining></TimeRemaining>
                </div>
            </template>
            <template v-else-if="showGameFailedMessages">
                <div class="col-span-3">
                    <p class="m-4">
                        <span v-if="outOfLives">Bad luck, you ran out of lives. But you can still get points for identifying the groups.</span>
                        <span v-else>Oooh, out of time. But you can still get points for identifying the groups.</span>
                    </p>
                </div>
                <div class="col-span-1">
                    <div class="m-4">
                        <button type="button" class="btn bg-blue-500 hover:bg-blue-300 w-full text-lg text-blue-50 py-2 px-4 rounded" @click="resolveWall">Resolve Wall</button>
                    </div>
                </div>
            </template>
            <template v-if="gameWon">
                <div class="col-span-4">
                    <p class="m-4">Congratulations! You have solved the wall. But what were the groups?</p>
                </div>
            </template>
        </div>
        <WallGroups v-if="showGroups"></WallGroups>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { GameState, useStore } from '../../store'
    import WallWord from '../WallWord.vue'
    import LivesCounter from '../LivesCounter.vue'
    import TimeRemaining from '../TimeRemaining.vue'
    import WallGroups from '../WallGroups.vue'

    export default defineComponent({
        name: 'WallPage',
        components: { WallWord, LivesCounter, TimeRemaining, WallGroups },
        props: {
            wallId: { type: String, required: true }
        },
        setup (props) {
            const store = useStore()

            const orderedGameWords = computed(() => store.getters.orderedGameWords)
            const gameNotStarted = computed(() => store.state.gameState == GameState.NotStarted)
            const livesLeft = computed(() => store.state.lives)
            const showLivesLeft = computed(() => store.getters.showLivesLeft)
            const gamePlaying = computed(() => store.state.gameState == GameState.Playing)
            const showGameFailedMessages = computed(() => store.state.gameState == GameState.Failed && !store.state.showGroups)
            const outOfLives = computed(() => store.state.lives <= 0)
            const gameWon = computed(() => store.state.gameState == GameState.Success)
            const showGroups = computed(() => store.state.showGroups)

            const toggleWord = e => store.commit('toggleWord', e)
            const startGame = () => store.commit('startGame')
            const resolveWall = () => store.commit('resolveWall')

            store.commit('loadDefinedGame', props.wallId)

            return {
                orderedGameWords,
                gameNotStarted,
                livesLeft,
                showLivesLeft,
                gamePlaying,
                showGameFailedMessages,
                outOfLives,
                gameWon,
                showGroups,
                toggleWord,
                startGame,
                resolveWall,
            }
        }
    })
</script>
