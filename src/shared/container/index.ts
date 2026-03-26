import { container } from 'tsyringe';

import { EtherealMailProvider } from '#/shared/container/providers/MailProvider/implementations/EtherealMailProvider.js';
import { IMailProvider } from '#/shared/container/providers/MailProvider/models/IMailProvider.js';
import { DiskStorageProvider } from '#/shared/container/providers/StorageProvider/implementations/DiskStorageProvider.js';
import { IStorageProvider } from '#/shared/container/providers/StorageProvider/models/IStorageProvider.js';

container.registerSingleton<IMailProvider>(
	'MailProvider',
	EtherealMailProvider
);

container.registerSingleton<IStorageProvider>(
	'StorageProvider',
	DiskStorageProvider
);
