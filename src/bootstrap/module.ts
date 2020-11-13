import { Module } from '@nestjs/common'

import { AppModule } from 'app'

@Module({
  imports: [AppModule],
})
class BootstrapModule {}

export default BootstrapModule
