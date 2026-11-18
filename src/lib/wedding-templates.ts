"use client";

export type InvitationTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  background: string;
  foreground: string;
  heading: string;
  tag: string;
  style?: string;
};

// The previous built-in collection has been retired.
// The public gallery now displays only templates published by the administrator.
export const weddingTemplates: InvitationTemplate[] = [];
