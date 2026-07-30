import type { App } from 'vue';
import Folder from './Folder.vue';

export type {
  FolderProps,
  FolderTreeData,
  FolderRef,
  FolderSemanticType,
  FileContentService,
} from './interface';

// @ts-ignore
Folder.install = function (app: App) {
  app.component(Folder.name, Folder);
  return app;
};

export default Folder;

export { Folder };
