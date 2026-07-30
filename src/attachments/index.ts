import type { App } from 'vue';
import AttachmentsComponent from './Attachments.vue';
import { FileListCard } from './FileList';

export type {
  Attachment,
  AttachmentsProps,
  AttachmentsRef,
  AttachmentsSelectOptions,
} from './interface';

const Attachments = Object.assign(AttachmentsComponent, {
  FileCard: FileListCard,
});

// @ts-ignore
Attachments.install = function(app: App) {
  app.component(Attachments.name, Attachments);
  app.component(FileListCard.name, FileListCard);
  return app;
}

export default Attachments;

export {
  Attachments,
}
