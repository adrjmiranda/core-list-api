import { and, eq, lt, sql } from 'drizzle-orm';
import cron from 'node-cron';

import { env } from '@/shared/env/index.js';
import { users } from '@/shared/infra/database/drizzle/users.js';
import { db } from '@/shared/infra/database/index.js';
import { app } from '@/shared/infra/http/app.js';

cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Executando limpeza de usuários fantasmas...');

  try {
    const deletedUsers = await db
      .delete(users)
      .where(
        and(
          eq(users.isVerified, false),
          lt(users.tokenExpiresAt, sql`NOW() - INTERVAL '3 days'`),
        ),
      )
      .returning();

    console.log(
      `✅ Limpeza concluída. ${deletedUsers.length} usuários removidos.`,
    );
  } catch (error) {
    console.error('❌ Erro na limpeza automática:', error);
  }
});

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
