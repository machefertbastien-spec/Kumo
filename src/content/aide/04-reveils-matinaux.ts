import { ArticlePreview, ArticleContent } from './types';

export const REVEILS_MATINAUX_PREVIEWS: ArticlePreview[] = [
  {
    id: 'quest-ce-reveil-trop-matinal',
    category: 'sommeil',
    title: 'Qu\'est-ce qu\'un réveil trop matinal ?',
    description: 'Définir et comprendre les réveils matinaux précoces',
    illustration: '🌅',
    color: '#E8D5C4',
  },
  {
    id: 'pourquoi-enfant-reveille-tres-tot',
    category: 'sommeil',
    title: 'Pourquoi mon enfant se réveille très tôt ?',
    description: 'Les multiples causes des réveils matinaux',
    illustration: '⏰',
    color: '#D4C5B4',
  },
  {
    id: 'fatigue-accumulee-reveils-precoces',
    category: 'sommeil',
    title: 'Fatigue accumulée et réveils précoces',
    description: 'Le paradoxe de la sur-fatigue matinale',
    illustration: '😴',
    color: '#C4B5A4',
  },
  {
    id: 'difficile-rendormir-matin',
    category: 'sommeil',
    title: 'Difficile de rendormir bébé le matin',
    description: 'Pourquoi le rendormissement matinal est compliqué',
    illustration: '🌄',
    color: '#B4A594',
  },
  {
    id: 'reveils-matinaux-cortisol',
    category: 'sommeil',
    title: 'Réveils matinaux et pic de cortisol',
    description: 'Le rôle du cortisol dans les réveils précoces',
    illustration: '📈',
    color: '#A49584',
  },
];

