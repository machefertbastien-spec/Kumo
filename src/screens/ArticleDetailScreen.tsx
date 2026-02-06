/**
 * ArticleDetailScreen - Detailed article view
 * Shows full article content with title, text, tables, and related articles
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SFIcon } from '../components/SFIcon';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getArticleContent,
  getRelatedArticles,
  type ContentSection,
} from '../content/aide';

const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
  tableHeader: '#E8D5C4',
};

interface ArticleContent {
  id: string;
  title: string;
  sections: Array<{
    type: 'text' | 'table';
    content?: string;
    table?: {
      headers: string[];
      rows: Array<{ col1: string; col2: string }>;
    };
  }>;
}

const OLD_ARTICLE_CONTENTS: Record<string, ArticleContent> = {
  '1': {
    id: '1',
    title: 'Comprendre les cycles de sommeil de bébé',
    sections: [
      {
        type: 'text',
        content: 'Le sommeil de bébé fonctionne par cycles composés de deux phases : le sommeil léger (sommeil paradoxal) et le sommeil profond (sommeil lent). Comprendre ces cycles peut aider à respecter les besoins naturels de sommeil de votre bébé.',
      },
      {
        type: 'table',
        table: {
          headers: ['Phase', 'Description'],
          rows: [
            {
              col1: 'Sommeil léger (paradoxal)',
              col2: 'Phase de sommeil léger durant laquelle bébé rêve plus, bouge légèrement et se réveille facilement.',
            },
            {
              col1: 'Sommeil profond (lent)',
              col2: 'Phase de sommeil profond durant laquelle bébé dort profondément, récupère et est plus difficile à réveiller.',
            },
          ],
        },
      },
      {
        type: 'text',
        content: 'Les cycles de bébé durent environ 50 à 60 minutes, bien plus courts que ceux des adultes. Respecter ces phases permet de favoriser un meilleur sommeil à votre bébé.',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Astuces pour aider bébé à s\'endormir',
    sections: [
      {
        type: 'text',
        content: 'L\'endormissement de bébé peut parfois être un défi. Voici quelques techniques douces et efficaces pour faciliter ce moment.',
      },
      {
        type: 'text',
        content: '1. Créer un rituel du coucher : Répétez les mêmes gestes chaque soir (bain, berceuse, câlin) pour signaler à bébé que c\'est l\'heure de dormir.\n\n2. Maintenir une température idéale : La chambre doit être entre 18 et 20°C pour un sommeil optimal.\n\n3. Utiliser le bruit blanc : Un fond sonore constant peut rassurer bébé et masquer les bruits extérieurs.\n\n4. Emmailloter avec douceur : Pour les nouveau-nés, l\'emmaillotage rappelle le confort du ventre maternel.\n\n5. Observer les signes de fatigue : Couchez bébé dès les premiers signes (bâillements, frottement des yeux) avant qu\'il ne soit trop fatigué.',
      },
    ],
  },
  '3': {
    id: '3',
    title: 'Les routines du coucher',
    sections: [
      {
        type: 'text',
        content: 'Une routine régulière du coucher aide bébé à comprendre que la nuit approche et favorise un endormissement plus facile.',
      },
      {
        type: 'text',
        content: 'Une bonne routine peut inclure :\n\n• Un bain tiède relaxant\n• Un massage doux avec une crème hydratante\n• Le dernier biberon ou tétée dans le calme\n• Une berceuse ou une histoire douce\n• Des câlins et bisous\n• Coucher bébé dans son lit encore éveillé mais somnolent\n\nL\'important est de répéter ces étapes dans le même ordre chaque soir, à la même heure. La régularité rassure bébé et l\'aide à anticiper le sommeil.',
      },
    ],
  },
  '4': {
    id: '4',
    title: 'Diversification alimentaire',
    sections: [
      {
        type: 'text',
        content: 'La diversification alimentaire débute généralement entre 4 et 6 mois. C\'est une étape importante qui permet à bébé de découvrir de nouvelles saveurs et textures.',
      },
      {
        type: 'text',
        content: 'Premiers aliments à introduire :\n\n• Purées de légumes doux (carottes, courgettes, patates douces)\n• Compotes de fruits (pomme, poire, banane)\n• Céréales infantiles sans gluten\n\nIntroduisez un seul nouvel aliment à la fois, attendez 3 jours avant d\'en proposer un autre pour détecter d\'éventuelles allergies. Commencez par de petites quantités (quelques cuillères) et augmentez progressivement.\n\nLe lait (maternel ou infantile) reste l\'aliment principal jusqu\'à 12 mois.',
      },
    ],
  },
  '5': {
    id: '5',
    title: 'Allaitement : les bases',
    sections: [
      {
        type: 'text',
        content: 'L\'allaitement maternel est recommandé par l\'OMS comme mode d\'alimentation exclusif jusqu\'à 6 mois. Voici les bases pour bien démarrer.',
      },
      {
        type: 'text',
        content: 'Conseils pour un bon démarrage :\n\n• Mettez bébé au sein dès la première heure après la naissance\n• Allaitez à la demande, sans restriction d\'horaires\n• Assurez-vous d\'une bonne prise du sein (bouche grande ouverte, menton contre le sein)\n• Alternez les seins à chaque tétée\n• Restez hydratée et mangez équilibré\n• Reposez-vous autant que possible\n\nLes premières semaines peuvent être difficiles. N\'hésitez pas à consulter une sage-femme ou une consultante en lactation si vous rencontrez des difficultés.',
      },
    ],
  },
  '6': {
    id: '6',
    title: 'Quelle température pour la chambre ?',
    sections: [
      {
        type: 'text',
        content: 'La température de la chambre de bébé joue un rôle important dans la qualité de son sommeil et sa sécurité.',
      },
      {
        type: 'text',
        content: 'Température idéale : entre 18°C et 20°C\n\nComment habiller bébé selon la température :\n\n• 20°C et plus : body + gigoteuse légère (0.5 TOG)\n• 18-20°C : body + pyjama + gigoteuse (1-2 TOG)\n• 16-18°C : body + pyjama chaud + gigoteuse épaisse (2.5 TOG)\n\nSignes que bébé a trop chaud : nuque moite, joues rouges, respiration rapide\nSignes que bébé a froid : extrémités froides, peau marbrée\n\nUtilisez un thermomètre dans la chambre et ajustez la gigoteuse plutôt que d\'utiliser des couvertures (risque d\'étouffement).',
      },
    ],
  },
  '7': {
    id: '7',
    title: 'Les étapes du développement moteur',
    sections: [
      {
        type: 'text',
        content: 'Le développement moteur de bébé suit généralement un ordre prévisible, bien que chaque enfant évolue à son propre rythme.',
      },
      {
        type: 'text',
        content: 'Repères par âge (moyennes) :\n\n0-3 mois :\n• Suit des objets du regard\n• Tient sa tête quelques secondes\n• Découvre ses mains\n\n4-6 mois :\n• Se retourne du dos sur le ventre\n• Attrape des objets\n• Commence à s\'asseoir avec soutien\n\n7-9 mois :\n• Tient assis seul\n• Commence à ramper\n• Fait passer les objets d\'une main à l\'autre\n\n10-12 mois :\n• Se met debout en se tenant\n• Fait ses premiers pas avec appui\n• Développe la pince (pouce-index)\n\nRappelez-vous : ces repères sont indicatifs. Consultez votre pédiatre si vous avez des inquiétudes.',
      },
    ],
  },
  '8': {
    id: '8',
    title: 'Fièvre : quand s\'inquiéter ?',
    sections: [
      {
        type: 'text',
        content: 'La fièvre est une réaction normale du corps face à une infection. Voici comment réagir et quand consulter.',
      },
      {
        type: 'text',
        content: 'Température normale : 36.5°C à 37.5°C (rectale)\nFièvre légère : 37.5°C à 38.5°C\nFièvre modérée : 38.5°C à 39°C\nFièvre élevée : au-dessus de 39°C\n\nQuand consulter en urgence :\n\n• Bébé a moins de 3 mois et a de la fièvre\n• Fièvre supérieure à 40°C\n• Convulsions fébriles\n• Comportement anormal (très apathique, difficultés à respirer)\n• Éruption cutanée qui ne disparaît pas à la pression\n• Fièvre qui dure plus de 3 jours\n\nGestes à adopter :\n• Découvrez bébé (ne le couvrez pas)\n• Proposez régulièrement à boire\n• Aérez la pièce (19-20°C)\n• Donnez du paracétamol si prescrit par le médecin\n• Surveillez l\'évolution',
      },
    ],
  },
};

export function ArticleDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { articleId } = route.params || {};

  // Try new system first, fallback to old placeholder
  const newArticle = getArticleContent(articleId);
  const oldArticle = OLD_ARTICLE_CONTENTS[articleId];
  const article = newArticle || oldArticle || OLD_ARTICLE_CONTENTS['2'];

  const relatedArticles = newArticle ? getRelatedArticles(articleId) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }}>
      {/* Sticky Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: THEME.bg,
      }}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          hitSlop={10}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <SFIcon name="chevron.left" size={24} color={THEME.text} />
        </Pressable>
        <Image
          source={require('../../assets/Header.png')}
          style={{ width: 120, height: 36 }}
          resizeMode="contain"
        />
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        {/* Title */}
        <Text style={{ 
          fontSize: 24, 
          fontWeight: '900', 
          color: THEME.text, 
          textAlign: 'center', 
          marginBottom: 24,
          lineHeight: 32,
        }}>
          {article.title}
        </Text>

        {/* Content Sections */}
        {article.sections.map((section: any, index: number) => (
          <View key={index} style={{ marginBottom: 20 }}>
            {section.type === 'text' && section.content && (
              <Text style={{ 
                fontSize: 15, 
                color: THEME.text, 
                lineHeight: 24,
                textAlign: 'justify',
              }}>
                {section.content}
              </Text>
            )}

            {section.type === 'list' && section.items && (
              <View>
                {section.items.map((item: string, itemIndex: number) => (
                  <Text 
                    key={itemIndex}
                    style={{ 
                      fontSize: 15, 
                      color: THEME.text, 
                      lineHeight: 24,
                      marginBottom: 8,
                    }}
                  >
                    • {item}
                  </Text>
                ))}
              </View>
            )}

            {section.type === 'table' && section.table && (
              <View style={{ 
                backgroundColor: THEME.card, 
                borderRadius: 16, 
                padding: 16,
                marginTop: 8,
              }}>
                {/* Table Headers */}
                <View style={{ 
                  flexDirection: 'row', 
                  backgroundColor: THEME.tableHeader, 
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                }}>
                  {section.table.headers.map((header: string, headerIndex: number) => (
                    <Text 
                      key={headerIndex}
                      style={{ 
                        flex: headerIndex === 0 ? 1 : 2, 
                        fontSize: 14, 
                        fontWeight: '700', 
                        color: THEME.text,
                        paddingRight: headerIndex < section.table.headers.length - 1 ? 8 : 0,
                      }}
                    >
                      {header}
                    </Text>
                  ))}
                </View>

                {/* Table Rows */}
                {section.table.rows.map((row: any, rowIndex: number) => (
                  <View 
                    key={rowIndex} 
                    style={{ 
                      flexDirection: 'row', 
                      paddingVertical: 12,
                      borderBottomWidth: rowIndex < section.table.rows.length - 1 ? 1 : 0,
                      borderBottomColor: THEME.line,
                    }}
                  >
                    {Object.keys(row).map((key, colIndex) => (
                      <Text 
                        key={key}
                        style={{ 
                          flex: colIndex === 0 ? 1 : 2, 
                          fontSize: 13, 
                          color: THEME.text,
                          lineHeight: 20,
                          paddingRight: colIndex < Object.keys(row).length - 1 ? 8 : 0,
                        }}
                      >
                        {row[key]}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <View style={{ marginTop: 32 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '800', 
              color: THEME.text,
              marginBottom: 16,
            }}>
              Articles associés
            </Text>
            
            {relatedArticles.map(relatedArticle => (
              <Pressable
                key={relatedArticle.id}
                // @ts-ignore
                onPress={() => navigation.push('ArticleDetail', { articleId: relatedArticle.id })}
                style={{ 
                  backgroundColor: THEME.card, 
                  borderRadius: 16, 
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 15, 
                    fontWeight: '700', 
                    color: THEME.text,
                    marginBottom: 4,
                  }}>
                    {relatedArticle.title}
                  </Text>
                  <Text style={{ 
                    fontSize: 13, 
                    color: THEME.muted,
                    lineHeight: 18,
                  }}>
                    {relatedArticle.description}
                  </Text>
                </View>
                <SFIcon name="chevron.right" size={20} color={THEME.muted} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


