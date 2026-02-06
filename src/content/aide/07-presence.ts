import { ArticlePreview, ArticleContent } from './types';

export const PRESENCE_PREVIEWS: ArticlePreview[] = [
  {
    id: 'besoin-presence-dormir',
    category: 'sommeil',
    title: 'Le besoin de présence pour dormir',
    description: 'Pourquoi bébé a besoin de vous pour s\'endormir et dormir',
    illustration: '🤗',
    color: '#E8D5C4',
  },
  {
    id: 'endormissement-dependant',
    category: 'sommeil',
    title: 'Endormissement dépendant de votre présence',
    description: 'Comprendre et accompagner ce besoin légitime',
    illustration: '👨‍👩‍👧',
    color: '#D4C5B4',
  },
  {
    id: 'reveils-lies-separation',
    category: 'sommeil',
    title: 'Réveils liés à la séparation',
    description: 'Quand l\'absence de parent réveille bébé',
    illustration: '💔',
    color: '#C4B5A4',
  },
  {
    id: 'angoisses-separation-sommeil',
    category: 'sommeil',
    title: 'Angoisses de séparation et sommeil',
    description: 'Le pic de 8-10 mois et ses impacts',
    illustration: '😰',
    color: '#B4A594',
  },
  {
    id: 'refuse-etre-pose',
    category: 'sommeil',
    title: 'Bébé refuse d\'être posé',
    description: 'Le sommeil au contact permanent',
    illustration: '🛏️',
    color: '#A49584',
  },
];

