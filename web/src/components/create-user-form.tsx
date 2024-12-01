import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  getGetUsersQueryKey,
  useCreateUser,
} from "../http/generated/users/users"

const createUserSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 letras" }),
})

type CreateUserFormData = z.infer<typeof createUserSchema>

export function CreateUserForm() {
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  })

  const { mutateAsync: createUser } = useCreateUser()

  function handleCreateUser(data: CreateUserFormData) {
    createUser({
      data: {
        name: data.name,
      },
    })

    queryClient.invalidateQueries({
      queryKey: getGetUsersQueryKey(),
    })

    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleCreateUser)}>
      <div>
        <input type="text" placeholder="Nome" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <button type="submit">Criar usuário</button>
    </form>
  )
}
