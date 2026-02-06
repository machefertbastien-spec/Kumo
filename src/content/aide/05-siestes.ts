import { ArticlePreview, ArticleContent } from './types';

export const SIESTES_PREVIEWS: ArticlePreview[] = [
  {
    id: 'pourquoi-refuse-sieste',
    category: 'sommeil',
    title: 'Pourquoi mon enfant refuse la sieste ?',
    description: 'Les multiples raisons du refus de sieste',
    illustration: '😤',
    color: '#E8D5C4',
  },
  {
    id: 'siestes-courtes-causes',
    category: 'sommeil',
    title: 'Siestes courtes : causes et solutions',
    description: 'Comprendre les siestes de 30-45 minutes',
    illustration: '⏱️',
    color: '#D4C5B4',
  },
  {
    id: 'transitions-siestes-age',
    category: 'sommeil',
    title: 'Transitions de siestes selon l\'âge',
    description: 'Quand et comment passer de 4 à 3, 3 à 2, 2 à 1 sieste',
    illustration: '🔄',
    color: '#C4B5A4',
  },
  {
    id: 'siestes-impact-sommeil-nocturne',
    category: 'sommeil',
    title: 'Les siestes impactent-elles le sommeil nocturne ?',
    description: 'Le lien entre siestes et nuits',
    illustration: '🌓',
    color: '#B4A594',
  },
  {
    id: 'equilibre-siestes',
    category: 'sommeil',
    title: 'Trouver l\'équilibre avec les siestes',
    description: 'Ni trop, ni trop peu : le juste milieu',
    illustration: '⚖️',
    color: '#A49584',
  },
];

