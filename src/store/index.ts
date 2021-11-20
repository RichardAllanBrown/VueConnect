import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store, createLogger } from "vuex";
import { flatMap, map, find, filter, shuffle, every, sortBy, partition, concat } from "lodash-es";

const debug = process.env.NODE_ENV !== 'production'

export interface GameDefinition {
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
    Locked,
    Success,
}

export interface State {
    gameDefinitions: Array<GameDefinition>,
    activeGameId: number|null,
    activeGame: Array<WordInGame>,
    lives: number,
    foundGroups: number,
    gameState: GameState,
}

export const key: InjectionKey<Store<State>> = Symbol()

const state = () => ({
    gameDefinitions: [{
        name: 'Game 1',
        groups: [
            { connection: 'Pork products', words: [ 'Lechon', 'Bacon', 'Speck', 'Prosciutto' ] },
            { connection: 'Terms in backgammon', words: [ 'Bear off', 'Gammon', 'Pip', 'Anchor' ] },
            { connection: 'Small amount', words: [ 'Trace', 'Morsel', 'Smidgen', 'Iota' ] },
            { connection: 'End with a silent letter', words: [ 'Coup', 'Debris', 'Autumn', 'Crumb' ] }
        ]
    }],
    activeGameId: null,
    activeGame: [],
    lives: 3,
    foundGroups: 0,
    gameState: GameState.NotStarted,
})

const getters = {
    orderedGameWords (state: State) {
        const [ foundGroups, unfoundGroups ] = partition(state.activeGame, { wordState: WordInGameState.Locked });
        return concat(sortBy(foundGroups, 'groupId'), unfoundGroups)
    },
    showLivesLeft (state: State) : boolean {
        return 2 <= state.foundGroups
    },
}

const actions = {

}

const mutations = {
    loadDefinedGame (state: State, id: number) {
        const game = state.gameDefinitions[id]

        const wordsInGame = flatMap(game.groups, (g, groupId) => {
            return map(g.words, (word) => {
                return { groupId, word, wordState: WordInGameState.Open } as WordInGame
            })
        })

        state.activeGame = shuffle(wordsInGame)
        state.activeGameId = id
        state.lives = 3
        state.foundGroups = 0
        state.gameState = GameState.Playing
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
                    }
                } else {
                    currentGroup.forEach((word) => word.wordState = WordInGameState.Open)
                    
                    // Start losing lives if incorrectly guessed when 2 groups have already been found
                    if (2 <= state.foundGroups) {
                        state.lives -= 1

                        if (state.lives <= 0) {
                            state.gameState = GameState.Locked
                        }
                    }
                }
                break;

            case WordInGameState.Selected:
                entry.wordState = WordInGameState.Open;
                break;
        }
    }
}

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
