import { ArticlePreview, ArticleContent } from './types';

export const PLEURS_PREVIEWS: ArticlePreview[] = [
  {
    id: 'comprendre-pleurs-bebe',
    category: 'developpement',
    title: 'Comprendre les pleurs de bébé',
    description: 'Les pleurs comme moyen de communication',
    illustration: '😢',
    color: '#E8D5C4',
  },
  {
    id: 'pleurs-fatigue-vs-souffrance',
    category: 'developpement',
    title: 'Pleurs de fatigue vs pleurs de souffrance',
    description: 'Différencier les types de pleurs',
    illustration: '🔍',
    color: '#D4C5B4',
  },
  {
    id: 'pleurs-manque-sommeil',
    category: 'sommeil',
    title: 'Pleurs liés au manque de sommeil',
    description: 'Quand la fatigue génère des pleurs intenses',
    illustration: '😫',
    color: '#C4B5A4',
  },
  {
    id: 'pleurs-decharge-stress',
    category: 'developpement',
    title: 'Les pleurs de décharge de stress',
    description: 'Pleurer pour évacuer les tensions',
    illustration: '💨',
    color: '#B4A594',
  },
  {
    id: 'quand-sinquieter',
    category: 'sante',
    title: 'Quand s\'inquiéter des pleurs ?',
    description: 'Reconnaître les pleurs pathologiques',
    illustration: 'exclamationmark.triangle.fill',
    color: '#A49584',
  },
  {
    id: 'cauchemars-age',
    category: 'sommeil',
    title: 'Cauchemars et terreurs nocturnes selon l\'âge',
    description: 'Comprendre et accompagner ces manifestations',
    illustration: '😱',
    color: '#948574',
  },
];

