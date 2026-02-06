/**
 * Section 1 : Bases du sommeil & rythmes biologiques
 */

import { ArticleContent, ArticlePreview } from './types';

export const BASES_SOMMEIL_PREVIEWS: ArticlePreview[] = [
  {
    id: 'comment-fonctionne-sommeil',
    category: 'sommeil',
    title: 'Comment fonctionne le sommeil d\'un bébé',
    description: 'Comprendre le sommeil immature, les cycles et les mécanismes d\'endormissement',
    illustration: '😴',
    color: '#E8D5C4'
  },
  {
    id: 'besoins-sommeil-age',
    category: 'sommeil',
    title: 'Les besoins de sommeil selon l\'âge',
    description: 'Repères par âge et répartition jour/nuit, sans tableaux rigides',
    illustration: '📊',
    color: '#D4E8F0'
  },
  {
    id: 'temps-eveil-essentiels',
    category: 'sommeil',
    title: 'Temps d\'éveil : pourquoi ils sont essentiels',
    description: 'La clé pour comprendre la fatigue et le cortisol',
    illustration: '⏱️',
    color: '#F0E8D4'
  },
  {
    id: 'fenetre-sommeil',
    category: 'sommeil',
    title: 'Comment reconnaître la bonne fenêtre de sommeil',
    description: 'Repérer le bon moment pour dormir avant la montée de cortisol',
    illustration: '🎯',
    color: '#E8F0D4'
  },
  {
    id: 'enfant-trop-fatigue',
    category: 'sommeil',
    title: 'Pourquoi un enfant trop fatigué lutte contre le sommeil',
    description: 'Le paradoxe de la sur-fatigue et du cortisol',
    illustration: '😫',
    color: '#F0D4E8'
  },
  {
    id: 'stress-cortisol-sommeil',
    category: 'sommeil',
    title: 'Stress, cortisol et sommeil : le cercle vicieux',
    description: 'Comprendre le lien entre fatigue, stress et réveils',
    illustration: '🔄',
    color: '#E8D4D4'
  },
  {
    id: 'pression-sommeil',
    category: 'sommeil',
    title: 'Pression de sommeil : ce qui aide vraiment à dormir',
    description: 'Comment se construit le besoin de dormir',
    illustration: '💤',
    color: '#D4E8E8'
  },
  {
    id: 'sommeil-jour-influence-nuit',
    category: 'sommeil',
    title: 'Pourquoi le sommeil de jour influence la nuit',
    description: 'Le sommeil se régule sur 24 heures',
    illustration: '☀️🌙',
    color: '#F0E8E8'
  }
];

