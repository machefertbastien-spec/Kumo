# Structure du contenu - Onglet Aide

## 📁 Organisation des fichiers

```
src/content/aide/
├── index.ts                 # Point d'entrée principal
├── types.ts                 # Types TypeScript
├── categories.ts            # Définition des catégories
├── 01-bases-sommeil.ts      # Section 1 (CRÉÉ ✅)
├── 02-endormissement.ts     # Section 2 (À CRÉER)
├── 03-reveils-nocturnes.ts  # Section 3 (À CRÉER)
├── 04-reveils-matinaux.ts   # Section 4 (À CRÉER)
├── 05-siestes.ts            # Section 5 (À CRÉER)
├── 06-alimentation.ts       # Section 6 (À CRÉER)
├── 07-presence.ts           # Section 7 (À CRÉER)
├── 08-pleurs.ts             # Section 8 (À CRÉER)
└── 10-changements.ts        # Section 10 (À CRÉER)
```

## 🎯 Sections de contenu

### ✅ Section 1 : Bases du sommeil & rythmes biologiques (FAIT)
- 8 articles créés
- Catégorie principale : `sommeil`

### 📝 Section 2 : Endormissement & couchers difficiles (À FAIRE)
Articles à créer :
1. Pourquoi mon enfant pleure au moment du coucher
2. Temps d'endormissement long : ce que ça signifie
3. Endormissement dans les bras, au sein ou au biberon
4. Décalage entre signes de fatigue et endormissement
5. Comment le cortisol bloque l'endormissement

### 📝 Section 3 : Réveils nocturnes (À FAIRE)
Articles à créer :
1. Pourquoi les bébés se réveillent la nuit
2. Réveils fréquents : sommeil, faim ou inconfort ?
3. Réveils à heures fixes : que regarder en priorité ?
4. Difficulté à se rendormir seul
5. Réveils liés au stress ou à la sur-fatigue
6. Quand les réveils nocturnes deviennent un cercle vicieux

### 📝 Section 4 : Réveils trop matinaux (À FAIRE)
Articles à créer :
1. Qu'est-ce qu'un réveil trop matinal ?
2. Pourquoi mon enfant se réveille très tôt ?
3. Fatigue accumulée et réveils précoces
4. Pourquoi il est difficile de se rendormir le matin
5. Réveils matinaux et cortisol

### 📝 Section 5 : Siestes compliquées (À FAIRE)
Articles à créer :
1. Pourquoi mon enfant refuse la sieste
2. Siestes courtes : causes fréquentes
3. Transitions de siestes selon l'âge
4. Siestes et impact sur le sommeil nocturne
5. Trop ou pas assez de siestes : comment trouver l'équilibre

### 📝 Section 6 : Alimentation & sommeil (À FAIRE)
Articles à créer :
1. Faim nocturne : réelle ou non ?
2. Réveils liés à l'alimentation ?
3. Répartition des apports sur 24h
4. Inconfort digestif et réveils nocturnes
5. Diversification alimentaire et sommeil
6. Quand l'alimentation perturbe l'endormissement

### 📝 Section 7 : Besoin de présence & séparation (À FAIRE)
Articles à créer :
1. Pourquoi mon enfant a besoin de ma présence pour dormir
2. Endormissement dépendant : ce que ça signifie vraiment
3. Réveils nocturnes liés à la séparation
4. Angoisses de séparation et sommeil
5. Pourquoi un enfant refuse d'être posé

### 📝 Section 8 : Bébé pleure beaucoup (À FAIRE)
Articles à créer :
1. Comprendre les pleurs de son bébé
2. Pleurs de fatigue vs pleurs de souffrance
3. Pleurs liés au manque de sommeil
4. Pleurs de décharge et stress accumulé
5. Quand faut-il s'inquiéter
6. Cauchemars : à partir de quel âge

### 📝 Section 10 : Changements & périodes sensibles (À FAIRE)
Articles à créer :
1. Régressions du sommeil : mythe ou réalité
2. Maladie, dents et sommeil
3. Crèche, école et troubles du sommeil
4. Vacances, déplacements et décalages
5. Pourquoi certaines périodes sont plus sensibles

## 📊 Format des données

### ArticlePreview (pour la liste)
```typescript
{
  id: 'identifiant-unique',
  category: 'sommeil' | 'alimentation' | 'temperature' | 'developpement' | 'sante',
  title: 'Titre de l\'article',
  description: 'Description courte (1-2 phrases)',
  illustration: '😴', // Emoji
  color: '#E8D5C4'    // Couleur de fond
}
```

### ArticleContent (contenu complet)
```typescript
{
  id: 'identifiant-unique',
  title: 'Titre complet',
  category: 'sommeil',
  sections: [
    {
      type: 'text',
      content: 'Paragraphe de texte...'
    },
    {
      type: 'table',
      table: {
        headers: ['Colonne 1', 'Colonne 2'],
        rows: [
          { col1: 'Valeur 1', col2: 'Valeur 2' }
        ]
      }
    },
    {
      type: 'list',
      items: ['Point 1', 'Point 2']
    }
  ],
  relatedArticles: ['id-article-1', 'id-article-2']
}
```

## 🔧 Pour ajouter une nouvelle section

1. Créer un fichier `XX-nom-section.ts` dans `src/content/aide/`
2. Définir les constantes `NOM_SECTION_PREVIEWS` et `NOM_SECTION_CONTENT`
3. Importer dans `index.ts`
4. Ajouter aux tableaux `ALL_ARTICLE_PREVIEWS` et `ALL_ARTICLE_CONTENTS`

## 🎨 Couleurs suggérées par catégorie

- **Sommeil** : #E8D5C4, #D4E8F0, #F0E8D4, #E8F0D4
- **Alimentation** : #FFE8D4, #FFF0E8, #F0F0D4
- **Température** : #FFE8E8, #F0E8E8, #E8F0F0
- **Développement** : #F0D4E8, #E8D4D4, #D4E8E8
- **Santé** : #E8E8F0, #F0E8F0, #D4F0E8

## ✅ Status actuel

**Section 1 complète** : 8 articles sur les bases du sommeil
- Tous les contenus détaillés créés
- Structure de données établie
- Prêt à être intégré dans AideScreen.tsx

**Sections 2-10** : Structure prête, contenu à migrer
- Le contenu existe dans votre document Word
- Il faut le formater selon le modèle de la Section 1
- Chaque section dans son propre fichier TypeScript
