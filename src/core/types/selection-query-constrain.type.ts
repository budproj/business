import { SelectQueryBuilder } from 'typeorm'

export type SelectionQueryConstrain<E> = (query?: SelectQueryBuilder<E>) => SelectQueryBuilder<E>
