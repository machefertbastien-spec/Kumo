/**
 * Catégories de contenu pour l'onglet Aide
 */

export type CategoryKey = 'sommeil' | 'alimentation' | 'temperature' | 'developpement' | 'sante';

export interface Category {
  key: CategoryKey;
  label: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    key: 'sommeil',
    label: 'Sommeil',
    icon: 'moon.fill',
    description: 'Comprendre et améliorer le sommeil de votre enfant'
  },
  {
    key: 'alimentation',
    label: 'Alimentation',
    icon: 'fork.knife',
    description: 'Alimentation et son impact sur le sommeil'
  },
  {
    key: 'temperature',
    label: 'Température',
    icon: 'thermometer.medium',
    description: 'Confort thermique et environnement'
  },
  {
    key: 'developpement',
    label: 'Développement',
    icon: 'chart.line.uptrend.xyaxis',
    description: 'Évolution et périodes sensibles'
  },
  {
    key: 'sante',
    label: 'Santé',
    icon: 'heart.text.square.fill',
    description: 'Santé et bien-être du bébé'
  }
];
