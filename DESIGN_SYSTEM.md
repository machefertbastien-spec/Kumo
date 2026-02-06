# 🐨 Kumo - Charte couleurs officielle

## 📐 Design Principles

### Typographies
**Police : Inter**
- Police principale
- Excellente lisibilité
- Moderne & douce
- Non infantile
- Non médical

---

## 🎨 1. Couleurs de fond (Backgrounds)

| Nom | Hex RGB | Hex Code |
|-----|---------|----------|
| **Warm Cream** | 247 / 241 236 | `#F7F1EC` |
| **Soft Card White** | 251 / 248 246 | `#FBF8F6` |
| **Muted Beige** | 239 / 231 225 | `#EFE7E1` |

---

## 🔥 2. Couleur primaire (Action principale)

| Nom | RGB | Hex Code |
|-----|-----|----------|
| **Warm Terracotta** | 212 / 138 / 99 | `#D48A63` |
| **Terracotta Dark** | 198 / 121 / 82 | `#C67952` |

---

## 🛠️ 3. Couleurs fonctionnelles par usage

### Alimentation
| Nom | Usage | Hex Code |
|-----|-------|----------|
| **Soft Sage** | Biberon / Alimentation | `#E6A77D` |

### Hygiène
| Nom | Usage | Hex Code |
|-----|-------|----------|
| **Warm Peach** | Couches / Hygiène | `#E3B58F` |

---

## 📊 4. Couleurs graphiques (courbes Suivi)

| Fonction | Hex Code |
|----------|----------|
| **Poids** | `#D27C57` |
| **Taille** | `#9FB59B` |
| **Head Circ. Line** | `#8FB9C3` |

---

## 📝 5. Texte

| Type | Hex Code |
|------|----------|
| **Primary Text** | `#4B3F39` |
| **Secondary Text** | `#7A6A60` |
| **Disabled Text** | `#FB8ADAG` |

---

## 🎯 6. États & UI neutres

| État | Indication | Code |
|------|------------|------|
| **Jamais le nexx** (noir) | ❌ | `#000000` |
| **Jamais de blanc pur** | ❌ | - |
| **Pas de gradients** | ❌ | - |
| **Pas de saturation forte** | ❌ | - |
| **Toujours des tons chauds** | ✅ | - |
| **Une couleur = une fonction** | ✅ | - |

---

## 🔒 7. Règles STRICTES d'usage (important)

### Code actuel
```typescript
// Backgrounds
bg: main: #F771EC;
bg: card: #F8F8F8;
bg: muted: #FFE7E1;

// Couleur primaire
primary: #D48A63;
primary-dark: #C67952;

// Fonctions spécifiques
sleep: #BFC6B8;
feed: #E6A77D;
diaper: #E3B58F;
```

### ⚠️ Règles d'application
- **Jamais de noir pur** (`#000000`) → utiliser `#4B3F39` (Primary Text)
- **Jamais de blanc pur** → utiliser `#FBF8F6` (Soft Card White) ou `#F7F1EC` (Warm Cream)
- **Pas de gradients** → tous les boutons et éléments doivent utiliser des couleurs plates
- **Pas de saturation forte** → respecter les tonalités douces et chaudes de la charte
- **Toujours des tons chauds et harmonieux**
- **Une couleur = une fonction** → chaque action/catégorie a SA couleur dédiée

---

## 🚀 Version tokens prête dev

### Backgrounds
```typescript
BACKGROUND_MAIN: '#F7F1EC',      // Warm Cream
BACKGROUND_CARD: '#FBF8F6',      // Soft Card White
BACKGROUND_MUTED: '#EFE7E1',     // Muted Beige
```

### Primary Colors
```typescript
PRIMARY: '#D48A63',              // Warm Terracotta
PRIMARY_DARK: '#C67952',         // Terracotta Dark
```

### Functional Colors
```typescript
FEED: '#E6A77D',                 // Soft Sage (Alimentation)
DIAPER: '#E3B58F',               // Warm Peach (Couches/Hygiène)
SLEEP: '#BFC6B8',                // (à confirmer si toujours utilisé)
```

### Chart Colors
```typescript
CHART_WEIGHT: '#D27C57',         // Poids
CHART_HEIGHT: '#9FB59B',         // Taille
CHART_HEAD: '#8FB9C3',           // Périmètre crânien
```

### Text Colors
```typescript
TEXT_PRIMARY: '#4B3F39',         // Texte principal
TEXT_SECONDARY: '#7A6A60',       // Texte secondaire
TEXT_DISABLED: '#FB8ADAG',       // Texte désactivé
```

---

## 📋 Checklist d'intégration

- [ ] Remplacer toutes les couleurs de fond par les nouvelles couleurs (Warm Cream, Soft Card White, Muted Beige)
- [ ] Remplacer la couleur primaire actuelle par Warm Terracotta (#D48A63)
- [ ] Supprimer tous les gradients existants
- [ ] Mapper chaque fonction à sa couleur dédiée (alimentation → #E6A77D, couches → #E3B58F)
- [ ] Remplacer le noir pur par #4B3F39
- [ ] Remplacer le blanc pur par #FBF8F6 ou #F7F1EC
- [ ] Vérifier que les graphiques de croissance utilisent #D27C57 (poids), #9FB59B (taille), #8FB9C3 (tête)
- [ ] Appliquer la police Inter sur tous les textes
- [ ] Valider que chaque écran respecte les tons chauds et doux

---

## 🎨 Exemples d'application

### Bouton primaire
```tsx
<TouchableOpacity 
  style={{
    backgroundColor: '#D48A63', // Warm Terracotta
    borderRadius: 12,
    padding: 16,
  }}
>
  <Text style={{ color: '#FBF8F6' }}>Continuer</Text>
</TouchableOpacity>
```

### Card avec fond
```tsx
<View 
  style={{
    backgroundColor: '#FBF8F6', // Soft Card White
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFE7E1', // Muted Beige
  }}
>
  {/* Contenu */}
</View>
```

### Bouton d'action spécifique
```tsx
// Alimentation
<GradientTile
  title="Repas"
  colors={['#E6A77D']} // Plus de gradient, couleur unique
  iconName="cafe-outline"
/>

// Couches
<GradientTile
  title="Couche"
  colors={['#E3B58F']} // Plus de gradient, couleur unique
  iconName="water-outline"
/>
```

---

**Date de création :** 27 janvier 2026  
**Version :** 1.0  
**Statut :** Prêt pour intégration
