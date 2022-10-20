export interface IState {
  onEnter(prevState: string): void;
  onExit(nextState: string): void;
}

export type EnterState = (stateName: string) => void
export type PushState = (stateName: string, lastStateName: string) => void
export type PopState = () => void

export enum EventType {
  NONE, ENTER, PUSH, POP
}