export const BASES_SOMMEIL_CONTENT: Record<string, ArticleContent> = {
  'comment-fonctionne-sommeil': {
    id: 'comment-fonctionne-sommeil',
    title: 'Comment fonctionne le sommeil d\'un bébé / enfant',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Le sommeil d\'un bébé est immature à la naissance. Son cerveau ne sait pas encore enchaîner naturellement les cycles de sommeil comme celui d\'un adulte. Cette capacité se construit progressivement avec la maturation neurologique.'
      },
      {
        type: 'text',
        content: 'Les cycles de sommeil d\'un bébé durent environ 30 à 45 minutes, contre environ 90 minutes chez l\'adulte. À la fin de chaque cycle, le cerveau repasse en sommeil très léger. À ce moment précis, un réveil est physiologiquement attendu.\n\n➡️ Ce n\'est pas le réveil qui est anormal, mais l\'impossibilité de se rendormir.'
      },
      {
        type: 'text',
        content: 'L\'endormissement dépend de deux mécanismes principaux :\n• la pression de sommeil, qui augmente avec le temps passé éveillé\n• le niveau de cortisol, l\'hormone de l\'éveil et du stress'
      },
      {
        type: 'text',
        content: 'Lorsque les temps d\'éveil sont adaptés, la pression de sommeil augmente sans excès de cortisol. Cela permet au cerveau de basculer vers le sommeil.\n\nLorsque les temps d\'éveil sont trop longs, le cortisol augmente et bloque mécaniquement l\'endormissement, y compris chez un enfant très fatigué.'
      },
      {
        type: 'text',
        content: 'C\'est pour cette raison qu\'un bébé en sur-fatigue peut :\n• lutter contre le sommeil\n• pleurer fortement au moment de dormir\n• se réveiller plus souvent la nuit\n\n➡️ La fatigue excessive fragmente le sommeil au lieu de l\'approfondir.'
      },
      {
        type: 'text',
        content: 'Le sommeil se régule sur 24 heures, et non uniquement la nuit. Les siestes permettent de faire redescendre le cortisol et de maintenir une pression de sommeil stable.\n\nDes siestes absentes, trop courtes ou mal positionnées entraînent une sur-fatigue chronique, qui impacte directement le sommeil nocturne.'
      },
      {
        type: 'text',
        content: '👉 Le sommeil n\'est ni une question de volonté, ni une question de méthode.\n👉 C\'est un équilibre biologique entre rythmes, fatigue et stress.'
      }
    ],
    relatedArticles: [
      'temps-eveil-essentiels',
      'fenetre-sommeil',
      'stress-cortisol-sommeil',
      'pression-sommeil',
      'sommeil-jour-influence-nuit'
    ]
  },

  'besoins-sommeil-age': {
    id: 'besoins-sommeil-age',
    title: 'Les besoins de sommeil selon l\'âge',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les besoins de sommeil d\'un enfant sont directement liés à son âge et à la maturation de son cerveau. Ils diminuent progressivement au fil du développement, à mesure que les cycles de sommeil s\'allongent et que les capacités neurologiques évoluent.'
      },
      {
        type: 'text',
        content: 'À la naissance, les besoins de sommeil sont très élevés. Le sommeil est encore immature et réparti sur l\'ensemble des 24 heures. Avec la maturation cérébrale, le sommeil nocturne se consolide, les périodes d\'éveil augmentent et les besoins globaux de sommeil diminuent par paliers successifs.'
      },
      {
        type: 'table',
        table: {
          headers: ['Âge', 'Sommeil total sur 24h'],
          rows: [
            { age: '0 à 3 mois', sommeil: '14 à 17 heures' },
            { age: '4 à 6 mois', sommeil: '14 à 15 heures' },
            { age: '7 à 12 mois', sommeil: '13 à 14 heures' },
            { age: '1 à 2 ans', sommeil: '12 à 14 heures' },
            { age: '2 à 3 ans', sommeil: '11 à 13 heures' },
            { age: '3 à 5 ans', sommeil: '10 à 12 heures' }
          ]
        }
      },
      {
        type: 'text',
        content: 'Ces besoins incluent le sommeil de nuit et les siestes.'
      },
      {
        type: 'table',
        table: {
          headers: ['Âge', 'Sommeil nocturne', 'Siestes'],
          rows: [
            { age: '0 à 3 mois', nuit: 'non structuré', siestes: 'multiples' },
            { age: '4 à 6 mois', nuit: '9 à 11 h', siestes: '2 à 4' },
            { age: '7 à 12 mois', nuit: '10 à 12 h', siestes: '2' },
            { age: '1 à 2 ans', nuit: '10 à 12 h', siestes: '1 à 2' },
            { age: '2 à 3 ans', nuit: '10 à 11 h', siestes: '1' },
            { age: '3 à 5 ans', nuit: '10 à 11 h', siestes: 'parfois 0' }
          ]
        }
      },
      {
        type: 'text',
        content: 'Lorsque les besoins de sommeil liés à l\'âge ne sont pas respectés, une dette de sommeil peut s\'installer. Cette dette résulte d\'un écart répété entre le besoin biologique de sommeil et le temps de sommeil réellement obtenu.'
      },
      {
        type: 'text',
        content: 'Conséquences d\'un non-respect des besoins :\n• des difficultés d\'endormissement\n• des réveils nocturnes fréquents\n• des réveils trop matinaux\n• une augmentation de l\'agitation et des pleurs'
      }
    ],
    relatedArticles: [
      'comment-fonctionne-sommeil',
      'temps-eveil-essentiels',
      'fenetre-sommeil',
      'sommeil-jour-influence-nuit'
    ]
  },

  'temps-eveil-essentiels': {
    id: 'temps-eveil-essentiels',
    title: 'Temps d\'éveil : pourquoi ils sont essentiels',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les temps d\'éveil correspondent à la durée maximale pendant laquelle un bébé ou un enfant peut rester éveillé sans déséquilibrer son sommeil. Ils sont directement liés à l\'âge et à la maturation du cerveau.'
      },
      {
        type: 'text',
        content: 'Chez le bébé et le jeune enfant, le cerveau ne peut pas rester éveillé longtemps sans produire du cortisol. Lorsque les temps d\'éveil sont respectés, la pression de sommeil augmente progressivement et permet l\'endormissement. Lorsqu\'ils sont dépassés, le cortisol augmente et empêche l\'accès au sommeil.'
      },
      {
        type: 'table',
        table: {
          headers: ['Âge', 'Temps d\'éveil maximal'],
          rows: [
            { age: '0 à 3 mois', temps: '1h à 1h30' },
            { age: '4 à 6 mois', temps: '1h30 à 2h' },
            { age: '7 à 9 mois', temps: '2h à 3h' },
            { age: '10 à 12 mois', temps: '3h à 4h' },
            { age: '1 à 2 ans', temps: '4h à 5h' },
            { age: '2 à 3 ans', temps: '5h à 6h' },
            { age: '3 à 5 ans', temps: '6h à 7h' }
          ]
        }
      },
      {
        type: 'text',
        content: 'Ces repères correspondent à la capacité neurologique maximale d\'éveil à chaque âge.'
      },
      {
        type: 'text',
        content: 'Ce qui se passe quand les temps d\'éveil sont respectés :\n• la pression de sommeil augmente progressivement\n• le cortisol reste bas\n• l\'endormissement est facilité\n• le sommeil est plus stable'
      },
      {
        type: 'text',
        content: 'Ce qui se passe quand les temps d\'éveil sont trop longs :\n• le cortisol augmente\n• l\'endormissement devient difficile\n• le sommeil se fragmente\n• les réveils nocturnes sont plus fréquents\n\n➡️ Un temps d\'éveil trop long n\'entraîne pas un meilleur sommeil, mais une sur-fatigue.'
      },
      {
        type: 'text',
        content: '👉 Les temps d\'éveil sont des repères physiologiques liés à l\'âge.\n👉 Leur respect conditionne l\'équilibre entre pression de sommeil et cortisol.\n👉 Ils sont un levier central dans la compréhension des troubles du sommeil.'
      }
    ],
    relatedArticles: [
      'comment-fonctionne-sommeil',
      'besoins-sommeil-age',
      'pression-sommeil',
      'stress-cortisol-sommeil',
      'sommeil-jour-influence-nuit'
    ]
  }
};
