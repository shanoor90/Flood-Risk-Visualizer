import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ImageBackground, 
  SafeAreaView, 
  Platform,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import GlassCard from '../components/GlassCard';
import { authService } from '../services/authService';

// Verify this file exists: frontend/assets/images/login_bg.jpg
const loginBgImage = require('../../assets/images/login_bg.jpg');

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (username && email && password) {
      setLoading(true);
      try {
        await authService.signup(email, password, username);
        setLoading(false);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } catch (error) {
        setLoading(false);
        Alert.alert('Signup Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <ImageBackground source={loginBgImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          {/* Added KeyboardAvoidingView to prevent keyboard from covering inputs */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              
              <GlassCard style={styles.card} intensity={30}>
                <View style={styles.contentContainer}>
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>Join FloodGuard for real-time safety.</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Choose a username"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={username}
                      onChangeText={setUsername}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleSignup}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
                  </TouchableOpacity>

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                      <Text style={styles.linkText}>Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>

            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 20, 40, 0.4)', 
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0, 
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
  },
  contentContainer: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#60a5fa',
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
  },
  linkText: {
    color: '#60a5fa',
    fontWeight: 'bold',
  },
});