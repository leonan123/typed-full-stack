import { randomUUID } from "crypto";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

interface User {
  id: string;
  name: string;
}

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Doe",
  },
];

export const routes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/users",
    {
      schema: {
        tags: ["Users"],
        description: "Create a user.",
        operationId: "createUser",
        body: z.object({
          name: z.string(),
        }),
        response: {
          201: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body;

      users.push({
        id: randomUUID(),
        name,
      });

      reply.status(201).send({});
    }
  );

  app.get(
    "/users/:id",
    {
      schema: {
        tags: ["Users"],
        description: "Get a user.",
        operationId: "getUser",
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const user = users.find((user) => user.id === id);

      if (!user) {
        return reply.status(404).send({
          message: "User not found",
        });
      }

      reply.status(200).send(user);
    }
  );

  app.get(
    "/users",
    {
      schema: {
        tags: ["Users"],
        description: "List users.",
        operationId: "getUsers",
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
            })
          ),
        },
      },
    },
    () => users
  );
};
