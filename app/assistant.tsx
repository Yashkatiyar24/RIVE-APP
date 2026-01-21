import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAppStore, ChatMessage } from '../store/useAppStore';
import RiveBuddy from '../components/RiveBuddy';
import AIOwl from '../components/AIOwl';
import { useBuddy } from '../context/BuddyProvider';

/**
 * AI Assistant Screen
 * 
 * Chat interface with AI Owl and floating buddy.
 * Buddy reacts to:
 * - Sending messages (focused mood)
 * - Thinking/processing (thinking animation)
 * - Receiving replies (happy + celebrate)
 */

export default function AssistantScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { chatMessages, isThinking, addChatMessage, setIsThinking } = useAppStore();
  const [inputText, setInputText] = useState('');
  const buddy = useBuddy();

  // Set initial mood on mount
  useEffect(() => {
    buddy.setMood('happy');
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatMessages]);

  // Sync thinking state with buddy
  useEffect(() => {
    if (isThinking) {
      buddy.onChatThinkingStart();
    }
  }, [isThinking]);

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      // Notify buddy of message send
      buddy.onChatSend();

      // Add user message
      addChatMessage({
        id: `msg-${Date.now()}`,
        text: inputText,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        isUser: true,
      });

      setInputText('');

      // Start thinking
      setIsThinking(true);
      buddy.onChatThinkingStart();

      // Simulate AI response after 2 seconds
      setTimeout(() => {
        addChatMessage({
          id: `msg-${Date.now()}-ai`,
          text: 'Great question! Let me help you with that. Education is a fascinating topic with many interesting aspects to explore. I can help you learn about various subjects, from science and mathematics to history and languages.',
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          isUser: false,
        });

        // Stop thinking and celebrate reply
        setIsThinking(false);
        buddy.onChatReply();
      }, 2000);
    }
  }, [inputText, addChatMessage, setIsThinking, buddy]);

  const handleBuddyTap = useCallback(() => {
    if (!isThinking) {
      buddy.triggerWink();
    }
  }, [isThinking, buddy]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
              data-testid="back-button"
            >
              <Text style={styles.backIcon}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle}>AI Assistant</Text>
            <Pressable style={styles.menuButton} data-testid="menu-button">
              <Text style={styles.menuIcon}>☰</Text>
            </Pressable>
          </View>

          {/* AI Owl Character with Buddy in corner */}
          <View style={styles.heroSection}>
            <View style={styles.owlContainer}>
              <AIOwl
                size="medium"
                isThinking={isThinking}
                onTap={handleBuddyTap}
              />
            </View>

            {/* Floating Buddy - reacts to chat state */}
            <View style={styles.heroBuddy}>
              <RiveBuddy
                size="small"
                showStreak={true}
                pointerEvents="none"
                onTap={() => buddy.triggerCelebrate()}
              />
            </View>
          </View>

          {/* Thinking Text */}
          <View style={styles.thinkingContainer}>
            <Text style={styles.thinkingText}>
              {isThinking ? 'AI Owl is Thinking..' : 'AI Owl is Ready!'}
            </Text>
          </View>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {chatMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser && styles.messageContainerUser,
                ]}
                data-testid={message.isUser ? 'user-message' : 'ai-message'}
              >
                {!message.isUser && (
                  <View style={styles.aiAvatar}>
                    <Text style={styles.aiAvatarText}>🦉</Text>
                  </View>
                )}

                <View style={styles.messageBubbleWrapper}>
                  <View
                    style={[
                      styles.messageBubble,
                      message.isUser
                        ? styles.messageBubbleUser
                        : styles.messageBubbleAI,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        message.isUser && styles.messageTextUser,
                      ]}
                    >
                      {message.text}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.messageTime,
                      message.isUser && styles.messageTimeUser,
                    ]}
                  >
                    {message.timestamp}
                  </Text>
                </View>

                {message.isUser && (
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>👤</Text>
                  </View>
                )}
              </View>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <View style={styles.messageContainer}>
                <View style={styles.aiAvatar}>
                  <Text style={styles.aiAvatarText}>🦉</Text>
                </View>
                <View style={styles.thinkingBubble}>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, styles.dot1]} />
                    <View style={[styles.typingDot, styles.dot2]} />
                    <View style={[styles.typingDot, styles.dot3]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* GPT Badge */}
          <View style={styles.gptBadge}>
            <Text style={styles.gptIcon}>⚙️</Text>
            <Text style={styles.gptText}>Powered by GPT-5</Text>
          </View>

          {/* Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Describe your task.."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              data-testid="message-input"
            />
            <View style={styles.inputActions}>
              <Pressable style={styles.attachButton} data-testid="attach-button">
                <Text style={styles.attachIcon}>📎</Text>
                <Text style={styles.attachText}>Attach</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!inputText.trim()}
                data-testid="send-button"
              >
                <Text style={styles.sendIcon}>↑</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#1F2937',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: '#1F2937',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
    position: 'relative',
  },
  owlContainer: {
    backgroundColor: '#FFF8F0',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  heroBuddy: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  thinkingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  thinkingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 16,
  },
  chatContent: {
    gap: 16,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageContainerUser: {
    flexDirection: 'row-reverse',
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    fontSize: 20,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 20,
  },
  messageBubbleWrapper: {
    flex: 1,
    gap: 4,
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: '85%',
  },
  messageBubbleAI: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  messageBubbleUser: {
    backgroundColor: '#1F2937',
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937',
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
    paddingHorizontal: 4,
  },
  messageTimeUser: {
    textAlign: 'right',
  },
  thinkingBubble: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  gptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
    gap: 6,
  },
  gptIcon: {
    fontSize: 14,
  },
  gptText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    fontSize: 15,
    color: '#1F2937',
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  attachIcon: {
    fontSize: 16,
  },
  attachText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
