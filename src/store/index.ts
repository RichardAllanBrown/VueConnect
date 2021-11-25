import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store, createLogger } from "vuex";
import { flatMap, map, find, filter, shuffle, every, sortBy, partition, concat } from "lodash-es";
import gameDefinitions from './games.json';

const debug = process.env.NODE_ENV !== 'production'

export interface GameDefinition {
    id: string,
    name: string,
    groups: Array<{ connection: string, words: Array<string> }>,
}

export enum WordInGameState {
    Open,
    Selected,
    Locked,
}

export interface WordInGame {
    groupId: number,
    word: string,
    wordState: WordInGameState,
}

export enum GameState {
    NotStarted,
    Playing,
    Failed,
    Success
}

export interface State {
    gameDefinitions: Array<GameDefinition>,
    activeGameId: string|null,
    activeGame: Array<WordInGame>,
    lives: number,
    foundGroups: number,
    gameState: GameState,
    timeLeft: number,
    showGroups: boolean,
}

export const key: InjectionKey<Store<State>> = Symbol()

var timerInterval = null;

const startTimer = () => {
    timerInterval = setInterval(() => {
        store.commit('decrementTimer')
    }, 1000)
}

const clearTimer = () => {
    if (timerInterval != null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

const state = () => ({
    gameDefinitions,
    activeGameId: null,
    activeGame: [],
    lives: 3,
    foundGroups: 0,
    gameState: GameState.NotStarted,
    timeLeft: 0,
    showGroups: false,
})

const getters = {
    orderedGameWords (state: State) {
        const [ foundGroups, unfoundGroups ] = partition(state.activeGame, { wordState: WordInGameState.Locked });
        return concat(sortBy(foundGroups, 'groupId'), unfoundGroups)
    },
    showLivesLeft (state: State) : boolean {
        return 2 <= state.foundGroups
    },
    groups (state: State) {
        if (state.activeGameId == null) {
            return [];
        }
        const gameDefinition = find(state.gameDefinitions, { id: state.activeGameId }) as GameDefinition
        return map([0, 1, 2, 3], (groupId) => { 
            return { groupId, name: gameDefinition.groups[groupId].connection }
        })
    }
}

const actions = {

}

const mutations = {
    loadDefinedGame (state: State, id: string) {
        const game = find(state.gameDefinitions, { id }) as GameDefinition
        if (game == null) {
            throw Error(`Cannot load game with id {id}`)
        }

        const wordsInGame = flatMap(game.groups, (g, groupId) => {
            return map(g.words, (word) => {
                return { groupId, word, wordState: WordInGameState.Open } as WordInGame
            })
        })

        clearTimer()
        state.activeGame = shuffle(wordsInGame)
        state.activeGameId = id
        state.lives = 3
        state.foundGroups = 0
        state.gameState = GameState.NotStarted
        state.timeLeft = timeLimit
        state.showGroups = false
    },
    startGame (state: State) {
        state.gameState = GameState.Playing
        startTimer()
    },
    decrementTimer (state: State) {
        if (0 < state.timeLeft) {
            state.timeLeft--;
        }
        if (state.timeLeft <= 0) {
            state.gameState = GameState.Failed
            clearTimer()
        }
    },
    toggleWord (state: State, word: string) {
        const entry = find(state.activeGame, { word })
        if (!entry || state.gameState != GameState.Playing) return;
        switch (entry.wordState) {
            case WordInGameState.Open:
                entry.wordState = WordInGameState.Selected

                // Check if a group of 4 has been selected
                const currentGroup = filter(state.activeGame, { wordState: WordInGameState.Selected })
                if (currentGroup.length != 4) {
                    break;
                }
                
                // Check if the group is valid, if so we mark that groups as found
                if (every(currentGroup, { groupId: entry.groupId })) {
                    currentGroup.forEach((word) => word.wordState = WordInGameState.Locked)
                    state.foundGroups += 1

                    // Automatically solve the last group once 3 have been identified
                    if (3 <= state.foundGroups) {
                        state.foundGroups = 4
                        state.activeGame.forEach((word) => word.wordState = WordInGameState.Locked)
                        state.gameState = GameState.Success
                        state.showGroups = true
                        clearTimer()
                    }
                } else {
                    currentGroup.forEach((word) => word.wordState = WordInGameState.Open)
                    
                    // Start losing lives if incorrectly guessed when 2 groups have already been found
                    if (2 <= state.foundGroups) {
                        state.lives -= 1

                        if (state.lives <= 0) {
                            state.gameState = GameState.Failed
                            clearTimer()
                        }
                    }
                }
                break;

            case WordInGameState.Selected:
                entry.wordState = WordInGameState.Open;
                break;
        }
    },
    resolveWall (state: State) {
        state.activeGame.forEach((word) => word.wordState = WordInGameState.Locked)
        state.showGroups = true
    }
}

export const timeLimit = 150

export const store = createStore<State>({
    state,
    getters,
    actions,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})

export function useStore () {
    return baseUseStore(key)
}
