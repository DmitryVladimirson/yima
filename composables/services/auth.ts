import { useState } from '#imports'

export interface UserInfo {
  email: string
  admin?: boolean
}

const useUserState = () => useState<UserInfo>('user')

export const useYimaAuth = () => {
  return {
    useUserState,
  }
}
