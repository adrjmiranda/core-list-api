export interface IStorageProvider {
  saveFile(
    fileName: string,
    fileStream: NodeJS.ReadableStream,
  ): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
