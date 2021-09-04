/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="@sveltejs/kit" />

export interface DialogueField {
  type: 'number' | 'text' | 'choice' | 'editor' | 'paragraph';
  body?: string;
  options?: DialogueFieldSelectOption[];
  placeholder?: string;
  name: string;
  id: string;
  maxlength?: number;
  minlength?: number;
  initialValue?: unknown;
  stylingClasses?: string;
}

export interface Project {
  bugs: Bugs;
  details: {
    users: string[];
    owner: string;
    name: string;
    visibility: 'private' | 'public';
  };
  [key: string]: unknown;
}

export interface DialogueButton {
  onClick: () => void;
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
  submitBtnStyles?: string;
  header?: string;
  headerStyles?: string;
}

export interface Bug {
  id: string;
  title: string;
  details: {
    severity: 'low' | 'medium' | 'high' | 'severe';
    platforms?: string[];
    assignedTo?: string[];
    status: 'fixed' | 'onHold' | 'beingFixed' | 'abandoned';
    description?: string;
  };
}

export interface Bugs {
  [key: string]: Bug;
}
