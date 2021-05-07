import { Activity } from '../activities/base.activity'

export interface ActivityDispatcher {
  dispatch<D = any>(activity: Activity<D>): void | Promise<void>
}