export const PRESENCE_CONTENT: Record<string, ArticleContent> = {
  'besoin-presence-dormir': {
    id: 'besoin-presence-dormir',
    title: 'Le besoin de présence pour dormir',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Le besoin de présence parentale pour s\'endormir et dormir est biologiquement normal chez les bébés et jeunes enfants. Pendant des millénaires, les bébés humains dormaient au contact de leurs parents pour survivre (protection, chaleur, alimentation).',
      },
      {
        type: 'text',
        content: 'Le cerveau de bébé est programmé pour rechercher la proximité : votre présence régule son rythme cardiaque, sa température, son niveau de stress. L\'absence déclenche une alerte de survie : pleurs, agitation, impossibilité de lâcher prise.',
      },
      {
        type: 'text',
        content: 'Ce besoin n\'est pas un "problème" à résoudre, ni une "mauvaise habitude" à corriger. C\'est un besoin développemental qui évolue naturellement avec la maturation cérébrale et l\'attachement sécure.',
      },
      {
        type: 'text',
        content: 'Certains bébés ont un besoin de proximité plus intense que d\'autres, lié au tempérament, à la sensibilité, au vécu (naissance difficile, séparation précoce). Ce besoin mérite d\'être respecté et accompagné.',
      },
      {
        type: 'text',
        content: 'Si ce besoin vous épuise, vous pouvez le faire évoluer progressivement : présence sans contact, puis distance croissante, puis sortie de la chambre. Mais toujours en respectant le rythme de l\'enfant, sans forcer.',
      },
    ],
    relatedArticles: [
      'endormissement-dependant',
      'reveils-lies-separation',
      'endormissement-bras-sein-biberon',
      'difficulte-rendormir-seul',
      'refuse-etre-pose',
    ],
  },
  'endormissement-dependant': {
    id: 'endormissement-dependant',
    title: 'Endormissement dépendant de votre présence',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'On parle d\'endormissement "dépendant" quand bébé ne peut s\'endormir que dans vos bras, à vos côtés, ou avec votre intervention (bercement, tétée, chanson). Ce schéma est extrêmement fréquent et normal.',
      },
      {
        type: 'text',
        content: 'Cette "dépendance" n\'est pas pathologique : c\'est une réponse à l\'immaturité neurologique. Le cerveau de bébé a besoin de signaux rassurants pour accepter de lâcher prise et basculer dans le sommeil.',
      },
      {
        type: 'text',
        content: 'L\'endormissement dépendant devient problématique uniquement si : vous vivez mal cette situation (épuisement, frustration), les réveils nocturnes sont très fréquents avec besoin systématique de votre intervention, ou cela crée des tensions familiales.',
      },
      {
        type: 'text',
        content: 'Si vous souhaitez faire évoluer vers plus d\'autonomie, procédez par micro-étapes : réduire l\'intensité de l\'aide (bercer moins, tétée plus courte), augmenter la distance (posé dans lit mais main sur le ventre), puis s\'éloigner progressivement.',
      },
      {
        type: 'text',
        content: 'Il n\'y a aucune urgence : de nombreux enfants ont besoin d\'aide à l\'endormissement pendant des années. Tant que cela reste supportable pour vous, il n\'y a aucune raison de changer.',
      },
    ],
    relatedArticles: [
      'besoin-presence-dormir',
      'endormissement-bras-sein-biberon',
      'difficulte-rendormir-seul',
      'reveils-lies-separation',
      'refuse-etre-pose',
    ],
  },
  'reveils-lies-separation': {
    id: 'reveils-lies-separation',
    title: 'Réveils liés à la séparation',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Certains réveils nocturnes sont directement liés à la séparation : bébé se réveille lors d\'un micro-réveil, constate votre absence, et ne peut se rendormir sans vous retrouver.',
      },
      {
        type: 'text',
        content: 'Ce mécanisme est lié au besoin de retrouver les conditions d\'endormissement : si vous étiez présent à l\'endormissement, bébé vous recherche au réveil. Ce n\'est pas un caprice : c\'est un signal de sécurité neurologique.',
      },
      {
        type: 'text',
        content: 'Les réveils de séparation sont particulièrement fréquents lors des périodes d\'angoisse de séparation (8-10 mois, 12-18 mois, 2 ans). Le cerveau devient conscient de votre existence séparée et craint votre disparition.',
      },
      {
        type: 'text',
        content: 'Ces réveils peuvent être multiples (toutes les 1-2h), avec pleurs intenses dès que bébé ouvre les yeux et ne vous voit pas. Votre retour le calme instantanément : preuve que le besoin était émotionnel, pas physiologique.',
      },
      {
        type: 'text',
        content: 'Pour apaiser ces réveils, renforcez la sécurité affective le jour (jeux de cache-cache, explications, câlins), maintenez votre présence rassurante la nuit (sans forcément intervenir immédiatement), et laissez le temps à bébé de dépasser cette phase.',
      },
    ],
    relatedArticles: [
      'angoisses-separation-sommeil',
      'difficulte-rendormir-seul',
      'besoin-presence-dormir',
      'pourquoi-bebes-reveillent',
      'reveils-heures-fixes',
    ],
  },
  'angoisses-separation-sommeil': {
    id: 'angoisses-separation-sommeil',
    title: 'Angoisses de séparation et sommeil',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'L\'angoisse de séparation est une étape développementale normale qui apparaît vers 8-10 mois. Bébé prend conscience que vous existez en dehors de lui, et craint que votre absence soit définitive.',
      },
      {
        type: 'text',
        content: 'Cette phase impacte fortement le sommeil : bébé refuse d\'être posé, pleure dès que vous sortez de son champ de vision, se réveille fréquemment la nuit en vous cherchant. Même un bébé qui "faisait ses nuits" peut recommencer à se réveiller.',
      },
      {
        type: 'text',
        content: 'L\'angoisse de séparation a plusieurs pics : 8-10 mois (la plus intense), 12-18 mois, 2 ans, 3 ans. Entre deux pics, le sommeil peut se réaméliorer spontanément.',
      },
      {
        type: 'text',
        content: 'Pendant ces périodes, forcer l\'autonomie est contre-productif : cela augmente l\'angoisse et aggrave les réveils. Au contraire, combler le besoin de proximité rassure bébé et l\'aide à dépasser cette phase plus rapidement.',
      },
      {
        type: 'text',
        content: 'Stratégies utiles : jouer à cache-cache le jour (pour apprendre que vous revenez toujours), verbaliser vos départs/retours, maintenir une présence rassurante la nuit, éviter les changements majeurs pendant ces phases.',
      },
    ],
    relatedArticles: [
      'reveils-lies-separation',
      'besoin-presence-dormir',
      'regressions-sommeil-mythe-realite',
      'periodes-sensibles',
      'endormissement-dependant',
    ],
  },
  'refuse-etre-pose': {
    id: 'refuse-etre-pose',
    title: 'Bébé refuse d\'être posé',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Certains bébés se réveillent instantanément dès qu\'on les pose dans leur lit, même profondément endormis. Ce "réveil à la pose" est très fréquent et désespère les parents épuisés.',
      },
      {
        type: 'text',
        content: 'Ce réveil est lié à plusieurs facteurs : changement de température (passage des bras chauds au matelas froid), changement de position (horizontal vs vertical), perte du contact rassurant, sensibilité au mouvement.',
      },
      {
        type: 'text',
        content: 'Le réflexe de Moro (réflexe archaïque de chute) peut aussi être en cause : dès que bébé sent qu\'on le pose, son corps déclenche une alerte et il se réveille en sursaut.',
      },
      {
        type: 'text',
        content: 'Stratégies pour faciliter la pose : chauffer le matelas avant (bouillotte retirée ensuite), attendre le sommeil profond (15-20 minutes), poser en gardant les mains sur bébé quelques minutes, emmailloter (avant 3-4 mois).',
      },
      {
        type: 'text',
        content: 'Si rien ne fonctionne, acceptez temporairement que bébé dorme en contact : dans vos bras, en écharpe, en cododo. Ce besoin intense diminue avec la maturation. Forcer génère stress et épuisement pour tous.',
      },
    ],
    relatedArticles: [
      'besoin-presence-dormir',
      'endormissement-bras-sein-biberon',
      'pleurs-moment-coucher',
      'endormissement-dependant',
      'reveils-lies-separation',
    ],
  },
};
