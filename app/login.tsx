import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Xato', 'Barcha maydonlarni to\'ldiring');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Xato', error.message || 'Kirishda xatolik');
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !phone) {
      Alert.alert('Xato', 'Barcha maydonlarni to\'ldiring');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Xato', 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, fullName, phone);
    setLoading(false);

    if (error) {
      Alert.alert('Xato', error.message || 'Ro\'yxatdan o\'tishda xatolik');
    } else {
      Alert.alert('Muvaffaqiyatli', 'Hisobingiz yaratildi!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <MaterialIcons name="work" size={80} color={colors.primary} />
            <Text style={styles.title}>ProStaff Worker</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Ishchi sifatida ro\'yxatdan o\'ting' : 'Tizimga kiring'}
            </Text>
          </View>

          <View style={styles.form}>
            {isSignUp && (
              <>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="person" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="To'liq ismingiz"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="phone" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Telefon raqamingiz"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Parol"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={isSignUp ? handleSignUp : handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>
                  {isSignUp ? 'Ro\'yxatdan o\'tish' : 'Kirish'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.switchText}>
                {isSignUp
                  ? 'Allaqachon hisobingiz bormi? Kirish'
                  : 'Hisobingiz yo\'qmi? Ro\'yxatdan o\'tish'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    height: 48,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
