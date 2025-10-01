import api from './client'

export interface UserDTO {
  id?: number
  name: string
  surname: string
  cell: string
  email: string
  passwordCipher: string
}

export async function createUser(user: UserDTO) {
  const res = await api.post('/users', user)
  return res.data as UserDTO
}

export async function getUserByEmail(email: string) {
  const res = await api.get<UserDTO[]>(`/users`, { params: { email } })
  return res.data[0] ?? null
}
