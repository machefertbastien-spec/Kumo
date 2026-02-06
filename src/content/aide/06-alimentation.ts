import { ArticlePreview, ArticleContent } from './types';

export const ALIMENTATION_PREVIEWS: ArticlePreview[] = [
  {
    id: 'faim-nocturne-reelle-non',
    category: 'alimentation',
    title: 'Faim nocturne : réelle ou non ?',
    description: 'Distinguer les vrais besoins nutritionnels des habitudes',
    illustration: '🍼',
    color: '#E8D5C4',
  },
  {
    id: 'reveils-lies-alimentation',
    category: 'alimentation',
    title: 'Réveils liés à l\'alimentation',
    description: 'Quand les besoins alimentaires perturbent le sommeil',
    illustration: '🍽️',
    color: '#D4C5B4',
  },
  {
    id: 'repartition-apports-24h',
    category: 'alimentation',
    title: 'Répartition des apports sur 24h',
    description: 'Équilibrer jour et nuit pour réduire les réveils',
    illustration: '⏰',
    color: '#C4B5A4',
  },
  {
    id: 'inconfort-digestif-reveils',
    category: 'alimentation',
    title: 'Inconfort digestif et réveils',
    description: 'RGO, coliques, constipation : impact sur le sommeil',
    illustration: '😣',
    color: '#B4A594',
  },
  {
    id: 'diversification-alimentaire-sommeil',
    category: 'alimentation',
    title: 'Diversification alimentaire et sommeil',
    description: 'L\'introduction des solides améliore-t-elle les nuits ?',
    illustration: '🥄',
    color: '#A49584',
  },
  {
    id: 'alimentation-perturbe-endormissement',
    category: 'alimentation',
    title: 'Quand l\'alimentation perturbe l\'endormissement',
    description: 'Digestion difficile, inconfort, timing inadapté',
    illustration: '🌙',
    color: '#948574',
  },
];

