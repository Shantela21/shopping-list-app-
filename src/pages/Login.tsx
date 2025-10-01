import React from 'react'

import { useAppSelector, useAppDispatch } from '../../reduxHooks.ts'

export default function Login() {
    const email = useAppSelector((state) => state.login.email)
  const dispatch = useAppDispatch()
  return (
    <div>
      Apple
    </div>
  )
}
