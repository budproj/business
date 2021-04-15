import { Injectable } from '@nestjs/common'

import { RepositoryStorageInterface } from '@adapters/storage/interfaces/repository.interface'

@Injectable()
export class AWSS3Provider implements RepositoryStorageInterface {}
