import { app } from '@/shared/infra/http/app.js';
import { env } from '@/shared/env/index.js';

const start = async (): Promise<void> => {
  try {
    const port = env.PORT;
    const host = env.HOST;

    await app.listen({ port, host });

    console.log(`Server running on http://${host}:${port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
