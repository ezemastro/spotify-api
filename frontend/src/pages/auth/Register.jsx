import { backendFetch } from '../../utils/fetch.js'

export default function Register () {
  const handleRegister = async (e) => {
    e.preventDefault()
    const response = await backendFetch('/register', {
      method: 'POST',
      body: {
        username: e.target.username.value,
        password: e.target.password.value,
        email: e.target.email.value
      }
    })
    console.log(response)
  }

  return (
    <form action='' onSubmit={handleRegister}>
      <input type='text' name='username' placeholder='Username' />
      <input type='email' name='email' placeholder='Email' />
      <input type='password' name='password' placeholder='Password' />
      <button type='submit'>Register</button>
    </form>
  )
}
