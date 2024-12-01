import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { routes } from "./routes";
import fs from "fs";
import { resolve } from "path";

const PORT = 3333;

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Live typed full-stack",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(routes);

app.listen({ port: PORT }).then(() => {
  console.log("🔥 HTTP server running on http://localhost:3333");
});

app.ready().then(() => {
  const spec = app.swagger();

  fs.writeFile(
    resolve(__dirname, "swagger.json"),
    JSON.stringify(spec, null, 2),
    "utf8",
    () => {}
  );
});
