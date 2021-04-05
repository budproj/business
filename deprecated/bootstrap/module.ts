import { Module } from '@nestjs/common'

import { AppModule } from 'src/app'

@Module({
  imports: [AppModule],
})
class BootstrapModule {}

export default BootstrapModule
