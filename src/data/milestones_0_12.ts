// Développement psychomoteur de 0 à 12 mois - Dataset complet (100 items)

interface MilestoneItem {
  id: string;
  label: string;
  hint?: string;
}

interface MilestoneGroup {
  key: string;
  title: string;
  items: MilestoneItem[];
}

export const MILESTONE_GROUPS: MilestoneGroup[] = [
  {
    key: "0-1",
    title: "0-1 mois",
    items: [
      { id: "m01_01", label: "Fixer un visage à courte distance", hint: "Visage proche (20-30 cm)" },
      { id: "m01_02", label: "Tourner la tête vers une voix", hint: "Parler d'un côté puis de l'autre" },
      { id: "m01_03", label: "Se calmer au contact", hint: "Peau à peau, contenance douce" },
      { id: "m01_04", label: "Différencier certains pleurs", hint: "Observer timing et signaux" },
      { id: "m01_05", label: "Ouvrir les mains plus souvent", hint: "Massage doux des mains" },
      { id: "m01_06", label: "Porter la main à la bouche", hint: "Laisser les mains libres" },
      { id: "m01_07", label: "Donner des coups de pied", hint: "Temps sur le dos, pieds nus" },
      { id: "m01_08", label: "Lever brièvement la tête (sur ventre)", hint: "Tummy time court" },
      { id: "m01_09", label: "Suivre un objet du regard", hint: "Objet contrasté, lent" },
      { id: "m01_10", label: "Sourire social (fin 1er mois)", hint: "Interactions calmes" },
    ],
  },
  {
    key: "2",
    title: "2 mois",
    items: [
      { id: "m02_01", label: "Sourire en réponse", hint: "Jeux de visage" },
      { id: "m02_02", label: "Gazouiller (voyelles)", hint: "Parler puis laisser répondre" },
      { id: "m02_03", label: "Suivre un objet sur 180°", hint: "Mobile ou hochet coloré" },
      { id: "m02_04", label: "Tenir la tête 45° (sur ventre)", hint: "Tummy time régulier" },
      { id: "m02_05", label: "Découvrir ses mains", hint: "Observer devant le visage" },
      { id: "m02_06", label: "Agripper un doigt fermement", hint: "Réflexe de préhension" },
      { id: "m02_07", label: "Réagir aux sons familiers", hint: "Voix, musique douce" },
      { id: "m02_08", label: "Bouger bras et jambes ensemble", hint: "Mouvements symétriques" },
    ],
  },
  {
    key: "3",
    title: "3 mois",
    items: [
      { id: "m03_01", label: "Rire aux éclats", hint: "Jeux, chatouilles douces" },
      { id: "m03_02", label: "Tourner la tête librement", hint: "Contrôle de la tête" },
      { id: "m03_03", label: "Porter les mains ensemble", hint: "Ligne médiane" },
      { id: "m03_04", label: "Tendre la main vers un objet", hint: "Hochet à portée" },
      { id: "m03_05", label: "Pousser sur les jambes (debout)", hint: "Soutenir sous les bras" },
      { id: "m03_06", label: "Reconnaître visages familiers", hint: "Sourire sélectif" },
      { id: "m03_07", label: "Babiller (consonnes)", hint: "ba, ma, da" },
      { id: "m03_08", label: "Suivre un objet en mouvement", hint: "Coordination œil-main" },
      { id: "m03_09", label: "Tenir la tête stable (assis)", hint: "Avec soutien du dos" },
      { id: "m03_10", label: "Porter objets à la bouche", hint: "Exploration orale" },
    ],
  },
  {
    key: "4",
    title: "4 mois",
    items: [
      { id: "m04_01", label: "Rouler dos → côté", hint: "Sur surface ferme" },
      { id: "m04_02", label: "Saisir un hochet", hint: "Préhension volontaire" },
      { id: "m04_03", label: "Tenir la tête stable", hint: "En position assise" },
      { id: "m04_04", label: "Sourire spontanément", hint: "Initiative sociale" },
      { id: "m04_05", label: "Babiller en réponse", hint: "Proto-conversation" },
      { id: "m04_06", label: "Pousser sur les avant-bras", hint: "Sur le ventre" },
      { id: "m04_07", label: "Attraper ses pieds", hint: "Coordination main-pied" },
      { id: "m04_08", label: "Imiter certains sons", hint: "Jeux vocaux" },
    ],
  },
  {
    key: "5",
    title: "5 mois",
    items: [
      { id: "m05_01", label: "Rouler dos → ventre", hint: "Retournement complet" },
      { id: "m05_02", label: "S'asseoir avec appui", hint: "Coussin de soutien" },
      { id: "m05_03", label: "Passer un objet d'une main à l'autre", hint: "Transfert" },
      { id: "m05_04", label: "Réagir à son prénom", hint: "Attention sélective" },
      { id: "m05_05", label: "Jouer avec ses pieds", hint: "Flexibilité" },
      { id: "m05_06", label: "Distinguer émotions (voix)", hint: "Reconnaissance tonale" },
      { id: "m05_07", label: "Râteler un petit objet", hint: "Préhension palmaire" },
      { id: "m05_08", label: "Babiller en chaîne", hint: "babababa, mamama" },
    ],
  },
  {
    key: "6",
    title: "6 mois",
    items: [
      { id: "m06_01", label: "S'asseoir sans appui (bref)", hint: "Équilibre court" },
      { id: "m06_02", label: "Rouler dans les 2 sens", hint: "Mobilité" },
      { id: "m06_03", label: "Saisir avec pince (pouce)", hint: "Pince inférieure" },
      { id: "m06_04", label: "Reconnaître les émotions (visage)", hint: "Lecture sociale" },
      { id: "m06_05", label: "Répondre à 'non'", hint: "Compréhension basique" },
      { id: "m06_06", label: "Explorations variées (bouche, mains)", hint: "Curiosité" },
      { id: "m06_07", label: "Chercher un objet tombé", hint: "Permanence de l'objet" },
      { id: "m06_08", label: "Aimer jouer en miroir", hint: "Reconnaissance visuelle" },
      { id: "m06_09", label: "Ramper en arrière", hint: "Début de locomotion" },
      { id: "m06_10", label: "Combiner syllabes différentes", hint: "bada, maba" },
    ],
  },
  {
    key: "7",
    title: "7 mois",
    items: [
      { id: "m07_01", label: "S'asseoir seul stable", hint: "Sans appui" },
      { id: "m07_02", label: "Ramper sur le ventre", hint: "Commando crawl" },
      { id: "m07_03", label: "Taper deux objets ensemble", hint: "Coordination bimanuelle" },
      { id: "m07_04", label: "Comprendre 'au revoir'", hint: "Geste + mot" },
      { id: "m07_05", label: "Anxiété de séparation", hint: "Début attachement sélectif" },
      { id: "m07_06", label: "Pointer du doigt", hint: "Communication intentionnelle" },
      { id: "m07_07", label: "Répondre à son prénom", hint: "Se retourner" },
      { id: "m07_08", label: "Imiter des gestes simples", hint: "Coucou, bravo" },
    ],
  },
  {
    key: "8",
    title: "8 mois",
    items: [
      { id: "m08_01", label: "Quatre pattes", hint: "Crawling coordonné" },
      { id: "m08_02", label: "Se mettre debout (accroché)", hint: "Avec meuble" },
      { id: "m08_03", label: "Pince pouce-index", hint: "Pince supérieure" },
      { id: "m08_04", label: "Dire 'papa' ou 'mama'", hint: "Premières syllabes" },
      { id: "m08_05", label: "Jouer à cache-cache", hint: "Permanence de l'objet" },
      { id: "m08_06", label: "Peur des étrangers", hint: "Normale 8-12 mois" },
      { id: "m08_07", label: "Chercher objet caché", hint: "Sous un tissu" },
      { id: "m08_08", label: "Manger avec les doigts", hint: "Autonomie alimentaire" },
    ],
  },
  {
    key: "9",
    title: "9 mois",
    items: [
      { id: "m09_01", label: "Se déplacer en quatre pattes", hint: "Exploration active" },
      { id: "m09_02", label: "Passer assis → quatre pattes", hint: "Transition fluide" },
      { id: "m09_03", label: "Tenir debout avec appui", hint: "Quelques secondes" },
      { id: "m09_04", label: "Comprendre 'non'", hint: "Réaction visible" },
      { id: "m09_05", label: "Imiter des sons d'animaux", hint: "Jeu vocal" },
      { id: "m09_06", label: "Jeter des objets intentionnellement", hint: "Cause-effet" },
      { id: "m09_07", label: "Faire 'au revoir' de la main", hint: "Geste social" },
      { id: "m09_08", label: "Attraper petits objets", hint: "Pince fine" },
    ],
  },
  {
    key: "10",
    title: "10 mois",
    items: [
      { id: "m10_01", label: "Marcher le long des meubles", hint: "Cruising" },
      { id: "m10_02", label: "Se tenir debout seul (bref)", hint: "Sans appui" },
      { id: "m10_03", label: "Dire 1-2 mots", hint: "papa, mama, dada" },
      { id: "m10_04", label: "Comprendre consignes simples", hint: "Donne, viens" },
      { id: "m10_05", label: "Applaudir", hint: "Imitation sociale" },
      { id: "m10_06", label: "Mettre objets dans contenant", hint: "Coordination" },
      { id: "m10_07", label: "Pointer ce qu'il veut", hint: "Communication" },
      { id: "m10_08", label: "Montrer affection", hint: "Câlins, bisous" },
    ],
  },
  {
    key: "11",
    title: "11 mois",
    items: [
      { id: "m11_01", label: "Tenir debout seul", hint: "Quelques secondes" },
      { id: "m11_02", label: "Faire quelques pas seul", hint: "Premiers pas" },
      { id: "m11_03", label: "Dire 2-3 mots", hint: "Vocabulaire émergeant" },
      { id: "m11_04", label: "Suivre consignes à 1 étape", hint: "Donne le ballon" },
      { id: "m11_05", label: "Utiliser objets correctement", hint: "Téléphone, brosse" },
      { id: "m11_06", label: "Secouer la tête 'non'", hint: "Geste de refus" },
      { id: "m11_07", label: "Empiler 2 cubes", hint: "Coordination" },
      { id: "m11_08", label: "Boire au gobelet", hint: "Autonomie" },
    ],
  },
  {
    key: "12",
    title: "12 mois",
    items: [
      { id: "m12_01", label: "Marcher seul", hint: "Locomotion indépendante" },
      { id: "m12_02", label: "Dire 3-5 mots", hint: "Vocabulaire actif" },
      { id: "m12_03", label: "Comprendre 50+ mots", hint: "Vocabulaire passif" },
      { id: "m12_04", label: "Imiter activités ménagères", hint: "Jeu symbolique" },
      { id: "m12_05", label: "Montrer ce qu'il veut", hint: "Pointer + vocaliser" },
      { id: "m12_06", label: "Gribouiller", hint: "Tenir un crayon" },
      { id: "m12_07", label: "Empiler 2-3 cubes", hint: "Motricité fine" },
      { id: "m12_08", label: "Faire des câlins", hint: "Affection spontanée" },
      { id: "m12_09", label: "Chercher objet caché", hint: "Mémoire de travail" },
      { id: "m12_10", label: "Aider à s'habiller", hint: "Tendre bras/jambes" },
    ],
  },
];

export interface MilestoneWithGroup extends MilestoneItem {
  groupKey: string;
  groupTitle: string;
}

export const getAllMilestones = (): MilestoneWithGroup[] => 
  MILESTONE_GROUPS.flatMap(g => 
    g.items.map(it => ({ 
      ...it, 
      groupKey: g.key, 
      groupTitle: g.title 
    }))
  );