export const SIESTES_CONTENT: Record<string, ArticleContent> = {
  'pourquoi-refuse-sieste': {
    id: 'pourquoi-refuse-sieste',
    title: 'Pourquoi mon enfant refuse la sieste ?',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Le refus de sieste est un motif fréquent de consultation. Il peut avoir de multiples causes, rarement liées à un vrai manque de besoin de sommeil.',
      },
      {
        type: 'text',
        content: 'La cause la plus fréquente est un mauvais timing : sieste proposée trop tôt (pas assez de pression de sommeil) ou trop tard (sur-fatigue, cortisol monté). Le temps d\'éveil avant la sieste doit être adapté à l\'âge.',
      },
      {
        type: 'text',
        content: 'Un environnement inadapté peut aussi expliquer le refus : trop de lumière, trop de bruit, température inadaptée. Les siestes nécessitent les mêmes conditions que la nuit : obscurité, calme, fraîcheur.',
      },
      {
        type: 'text',
        content: 'Les périodes de transition (passage de 3 à 2 siestes, ou 2 à 1) génèrent souvent des refus temporaires. Le corps s\'ajuste progressivement au nouveau rythme.',
      },
      {
        type: 'text',
        content: 'Enfin, certains enfants résistent par tempérament : ils ont peur de "rater" quelque chose, préfèrent rester avec vous, ou n\'acceptent pas la séparation. La présence rassurante peut alors faciliter l\'endormissement.',
      },
    ],
    relatedArticles: [
      'temps-eveil-essentiels',
      'fenetre-sommeil',
      'transitions-siestes-age',
      'enfant-trop-fatigue',
      'siestes-impact-sommeil-nocturne',
    ],
  },
  'siestes-courtes-causes': {
    id: 'siestes-courtes-causes',
    title: 'Siestes courtes : causes et solutions',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les siestes courtes (30-45 minutes) sont normales jusqu\'à 4-6 mois : elles correspondent à la durée d\'un cycle de sommeil immature. Après cet âge, certains bébés allongent spontanément leurs siestes, d\'autres non.',
      },
      {
        type: 'text',
        content: 'Une sieste courte n\'est problématique que si bébé se réveille fatigué, grognon, et ne tient pas jusqu\'à la sieste suivante. Si bébé est en forme après 30 minutes, c\'est que cela lui suffit.',
      },
      {
        type: 'text',
        content: 'Les causes fréquentes de siestes courtes : environnement trop stimulant (lumière, bruit), timing inadapté (trop tôt ou trop tard), besoin d\'aide au rendormissement non comblé, sur-fatigue chronique.',
      },
      {
        type: 'text',
        content: 'Pour allonger les siestes, testez : obscurité totale, bruit blanc, respect strict des temps d\'éveil, intervention rapide lors du micro-réveil (avant réveil complet), coucher plus tôt le soir (pour réduire la dette).',
      },
      {
        type: 'text',
        content: 'Certains enfants font naturellement des siestes courtes toute leur enfance. Si l\'état de forme est bon et que les nuits compensent, il n\'y a pas lieu de forcer l\'allongement.',
      },
    ],
    relatedArticles: [
      'comment-fonctionne-sommeil',
      'pourquoi-refuse-sieste',
      'difficulte-rendormir-seul',
      'equilibre-siestes',
      'temps-eveil-essentiels',
    ],
  },
  'transitions-siestes-age': {
    id: 'transitions-siestes-age',
    title: 'Transitions de siestes selon l\'âge',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les besoins de siestes évoluent avec l\'âge. Les transitions d\'un rythme à l\'autre sont des périodes délicates qui nécessitent de l\'adaptation.',
      },
      {
        type: 'text',
        content: 'Passage de 4 à 3 siestes (vers 4-6 mois) : les temps d\'éveil s\'allongent progressivement. Proposez 3 siestes tant que bébé les accepte, puis passez à 2 quand les refus deviennent systématiques.',
      },
      {
        type: 'text',
        content: 'Passage de 3 à 2 siestes (vers 6-9 mois) : la dernière sieste en fin d\'après-midi devient difficile. Supprimez-la et avancez l\'heure du coucher pour compenser.',
      },
      {
        type: 'text',
        content: 'Passage de 2 à 1 sieste (vers 12-18 mois) : période souvent difficile. Alternez jours à 1 et jours à 2 siestes selon les signes. Avancez le coucher les jours à 1 sieste pour éviter la sur-fatigue.',
      },
      {
        type: 'text',
        content: 'Suppression de la dernière sieste (vers 3-5 ans) : très progressif. Certains jours avec sieste, d\'autres sans. Maintenez un temps calme même sans sommeil. Avancez le coucher du soir.',
      },
    ],
    relatedArticles: [
      'besoins-sommeil-age',
      'temps-eveil-essentiels',
      'pourquoi-refuse-sieste',
      'equilibre-siestes',
      'sommeil-jour-influence-nuit',
    ],
  },
  'siestes-impact-sommeil-nocturne': {
    id: 'siestes-impact-sommeil-nocturne',
    title: 'Les siestes impactent-elles le sommeil nocturne ?',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'C\'est une croyance très répandue : "moins bébé dort le jour, mieux il dormira la nuit". En réalité, c\'est souvent l\'inverse qui se produit.',
      },
      {
        type: 'text',
        content: 'Le sommeil fonctionne sur 24h : un enfant qui manque de sommeil le jour accumule de la fatigue, ce qui augmente le cortisol et fragmente le sommeil nocturne. Moins de siestes = nuits plus difficiles.',
      },
      {
        type: 'text',
        content: 'Il existe un équilibre délicat : trop de sommeil diurne peut effectivement retarder l\'endormissement du soir (surtout si la dernière sieste est trop tardive). Mais trop peu génère de la sur-fatigue.',
      },
      {
        type: 'text',
        content: 'Les siestes bien placées, au bon moment, améliorent les nuits. Elles permettent à bébé de récupérer, de baisser son cortisol, et d\'aborder la nuit en étant fatigué mais pas épuisé.',
      },
      {
        type: 'text',
        content: 'Si vous observez des difficultés nocturnes après une bonne journée de siestes, vérifiez plutôt : l\'heure de la dernière sieste (trop tardive ?), la durée totale (excessive ?), et l\'heure du coucher (trop tôt ?).',
      },
    ],
    relatedArticles: [
      'sommeil-jour-influence-nuit',
      'besoins-sommeil-age',
      'equilibre-siestes',
      'enfant-trop-fatigue',
      'pression-sommeil',
    ],
  },
  'equilibre-siestes': {
    id: 'equilibre-siestes',
    title: 'Trouver l\'équilibre avec les siestes',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'L\'équilibre des siestes est un ajustement quotidien : ni trop (risque de retarder le coucher ou fragmenter la nuit), ni trop peu (risque de sur-fatigue et nuits difficiles).',
      },
      {
        type: 'text',
        content: 'Le bon équilibre se reconnaît ainsi : bébé s\'endort facilement pour les siestes, dort la durée adaptée à son âge, reste en forme entre les siestes, s\'endort facilement le soir, dort bien la nuit.',
      },
      {
        type: 'text',
        content: 'Si les siestes sont trop longues ou trop tardives, vous observerez : difficulté d\'endormissement le soir, coucher très tardif, nuit écourtée ou fragmentée. Solution : limiter la durée ou avancer l\'heure.',
      },
      {
        type: 'text',
        content: 'Si les siestes sont insuffisantes, vous verrez : irritabilité, pleurs fréquents, micro-siestes dans la poussette/voiture, endormissement ultra-rapide, nuits agitées avec réveils. Solution : protéger et allonger les siestes.',
      },
      {
        type: 'text',
        content: 'L\'équilibre évolue avec l\'âge et les transitions. Ce qui fonctionnait hier peut ne plus fonctionner aujourd\'hui. Observez, ajustez, testez : chaque enfant est unique.',
      },
    ],
    relatedArticles: [
      'siestes-impact-sommeil-nocturne',
      'besoins-sommeil-age',
      'transitions-siestes-age',
      'temps-eveil-essentiels',
      'sommeil-jour-influence-nuit',
    ],
  },
};
