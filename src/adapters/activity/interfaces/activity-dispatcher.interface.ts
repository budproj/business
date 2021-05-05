import { Activity } from './activity.interface'

export interface ActivityDispatcher {
  dispatch(activity: Activity): void | Promise<void>
}
