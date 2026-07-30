import type { App } from 'vue';
import FileCard from './FileCard.vue';
import List from './List.vue';

export type {
  FileCardProps,
  FileCardListProps,
  FileCardListItem,
  FileCardSpinProps,
  FileCardSemanticType,
  FileCardListSemanticType,
  CardInfo,
  CardType,
  PresetIcons,
} from './interface';

type FileCardType = typeof FileCard & {
  List: typeof List;
  install: (app: App) => App;
};

(FileCard as FileCardType).List = List;

// @ts-ignore
FileCard.install = function (app: App) {
  app.component(FileCard.name, FileCard);
  app.component(List.name, List);
  return app;
};

export default FileCard as FileCardType;

export { FileCard, List as FileCardList };
