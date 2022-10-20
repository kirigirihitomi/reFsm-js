import FiniteStateMechine from "."
import FSState from "./state"
import { EnterState, PushState, PopState, EventType } from './types'

export default class FSEvent {
  protected _onEnterState: EnterState
  protected _onPushState: PushState
  protected _onPopState: PopState

  protected _eventName: string
  protected _stateOwner: FSState
  protected _targetState: string
  protected _owner: FiniteStateMechine
  protected _type: EventType = null!

  action?: (params: any) => void = null!

  constructor(name: string, target: string, state: FSState, owner: FiniteStateMechine, e: EnterState, pu: PushState, po: PopState) {
    this._eventName = name
    this._targetState = target
    this._stateOwner = state
    this._owner = owner
    this._onEnterState = e
    this._onPushState = pu
    this._onPopState = po
  }

  enter(stateName: string): FSState {
    this._targetState = stateName
    this._type = EventType.ENTER
    return this._stateOwner
  }

  push(stateName: string): FSState {
    this._targetState = stateName
    this._type = EventType.PUSH
    return this._stateOwner
  }

  pop() {
    this._type = EventType.POP
  }

  execute(params: any) {
    this.action?.call(this, params)
    switch (this._type) {
      case EventType.ENTER:
        this._onEnterState(this._targetState); break;
      case EventType.PUSH:
        this._onPushState(this._targetState, this._owner.currentState.stateName); break;
      case EventType.POP:
        this._onPopState(); break
      default: break;
    }
  }
}
