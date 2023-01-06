import create from 'zustand';

interface GameInitStore {
    players: string[];
    addPlayer: (player: string) => void;
    removePlayer: (index: number) => void;
}

export const useGameInitStore = create<GameInitStore>((set) => ({
    players: [],
    addPlayer: (player) => set((store) => ({
        players: [...store.players, player]
    })),
    removePlayer: (index) => set((store) => ({
        players: [...store.players.slice(0, index), ...store.players.slice(index + 1)],
    }))
}))
