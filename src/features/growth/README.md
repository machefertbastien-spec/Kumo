# 📈 Growth Charts Feature

Feature complète de suivi de croissance pour bébés 0-12 mois basée sur les standards OMS.

## 🎯 Fonctionnalités

- **Courbes de croissance** : Visualisation avec bandes percentiles (P3, P15, P50, P85, P97)
- **3 métriques** : Poids, taille, périmètre crânien
- **Ajout rapide** : Saisie d'une mesure en 10 secondes
- **Historique détaillé** : Liste avec évolutions, édition et suppression
- **Calculs z-score** : Méthode LMS (WHO) avec interpolation
- **Offline-first** : Stockage local AsyncStorage
- **Validation** : Détection des valeurs aberrantes

## 📁 Architecture

```
src/features/growth/
├── types.ts                    # Types TypeScript & constantes
├── index.ts                    # API publique
├── math/
│   └── growthMath.ts          # Calculs z-score, percentiles, LMS
├── storage/
│   └── measurementsRepo.ts    # CRUD AsyncStorage
├── ref/
│   ├── refData.ts             # Chargeur de données OMS
│   ├── lms/                   # Données LMS par sexe/métrique
│   │   ├── female.weight.lms.json
│   │   ├── female.length.lms.json
│   │   ├── female.hc.lms.json
│   │   ├── male.weight.lms.json
│   │   ├── male.length.lms.json
│   │   └── male.hc.lms.json
│   └── generated/             # Bandes percentiles pré-calculées
│       ├── female.weight.bands.json
│       └── ...
├── hooks/
│   └── useGrowthData.ts       # Hook React avec stats calculées
├── ui/
│   ├── GrowthChartsScreen.tsx # Écran principal courbes
│   ├── GrowthHistoryScreen.tsx# Historique & filtres
│   └── AddMeasurementSheet.tsx# Formulaire ajout
└── __tests__/
    └── growthMath.test.ts     # Tests unitaires

scripts/
└── generate-growth-bands.js   # Script de pré-calcul
```

## 🚀 Utilisation

### 1. Génération des bandes percentiles

```bash
node scripts/generate-growth-bands.js
```

Cela génère les fichiers `.bands.json` à partir des données LMS.

### 2. Intégration dans la navigation

**Option A : Onglet dédié**

```tsx
import { GrowthChartsScreen, AddMeasurementSheet } from './src/features/growth';

function GrowthTab() {
  const [showAdd, setShowAdd] = useState(false);
  
  return (
    <>
      <GrowthChartsScreen
        childId={baby.id}
        childDob={baby.birthDateISO}
        childSex={baby.sex}
        onAddMeasurement={() => setShowAdd(true)}
      />
      
      {showAdd && (
        <Modal>
          <AddMeasurementSheet
            childId={baby.id}
            onClose={() => setShowAdd(false)}
            onSuccess={() => {
              setShowAdd(false);
              // Refetch si nécessaire
            }}
          />
        </Modal>
      )}
    </>
  );
}

// Dans TabNavigator
<Tab.Screen name="Croissance" component={GrowthTab} />
```

**Option B : Stack Navigator**

```tsx
const Stack = createNativeStackNavigator();

<Stack.Screen name="GrowthCharts" component={GrowthChartsScreen} />
<Stack.Screen name="GrowthHistory" component={GrowthHistoryScreen} />
```

### 3. Ajout d'une mesure

```tsx
import { addMeasurement } from './src/features/growth';

await addMeasurement(
  childId,
  'weight',      // 'weight' | 'length' | 'headCircumference'
  4.5,           // valeur en kg ou cm
  '2025-01-15T10:30:00.000Z', // ISO date
  'home',        // 'home' | 'doctor' (optionnel)
  'Après le bain' // note (optionnel)
);
```

### 4. Utilisation du hook

