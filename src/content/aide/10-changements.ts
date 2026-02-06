import { ArticlePreview, ArticleContent } from './types';

export const CHANGEMENTS_PREVIEWS: ArticlePreview[] = [
  {
    id: 'regressions-sommeil-mythe-realite',
    category: 'sommeil',
    title: 'Régressions du sommeil : mythe ou réalité ?',
    description: 'Comprendre les changements soudains de sommeil',
    illustration: '🔄',
    color: '#E8D5C4',
  },
  {
    id: 'maladie-dents-sommeil',
    category: 'sante',
    title: 'Maladie, dents et sommeil',
    description: 'L\'impact des poussées dentaires et maladies',
    illustration: 'cross.case.fill',
    color: '#D4C5B4',
  },
  {
    id: 'creche-ecole-troubles',
    category: 'sommeil',
    title: 'Crèche, école et troubles du sommeil',
    description: 'Les adaptations et leurs impacts',
    illustration: '🏫',
    color: '#C4B5A4',
  },
  {
    id: 'vacances-deplacements-decalages',
    category: 'sommeil',
    title: 'Vacances, déplacements et décalages',
    description: 'Gérer les changements d\'environnement',
    illustration: '✈️',
    color: '#B4A594',
  },
  {
    id: 'periodes-sensibles',
    category: 'developpement',
    title: 'Les périodes sensibles du développement',
    description: 'Pics de croissance, acquisitions, bonds développementaux',
    illustration: '🌱',
    color: '#A49584',
  },
];

