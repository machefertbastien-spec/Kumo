import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SFIcon } from '../components/SFIcon';
import { ScreenHeader } from '../components/ui';

const THEME = {
  bg: '#F7F1EC',
  card: '#FBF8F6',
  text: '#4B3F39',
  muted: '#7A6A60',
  line: '#EFE7E1',
  primary: '#D48A63',
  botBubble: '#FBF8F6',
  userBubble: '#E8D5C4',
};

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  isTable?: boolean;
  tableData?: { age: string; hours: string }[];
}

const SUGGESTED_QUESTIONS = [
  "Combien d'heures de sommeil un bébé doit-il dormir ?",
  "Comment savoir si mon bébé a faim ?",
  "Quelles activités pour stimuler l'éveil de mon bébé ?",
  "Autre question...",
];

const WELCOME_MESSAGE = 
  "Bonjour ! Je suis ici pour répondre à vos questions et vous offrir des conseils sur le sommeil, l'alimentation, le temps d'éveil et tout ce qui concerne votre bébé. Comment puis-je vous aider ?";

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: WELCOME_MESSAGE,
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSuggestionPress = (question: string) => {
    if (question === "Autre question...") {
      setShowSuggestions(false);
      return;
    }
    
    handleSendMessage(question);
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setShowSuggestions(false);

    // Simulate bot response (you can replace this with actual API call)
    setTimeout(() => {
      let botResponse: Message;

      if (messageText.toLowerCase().includes('sommeil')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "La durée du sommeil d'un bébé dépend de son âge. Voici un tableau des durées de sommeil recommandées en fonction de l'âge du bébé :",
          sender: 'bot',
          isTable: true,
          tableData: [
            { age: '0 - 3 mois', hours: '14 - 17 heures' },
            { age: '4 - 6 mois', hours: '12 - 15 heures' },
            { age: '7 - 12 mois', hours: '11 - 14 heures' },
          ],
        };
      } else if (messageText.toLowerCase().includes('faim')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "Voici quelques signes que votre bébé a faim :\n\n• Il porte ses mains à sa bouche\n• Il tourne la tête à la recherche du sein\n• Il fait des mouvements de succion\n• Il pleure (signe tardif)\n• Il est agité\n\nIl est préférable de nourrir bébé dès les premiers signes plutôt que d'attendre les pleurs.",
          sender: 'bot',
        };
      } else if (messageText.toLowerCase().includes('éveil') || messageText.toLowerCase().includes('activité')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "Pour stimuler l'éveil de votre bébé, voici quelques activités adaptées :\n\n• Tummy time (temps sur le ventre) pour renforcer les muscles\n• Chansons et comptines pour le langage\n• Livres d'images contrastées\n• Jouets à textures variées\n• Miroir pour se découvrir\n• Promenades pour découvrir le monde\n\nAdaptez toujours les activités à l'âge et au rythme de votre bébé !",
          sender: 'bot',
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: "Je suis là pour vous aider avec toutes vos questions sur votre bébé. N'hésitez pas à me demander des conseils sur le sommeil, l'alimentation, le développement ou tout autre sujet qui vous préoccupe !",
          sender: 'bot',
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header with settings button */}
        <ScreenHeader showLogo />

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                flexDirection: message.sender === 'bot' ? 'row' : 'row-reverse',
                alignItems: 'flex-start',
                marginBottom: 16,
              }}
            >
              {/* Avatar */}
              {message.sender === 'bot' ? (
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: THEME.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    overflow: 'hidden',
                  }}
                >
                  <Image source={require('../../assets/Kumo-logo.png')} style={{ width: 28, height: 28 }} />
                </View>
              ) : (
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: THEME.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>👤</Text>
                </View>
              )}

              {/* Message Bubble */}
              <View
                style={{
                  flex: 1,
                  backgroundColor:
                    message.sender === 'bot' ? THEME.botBubble : THEME.userBubble,
                  borderRadius: 16,
                  padding: 14,
                  maxWidth: '80%',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: THEME.text,
                    lineHeight: 22,
                  }}
                >
                  {message.text}
                </Text>

                {/* Table (if exists) */}
                {message.isTable && message.tableData && (
                  <View
                    style={{
                      marginTop: 12,
                      backgroundColor: THEME.bg,
                      borderRadius: 12,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Table Header */}
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: THEME.primary,
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          fontWeight: '700',
                          color: THEME.card,
                        }}
                      >
                        Âge
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          fontWeight: '700',
                          color: THEME.card,
                        }}
                      >
                        Durée moyenne de sommeil
                      </Text>
                    </View>

                    {/* Table Rows */}
                    {message.tableData.map((row, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          padding: 10,
                          backgroundColor: index % 2 === 0 ? THEME.card : THEME.bg,
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 13,
                            color: THEME.text,
                            fontWeight: '600',
                          }}
                        >
                          {row.age}
                        </Text>
                        <Text
                          style={{
                            flex: 1,
                            fontSize: 13,
                            color: THEME.text,
                          }}
                        >
                          {row.hours}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {message.isTable && (
                  <Text
                    style={{
                      fontSize: 13,
                      color: THEME.muted,
                      marginTop: 12,
                      fontStyle: 'italic',
                    }}
                  >
                    Ces chiffres sont des moyennes, chaque bébé étant unique. Observez votre
                    bébé pour ajuster ces recommandations en fonction de son besoin de
                    sommeil. Besoin d'autre chose?
                  </Text>
                )}
              </View>
            </View>
          ))}

          {/* Suggested Questions */}
          {showSuggestions && (
            <View style={{ marginTop: 8, gap: 10 }}>
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSuggestionPress(question)}
                  style={({ pressed }) => ({
                    backgroundColor: THEME.card,
                    borderRadius: 16,
                    padding: 14,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: THEME.text,
                      fontWeight: '600',
                    }}
                  >
                    {question}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View
          style={{
            backgroundColor: THEME.bg,
            borderTopWidth: 1,
            borderTopColor: THEME.line,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: Platform.OS === 'ios' ? 8 : 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: THEME.card,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Écrivez votre message..."
              placeholderTextColor={THEME.muted}
              style={{
                flex: 1,
                fontSize: 15,
                color: THEME.text,
                paddingVertical: 4,
                maxHeight: 100,
              }}
              multiline
              maxLength={500}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (inputText.trim()) {
                  handleSendMessage();
                }
              }}
            />
            <Pressable
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim()}
              style={({ pressed }) => ({
                marginLeft: 8,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: inputText.trim() ? THEME.primary : THEME.line,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <SFIcon
                name="paperplane.fill"
                size={18}
                color={inputText.trim() ? THEME.card : THEME.muted}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
