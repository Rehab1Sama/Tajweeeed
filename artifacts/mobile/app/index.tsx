import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function LandingScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/(tabs)');
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || isSignedIn) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.primary }]} />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header gradient */}
      <LinearGradient
        colors={['#0D5454', '#0A4545E0', '#0D545400']}
        style={[
          styles.gradient,
          {
            paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) + 24,
          },
        ]}
      >
        <Animated.View entering={FadeIn.delay(200)} style={styles.logoArea}>
          <View style={styles.logoRing}>
            <Ionicons name="moon" size={28} color="#C89428" />
          </View>
          <Text style={styles.appName}>نور التجويد</Text>
        </Animated.View>
      </LinearGradient>

      {/* Content */}
      <Animated.View
        entering={FadeInUp.delay(300).springify()}
        style={[
          styles.content,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 32,
          },
        ]}
      >
        <View style={styles.heroText}>
          <Text style={[styles.headline, { color: colors.primary }]}>
            رتّلي القرآن
          </Text>
          <Text style={[styles.headlineGold, { color: colors.secondary }]}>
            كما أنزل
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            مساحة تعليمية هادئة ومتخصصة للنساء لتعلم أحكام التجويد وفهمها
            فهماً علمياً صحيحاً
          </Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: 'book-outline' as const, text: 'دروس مرئية ومكتوبة' },
            { icon: 'mic-outline' as const, text: 'تسجيل وتقييم التلاوة' },
            { icon: 'bar-chart-outline' as const, text: 'تتبع التقدم والإتقان' },
          ].map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <Ionicons name={f.icon} size={18} color={colors.secondary} />
              <Text
                style={[styles.featureText, { color: colors.mutedForeground }]}
              >
                {f.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => router.push('/sign-in')}
          >
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
              تسجيل الدخول
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                borderColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => router.push('/sign-up')}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>
              إنشاء حساب جديد
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1 },
  container: { flex: 1 },
  gradient: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  logoArea: { alignItems: 'center', gap: 10 },
  logoRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#C89428',
    backgroundColor: 'rgba(200,148,40,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: '#F9F5EB',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingTop: 36,
  },
  heroText: { alignItems: 'center', gap: 4 },
  headline: {
    fontSize: 44,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    lineHeight: 52,
  },
  headlineGold: {
    fontSize: 44,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginTop: -4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
    maxWidth: 320,
    fontFamily: 'Inter_400Regular',
  },
  features: { gap: 10, paddingHorizontal: 8 },
  featureRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
  buttons: { gap: 12 },
  primaryBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
