import React, { useEffect, useRef, useState } from 'react';
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
import { askKumo } from '../services/kumoChat';
import type { KumoMessage } from '../services/kumoChat';

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
}

const SUGGESTED_QUESTIONS = [
  "Combien d'heures de sommeil pour un bebe ?",
  'Comment reconnaitre les signes de faim ?',
  "Quelles activites d'eveil selon l'age ?",
  'Autre question...',
];

const WELCOME_MESSAGE =
  "Bonjour, je suis Kumo IA v2. Je peux vous aider sur le sommeil, l'alimentation et l'eveil de votre bebe. Quelle est votre question ?";

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
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSuggestionPress = (question: string) => {
    if (question === 'Autre question...') {
      setShowSuggestions(false);
      return;
    }
    handleSendMessage(question);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setShowSuggestions(false);
    setIsSending(true);

    try {
      const history: KumoMessage[] = [...messages, userMessage]
        .slice(-14)
        .map((m): KumoMessage => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

      const responseText = await askKumo(history);
      const botMessage: Message = {
        id: `${Date.now()}_bot`,
        text: responseText,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const rawError = String(error?.message || '');
      const isMissingKey = rawError.includes('OPENAI_API_KEY_MISSING');
      const isMissingRelayUrl = rawError.includes('KUMO_RELAY_URL_MISSING');
      const isTimeout = rawError.includes('KUMO_REQUEST_TIMEOUT');
      const normalizedReason = rawError
        .replace(/^OPENAI_API_ERROR:\s*/i, '')
        .replace(/^KUMO_RELAY_ERROR:\s*/i, '')
        .trim();
      const fallback = isMissingRelayUrl
        ? 'Configuration manquante: ajoute EXPO_PUBLIC_KUMO_RELAY_URL pour activer Kumo IA.'
        : isMissingKey
          ? 'Configuration manquante: active le relay (EXPO_PUBLIC_KUMO_USE_RELAY=1) ou configure EXPO_PUBLIC_OPENAI_API_KEY en mode direct.'
          : isTimeout
            ? 'Kumo ne repond pas pour le moment. Verifiez le serveur relay puis reessayez.'
          : `Impossible de contacter Kumo. ${normalizedReason || 'Verifiez la connexion puis reessayez.'}`;

      const botMessage: Message = {
        id: `${Date.now()}_error`,
        text: fallback,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(id);
  }, [messages, isSending]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bg }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScreenHeader showLogo />

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
                  <Text style={{ fontSize: 18 }}>U</Text>
                </View>
              )}

              <View
                style={{
                  flex: 1,
                  backgroundColor: message.sender === 'bot' ? THEME.botBubble : THEME.userBubble,
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
              </View>
            </View>
          ))}

          {isSending && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
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
              <View
                style={{
                  backgroundColor: THEME.botBubble,
                  borderRadius: 16,
                  padding: 14,
                  maxWidth: '80%',
                }}
              >
                <Text style={{ fontSize: 14, color: THEME.muted }}>Kumo ecrit...</Text>
              </View>
            </View>
          )}

          {showSuggestions && (
            <View style={{ marginTop: 8, gap: 10 }}>
              {SUGGESTED_QUESTIONS.map((question) => (
                <Pressable
                  key={question}
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
              placeholder="Ecrivez votre message..."
              placeholderTextColor={THEME.muted}
              style={{
                flex: 1,
                fontSize: 15,
                color: THEME.text,
                paddingVertical: 4,
                maxHeight: 100,
              }}
              multiline
              maxLength={800}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (inputText.trim() && !isSending) {
                  handleSendMessage();
                }
              }}
            />

            <Pressable
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim() || isSending}
              style={({ pressed }) => ({
                marginLeft: 8,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: inputText.trim() && !isSending ? THEME.primary : THEME.line,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <SFIcon
                name="paperplane.fill"
                size={18}
                color={inputText.trim() && !isSending ? THEME.card : THEME.muted}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
