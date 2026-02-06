/**
 * Types pour le contenu de l'onglet Aide
 */

import { CategoryKey } from './categories';

export interface ContentSection {
  type: 'text' | 'table' | 'list';
  content?: string;
  items?: string[];
  table?: {
    headers: string[];
    rows: Array<{ [key: string]: string }>;
  };
}

export interface ArticleContent {
  id: string;
  title: string;
  category: CategoryKey;
  sections: ContentSection[];
  relatedArticles?: string[];
}

export interface ArticlePreview {
  id: string;
  category: CategoryKey;
  title: string;
  description: string;
  illustration: string;
  color: string;
}