export const REVEILS_MATINAUX_CONTENT: Record<string, ArticleContent> = {
  'quest-ce-reveil-trop-matinal': {
    id: 'quest-ce-reveil-trop-matinal',
    title: 'Qu\'est-ce qu\'un réveil trop matinal ?',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'On parle de réveil trop matinal lorsque bébé se réveille avant 6h du matin et montre des signes de fatigue pendant la journée. Un enfant qui se réveille naturellement à 6h30-7h et reste en forme n\'a pas de problème de réveil matinal.',
      },
      {
        type: 'text',
        content: 'Le réveil matinal est considéré comme "trop précoce" s\'il empêche l\'enfant de compléter ses besoins de sommeil total sur 24h. Par exemple, un bébé de 8 mois qui a besoin de 14h de sommeil et ne dort que 12h a une dette.',
      },
      {
        type: 'text',
        content: 'Certains enfants sont naturellement "matinaux" et se réveillent tôt sans problème. D\'autres sont "du soir" et ont besoin d\'un réveil plus tardif. Il faut observer l\'état de forme de l\'enfant, pas seulement l\'heure.',
      },
      {
        type: 'text',
        content: 'Les signes d\'un réveil trop précoce : fatigue dès le lever, besoin de sieste très tôt (avant 9h), irritabilité en matinée, difficulté à tenir jusqu\'à la sieste, coucher très précoce qui s\'auto-entretient.',
      },
      {
        type: 'text',
        content: 'Un réveil matinal n\'est pas forcément un problème à "résoudre". Si bébé est en forme et atteint ses besoins de sommeil, c\'est simplement son rythme biologique naturel.',
      },
    ],
    relatedArticles: [
      'besoins-sommeil-age',
      'pourquoi-enfant-reveille-tres-tot',
      'fatigue-accumulee-reveils-precoces',
      'temps-eveil-essentiels',
      'sommeil-jour-influence-nuit',
    ],
  },
  'pourquoi-enfant-reveille-tres-tot': {
    id: 'pourquoi-enfant-reveille-tres-tot',
    title: 'Pourquoi mon enfant se réveille très tôt ?',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les réveils matinaux précoces ont de multiples causes. La plus fréquente est un coucher trop tardif : la sur-fatigue augmente le cortisol, fragmente le sommeil, et provoque un réveil précoce.',
      },
      {
        type: 'text',
        content: 'Paradoxalement, coucher plus tard ne fait pas dormir plus longtemps : cela crée au contraire un réveil encore plus tôt. Le cerveau épuisé sécrète du cortisol qui interrompt le sommeil dès 5h-5h30.',
      },
      {
        type: 'text',
        content: 'D\'autres causes possibles : l\'environnement (lumière, bruit, température), la faim (surtout chez les petits bébés), les siestes mal placées ou trop tardives, un rythme circadien décalé.',
      },
      {
        type: 'text',
        content: 'Le pic naturel de cortisol du matin (vers 6h-7h) rend aussi le sommeil plus léger. Si bébé a déjà une dette de sommeil, ce pic peut provoquer un réveil complet au lieu d\'un simple micro-réveil.',
      },
      {
        type: 'text',
        content: 'Pour repousser les réveils matinaux, il faut souvent avancer l\'heure du coucher (contre-intuitif mais efficace), protéger les siestes, obscurcir la chambre, et laisser le temps au corps de recaler son horloge biologique.',
      },
    ],
    relatedArticles: [
      'quest-ce-reveil-trop-matinal',
      'fatigue-accumulee-reveils-precoces',
      'reveils-matinaux-cortisol',
      'enfant-trop-fatigue',
      'sommeil-jour-influence-nuit',
    ],
  },
  'fatigue-accumulee-reveils-precoces': {
    id: 'fatigue-accumulee-reveils-precoces',
    title: 'Fatigue accumulée et réveils précoces',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'La fatigue accumulée est la cause n°1 des réveils matinaux précoces. Plus bébé est fatigué, moins il dort longtemps : c\'est le paradoxe de la sur-fatigue.',
      },
      {
        type: 'text',
        content: 'Quand la dette de sommeil s\'installe, le cortisol reste élevé même la nuit. Vers 5h-6h du matin, ce cortisol élevé coïncide avec le pic naturel de cortisol matinal : l\'effet est démultiplié et provoque un réveil complet.',
      },
      {
        type: 'text',
        content: 'Le cercle vicieux s\'installe : réveil à 5h → journée fatiguée → coucher difficile → nuit agitée → réveil à 5h. Les parents tentent alors de décaler le coucher, pensant que bébé dormira plus tard, mais cela aggrave la situation.',
      },
      {
        type: 'text',
        content: 'Pour casser ce cercle, il faut faire exactement l\'inverse : avancer l\'heure du coucher (parfois de 30 minutes à 1 heure), respecter strictement les temps d\'éveil, préserver toutes les siestes.',
      },
      {
        type: 'text',
        content: 'La récupération prend 1 à 2 semaines. Il faut tenir cette routine même si les réveils matinaux persistent au début : le corps a besoin de temps pour reconstruire ses réserves et faire baisser le cortisol de base.',
      },
    ],
    relatedArticles: [
      'cercle-vicieux-reveils',
      'stress-cortisol-sommeil',
      'enfant-trop-fatigue',
      'pourquoi-enfant-reveille-tres-tot',
      'reveils-matinaux-cortisol',
    ],
  },
  'difficile-rendormir-matin': {
    id: 'difficile-rendormir-matin',
    title: 'Difficile de rendormir bébé le matin',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Rendormir bébé après un réveil matinal est souvent mission impossible. Le pic de cortisol du matin, combiné à la lumière croissante, crée un état d\'éveil qui empêche le retour au sommeil.',
      },
      {
        type: 'text',
        content: 'Le cerveau interprète la lumière du jour comme un signal de réveil définitif. Même si bébé est encore fatigué, son horloge biologique lui dit qu\'il est temps de se lever. La pression de sommeil est aussi au plus bas.',
      },
      {
        type: 'text',
        content: 'Forcer le rendormissement génère souvent frustration et pleurs : bébé ne comprend pas pourquoi vous insistez alors que son corps lui dit de se réveiller. Cela peut créer une association négative avec le sommeil.',
      },
      {
        type: 'text',
        content: 'Si le réveil est très précoce (avant 5h30), vous pouvez tenter un rendormissement avec obscurité totale, calme, présence apaisante. Mais si bébé résiste après 10-15 minutes, mieux vaut accepter le réveil.',
      },
      {
        type: 'text',
        content: 'La vraie solution est préventive : avancer le coucher du soir pour que bébé récupère sa dette et repousse naturellement l\'heure du réveil matinal. Cela prend du temps mais c\'est la seule approche durable.',
      },
    ],
    relatedArticles: [
      'quest-ce-reveil-trop-matinal',
      'pourquoi-enfant-reveille-tres-tot',
      'reveils-matinaux-cortisol',
      'difficulte-rendormir-seul',
      'fatigue-accumulee-reveils-precoces',
    ],
  },
  'reveils-matinaux-cortisol': {
    id: 'reveils-matinaux-cortisol',
    title: 'Réveils matinaux et pic de cortisol',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Le cortisol suit un rythme circadien : il est au plus bas la nuit (vers 2-3h) et atteint son pic le matin (vers 6-8h). Ce pic est normal et prépare le corps au réveil.',
      },
      {
        type: 'text',
        content: 'Chez un enfant reposé, ce pic de cortisol matinal provoque un réveil naturel vers 6h30-7h30. Chez un enfant en dette de sommeil, le cortisol de base est déjà élevé : le pic matinal déclenche alors un réveil précoce (5h-5h30).',
      },
      {
        type: 'text',
        content: 'Le cortisol élevé rend aussi le sommeil du petit matin très léger : bébé enchaîne mal les derniers cycles, se réveille entre chaque cycle, et finit par émerger complètement bien avant l\'heure.',
      },
      {
        type: 'text',
        content: 'Pour faire baisser le cortisol de base et repousser les réveils matinaux, il faut impérativement restaurer les réserves de sommeil : coucher plus tôt, respecter les temps d\'éveil, protéger les siestes.',
      },
      {
        type: 'text',
        content: 'La régulation du cortisol prend 7 à 14 jours. Pendant cette période, les réveils matinaux peuvent même sembler empirer avant de s\'améliorer : c\'est normal, le corps se recale progressivement.',
      },
    ],
    relatedArticles: [
      'stress-cortisol-sommeil',
      'fatigue-accumulee-reveils-precoces',
      'enfant-trop-fatigue',
      'pourquoi-enfant-reveille-tres-tot',
      'cercle-vicieux-reveils',
    ],
  },
};
