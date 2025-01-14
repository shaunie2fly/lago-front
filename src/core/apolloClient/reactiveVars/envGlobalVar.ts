import { makeVar } from '@apollo/client'

import { AppEnvEnum } from '~/globalTypes'

interface EnvGlobal {
  appEnv: AppEnvEnum
  apiUrl: string
  disableSignUp: boolean
  appVersion: string
}

export const envGlobalVar = makeVar<EnvGlobal>({
  appEnv: window.APP_ENV || APP_ENV,
  apiUrl: window.API_URL || API_URL,
  disableSignUp: window.LAGO_SIGNUP_DISABLED || LAGO_SIGNUP_DISABLED || false,
  appVersion: APP_VERSION,
})
