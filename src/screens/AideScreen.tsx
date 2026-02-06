/**
 * AideScreen - Help library with content categories
 * Main screen showing search bar, category filters, and article cards
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SFIcon } from '../components/SFIcon';
import { HeroBadge } from '../components/ui/HeroBadge';
import { ScreenHeader } from '../components/ui';
import { useNavigation } from '@react-navigation/native';
import {
  ALL_ARTICLE_PREVIEWS,
  CATEGORIES,
  getArticlesByCategory,
  searchArticles,
  type CategoryKey,
} from '../content/aide';

const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
  secondary: '#E6A77D',
};

const OLD_ARTICLES_PLACEHOLDER = [
  {
    id: '2',
    category: 'sommeil',
    title: 'Astuces pour aider bébé à s\'endormir',
    description: 'Découvrez des conseils pratiques pour favoriser l\'endormissement de bébé',
    illustration: '🎵',
    color: '#E8D5C4',
  },
  {
    id: '3',
    category: 'sommeil',
    title: 'Les routines du coucher',
    description: 'Comment mettre en place un rituel apaisant avant le dodo',
    illustration: '🛏️',
    color: '#E8D5C4',
  },
  {
    id: '4',
    category: 'alimentation',
    title: 'Diversification alimentaire',
    description: 'Tout savoir sur l\'introduction des aliments solides',
    illustration: '🍼',
    color: '#E6A77D',
  },
  {
    id: '5',
    category: 'alimentation',
    title: 'Allaitement : les bases',
    description: 'Guide complet pour bien démarrer l\'allaitement maternel',
    illustration: '🤱',
    color: '#E6A77D',
  },
  {
    id: '6',
    category: 'temperature',
    title: 'Quelle température pour la chambre ?',
    description: 'Les bonnes pratiques pour assurer le confort de bébé',
    illustration: '🌡️',
    color: '#E3B58F',
  },
  {
    id: '7',
    category: 'developpement',
    title: 'Les étapes du développement moteur',
    description: 'De la naissance à 12 mois : ce qui est normal',
    illustration: '👶',
    color: '#A8B59B',
  },
  {
    id: '8',
    category: 'sante',
    title: 'Fièvre : quand s\'inquiéter ?',
    description: 'Reconnaître les signes et savoir réagir face à la fièvre',
    illustration: '🤒',
    color: '#E85D75',
  },
];

export function AideScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>('sommeil');
  const [searchQuery, setSearchQuery] = useState('');

  // Use memoized filtering for better performance
  const filteredArticles = useMemo(() => {
    if (searchQuery.trim()) {
      return searchArticles(searchQuery);
    }
    
    // Combine new structured articles with old placeholder articles
    const newArticles = getArticlesByCategory(selectedCategory);
    const oldArticles = OLD_ARTICLES_PLACEHOLDER.filter(
      article => !selectedCategory || article.category === selectedCategory
    );
    
    return [...newArticles, ...oldArticles];
  }, [selectedCategory, searchQuery]);

  const categoryLabel = CATEGORIES.find(c => c.key === selectedCategory)?.label || 'Tous';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      {/* Header with settings button */}
      <ScreenHeader showLogo />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: THEME.text, marginBottom: 16 }}>
          Aide
        </Text>

        {/* Search Bar */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: THEME.card, 
          borderRadius: 20, 
          paddingHorizontal: 16, 
          paddingVertical: 12,
          marginBottom: 16,
        }}>
          <SFIcon name="magnifyingglass" size={20} color={THEME.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher"
            placeholderTextColor={THEME.muted}
            style={{ 
              flex: 1, 
              marginLeft: 8, 
              fontSize: 16, 
              color: THEME.text,
              fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
            }}
          />
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, marginBottom: 24 }}
        >
          {CATEGORIES.map((category, index) => (
            <HeroBadge
              key={category.key}
              text={category.label}
              icon={
                <SFIcon 
                  name={category.icon} 
                  size={16} 
                  color={selectedCategory === category.key ? '#FBF8F6' : '#D48A63'}
                />
              }
              variant={selectedCategory === category.key ? 'default' : 'outline'}
              size="md"
              onPress={() => setSelectedCategory(category.key)}
              animated={index === 0}
              style={{
                backgroundColor: selectedCategory === category.key ? THEME.primary : THEME.card,
                borderColor: selectedCategory === category.key ? THEME.primary : THEME.line,
              }}
              textStyle={{
                color: selectedCategory === category.key ? '#FBF8F6' : THEME.primary,
              }}
            />
          ))}
        </ScrollView>

        {/* Articles Section */}
        <Text style={{ fontSize: 18, fontWeight: '800', color: THEME.text, marginBottom: 16 }}>
          {categoryLabel}
        </Text>

        {filteredArticles.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: THEME.muted }}>Aucun article trouvé</Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {filteredArticles.map((article) => (
              <Pressable
                key={article.id}
                onPress={() => {
                  // @ts-ignore - Navigation will be properly typed in the stack
                  navigation.navigate('ArticleDetail', { articleId: article.id });
                }}
                style={({ pressed }) => ({
                  backgroundColor: THEME.card,
                  borderRadius: 20,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: THEME.text, marginBottom: 6 }}>
                    {article.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: THEME.muted, lineHeight: 18 }}>
                    {article.description}
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center' }}>
                  <View style={{ 
                    width: 80, 
                    height: 80, 
                    backgroundColor: article.color, 
                    borderRadius: 16, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                    {article.illustration.includes('.') || article.illustration.includes('-') ? (
                      <SFIcon 
                        name={article.illustration} 
                        size={36} 
                        color={article.category === 'sante' ? THEME.primary : THEME.text} 
                        weight="semibold" 
                      />
                    ) : (
                      <Text style={{ fontSize: 40 }}>{article.illustration}</Text>
                    )}
                  </View>
                  <SFIcon name="chevron.right" size={20} color={THEME.muted} />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