export const PLEURS_CONTENT: Record<string, ArticleContent> = {
  'comprendre-pleurs-bebe': {
    id: 'comprendre-pleurs-bebe',
    title: 'Comprendre les pleurs de bébé',
    category: 'developpement',
    sections: [
      {
        type: 'text',
        content: 'Les pleurs sont le principal moyen de communication des bébés. Ils ne savent ni parler, ni signaler leurs besoins autrement : pleurer est leur seule option pour exprimer un inconfort, une émotion, un besoin.',
      },
      {
        type: 'text',
        content: 'Les bébés pleurent pour de multiples raisons : faim, fatigue, couche sale, froid/chaud, douleur, inconfort digestif, sur-stimulation, besoin de contact, peur, frustration. Un même bébé peut pleurer 1h à 3h par jour, c\'est dans la norme.',
      },
      {
        type: 'text',
        content: 'Contrairement aux idées reçues, les bébés ne pleurent jamais "pour rien" ou "par caprice". Même si la cause vous échappe, il y a toujours une raison : parfois évidente (faim), parfois plus subtile (besoin de décharge émotionnelle).',
      },
      {
        type: 'text',
        content: 'Répondre aux pleurs ne "rend pas l\'enfant capricieux" : au contraire, cela construit son sentiment de sécurité. Un bébé dont les pleurs sont entendus et apaisés développe un attachement sécure et pleure moins à long terme.',
      },
      {
        type: 'text',
        content: 'Avec le temps, vous apprendrez à différencier les types de pleurs : faim (insistant, rythmé), fatigue (geignard, crescendo), douleur (aigu, soudain), décharge (intense mais apaisant une fois accompagné).',
      },
    ],
    relatedArticles: [
      'pleurs-fatigue-vs-souffrance',
      'pleurs-manque-sommeil',
      'pleurs-decharge-stress',
      'quand-sinquieter',
      'pleurs-moment-coucher',
    ],
  },
  'pleurs-fatigue-vs-souffrance': {
    id: 'pleurs-fatigue-vs-souffrance',
    title: 'Pleurs de fatigue vs pleurs de souffrance',
    category: 'developpement',
    sections: [
      {
        type: 'text',
        content: 'Différencier les pleurs de fatigue des pleurs de souffrance est crucial pour y répondre de manière adaptée. Les confondre peut générer stress et interventions inadaptées.',
      },
      {
        type: 'text',
        content: 'Pleurs de fatigue : geignements qui montent en intensité, bébé frotte ses yeux, bâille, détourne le regard, se cambre. Ces pleurs signalent "je suis fatigué mais je n\'arrive pas à lâcher prise". Votre présence calme et apaisante aide.',
      },
      {
        type: 'text',
        content: 'Pleurs de souffrance : aigus, soudains, intenses dès le départ. Bébé peut se raidir, avoir le visage crispé, refuser d\'être consolé. Ces pleurs signalent une douleur physique (otite, RGO, coliques, blessure).',
      },
      {
        type: 'text',
        content: 'Les pleurs de fatigue s\'apaisent progressivement une fois bébé endormi (ou en voie d\'endormissement). Les pleurs de souffrance persistent même quand bébé est calé, bercé, nourri : la douleur sous-jacente reste.',
      },
      {
        type: 'text',
        content: 'En cas de doute, fiez-vous à votre instinct. Si vous sentez que "quelque chose ne va pas", consultez. Mieux vaut une consultation rassurante qu\'une douleur non prise en charge.',
      },
    ],
    relatedArticles: [
      'comprendre-pleurs-bebe',
      'quand-sinquieter',
      'pleurs-manque-sommeil',
      'inconfort-digestif-reveils',
      'pleurs-moment-coucher',
    ],
  },
  'pleurs-manque-sommeil': {
    id: 'pleurs-manque-sommeil',
    title: 'Pleurs liés au manque de sommeil',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Le manque de sommeil est une cause majeure de pleurs intenses chez les bébés et jeunes enfants. Un enfant en dette de sommeil pleure plus facilement, plus longtemps, et pour des raisons qui ne le feraient pas pleurer s\'il était reposé.',
      },
      {
        type: 'text',
        content: 'La sur-fatigue augmente le cortisol, qui rend bébé irritable, hyper-réactif, incapable de se réguler émotionnellement. Le moindre stimulus (frustration, changement, attente) déclenche des pleurs intenses.',
      },
      {
        type: 'text',
        content: 'Les pleurs liés à la fatigue sont souvent en fin de journée ("heure sorcière" entre 17h et 21h), après une journée riche en stimulations et pauvre en sommeil. Bébé accumule les tensions et les évacue par des pleurs.',
      },
      {
        type: 'text',
        content: 'Ces pleurs peuvent sembler inconsolables : vous avez tout essayé (nourrir, bercer, changer, câliner) et rien ne marche. C\'est normal : le besoin sous-jacent est le sommeil, et seul le sommeil peut l\'apaiser durablement.',
      },
      {
        type: 'text',
        content: 'Pour réduire ces pleurs, travaillez en amont : respectez les temps d\'éveil, protégez les siestes, couchez bébé dès les premiers signes de fatigue. Un bébé reposé pleure beaucoup moins.',
      },
    ],
    relatedArticles: [
      'enfant-trop-fatigue',
      'stress-cortisol-sommeil',
      'pleurs-decharge-stress',
      'temps-eveil-essentiels',
      'cercle-vicieux-reveils',
    ],
  },
  'pleurs-decharge-stress': {
    id: 'pleurs-decharge-stress',
    title: 'Les pleurs de décharge de stress',
    category: 'developpement',
    sections: [
      {
        type: 'text',
        content: 'Les pleurs de décharge sont un mécanisme naturel d\'évacuation des tensions accumulées. Bébé "décharge" le stress de la journée (stimulations, frustrations, séparations) en pleurant dans vos bras.',
      },
      {
        type: 'text',
        content: 'Ces pleurs surviennent souvent en fin de journée ou au moment du coucher : bébé a besoin de "vider son sac" avant de pouvoir lâcher prise et s\'endormir. Les tentatives de distraction ne fonctionnent pas : il a besoin de pleurer.',
      },
      {
        type: 'text',
        content: 'Pleurer en présence d\'un adulte sécurisant active le système nerveux parasympathique (détente) et libère des hormones apaisantes. C\'est un processus de régulation émotionnelle indispensable.',
      },
      {
        type: 'text',
        content: 'Votre rôle n\'est pas d\'arrêter ces pleurs à tout prix, mais d\'accueillir l\'émotion : tenir bébé, parler doucement, accepter ses pleurs sans paniquer. Votre calme l\'aide à traverser la tempête émotionnelle.',
      },
      {
        type: 'text',
        content: 'Après ces pleurs, bébé est souvent beaucoup plus calme, détendu, prêt à s\'endormir. Si vous empêchez systématiquement ces décharges (distraction, agitation), les tensions restent et génèrent réveils nocturnes et irritabilité.',
      },
    ],
    relatedArticles: [
      'comprendre-pleurs-bebe',
      'pleurs-manque-sommeil',
      'pleurs-moment-coucher',
      'stress-cortisol-sommeil',
      'enfant-trop-fatigue',
    ],
  },
  'quand-sinquieter': {
    id: 'quand-sinquieter',
    title: 'Quand s\'inquiéter des pleurs ?',
    category: 'sante',
    sections: [
      {
        type: 'text',
        content: 'La plupart des pleurs sont bénins et correspondent à des besoins normaux. Mais certains signaux doivent vous alerter et justifier une consultation médicale.',
      },
      {
        type: 'text',
        content: 'Consultez rapidement si : pleurs aigus, perçants, inhabituels (dits "pleurs neurologiques"), pleurs inconsolables pendant plus de 3 heures d\'affilée, pleurs associés à de la fièvre, des vomissements, une diarrhée, un refus de s\'alimenter.',
      },
      {
        type: 'text',
        content: 'Autres signaux d\'alerte : bébé très mou (hypotonique) ou au contraire très raide, teint pâle ou grisâtre, fontanelle bombée, gémissements continus même endormi, pleurs systématiques à la manipulation d\'un membre (fracture ?).',
      },
      {
        type: 'text',
        content: 'Faites confiance à votre instinct parental : si vous sentez que "ce n\'est pas normal", même sans symptôme précis, consultez. Les professionnels préfèrent une consultation rassurante à un problème non détecté.',
      },
      {
        type: 'text',
        content: 'Les pleurs excessifs peuvent aussi signaler : un RGO sévère, une allergie alimentaire, une otite, une infection urinaire, un inconfort digestif chronique. Ces pathologies nécessitent une prise en charge médicale.',
      },
    ],
    relatedArticles: [
      'comprendre-pleurs-bebe',
      'pleurs-fatigue-vs-souffrance',
      'inconfort-digestif-reveils',
      'maladie-dents-sommeil',
      'pleurs-decharge-stress',
    ],
  },
  'cauchemars-age': {
    id: 'cauchemars-age',
    title: 'Cauchemars et terreurs nocturnes selon l\'âge',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les cauchemars et terreurs nocturnes sont deux phénomènes distincts qui peuvent perturber le sommeil. Les distinguer permet de mieux y répondre.',
      },
      {
        type: 'text',
        content: 'Cauchemars : mauvais rêves qui surviennent en sommeil paradoxal (seconde moitié de nuit). L\'enfant se réveille effrayé, pleure, se souvient du rêve, recherche du réconfort. Ils apparaissent vers 18-24 mois quand l\'imaginaire se développe.',
      },
      {
        type: 'text',
        content: 'Terreurs nocturnes : crises de panique en sommeil profond (première moitié de nuit). L\'enfant hurle, semble réveillé mais ne l\'est pas, ne vous reconnaît pas, repousse le réconfort. Il ne se souvient de rien au réveil.',
      },
      {
        type: 'text',
        content: 'Les terreurs nocturnes sont plus fréquentes chez l\'enfant en dette de sommeil : la sur-fatigue crée des "réveils confusionnels" entre deux cycles. Elles disparaissent avec la maturation et un sommeil restauré.',
      },
      {
        type: 'text',
        content: 'En cas de cauchemar : rassurez, câlinez, verbalisez ("c\'était un rêve, ce n\'est pas réel"), laissez une veilleuse si besoin. En cas de terreur nocturne : ne réveillez pas, restez à proximité pour la sécurité, attendez que ça passe (5-15 minutes).',
      },
    ],
    relatedArticles: [
      'comment-fonctionne-sommeil',
      'enfant-trop-fatigue',
      'stress-cortisol-sommeil',
      'periodes-sensibles',
      'angoisses-separation-sommeil',
    ],
  },
};
