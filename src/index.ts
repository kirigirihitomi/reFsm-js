import { IState, } from './types'
import FSState from './state'

class EmptyState implements IState {
  onEnter(prevState: string): void { }
  onExit(nextState: string): void { }
}

class AnyState implements IState {
  onEnter(prevState: string): void { }
  onExit(nextState: string): void { }
}

export default class FiniteStateMechine extends EventTarget {
  protected _stateStack: FSState[] = []
  protected _states: Map<string, FSState> = new Map()

  protected _emptyIState: EmptyState = new EmptyState()
  protected _emptyState: FSState = this.register(null!, this._emptyIState)

  protected _anyIState: AnyState = new AnyState()
  protected _anyState: FSState = new FSState(this._anyIState, this, null!, this.enter.bind(this), this.push.bind(this), this.pop.bind(this))

  get currentState(): FSState {
    let length = this._stateStack.length
    return length > 0 ? this._stateStack[length - 1] : this._emptyState!
  }

  get anyState(): FSState { return this._anyState }

  register(stateName: string, stateObject: IState) {
    let state = new FSState(stateObject, this, stateName, this.enter.bind(this), this.push.bind(this), this.pop.bind(this))
    this._states.set(stateName, state)
    return state
  }

  getState(stateName: string): Nullable<FSState> {
    return this._states.get(stateName) || null
  }

  enter(stateName: string) {
    this.push(stateName, this._pop(stateName))
  }

  push(newState: string, lastState?: Nullable<string>): void {
    if (!this._states.has(newState)) { throw 'no specific state' }
    let lastName: Nullable<string> = lastState || this.currentState.stateName
    this._stateStack.push(this._states.get(newState)!)
    this.currentState.stateObject.onEnter(lastName)
  }

  private _pop(newName?: string): Nullable {
    let lastState = this.currentState
    this._stateStack.pop()
    let newStateName: string = newName || this.currentState.stateName
    lastState.stateObject.onExit(newStateName)
    return lastState.stateName
  }

  pop() {
    this._pop()
  }

  trigger(eventName: string, params?: any) {
    if (!this.anyState.trigger(eventName, params))
      this.currentState.trigger(eventName, params)
  }
}
