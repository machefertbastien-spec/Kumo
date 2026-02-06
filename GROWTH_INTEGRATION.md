# 🔌 Intégration de la feature Courbes de Croissance

## Vue d'ensemble

Cette feature ajoute 3 nouveaux écrans à votre app Kumo :
1. **GrowthChartsScreen** : Courbes avec dernière mesure
2. **GrowthHistoryScreen** : Historique complet avec filtres
3. **AddMeasurementSheet** : Formulaire d'ajout (modal/bottom sheet)

## Prérequis

Les données suivantes doivent être disponibles dans votre app :
```typescript
const baby = {
  id: string;              // ID unique de l'enfant
  birthDateISO: string;    // Date de naissance ISO (ex: "2025-01-01T00:00:00.000Z")
  sex: "male" | "female";  // Sexe (requis pour courbes OMS)
};
```

## Option 1 : Onglet séparé (Recommandé)

Ajoutez un nouvel onglet "Croissance" dans votre `TabNavigator`.

### Étape 1 : Créer le composant wrapper

Créez `src/screens/GrowthTabScreen.tsx` :

```tsx
import React, { useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { 
  GrowthChartsScreen, 
  AddMeasurementSheet 
} from '../features/growth';

export function GrowthTabScreen({ baby }) {
  const [showAddSheet, setShowAddSheet] = useState(false);

  return (
    <>
      <GrowthChartsScreen
        childId={baby.id}
        childDob={baby.birthDateISO}
        childSex={baby.sex}
        onAddMeasurement={() => setShowAddSheet(true)}
      />

      {/* Modal pour ajout de mesure */}
      {showAddSheet && (
        <Modal
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAddSheet(false)}
        >
          <AddMeasurementSheet
            childId={baby.id}
            onClose={() => setShowAddSheet(false)}
            onSuccess={() => {
              setShowAddSheet(false);
              // La liste se recharge automatiquement
            }}
          />
        </Modal>
      )}
    </>
  );
}
```

### Étape 2 : Ajouter l'onglet dans App.js

Dans votre fichier `App.js`, ajoutez l'onglet :

```javascript
import { GrowthTabScreen } from './src/screens/GrowthTabScreen';

// Dans votre TabsScreen component
function TabsScreen(props) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Accueil" options={{ tabBarIconName: "home-outline" }}>
        {() => <HomeScreen {...props} />}
      </Tab.Screen>
      
      {/* NOUVEAU TAB CROISSANCE */}
      <Tab.Screen name="Croissance" options={{ tabBarIconName: "trending-up-outline" }}>
        {() => <GrowthTabScreen baby={props.baby} />}
      </Tab.Screen>
      
      <Tab.Screen name="SleepPlanner" options={{ tabBarIconName: "sparkles-outline" }}>
        {() => <SleepPlannerScreen {...props} />}
      </Tab.Screen>
      
      <Tab.Screen name="Historique" options={{ tabBarIconName: "calendar-outline" }}>
        {() => <HistoryScreen {...props} />}
      </Tab.Screen>
      
      <Tab.Screen name="Stats" options={{ tabBarIconName: "stats-chart-outline" }}>
        {() => <StatsScreen {...props} />}
      </Tab.Screen>
      
      <Tab.Screen name="Réglages" options={{ tabBarIconName: "settings-outline" }}>
        {() => <SettingsScreen {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
```

### Étape 3 : Ajouter l'icône (react-native-heroicons)

Si vous utilisez Heroicons, modifiez l'helper Icon :

```javascript
// Dans App.js, section Icon helper
function Icon({ name, size = 24, color = "#2C3E50" }) {
  const iconMap = {
    "home-outline": HomeIcon,
    "trending-up-outline": ChartBarIcon,  // NOUVEAU
    "sparkles-outline": SparklesIcon,
    "calendar-outline": CalendarIcon,
    "stats-chart-outline": ChartPieIcon,
    "settings-outline": CogIcon,
  };
  
  const IconComponent = iconMap[name] || HomeIcon;
  return <IconComponent width={size} height={size} stroke={color} />;
}

// N'oubliez pas l'import
import { 
  HomeIcon, 
  ChartBarIcon,  // NOUVEAU
  SparklesIcon,
  CalendarIcon,
  ChartPieIcon,
  CogIcon 
} from 'react-native-heroicons/outline';
```

## Option 2 : Écran séparé (Stack Navigator)

Si vous préférez un écran accessible depuis un bouton.

### Dans App.js

