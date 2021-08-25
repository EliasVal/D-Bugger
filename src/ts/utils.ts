import type { DialogueValues } from 'src/global';
import { dialogueValues, isDisplayingDialogue, isDisplayingLoading, Toasts } from './stores';

export const MakeId = (length) => {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const SplitAndCapitalise = (text: string) => {
	let capitalised = text.replace(/([A-Z])/g, ' $1').trim();
	return capitalised.charAt(0).toUpperCase() + capitalised.substring(1);
};

export const DisplayDialogue = (values: DialogueValues) => {
	overflowYHide();
	isDisplayingDialogue.set(true);
	dialogueValues.set(values);
};

export const CloseDialogue = () => {
	isDisplayingDialogue.set(false);
	overflowYShow();
};

export const DisplayLoading = () => {
	overflowYHide();
	isDisplayingLoading.set(true);
};
export const CloseLoading = () => {
	isDisplayingLoading.set(false);
	overflowYShow();
};

export const DisplayToast = (toastVals) => {
	let toasts;

	let unsubscribe = Toasts.subscribe((t) => {
		toasts = t;
	});
	unsubscribe();

	let temp = [{ ...toastVals, id: Date.now() }, ...toasts];
	//if (temp.length > 5) temp.pop();
	Toasts.update((t) => (t = temp));
};

const overflowYHide = () => (document.getElementsByTagName('html')[0].style.overflowY = 'hidden');
const overflowYShow = () => (document.getElementsByTagName('html')[0].style.overflowY = 'unset');
