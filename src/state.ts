import FiniteStateMechine from "."
import FSEvent from "./event"
import { EnterState, PushState, PopState, IState } from './types'

export default class FSState {
  protected _onEnterState: EnterState
  protected _onPushState: PushState
  protected _onPopState: PopState

  protected _stateObject: IState
  protected _stateName: string
  protected _owner: FiniteStateMechine
  protected _translationEvents: Map<string, FSEvent>

  constructor(obj: IState, owner: FiniteStateMechine, name: string, e: EnterState, pu: PushState, po: PopState) {
    this._stateObject = obj
    this._stateName = name
    this._owner = owner
    this._onEnterState = e
    this._onPushState = pu
    this._onPopState = po
    this._translationEvents = new Map()
  }

  get stateObject() { return this._stateObject }
  get stateName() { return this._stateName }

  on(eventName: string, action?: (params: any) => void): FSEvent {
    let newEvent = new FSEvent(eventName, "", this, this._owner, this._onEnterState, this._onPushState, this._onPopState)
    newEvent.action = action
    this._translationEvents.set(eventName, newEvent)
    return newEvent
  }

  trigger(name: string, params?: any) {
    this._translationEvents.get(name)?.execute(params)
    return this._translationEvents.has(name)
  }
}
