import type { DialogueValues, Toast } from 'src/global';
import { dialogueValues, isDisplayingDialogue, isDisplayingLoading, Toasts } from './stores';

export const SplitAndCapitalise = (text: string): string => {
  const capitalised = text.replace(/([A-Z])/g, ' $1').trim();
  return capitalised.charAt(0).toUpperCase() + capitalised.substring(1);
};

export const DisplayDialogue = (values: DialogueValues): void => {
  isDisplayingDialogue.set(true);
  dialogueValues.set(values);
};

export const CloseDialogue = (): void => isDisplayingDialogue.set(false);

export const DisplayLoading = (): void => isDisplayingLoading.set(true);

export const CloseLoading = (): void => isDisplayingLoading.set(false);

export const DisplayToast = (params: Toast): void => {
  if (!('duration' in params)) params.duration = 4000;
  let toasts;

  const unsubscribe = Toasts.subscribe((t) => {
    toasts = t;
  });
  unsubscribe();

  const temp = [{ ...params, id: Date.now() }, ...toasts];
  if (temp.length > 7) temp.pop();
  Toasts.set(temp);
};
