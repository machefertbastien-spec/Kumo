import { ArticlePreview, ArticleContent } from './types';

export const REVEILS_NOCTURNES_PREVIEWS: ArticlePreview[] = [
  {
    id: 'pourquoi-bebes-reveillent',
    category: 'sommeil',
    title: 'Pourquoi les bébés se réveillent la nuit',
    description: 'Les causes naturelles et physiologiques des réveils nocturnes',
    illustration: '🌙',
    color: '#E8D5C4',
  },
  {
    id: 'reveils-frequents-sommeil-faim-inconfort',
    category: 'sommeil',
    title: 'Réveils fréquents : sommeil, faim ou inconfort ?',
    description: 'Distinguer les différents types de réveils nocturnes',
    illustration: '🤔',
    color: '#D4C5B4',
  },
  {
    id: 'reveils-heures-fixes',
    category: 'sommeil',
    title: 'Réveils nocturnes à heures fixes',
    description: 'Pourquoi bébé se réveille toujours à la même heure la nuit',
    illustration: '🕐',
    color: '#C4B5A4',
  },
  {
    id: 'difficulte-rendormir-seul',
    category: 'sommeil',
    title: 'Difficulté à se rendormir seul',
    description: 'Comprendre les besoins d\'aide au rendormissement',
    illustration: '👶',
    color: '#B4A594',
  },
  {
    id: 'reveils-stress-surfatigue',
    category: 'sommeil',
    title: 'Réveils liés au stress et à la sur-fatigue',
    description: 'Le cercle vicieux de la fatigue et des réveils',
    illustration: '😰',
    color: '#A49584',
  },
  {
    id: 'cercle-vicieux-reveils',
    category: 'sommeil',
    title: 'Le cercle vicieux des réveils nocturnes',
    description: 'Comment la fatigue engendre plus de réveils',
    illustration: '🔄',
    color: '#948574',
  },
];

