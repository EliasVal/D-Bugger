/// <reference types="@sveltejs/kit" />

export interface DialogueField {
	type: 'number' | 'text' | 'choice';
	options?: DialogueFieldSelectOption[];
	placeholder: string;
	name: string;
	id: string;
	maxlength?: number;
	minlength?: number;
}

export interface Project {
	bugs: Bug[];
	users: string[];
	owner: string;
	[key: string]: any;
}

export interface DialogueButton {
	onClick: Function;
	title: string;
	stylingClasses?: string;
}

export interface DialogueFieldSelectOption {
	text: string;
	value: string;
}

export interface DialogueValues {
	fields?: DialogueField[];
	buttons?: DialogueButton[];
	onSubmit: Function;
	submitBtnText: string;
	header?: string;
	headerStyles?: string;
}

export interface Bug {
	id: number | string;
	title: string;
	details: {
		severity: 'low' | 'medium' | 'high' | 'severe';
		platforms?: string[];
		assignedTo?: string[];
		status: 'fixed' | 'onHold' | 'beingFixed' | 'abandoned';
	};
}