export const ALIMENTATION_CONTENT: Record<string, ArticleContent> = {
  'faim-nocturne-reelle-non': {
    id: 'faim-nocturne-reelle-non',
    title: 'Faim nocturne : réelle ou non ?',
    category: 'alimentation',
    sections: [
      {
        type: 'text',
        content: 'La faim nocturne est une cause fréquente de réveils chez les jeunes bébés (0-6 mois). Après 6 mois, la majorité des bébés peuvent physiologiquement dormir 11-12h sans manger, mais certains conservent un besoin réel plus longtemps.',
      },
      {
        type: 'text',
        content: 'Distinguer faim réelle et habitude : la faim réelle survient après un délai raisonnable (4-6h minimum), bébé tète vigoureusement, prend une quantité significative, se rendort rapidement. L\'habitude : réveil systématique à heure fixe, tétée courte/faible, difficultés de rendormissement.',
      },
      {
        type: 'text',
        content: 'Les réveils de faim nocturne peuvent aussi signaler une répartition déséquilibrée des apports : si bébé mange peu le jour (distraction, refus, endormissement au sein), il compensera la nuit.',
      },
      {
        type: 'text',
        content: 'Certains enfants ont des besoins caloriques plus élevés (croissance rapide, métabolisme élevé, activité intense) et maintiennent légitimement des tétées nocturnes au-delà de 6 mois.',
      },
      {
        type: 'text',
        content: 'Si vous souhaitez espacer les tétées nocturnes, vérifiez d\'abord que les apports diurnes sont suffisants, puis réduisez progressivement la durée ou le volume des tétées nocturnes, en surveillant la courbe de croissance.',
      },
    ],
    relatedArticles: [
      'reveils-lies-alimentation',
      'repartition-apports-24h',
      'reveils-frequents-sommeil-faim-inconfort',
      'reveils-heures-fixes',
      'pourquoi-bebes-reveillent',
    ],
  },
  'reveils-lies-alimentation': {
    id: 'reveils-lies-alimentation',
    title: 'Réveils liés à l\'alimentation',
    category: 'alimentation',
    sections: [
      {
        type: 'text',
        content: 'Les réveils liés à l\'alimentation peuvent avoir plusieurs origines : faim réelle (besoin calorique), inconfort digestif (RGO, coliques), association d\'endormissement (sein/biberon pour se rendormir), ou habitude acquise.',
      },
      {
        type: 'text',
        content: 'Avant 4-6 mois, la plupart des bébés ont besoin de manger 1 à 3 fois la nuit. C\'est physiologique : leur estomac est petit, leur métabolisme rapide, et le lait maternel/infantile se digère vite.',
      },
      {
        type: 'text',
        content: 'Entre 6 et 12 mois, les besoins nocturnes diminuent progressivement. Certains bébés s\'auto-régulent spontanément (espacent puis suppriment), d\'autres maintiennent l\'habitude même sans besoin physiologique.',
      },
      {
        type: 'text',
        content: 'Si bébé se réveille systématiquement toutes les 1-2h pour téter quelques minutes, il s\'agit probablement d\'une association d\'endormissement plutôt que de faim : il utilise le sein/biberon comme aide au rendormissement.',
      },
      {
        type: 'text',
        content: 'Pour faire évoluer les réveils alimentaires, travaillez sur deux axes : rééquilibrer les apports diurnos (augmenter les calories de jour), et dissocier progressivement alimentation et endormissement (décaler la tétée du moment du coucher).',
      },
    ],
    relatedArticles: [
      'faim-nocturne-reelle-non',
      'repartition-apports-24h',
      'endormissement-bras-sein-biberon',
      'difficulte-rendormir-seul',
      'reveils-heures-fixes',
    ],
  },
  'repartition-apports-24h': {
    id: 'repartition-apports-24h',
    title: 'Répartition des apports sur 24h',
    category: 'alimentation',
    sections: [
      {
        type: 'text',
        content: 'Les bébés ont besoin d\'un certain nombre de calories sur 24h. Si ces calories ne sont pas prises le jour, elles seront compensées la nuit. C\'est un mécanisme de survie : bébé ne se laisse pas mourir de faim.',
      },
      {
        type: 'text',
        content: 'Certains bébés "inversent" leur alimentation : ils mangent peu le jour (distractions, endormissement au sein, refus) et se rattrapent la nuit. Ce schéma s\'auto-entretient si rien n\'est fait.',
      },
      {
        type: 'text',
        content: 'Pour rééquilibrer, augmentez les apports diurnes : proposez des tétées/biberons dans un environnement calme, évitez l\'endormissement systématique au sein, proposez des repas solides copieux (après 6 mois), limitez les grignotages.',
      },
      {
        type: 'text',
        content: 'En parallèle, réduisez progressivement les apports nocturnes : diminuez la durée des tétées, diluez le biberon, allongez l\'intervalle entre deux tétées. Bébé compensera naturellement en mangeant plus le jour.',
      },
      {
        type: 'text',
        content: 'Ce rééquilibrage prend 5 à 10 jours. Il est normal que bébé proteste au début : il ne comprend pas pourquoi ses habitudes changent. Restez cohérent, rassurant, et surveillez la courbe de poids.',
      },
    ],
    relatedArticles: [
      'faim-nocturne-reelle-non',
      'reveils-lies-alimentation',
      'diversification-alimentaire-sommeil',
      'endormissement-bras-sein-biberon',
      'besoins-sommeil-age',
    ],
  },
  'inconfort-digestif-reveils': {
    id: 'inconfort-digestif-reveils',
    title: 'Inconfort digestif et réveils',
    category: 'alimentation',
    sections: [
      {
        type: 'text',
        content: 'Les troubles digestifs sont une cause fréquente de réveils nocturnes, surtout chez les tout-petits. Le reflux gastro-œsophagien (RGO), les coliques, les gaz, la constipation créent un inconfort qui fragmente le sommeil.',
      },
      {
        type: 'text',
        content: 'Le RGO provoque des remontées acides qui brûlent l\'œsophage, surtout en position allongée. Bébé se réveille en pleurant, se cambre, refuse d\'être posé à plat. Les réveils sont souvent 30-45 minutes après l\'endormissement (digestion en cours).',
      },
      {
        type: 'text',
        content: 'Les coliques (pleurs intenses en fin de journée/soirée) et les gaz créent des douleurs abdominales qui rendent l\'endormissement et le sommeil difficiles. Bébé se tortille, ramène ses jambes sur le ventre, pleure intensément.',
      },
      {
        type: 'text',
        content: 'La constipation génère un inconfort permanent : bébé peine à se détendre, grogne, pousse pendant le sommeil. Les selles dures et rares signalent le problème.',
      },
      {
        type: 'text',
        content: 'En cas d\'inconfort digestif récurrent, consultez un professionnel de santé. Des solutions existent : traitement du RGO, adaptation de l\'alimentation (lait, diversification), fractionnement des repas, position surélevée.',
      },
    ],
    relatedArticles: [
      'reveils-frequents-sommeil-faim-inconfort',
      'pourquoi-bebes-reveillent',
      'pleurs-fatigue-vs-souffrance',
      'comprendre-pleurs-bebe',
      'quand-sinquieter',
    ],
  },
  'diversification-alimentaire-sommeil': {
    id: 'diversification-alimentaire-sommeil',
    title: 'Diversification alimentaire et sommeil',
    category: 'alimentation',
    sections: [
      {
        type: 'text',
        content: 'C\'est une croyance répandue : "dès que bébé mangera solide, il fera ses nuits". En réalité, la diversification alimentaire n\'a pas d\'impact direct et immédiat sur le sommeil.',
      },
      {
        type: 'text',
        content: 'Les réveils nocturnes après 6 mois sont rarement liés à la faim seule. Ils sont surtout causés par l\'immaturité du sommeil, les associations d\'endormissement, la sur-fatigue, l\'anxiété de séparation.',
      },
      {
        type: 'text',
        content: 'Introduire les solides (purées, compotes) peut indirectement aider si bébé avait une réelle faim nocturne : les solides sont plus "lourds" et tiennent plus longtemps que le lait. Mais l\'effet n\'est pas magique.',
      },
      {
        type: 'text',
        content: 'Attention à ne pas diversifier trop tôt dans l\'espoir d\'améliorer le sommeil : avant 4-6 mois, le système digestif de bébé n\'est pas prêt. Cela peut créer au contraire des inconforts digestifs qui fragmentent le sommeil.',
      },
      {
        type: 'text',
        content: 'Si vous diversifiez dans les règles (entre 4 et 6 mois, un aliment à la fois, texture adaptée) et que le sommeil s\'améliore, c\'est probablement lié à la maturation neurologique de bébé plutôt qu\'aux solides.',
      },
    ],
    relatedArticles: [
      'faim-nocturne-reelle-non',
      'repartition-apports-24h',
      'besoins-sommeil-age',
      'pourquoi-bebes-reveillent',
      'inconfort-digestif-reveils',
    ],
  },
  'alimentation-perturbe-endormissement': {
    id: 'alimentation-perturbe-endormissement',
    title: 'Quand l\'alimentation perturbe l\'endormissement',
    category: 'alimentation',
    sections: [
      {
        type: 'text',
        content: 'Le timing et la composition du dernier repas peuvent influencer l\'endormissement. Une digestion difficile, un inconfort, ou un repas inadapté retardent l\'endormissement et fragmentent le début de nuit.',
      },
      {
        type: 'text',
        content: 'Un repas trop copieux le soir demande une digestion intense qui maintient le corps en activité. À l\'inverse, un repas trop léger peut laisser bébé avec une sensation de faim qui l\'empêche de s\'endormir.',
      },
      {
        type: 'text',
        content: 'Certains aliments sont plus difficiles à digérer : les protéines animales, les légumes riches en fibres, les plats gras. Proposés le soir, ils peuvent créer un inconfort. Privilégiez des repas légers et digestes.',
      },
      {
        type: 'text',
        content: 'Le moment du dernier repas compte aussi : trop proche du coucher (moins de 30 minutes), la digestion est en cours et gêne l\'endormissement. Trop éloigné (plus de 2h), bébé peut avoir faim.',
      },
      {
        type: 'text',
        content: 'L\'idéal : un repas équilibré et digeste 1h à 1h30 avant le coucher, suivi d\'une petite tétée/biberon "de confort" juste avant la mise au lit (si cela fait partie de votre routine).',
      },
    ],
    relatedArticles: [
      'temps-endormissement-long',
      'pleurs-moment-coucher',
      'inconfort-digestif-reveils',
      'repartition-apports-24h',
      'endormissement-bras-sein-biberon',
    ],
  },
};
