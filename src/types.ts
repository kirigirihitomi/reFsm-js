export interface IState {
  onEnter(prevState: string): void;
  onExit(nextState: string): void;
}

export type EnterState = (stateName: Nullable<string>) => void
export type PushState = (stateName: Nullable<string>, lastStateName: Nullable<string>) => void
export type PopState = () => void

export enum EventType {
  NONE, ENTER, PUSH, POP
}
