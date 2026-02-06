/**
 * Point d'entrée principal pour tout le contenu de l'onglet Aide
 * Consolidation de tous les articles organisés par section
 */

import { ArticlePreview, ArticleContent } from './types';
import { CATEGORIES, CategoryKey } from './categories';

// Import des previews et contenus par section
import { BASES_SOMMEIL_PREVIEWS, BASES_SOMMEIL_CONTENT } from './01-bases-sommeil';
import { ENDORMISSEMENT_PREVIEWS, ENDORMISSEMENT_CONTENT } from './02-endormissement';
import { REVEILS_NOCTURNES_PREVIEWS, REVEILS_NOCTURNES_CONTENT } from './03-reveils-nocturnes';
import { REVEILS_MATINAUX_PREVIEWS, REVEILS_MATINAUX_CONTENT } from './04-reveils-matinaux';
import { SIESTES_PREVIEWS, SIESTES_CONTENT } from './05-siestes';
import { ALIMENTATION_PREVIEWS, ALIMENTATION_CONTENT } from './06-alimentation';
import { PRESENCE_PREVIEWS, PRESENCE_CONTENT } from './07-presence';
import { PLEURS_PREVIEWS, PLEURS_CONTENT } from './08-pleurs';
import { CHANGEMENTS_PREVIEWS, CHANGEMENTS_CONTENT } from './10-changements';

/**
 * Tous les aperçus d'articles pour la liste
 */
export const ALL_ARTICLE_PREVIEWS: ArticlePreview[] = [
  ...BASES_SOMMEIL_PREVIEWS,
  ...ENDORMISSEMENT_PREVIEWS,
  ...REVEILS_NOCTURNES_PREVIEWS,
  ...REVEILS_MATINAUX_PREVIEWS,
  ...SIESTES_PREVIEWS,
  ...ALIMENTATION_PREVIEWS,
  ...PRESENCE_PREVIEWS,
  ...PLEURS_PREVIEWS,
  ...CHANGEMENTS_PREVIEWS,
];

/**
 * Tous les contenus complets d'articles
 */
export const ALL_ARTICLE_CONTENTS: Record<string, ArticleContent> = {
  ...BASES_SOMMEIL_CONTENT,
  ...ENDORMISSEMENT_CONTENT,
  ...REVEILS_NOCTURNES_CONTENT,
  ...REVEILS_MATINAUX_CONTENT,
  ...SIESTES_CONTENT,
  ...ALIMENTATION_CONTENT,
  ...PRESENCE_CONTENT,
  ...PLEURS_CONTENT,
  ...CHANGEMENTS_CONTENT,
};

/**
 * Obtenir les articles par catégorie
 */
export function getArticlesByCategory(category: CategoryKey | null): ArticlePreview[] {
  if (!category) return ALL_ARTICLE_PREVIEWS;
  return ALL_ARTICLE_PREVIEWS.filter(article => article.category === category);
}

/**
 * Rechercher des articles
 */
export function searchArticles(query: string): ArticlePreview[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return ALL_ARTICLE_PREVIEWS;
  
  return ALL_ARTICLE_PREVIEWS.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Obtenir le contenu d'un article
 */
export function getArticleContent(articleId: string): ArticleContent | null {
  return ALL_ARTICLE_CONTENTS[articleId] || null;
}

/**
 * Obtenir les articles liés
 */
export function getRelatedArticles(articleId: string): ArticlePreview[] {
  const article = ALL_ARTICLE_CONTENTS[articleId];
  if (!article?.relatedArticles) return [];
  
  return article.relatedArticles
    .map(id => ALL_ARTICLE_PREVIEWS.find(preview => preview.id === id))
    .filter((preview): preview is ArticlePreview => preview !== undefined);
}

export { CATEGORIES } from './categories';
export type { Category, CategoryKey } from './categories';
export type { ArticlePreview, ArticleContent, ContentSection } from './types';