```tsx
import { useGrowthData } from './src/features/growth';

function MyComponent({ baby }) {
  const { measurements, loading, latestMeasurement, refetch } = useGrowthData({
    childId: baby.id,
    childDob: baby.birthDateISO,
    childSex: baby.sex,
    metric: 'weight',
  });

  if (latestMeasurement) {
    console.log('Dernière mesure:', latestMeasurement.measurement.value);
    console.log('Percentile:', latestMeasurement.percentile);
    console.log('Z-score:', latestMeasurement.zScore);
  }
}
```

## 🧮 Méthode LMS

Les courbes de croissance OMS utilisent la méthode **LMS** (Lambda-Mu-Sigma) :

- **L** : Paramètre de Box-Cox (asymétrie)
- **M** : Médiane (P50)
- **S** : Coefficient de variation

### Formules

**Z-score depuis valeur x :**
```
z = ((x/M)^L - 1) / (L*S)   pour L ≠ 0
z = ln(x/M) / S             pour L = 0
```

**Valeur x depuis z-score :**
```
x = M * (1 + L*S*z)^(1/L)   pour L ≠ 0
x = M * exp(S*z)            pour L = 0
```

**Percentile depuis z-score :**
```
percentile = Φ(z) * 100
où Φ est la fonction de répartition normale standard
```

## 📊 Données de référence

Les données LMS proviennent des **WHO Child Growth Standards** :
- 0-365 jours (0-12 mois)
- Par sexe (fille/garçon)
- Par métrique (poids/taille/PC)
- Interpolation linéaire entre jours

### Format LMS JSON

```json
{
  "0": { "L": 0.3487, "M": 3.3464, "S": 0.14602 },
  "1": { "L": 0.3487, "M": 3.3627, "S": 0.14558 },
  ...
  "365": { "L": 0.0714, "M": 7.7049, "S": 0.13229 }
}
```

### Format Bands JSON

```json
{
  "p3": [
    { "day": 0, "value": 2.456 },
    { "day": 1, "value": 2.467 },
    ...
  ],
  "p50": [...],
  "p97": [...]
}
```

## ✅ Tests

Exécuter les tests unitaires :

```bash
npm test -- growthMath.test
```

Les tests couvrent :
- Calcul d'âge en jours
- Interpolation LMS
- Conversions z-score ↔ valeur
- Percentiles et CDF normale
- Validation des mesures
- Calcul de deltas

## 🎨 Personnalisation

### Thème

Modifiez les constantes `THEME` dans chaque composant UI.

### Labels

```tsx
import { METRIC_LABELS } from './src/features/growth';

// Override
METRIC_LABELS.weight = 'Weight';
METRIC_LABELS.length = 'Height';
```

### Validation

```tsx
import { VALIDATION_BOUNDS } from './src/features/growth';

// Ajuster les limites
VALIDATION_BOUNDS.weight.max = 20; // kg
```

## ⚠️ Contraintes

- **Âge** : 0-365 jours uniquement (clamped)
- **Unités** : kg pour poids, cm pour taille/PC
- **Sexe** : "male" | "female" requis
- **Non-médical** : Disclaimer obligatoire dans l'UI

## 🔮 Améliorations futures

- [ ] Graphique SVG/Canvas natif
- [ ] Export PDF des courbes
- [ ] Sync Supabase
- [ ] Notifications si hors percentiles normaux
- [ ] Support 1-5 ans (extension)
- [ ] Comparaison jumeaux
- [ ] Import données pédiatre (CSV)

## 📚 Références

- [WHO Child Growth Standards](https://www.who.int/tools/child-growth-standards)
- [LMS Method](https://www.cdc.gov/growthcharts/percentile_data_files.htm)
- [Cole TJ, Green PJ. BMJ 1992](https://www.bmj.com/content/298/6675/784)

## 🤝 Contribution

Pour ajouter des données LMS complètes (365 jours) :

1. Télécharger les tables OMS officielles
2. Convertir en JSON au format `{ "day": { L, M, S } }`
3. Placer dans `src/features/growth/ref/lms/`
4. Régénérer les bandes : `node scripts/generate-growth-bands.js`

---

**Note** : Cette feature est indicative et ne doit pas être utilisée pour des diagnostics médicaux. Toujours consulter un professionnel de santé.
