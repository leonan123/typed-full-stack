import { CreateUserForm } from "./components/create-user-form"
import { useGetUsers } from "./http/generated/users/users"

export function App() {
  const { data: users } = useGetUsers()

  return (
    <div>
      <ul>
        {users?.data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      <CreateUserForm />
    </div>
  )
}
