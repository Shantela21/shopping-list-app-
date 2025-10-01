import { useAppSelector } from '../../reduxHooks'

export default function Login() {
  const email = useAppSelector((state) => state.login.email)
  return (
    <div>
      {email}
    </div>
  )
}