```javascript
import { GrowthChartsScreen } from './src/features/growth';

// Ajouter un écran dans le Stack principal
<Stack.Screen 
  name="GrowthCharts" 
  component={GrowthChartsScreen}
  options={{ title: "Courbes de croissance" }}
/>
```

### Accès depuis HomeScreen

Ajoutez un bouton dans votre HomeScreen :

```javascript
<Pressable 
  style={styles.growthButton}
  onPress={() => navigation.navigate('GrowthCharts', { baby })}
>
  <Text style={styles.growthButtonText}>📊 Courbes de croissance</Text>
</Pressable>
```

## Option 3 : Section dans Réglages

Ajoutez un lien dans votre écran de réglages :

```javascript
// Dans SettingsScreen
<Pressable 
  style={styles.settingRow}
  onPress={() => navigation.navigate('GrowthCharts', { baby })}
>
  <Text style={styles.settingLabel}>📈 Courbes de croissance</Text>
  <Text style={styles.settingChevron}>›</Text>
</Pressable>
```

## Gestion de l'historique

Pour ajouter un accès à l'historique détaillé :

```tsx
// Créez src/screens/GrowthHistoryTabScreen.tsx
import React from 'react';
import { GrowthHistoryScreen } from '../features/growth';

export function GrowthHistoryTabScreen({ baby }) {
  return (
    <GrowthHistoryScreen
      childId={baby.id}
      childDob={baby.birthDateISO}
      childSex={baby.sex}
    />
  );
}
```

Puis ajoutez un bouton dans GrowthTabScreen :

```tsx
<Pressable onPress={() => navigation.navigate('GrowthHistory')}>
  <Text>Voir l'historique complet</Text>
</Pressable>
```

## Synchronisation avec l'état global

Si vous utilisez un state manager (Context, Redux, etc.), vous pouvez recharger les données après ajout :

```tsx
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

function GrowthTabScreen({ baby }) {
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Recharger quand l'écran reprend le focus
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  return (
    <GrowthChartsScreen
      key={refreshKey}
      childId={baby.id}
      childDob={baby.birthDateISO}
      childSex={baby.sex}
      onAddMeasurement={...}
    />
  );
}
```

## Migration des données existantes

Si vous avez déjà des mesures dans votre app, créez un script de migration :

```typescript
import { addMeasurement } from './src/features/growth';

async function migrateMeasurements(oldData) {
  for (const measure of oldData) {
    await addMeasurement(
      measure.childId,
      measure.type, // 'weight' | 'length' | 'headCircumference'
      measure.value,
      measure.date,
      measure.source,
      measure.note
    );
  }
}
```

## Personnalisation du thème

Pour adapter au thème de votre app, modifiez les constantes dans chaque fichier UI :

```tsx
// Dans GrowthChartsScreen.tsx
const THEME = {
  primary: '#6C63FF',  // Votre couleur principale
  bg: '#F8F9FA',
  card: '#FFFFFF',
  // ... autres couleurs
};
```

Ou créez un fichier `src/features/growth/theme.ts` :

```tsx
export const GROWTH_THEME = {
  primary: '#6C63FF',
  bg: '#F8F9FA',
  // ...
};
```

Et importez-le dans tous les composants UI.

## Test de l'intégration

1. **Ajoutez un bébé** avec date de naissance et sexe
2. **Naviguez** vers l'onglet Croissance
3. **Ajoutez une mesure** : poids = 4.5 kg, date = aujourd'hui
4. **Vérifiez** que la mesure s'affiche avec son percentile
5. **Testez l'historique** et la suppression

## Troubleshooting

### "Missing ref data for male.weight"
→ Vérifiez que tous les fichiers LMS et bands sont présents dans `src/features/growth/ref/`

### "Cannot find module 'date-fns'"
→ La lib date-fns est déjà dans votre projet, vérifiez les imports

### Les percentiles semblent incorrects
→ Vérifiez que `baby.birthDateISO` est au bon format ISO

### L'ajout de mesure ne fonctionne pas
→ Vérifiez que `childId` est bien passé et non null

## Support

Pour toute question ou bug, ouvrez une issue avec :
- Version React Native / Expo
- Logs d'erreur complets
- Étapes pour reproduire

---

**Prochaines étapes** :
1. ✅ Ajouter l'onglet dans la navigation
2. 📊 Tester l'ajout de mesures
3. 🎨 Personnaliser le thème si nécessaire
4. 📈 (Optionnel) Implémenter un vrai graphique avec une lib comme Victory Native
