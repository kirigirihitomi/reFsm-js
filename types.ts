export interface IState {
    onEnter(prevState: string): void;
    onExit(nextState: string): void;
}