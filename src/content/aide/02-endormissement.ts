import { ArticlePreview, ArticleContent } from './types';

export const ENDORMISSEMENT_PREVIEWS: ArticlePreview[] = [
  {
    id: 'pleurs-moment-coucher',
    category: 'sommeil',
    title: 'Pleurs au moment du coucher',
    description: 'Pourquoi bébé pleure au moment d\'être couché et comment l\'accompagner',
    illustration: '😢',
    color: '#E8D5C4',
  },
  {
    id: 'temps-endormissement-long',
    category: 'sommeil',
    title: 'Temps d\'endormissement long',
    description: 'Les raisons d\'un endormissement prolongé et les solutions',
    illustration: '⏰',
    color: '#D4C5B4',
  },
  {
    id: 'endormissement-bras-sein-biberon',
    category: 'sommeil',
    title: 'Endormissement aux bras, au sein ou au biberon',
    description: 'Comprendre les besoins d\'aide à l\'endormissement',
    illustration: '🤱',
    color: '#C4B5A4',
  },
  {
    id: 'decalage-signes-fatigue',
    category: 'sommeil',
    title: 'Décalage entre les signes de fatigue et l\'endormissement',
    description: 'Pourquoi bébé ne s\'endort pas malgré les signes',
    illustration: '🔄',
    color: '#B4A594',
  },
  {
    id: 'cortisol-bloque-endormissement',
    category: 'sommeil',
    title: 'Le cortisol qui bloque l\'endormissement',
    description: 'Comment la sur-fatigue empêche de s\'endormir',
    illustration: '⚡',
    color: '#A49584',
  },
];