export const CHANGEMENTS_CONTENT: Record<string, ArticleContent> = {
  'regressions-sommeil-mythe-realite': {
    id: 'regressions-sommeil-mythe-realite',
    title: 'Régressions du sommeil : mythe ou réalité ?',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Le terme "régression du sommeil" est très utilisé, souvent à tort. Il désigne une détérioration soudaine du sommeil chez un enfant qui "dormait bien". Mais ces "régressions" sont-elles réelles ou un concept marketing ?',
      },
      {
        type: 'text',
        content: 'La réalité : le sommeil des bébés et jeunes enfants n\'est jamais linéaire. Il évolue en vagues, avec des périodes plus faciles et d\'autres plus difficiles. Ces variations sont normales et liées au développement cérébral, pas à une "régression".',
      },
      {
        type: 'text',
        content: 'Les périodes souvent citées (4 mois, 8 mois, 12 mois, 18 mois, 2 ans) correspondent à des étapes développementales majeures : maturation des cycles de sommeil, angoisse de séparation, acquisition de la marche, langage, opposition.',
      },
      {
        type: 'text',
        content: 'Pendant ces périodes, le cerveau est en ébullition : il traite de nouvelles compétences, ce qui peut fragmenter le sommeil. Ce n\'est pas une régression mais une progression : bébé évolue, son sommeil s\'ajuste.',
      },
      {
        type: 'text',
        content: 'Au lieu de chercher à "corriger" ces phases, accompagnez-les : présence rassurante, routine stable, patience. La plupart se résorbent spontanément en 2-6 semaines avec la maturation.',
      },
    ],
    relatedArticles: [
      'periodes-sensibles',
      'angoisses-separation-sommeil',
      'comment-fonctionne-sommeil',
      'besoins-sommeil-age',
      'cercle-vicieux-reveils',
    ],
  },
  'maladie-dents-sommeil': {
    id: 'maladie-dents-sommeil',
    title: 'Maladie, dents et sommeil',
    category: 'sante',
    sections: [
      {
        type: 'text',
        content: 'Les maladies (rhume, otite, gastro, fièvre) et les poussées dentaires perturbent fréquemment le sommeil. L\'inconfort physique empêche l\'endormissement et multiplie les réveils nocturnes.',
      },
      {
        type: 'text',
        content: 'Pendant ces périodes, il est normal et nécessaire de répondre davantage aux besoins de bébé : présence, câlins, médication si besoin. Votre enfant souffre : le laisser pleurer serait contre-productif et cruel.',
      },
      {
        type: 'text',
        content: 'Les dents : toutes les difficultés de sommeil ne sont pas liées aux dents. Les poussées dentaires créent un inconfort réel mais localisé (gencives gonflées, rouges, bave excessive). Cet inconfort dure 2-5 jours par dent, pas des semaines.',
      },
      {
        type: 'text',
        content: 'Si le sommeil reste perturbé au-delà de la phase aiguë (7-10 jours après guérison), il ne s\'agit plus de la maladie/dents mais d\'habitudes prises pendant cette période. Le cerveau a créé de nouvelles associations.',
      },
      {
        type: 'text',
        content: 'Pour revenir au rythme habituel, reprenez progressivement votre routine pré-maladie : horaires réguliers, rituels, réponses cohérentes. Le sommeil se recale en quelques jours à quelques semaines.',
      },
    ],
    relatedArticles: [
      'inconfort-digestif-reveils',
      'quand-sinquieter',
      'pleurs-fatigue-vs-souffrance',
      'reveils-frequents-sommeil-faim-inconfort',
      'periodes-sensibles',
    ],
  },
  'creche-ecole-troubles': {
    id: 'creche-ecole-troubles',
    title: 'Crèche, école et troubles du sommeil',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'L\'entrée à la crèche ou à l\'école est un bouleversement majeur pour l\'enfant : séparation, nouveau rythme, nouveaux adultes, stimulations intenses. Le sommeil en est souvent impacté, temporairement ou durablement.',
      },
      {
        type: 'text',
        content: 'Les premières semaines d\'adaptation sont épuisantes : bébé est sur-stimulé, stressé par les séparations, confronté à de nouveaux microbes. Il accumule de la fatigue, ce qui paradoxalement dégrade le sommeil (cortisol élevé).',
      },
      {
        type: 'text',
        content: 'Les manifestations fréquentes : endormissements difficiles, réveils nocturnes, réveils matinaux précoces, refus de sieste à la crèche (puis épuisement en fin de journée), pleurs intenses au retour à la maison.',
      },
      {
        type: 'text',
        content: 'Pour aider votre enfant : avancez l\'heure du coucher (compenser la dette diurne), maintenez une routine stable et rassurante, multipliez les moments de connexion (câlins, jeux calmes), acceptez une phase d\'ajustement de 4-8 semaines.',
      },
      {
        type: 'text',
        content: 'Si les troubles persistent au-delà de 2-3 mois, cherchez d\'autres causes : rythme de la crèche inadapté (siestes trop courtes/tardives), sur-stimulation permanente, anxiété de séparation non résolue.',
      },
    ],
    relatedArticles: [
      'angoisses-separation-sommeil',
      'enfant-trop-fatigue',
      'stress-cortisol-sommeil',
      'cercle-vicieux-reveils',
      'periodes-sensibles',
    ],
  },
  'vacances-deplacements-decalages': {
    id: 'vacances-deplacements-decalages',
    title: 'Vacances, déplacements et décalages',
    category: 'sommeil',
    sections: [
      {
        type: 'text',
        content: 'Les changements d\'environnement (vacances, déménagement, nuit chez les grands-parents) perturbent souvent le sommeil des jeunes enfants. Nouveau lit, nouvelles odeurs, nouveaux bruits : autant d\'éléments déstabilisants.',
      },
      {
        type: 'text',
        content: 'Les décalages horaires (voyages) dérèglent l\'horloge biologique : l\'organisme met 1 jour par heure de décalage pour se recaler. Un décalage de 6h nécessite donc environ 6 jours d\'adaptation.',
      },
      {
        type: 'text',
        content: 'Pendant les vacances, les horaires sont souvent décalés (couchers plus tardifs, siestes manquées, rythme irrégulier). Le retour à la maison peut être difficile : bébé a perdu ses repères et résiste au recadrage.',
      },
      {
        type: 'text',
        content: 'Stratégies pour limiter l\'impact : apporter des objets familiers (doudou, gigoteuse, mobile musical), maintenir autant que possible la routine habituelle, obscurcir la chambre, accepter une phase d\'adaptation.',
      },
      {
        type: 'text',
        content: 'Au retour de vacances, recalez progressivement les horaires : avancez ou reculez de 15-30 minutes par jour jusqu\'à retrouver le rythme habituel. Soyez patient : cela prend 3-7 jours selon l\'ampleur du décalage.',
      },
    ],
    relatedArticles: [
      'comment-fonctionne-sommeil',
      'temps-eveil-essentiels',
      'enfant-trop-fatigue',
      'fenetre-sommeil',
      'cercle-vicieux-reveils',
    ],
  },
  'periodes-sensibles': {
    id: 'periodes-sensibles',
    title: 'Les périodes sensibles du développement',
    category: 'developpement',
    sections: [
      {
        type: 'text',
        content: 'Le développement de l\'enfant n\'est pas linéaire : il progresse par bonds, avec des phases d\'acquisition intense suivies de phases de consolidation. Ces "périodes sensibles" impactent souvent le sommeil.',
      },
      {
        type: 'text',
        content: 'Exemples de périodes sensibles : maturation des cycles de sommeil (4 mois), angoisse de séparation (8-10 mois, 18 mois), acquisition de la marche (10-14 mois), explosion du langage (18-24 mois), phase d\'opposition (2 ans).',
      },
      {
        type: 'text',
        content: 'Pendant ces phases, le cerveau travaille intensément : il traite, intègre, consolide de nouvelles compétences. Cette activité cérébrale peut fragmenter le sommeil, provoquer des réveils, des difficultés d\'endormissement.',
      },
      {
        type: 'text',
        content: 'Les manifestations : bébé s\'exerce la nuit (se met debout dans son lit, babille, rampe), dort moins bien, semble "régresser" dans ses acquis de sommeil. C\'est temporaire : le cerveau doit intégrer les nouveautés.',
      },
      {
        type: 'text',
        content: 'Comment accompagner : patience, présence rassurante, routine stable, absence de changement majeur pendant ces phases (sevrage, déménagement, changement de mode de garde). La plupart se résorbent en 2-6 semaines.',
      },
    ],
    relatedArticles: [
      'regressions-sommeil-mythe-realite',
      'angoisses-separation-sommeil',
      'comment-fonctionne-sommeil',
      'besoins-sommeil-age',
      'stress-cortisol-sommeil',
    ],
  },
};
