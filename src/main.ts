import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { configureSwagger } from "./swagger/swagger.config";
import { JwtAuthGuard } from "./jwt/jwtauth.guard";

async function bootstrap(): Promise<void> {

  const app = await NestFactory.create(AppModule);
	app.enableCors();
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  configureSwagger(app);

  if (!process.env.DATABASE_HOST || !process.env.DATABASE_PORT) {
    throw new Error('Missing environment variables');
  }
  await app.listen(parseInt(process.env.PORT ?? '3000', 10),);



  

}
void bootstrap();
