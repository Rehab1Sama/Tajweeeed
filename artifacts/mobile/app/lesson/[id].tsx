import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useGetLesson } from '@workspace/api-client-react';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: lesson, isLoading } = useGetLesson(Number(id));

  const botPad = insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 24;

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.pulse, { backgroundColor: colors.muted }]} />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.mutedForeground} />
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
          لم يتم العثور على الدرس
        </Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.primary }]}>
          <Text style={[styles.backBtnText, { color: colors.primaryForeground }]}>عودة</Text>
        </Pressable>
      </View>
    );
  }

  const content = stripHtml(lesson.content);
  const levelLabel = lesson.level === 1 ? 'المستوى الأول' : 'المستوى الثاني';

  const handleVideoPress = async () => {
    if (!lesson.videoUrl) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(lesson.videoUrl);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: botPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.headerBg, { backgroundColor: colors.primary }]}>
        <View style={styles.levelRow}>
          <View style={[styles.levelChip, { backgroundColor: colors.secondary + '30' }]}>
            <Text style={[styles.levelText, { color: colors.secondary }]}>{levelLabel}</Text>
          </View>
          <Text style={[styles.orderText, { color: 'rgba(249,245,235,0.6)' }]}>
            درس {lesson.orderIndex}
          </Text>
        </View>
        <Text style={[styles.lessonTitle, { color: colors.primaryForeground }]}>
          {lesson.title}
        </Text>
      </View>

      {/* Video button */}
      {lesson.videoUrl && (
        <Pressable
          style={({ pressed }) => [
            styles.videoBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
              marginHorizontal: 20,
              marginTop: 20,
            },
          ]}
          onPress={handleVideoPress}
        >
          <View style={[styles.videoIcon, { backgroundColor: colors.secondary }]}>
            <Ionicons name="play" size={18} color="#052E2E" />
          </View>
          <Text style={[styles.videoBtnText, { color: colors.primary }]}>
            مشاهدة الفيديو التعليمي
          </Text>
          <Ionicons name="open-outline" size={18} color={colors.mutedForeground} />
        </Pressable>
      )}

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>شرح الدرس</Text>
        <Text style={[styles.contentText, { color: colors.foreground }]}>
          {content}
        </Text>
      </View>

      {/* Tips section */}
      <View style={[styles.tipCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <View style={styles.tipHeader}>
          <Ionicons name="bulb-outline" size={18} color={colors.secondary} />
          <Text style={[styles.tipLabel, { color: colors.secondary }]}>نصيحة</Text>
        </View>
        <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
          احرصي على تطبيق ما تعلمتِه أثناء تلاوتك اليومية. التكرار هو مفتاح الإتقان.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  pulse: { width: 200, height: 20, borderRadius: 10 },
  errorText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  backBtn: { borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, marginTop: 4 },
  backBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  headerBg: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28, gap: 12 },
  levelRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  levelChip: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  levelText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  orderText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  lessonTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    lineHeight: 32,
  },
  videoBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  videoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBtnText: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', textAlign: 'right' },
  contentSection: { paddingHorizontal: 20, paddingTop: 24, gap: 10 },
  sectionLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textAlign: 'right' },
  contentText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    lineHeight: 26,
  },
  tipCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  tipHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  tipLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  tipText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'right', lineHeight: 22 },
});