export const ENDORMISSEMENT_CONTENT: Record<string, ArticleContent> = {
  'pleurs-moment-coucher': {
    id: 'pleurs-moment-coucher',
    title: 'Pleurs au moment du coucher : pourquoi et comment accompagner ?',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les pleurs au moment du coucher sont très fréquents chez les bébés et jeunes enfants. Il ne s\'agit pas d\'un caprice, mais d\'une manifestation de leur immaturité neurologique et émotionnelle.',
      },
      {
        type: 'text',
        content: 'Le passage de l\'éveil au sommeil est une transition difficile pour le cerveau immature. Bébé doit accepter de lâcher prise, de se séparer de vous, de perdre le contrôle. C\'est angoissant pour lui, même s\'il est fatigué.',
      },
      {
        type: 'text',
        content: 'Les pleurs peuvent aussi signaler que le moment n\'est pas le bon : soit bébé n\'est pas encore assez fatigué (fenêtre de sommeil pas encore ouverte), soit il l\'est trop (cortisol déjà monté, sur-fatigue installée).',
      },
      {
        type: 'text',
        content: 'Votre présence rassurante, votre calme et votre acceptation de ses émotions sont essentiels. Les pleurs ne sont pas un échec : ils sont une façon pour bébé d\'évacuer les tensions accumulées dans la journée.',
      },
      {
        type: 'text',
        content: 'Si les pleurs sont très intenses ou systématiques, il peut être utile de vérifier les temps d\'éveil, l\'heure du coucher, et l\'environnement (température, luminosité, bruit).',
      },
    ],
    relatedArticles: [
      'comment-fonctionne-sommeil',
      'enfant-trop-fatigue',
      'fenetre-sommeil',
      'cortisol-bloque-endormissement',
      'besoin-presence-dormir',
    ],
  },
  'temps-endormissement-long': {
    id: 'temps-endormissement-long',
    title: 'Temps d\'endormissement long : pourquoi et que faire ?',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Un temps d\'endormissement long (plus de 20-30 minutes) peut avoir plusieurs causes. La plus fréquente est un décalage entre le moment du coucher et la fenêtre de sommeil optimale de votre enfant.',
      },
      {
        type: 'text',
        content: 'Si vous couchez bébé trop tôt, alors qu\'il n\'a pas encore assez de pression de sommeil, son cerveau n\'est simplement pas prêt à s\'endormir. Il va gigoter, parler, jouer, protester... parce qu\'il n\'a pas sommeil.',
      },
      {
        type: 'text',
        content: 'À l\'inverse, si vous couchez bébé trop tard, le cortisol monte, crée un état d\'alerte, et empêche l\'endormissement malgré la fatigue. Bébé est alors épuisé mais incapable de lâcher prise.',
      },
      {
        type: 'text',
        content: 'D\'autres facteurs peuvent allonger l\'endormissement : un environnement trop stimulant, une température inadaptée, une anxiété de séparation, un besoin de présence non comblé.',
      },
      {
        type: 'text',
        content: 'Pour réduire le temps d\'endormissement, respectez les temps d\'éveil recommandés, observez les signes de fatigue, créez un environnement propice (calme, sombre, frais), et accompagnez bébé avec présence et patience.',
      },
    ],
    relatedArticles: [
      'fenetre-sommeil',
      'temps-eveil-essentiels',
      'enfant-trop-fatigue',
      'pression-sommeil',
      'cortisol-bloque-endormissement',
    ],
  },
  'endormissement-bras-sein-biberon': {
    id: 'endormissement-bras-sein-biberon',
    title: 'Endormissement aux bras, au sein ou au biberon',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'S\'endormir dans les bras, au sein ou en prenant le biberon est un besoin légitime et naturel pour les bébés. C\'est même biologiquement normal : le contact, la chaleur, la succion sont des régulateurs puissants pour leur système nerveux immature.',
      },
      {
        type: 'text',
        content: 'Ce mode d\'endormissement n\'est pas un "problème" en soi. Il le devient uniquement si vous le vivez mal, si cela génère de l\'épuisement, ou si bébé ne parvient jamais à se rendormir seul lors des micro-réveils nocturnes.',
      },
      {
        type: 'text',
        content: 'Ces associations d\'endormissement peuvent perdurer plusieurs mois, voire années, sans poser de souci. Elles évoluent naturellement avec la maturation neurologique de l\'enfant.',
      },
      {
        type: 'text',
        content: 'Si vous souhaitez faire évoluer la situation, procédez progressivement : réduisez d\'abord l\'intensité de l\'aide (bercer moins fort, tétée plus courte), puis augmentez progressivement la distance (poser bébé réveillé mais somnolent).',
      },
      {
        type: 'text',
        content: 'L\'essentiel est de respecter le rythme de votre enfant et votre propre équilibre. Il n\'existe pas de "mauvaise" façon d\'accompagner l\'endormissement, tant que cela fonctionne pour vous et votre bébé.',
      },
    ],
    relatedArticles: [
      'comment-fonctionne-sommeil',
      'difficulte-rendormir-seul',
      'besoin-presence-dormir',
      'endormissement-dependant',
      'refuse-etre-pose',
    ],
  },
  'decalage-signes-fatigue': {
    id: 'decalage-signes-fatigue',
    title: 'Décalage entre signes de fatigue et endormissement',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Il arrive fréquemment que bébé montre des signes de fatigue (bâillements, frottement des yeux, grognements) mais ne parvienne pas à s\'endormir une fois couché. Ce décalage déroute beaucoup de parents.',
      },
      {
        type: 'text',
        content: 'Les premiers signes de fatigue indiquent que la fenêtre de sommeil approche, mais pas forcément qu\'elle est déjà ouverte. Si vous couchez bébé trop tôt après ces signes, il n\'aura pas encore assez de pression de sommeil.',
      },
      {
        type: 'text',
        content: 'À l\'inverse, si vous attendez trop longtemps après les signes, le cortisol monte et bébé bascule dans la sur-fatigue. Les signes disparaissent alors, remplacés par de l\'agitation, des pleurs, une énergie paradoxale.',
      },
      {
        type: 'text',
        content: 'Le bon timing se situe entre les premiers signes discrets et les signes francs de sur-fatigue. Cela demande de l\'observation fine et de l\'ajustement au quotidien.',
      },
      {
        type: 'text',
        content: 'Avec le temps, vous apprendrez à reconnaître la "vraie" fenêtre de sommeil de votre bébé, qui se situe souvent 10-15 minutes après les premiers signes de fatigue.',
      },
    ],
    relatedArticles: [
      'fenetre-sommeil',
      'temps-eveil-essentiels',
      'enfant-trop-fatigue',
      'pression-sommeil',
      'cortisol-bloque-endormissement',
    ],
  },
  'cortisol-bloque-endormissement': {
    id: 'cortisol-bloque-endormissement',
    title: 'Le cortisol qui bloque l\'endormissement',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Le cortisol est une hormone de stress et d\'éveil. Quand bébé dépasse son temps d\'éveil optimal sans s\'endormir, son organisme sécrète du cortisol pour lui permettre de "tenir" malgré la fatigue.',
      },
      {
        type: 'text',
        content: 'Ce mécanisme de survie crée un état d\'alerte physiologique : augmentation du rythme cardiaque, tension musculaire, vigilance accrue. Bébé devient alors agité, pleure, semble "énervé" alors qu\'il est épuisé.',
      },
      {
        type: 'text',
        content: 'Le cortisol empêche activement l\'endormissement : même si vous bercez, nourrissez, câlinez bébé, son système nerveux reste en mode "alerte". L\'endormissement peut alors prendre 30 minutes, 1 heure, voire plus.',
      },
      {
        type: 'text',
        content: 'Une fois endormi avec du cortisol élevé, le sommeil sera également plus fragile : réveils fréquents, difficultés à enchaîner les cycles, réveils nocturnes prolongés.',
      },
      {
        type: 'text',
        content: 'Pour éviter cette montée de cortisol, respectez les temps d\'éveil recommandés pour l\'âge de votre enfant, couchez-le dès les premiers signes de fatigue, et créez un environnement calme favorisant la détente.',
      },
    ],
    relatedArticles: [
      'stress-cortisol-sommeil',
      'enfant-trop-fatigue',
      'temps-eveil-essentiels',
      'fenetre-sommeil',
      'reveils-stress-surfatigue',
    ],
  },
};
