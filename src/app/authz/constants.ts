export enum POLICY {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export enum RESOURCE {
  USER = 'user',
  TEAM = 'team',
  CYCLE = 'cycle',
  OBJECTIVE = 'objective',
  KEY_RESULT = 'key-result',
}

export enum ACTION {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum PERMISSION {
  'USER:CREATE' = 'user:create',
  'USER:UPDATE' = 'user:update',
  'USER:READ' = 'user:read',
  'USER:DELETE' = 'user:delete',

  'TEAM:CREATE' = 'team:create',
  'TEAM:UPDATE' = 'team:update',
  'TEAM:READ' = 'team:read',
  'TEAM:DELETE' = 'team:delete',

  'CYCLE:CREATE' = 'cycle:create',
  'CYCLE:UPDATE' = 'cycle:update',
  'CYCLE:READ' = 'cycle:read',
  'CYCLE:DELETE' = 'cycle:delete',

  'OBJECTIVE:CREATE' = 'objective:create',
  'OBJECTIVE:UPDATE' = 'objective:update',
  'OBJECTIVE:READ' = 'objective:read',
  'OBJECTIVE:DELETE' = 'objective:delete',

  'KEY_RESULT:CREATE' = 'key-result:create',
  'KEY_RESULT:UPDATE' = 'key-result:update',
  'KEY_RESULT:READ' = 'key-result:read',
  'KEY_RESULT:DELETE' = 'key-result:delete',
}

export enum SCOPED_PERMISSION {
  'USER:CREATE:ANY' = 'user:create:any',
  'USER:CREATE:COMPANY' = 'user:create:company',
  'USER:CREATE:TEAM' = 'user:create:team',
  'USER:UPDATE:ANY' = 'user:update:any',
  'USER:UPDATE:COMPANY' = 'user:update:company',
  'USER:UPDATE:TEAM' = 'user:update:team',
  'USER:UPDATE:OWNS' = 'user:update:owns',
  'USER:READ:ANY' = 'user:read:any',
  'USER:READ:COMPANY' = 'user:read:company',
  'USER:READ:TEAM' = 'user:read:team',
  'USER:READ:OWNS' = 'user:read:owns',
  'USER:DELETE:ANY' = 'user:delete:any',
  'USER:DELETE:COMPANY' = 'user:delete:company',
  'USER:DELETE:TEAM' = 'user:delete:team',
  'USER:DELETE:OWNS' = 'user:delete:owns',

  'TEAM:CREATE:ANY' = 'team:create:any',
  'TEAM:CREATE:COMPANY' = 'team:create:company',
  'TEAM:CREATE:OWNS' = 'team:create:owns',
  'TEAM:UPDATE:ANY' = 'team:update:any',
  'TEAM:UPDATE:COMPANY' = 'team:update:company',
  'TEAM:UPDATE:OWNS' = 'team:update:owns',
  'TEAM:READ:ANY' = 'team:read:any',
  'TEAM:READ:COMPANY' = 'team:read:company',
  'TEAM:READ:OWNS' = 'team:read:owns',
  'TEAM:DELETE:ANY' = 'team:delete:any',
  'TEAM:DELETE:COMPANY' = 'team:delete:company',
  'TEAM:DELETE:OWNS' = 'team:delete:owns',

  'CYCLE:CREATE:ANY' = 'cycle:create:any',
  'CYCLE:CREATE:COMPANY' = 'cycle:create:company',
  'CYCLE:CREATE:TEAM' = 'cycle:create:team',
  'CYCLE:UPDATE:ANY' = 'cycle:update:any',
  'CYCLE:UPDATE:COMPANY' = 'cycle:update:company',
  'CYCLE:UPDATE:TEAM' = 'cycle:update:team',
  'CYCLE:READ:ANY' = 'cycle:read:any',
  'CYCLE:READ:COMPANY' = 'cycle:read:company',
  'CYCLE:READ:TEAM' = 'cycle:read:team',
  'CYCLE:DELETE:ANY' = 'cycle:delete:any',
  'CYCLE:DELETE:COMPANY' = 'cycle:delete:company',
  'CYCLE:DELETE:TEAM' = 'cycle:delete:team',

  'OBJECTIVE:CREATE:ANY' = 'objective:create:any',
  'OBJECTIVE:CREATE:COMPANY' = 'objective:create:company',
  'OBJECTIVE:CREATE:TEAM' = 'objective:create:team',
  'OBJECTIVE:CREATE:OWNS' = 'objective:create:owns',
  'OBJECTIVE:UPDATE:ANY' = 'objective:update:any',
  'OBJECTIVE:UPDATE:COMPANY' = 'objective:update:company',
  'OBJECTIVE:UPDATE:TEAM' = 'objective:update:team',
  'OBJECTIVE:UPDATE:OWNS' = 'objective:update:owns',
  'OBJECTIVE:READ:ANY' = 'objective:read:any',
  'OBJECTIVE:READ:COMPANY' = 'objective:read:company',
  'OBJECTIVE:READ:TEAM' = 'objective:read:team',
  'OBJECTIVE:READ:OWNS' = 'objective:read:owns',
  'OBJECTIVE:DELETE:ANY' = 'objective:delete:any',
  'OBJECTIVE:DELETE:COMPANY' = 'objective:delete:company',
  'OBJECTIVE:DELETE:TEAM' = 'objective:delete:team',
  'OBJECTIVE:DELETE:OWNS' = 'objective:delete:owns',

  'KEY_RESULT:CREATE:ANY' = 'key-result:create:any',
  'KEY_RESULT:CREATE:COMPANY' = 'key-result:create:company',
  'KEY_RESULT:CREATE:TEAM' = 'key-result:create:team',
  'KEY_RESULT:CREATE:OWNS' = 'key-result:create:owns',
  'KEY_RESULT:UPDATE:ANY' = 'key-result:update:any',
  'KEY_RESULT:UPDATE:COMPANY' = 'key-result:update:company',
  'KEY_RESULT:UPDATE:TEAM' = 'key-result:update:team',
  'KEY_RESULT:UPDATE:OWNS' = 'key-result:update:owns',
  'KEY_RESULT:READ:ANY' = 'key-result:read:any',
  'KEY_RESULT:READ:COMPANY' = 'key-result:read:company',
  'KEY_RESULT:READ:TEAM' = 'key-result:read:team',
  'KEY_RESULT:READ:OWNS' = 'key-result:read:owns',
  'KEY_RESULT:DELETE:ANY' = 'key-result:delete:any',
  'KEY_RESULT:DELETE:COMPANY' = 'key-result:delete:company',
  'KEY_RESULT:DELETE:TEAM' = 'key-result:delete:team',
  'KEY_RESULT:DELETE:OWNS' = 'key-result:delete:owns',
}
