import type { DialogueValues } from 'src/global';
import { dialogueValues, isDisplayingDialogue, isDisplayingLoading, Toasts } from './stores';

export const MakeId = (length: number): string => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const SplitAndCapitalise = (text: string): string => {
	const capitalised = text.replace(/([A-Z])/g, ' $1').trim();
	return capitalised.charAt(0).toUpperCase() + capitalised.substring(1);
};

export const DisplayDialogue = (values: DialogueValues): void => {
	overflowYHide();
	isDisplayingDialogue.set(true);
	dialogueValues.set(values);
};

export const CloseDialogue = (): void => {
	isDisplayingDialogue.set(false);
	overflowYShow();
};

export const DisplayLoading = (): void => {
	overflowYHide();
	isDisplayingLoading.set(true);
};
export const CloseLoading = (): void => {
	isDisplayingLoading.set(false);
	overflowYShow();
};

export const DisplayToast = (params: Record<string, unknown>): void => {
	let toasts;

	const unsubscribe = Toasts.subscribe((t) => {
		toasts = t;
	});
	unsubscribe();

	const temp = [{ ...params, id: Date.now() }, ...toasts];
	//if (temp.length > 5) temp.pop();
	Toasts.set(temp);
};

const overflowYHide = () => (document.getElementsByTagName('html')[0].style.overflowY = 'hidden');
const overflowYShow = () => (document.getElementsByTagName('html')[0].style.overflowY = 'unset');
