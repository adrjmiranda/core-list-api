import { container } from 'tsyringe';

import { EtherealMailProvider } from '#/shared/container/providers/MailProvider/implementations/EtherealMailProvider.js';
import { IMailProvider } from '#/shared/container/providers/MailProvider/models/IMailProvider.js';
import { DiskStorageProvider } from '#/shared/container/providers/StorageProvider/implementations/DiskStorageProvider.js';
import { IStorageProvider } from '#/shared/container/providers/StorageProvider/models/IStorageProvider.js';
import { JasonWebTokenProvider } from '#/shared/container/providers/TokenProvider/implemetations/JasonWebTokenProvider.js';
import { ITokenProvider } from '#/shared/container/providers/TokenProvider/models/ITokenProvider.js';

container.registerSingleton<IMailProvider>(
	'MailProvider',
	EtherealMailProvider
);

container.registerSingleton<IStorageProvider>(
	'StorageProvider',
	DiskStorageProvider
);

container.registerSingleton<ITokenProvider>(
	'TokenProvider',
	JasonWebTokenProvider
);