export const REVEILS_NOCTURNES_CONTENT: Record<string, ArticleContent> = {
  'pourquoi-bebes-reveillent': {
    id: 'pourquoi-bebes-reveillent',
    title: 'Pourquoi les bébés se réveillent la nuit',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les réveils nocturnes sont absolument normaux et physiologiques chez les bébés et jeunes enfants. Leur sommeil est immature : les cycles sont courts (30-45 minutes), et le passage d\'un cycle à l\'autre génère un micro-réveil.',
      },
      {
        type: 'text',
        content: 'Chez l\'adulte, ces micro-réveils passent inaperçus car nous nous rendormons instantanément. Chez le bébé, le cerveau immature a besoin d\'un signal pour se rendormir : retrouver les mêmes conditions d\'endormissement.',
      },
      {
        type: 'text',
        content: 'Si bébé s\'est endormi dans vos bras, au sein ou en tétant un biberon, il cherchera logiquement ces mêmes conditions lors des micro-réveils. Ce n\'est pas un caprice : c\'est un besoin neurologique.',
      },
      {
        type: 'text',
        content: 'D\'autres facteurs peuvent multiplier les réveils : la faim réelle (surtout avant 6 mois), l\'inconfort (couche, température, dents), l\'angoisse de séparation, le stress, la sur-fatigue, un environnement inadapté.',
      },
      {
        type: 'text',
        content: 'Avec le temps et la maturation cérébrale, les cycles s\'allongent, les réveils s\'espacent, et l\'enfant développe progressivement la capacité de se rendormir seul. Cela prend plusieurs mois, voire années.',
      },
    ],
    relatedArticles: [
      'comment-fonctionne-sommeil',
      'difficulte-rendormir-seul',
      'reveils-frequents-sommeil-faim-inconfort',
      'endormissement-bras-sein-biberon',
      'besoins-sommeil-age',
    ],
  },
  'reveils-frequents-sommeil-faim-inconfort': {
    id: 'reveils-frequents-sommeil-faim-inconfort',
    title: 'Réveils fréquents : sommeil, faim ou inconfort ?',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Tous les réveils nocturnes n\'ont pas la même origine. Savoir distinguer les différents types de réveils permet de mieux y répondre et d\'éviter les réponses inadaptées.',
      },
      {
        type: 'text',
        content: 'Les réveils liés au sommeil immature surviennent entre les cycles (toutes les 30-45 minutes). Bébé cherche les conditions d\'endormissement : si vous étiez là, il vous réclame. Ces réveils ne signalent pas forcément un besoin physique.',
      },
      {
        type: 'text',
        content: 'Les réveils de faim sont plus espacés (toutes les 2-4 heures selon l\'âge), et bébé montre des signes clairs : mouvements de succion, bouche ouverte, agitation croissante. Après 6 mois, les réveils de faim nocturne deviennent rares (mais possibles).',
      },
      {
        type: 'text',
        content: 'Les réveils d\'inconfort sont ponctuels et souvent accompagnés de pleurs intenses : couche sale, température inadaptée (trop chaud ou trop froid), dents qui poussent, reflux, infection d\'oreille.',
      },
      {
        type: 'text',
        content: 'Observez le moment, l\'intensité, la répétition des réveils. Un réveil systématique toutes les 45 minutes signale plutôt un besoin de retrouver les conditions d\'endormissement. Des réveils irréguliers et intenses orientent vers l\'inconfort.',
      },
    ],
    relatedArticles: [
      'pourquoi-bebes-reveillent',
      'faim-nocturne-reelle-non',
      'reveils-heures-fixes',
      'inconfort-digestif-reveils',
      'difficulte-rendormir-seul',
    ],
  },
  'reveils-heures-fixes': {
    id: 'reveils-heures-fixes',
    title: 'Réveils nocturnes à heures fixes',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Certains bébés se réveillent systématiquement à la même heure chaque nuit : 2h, 3h, 5h... Ce phénomène déroute les parents, qui y voient parfois un mystère inexplicable.',
      },
      {
        type: 'text',
        content: 'En réalité, ces réveils à heures fixes correspondent souvent à la fin d\'un cycle de sommeil. Si bébé a besoin d\'aide pour se rendormir, il va créer une "habitude" en se réveillant au même moment chaque nuit.',
      },
      {
        type: 'text',
        content: 'Le cerveau fonctionne par routine : si vous intervenez systématiquement (nourrir, bercer, prendre dans les bras), le réveil se renforce et devient un signal attendu par le cerveau.',
      },
      {
        type: 'text',
        content: 'Ces réveils peuvent aussi correspondre à des moments de sommeil léger dans l\'architecture du sommeil : vers 3-4h, le sommeil est naturellement plus fragile, avec plus de phases de sommeil paradoxal.',
      },
      {
        type: 'text',
        content: 'Pour faire évoluer ces réveils, il faut progressivement réduire l\'intensité de votre intervention : moins de temps, moins d\'aide, plus d\'autonomie. Le cerveau "désapprendra" alors ce réveil systématique.',
      },
    ],
    relatedArticles: [
      'pourquoi-bebes-reveillent',
      'difficulte-rendormir-seul',
      'comment-fonctionne-sommeil',
      'endormissement-dependant',
      'faim-nocturne-reelle-non',
    ],
  },
  'difficulte-rendormir-seul': {
    id: 'difficulte-rendormir-seul',
    title: 'Difficulté à se rendormir seul',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'La capacité à se rendormir seul après un réveil nocturne est une compétence qui se développe progressivement avec la maturation du cerveau. Elle n\'est pas innée, et certains enfants la développent plus tardivement que d\'autres.',
      },
      {
        type: 'text',
        content: 'Pour se rendormir seul, bébé doit retrouver les mêmes conditions que celles présentes lors de l\'endormissement. Si vous l\'avez aidé à s\'endormir (bercements, tétée, présence), il cherchera logiquement cette aide au réveil.',
      },
      {
        type: 'text',
        content: 'Ce besoin d\'aide n\'est pas un "défaut" : c\'est une réponse normale à l\'immaturité neurologique. Le cerveau de bébé ne sait pas encore que le réveil est temporaire, ni comment retourner vers le sommeil sans signal rassurant.',
      },
      {
        type: 'text',
        content: 'Si vous souhaitez accompagner votre enfant vers plus d\'autonomie, procédez très progressivement : réduisez l\'intensité de l\'aide (bercer moins fort, tétée plus courte), augmentez la distance, laissez quelques secondes avant d\'intervenir.',
      },
      {
        type: 'text',
        content: 'Il n\'y a pas d\'urgence : de nombreux enfants ont besoin d\'aide au rendormissement pendant plusieurs années. L\'essentiel est que cela reste supportable pour vous et respectueux des besoins de votre enfant.',
      },
    ],
    relatedArticles: [
      'pourquoi-bebes-reveillent',
      'endormissement-bras-sein-biberon',
      'endormissement-dependant',
      'besoin-presence-dormir',
      'reveils-heures-fixes',
    ],
  },
  'reveils-stress-surfatigue': {
    id: 'reveils-stress-surfatigue',
    title: 'Réveils liés au stress et à la sur-fatigue',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Paradoxalement, la sur-fatigue ne fait pas mieux dormir : elle génère au contraire plus de réveils nocturnes. Le cortisol, hormone du stress et de l\'éveil, en est responsable.',
      },
      {
        type: 'text',
        content: 'Quand bébé accumule de la fatigue sans pouvoir la compenser par du sommeil, son organisme sécrète du cortisol pour lui permettre de "tenir". Ce cortisol reste élevé pendant la nuit et fragmente le sommeil.',
      },
      {
        type: 'text',
        content: 'Les réveils liés au cortisol sont souvent multiples, agités, avec difficulté à se rendormir. Bébé peut pleurer intensément, être inconsolable, mettre 30 minutes à 1 heure pour se rendormir.',
      },
      {
        type: 'text',
        content: 'Le stress émotionnel (séparation, changement, tension familiale) active aussi le cortisol et crée les mêmes effets : sommeil fragmenté, réveils fréquents, difficulté à lâcher prise.',
      },
      {
        type: 'text',
        content: 'Pour réduire ces réveils, il faut casser le cercle vicieux : respecter les temps d\'éveil, coucher bébé dès les premiers signes de fatigue, créer un environnement calme, et accepter que le sommeil se répare progressivement.',
      },
    ],
    relatedArticles: [
      'stress-cortisol-sommeil',
      'cercle-vicieux-reveils',
      'enfant-trop-fatigue',
      'cortisol-bloque-endormissement',
      'temps-eveil-essentiels',
    ],
  },
  'cercle-vicieux-reveils': {
    id: 'cercle-vicieux-reveils',
    title: 'Le cercle vicieux des réveils nocturnes',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les réveils nocturnes peuvent créer un cercle vicieux difficile à briser : moins bébé dort, plus il se réveille, moins il dort, et ainsi de suite.',
      },
      {
        type: 'text',
        content: 'Le mécanisme est le suivant : les réveils nocturnes créent une dette de sommeil → la dette augmente le cortisol → le cortisol fragmente le sommeil → plus de réveils nocturnes → dette qui s\'aggrave.',
      },
      {
        type: 'text',
        content: 'Ce cercle vicieux s\'auto-entretient et peut durer des semaines, voire des mois, si rien n\'est fait pour le briser. Les parents épuisés tentent des solutions qui parfois aggravent la situation (couchers plus tardifs, suppression de siestes).',
      },
      {
        type: 'text',
        content: 'Pour sortir de ce cercle, il faut contre-intuitivement favoriser PLUS de sommeil : coucher plus tôt, respecter strictement les temps d\'éveil, préserver les siestes, créer un environnement optimal.',
      },
      {
        type: 'text',
        content: 'La récupération prend du temps : il faut parfois 1 à 2 semaines de sommeil protégé pour que le cortisol baisse et que le sommeil se consolide. Patience et régularité sont essentiels.',
      },
    ],
    relatedArticles: [
      'reveils-stress-surfatigue',
      'stress-cortisol-sommeil',
      'enfant-trop-fatigue',
      'besoins-sommeil-age',
      'sommeil-jour-influence-nuit',
    ],
  },
};
