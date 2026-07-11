import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useGetStudentDashboard, useGetDailyWird } from '@workspace/api-client-react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

function StatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  accent?: boolean;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: accent ? colors.primary : colors.card,
          borderColor: accent ? 'transparent' : colors.border,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color={accent ? colors.secondary : colors.primary}
      />
      <Text
        style={[
          styles.statValue,
          { color: accent ? colors.primaryForeground : colors.primary },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.statLabel,
          { color: accent ? 'rgba(249,245,235,0.75)' : colors.mutedForeground },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data: dashboard, isLoading, refetch } = useGetStudentDashboard();
  const { data: wird } = useGetDailyWird();

  const progressPct = dashboard?.totalRulesCount
    ? Math.round(
        ((dashboard.masteredRulesCount ?? 0) / dashboard.totalRulesCount) * 100
      )
    : 0;

  const CIRCLE_R = 44;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;
  const strokeDash = (progressPct / 100) * CIRCUMFERENCE;

  const topPad = insets.top + (Platform.OS === 'web' ? 67 : 0) + 8;
  const botPad = insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 80;

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.loadingPulse, { backgroundColor: colors.muted }]} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: botPad, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(50)}>
        <Text style={[styles.greeting, { color: colors.primary }]}>
          السلام عليكم ورحمة الله
        </Text>
        <Text style={[styles.greetingSub, { color: colors.mutedForeground }]}>
          أهلاً بكِ في مساحتكِ التعليمية
        </Text>
      </Animated.View>

      {/* Progress Ring */}
      <Animated.View
        entering={FadeInDown.delay(150)}
        style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.progressRow}>
          {/* SVG Ring */}
          <View style={styles.ringContainer}>
            <View style={styles.svgWrapper}>
              {/* Background ring */}
              <View
                style={[
                  styles.ringBg,
                  { borderColor: colors.muted },
                ]}
              />
              {/* We use a simple percentage text since SVG requires react-native-svg */}
              <View style={styles.ringCenter}>
                <Text style={[styles.ringPct, { color: colors.primary }]}>{progressPct}%</Text>
                <Text style={[styles.ringLabel, { color: colors.mutedForeground }]}>إتقان</Text>
              </View>
            </View>
          </View>

          <View style={styles.progressInfo}>
            <Text style={[styles.progressTitle, { color: colors.primary }]}>
              تقدمكِ العام
            </Text>
            <Text style={[styles.progressDesc, { color: colors.mutedForeground }]}>
              أتقنتِ{' '}
              <Text style={{ fontFamily: 'Inter_700Bold', color: colors.secondary }}>
                {dashboard?.masteredRulesCount ?? 0}
              </Text>{' '}
              من أصل{' '}
              <Text style={{ fontFamily: 'Inter_700Bold', color: colors.primary }}>
                {dashboard?.totalRulesCount ?? 0}
              </Text>{' '}
              حكماً
            </Text>
            {dashboard?.daysRemaining != null && (
              <View style={[styles.daysTag, { backgroundColor: colors.secondary + '20' }]}>
                <Ionicons name="calendar-outline" size={13} color={colors.secondary} />
                <Text style={[styles.daysText, { color: colors.secondary }]}>
                  {dashboard.daysRemaining} يوم متبقٍ
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.statsGrid}>
        <StatCard
          label="واجبات معلقة"
          value={dashboard?.pendingAssignments ?? 0}
          icon="document-text-outline"
          accent
        />
        <StatCard
          label="تلاوات للتقييم"
          value={dashboard?.pendingRecordingFeedback ?? 0}
          icon="mic-outline"
        />
        <StatCard
          label="شهادات"
          value={dashboard?.certificates?.length ?? 0}
          icon="ribbon-outline"
        />
      </Animated.View>

      {/* Course card */}
      {dashboard?.activeEnrollment && (
        <Animated.View entering={FadeInDown.delay(250)}>
          <View
            style={[
              styles.courseCard,
              { backgroundColor: colors.primary, borderColor: 'transparent' },
            ]}
          >
            <View style={styles.courseHeader}>
              <Ionicons name="book" size={18} color={colors.secondary} />
              <Text style={[styles.courseSub, { color: 'rgba(249,245,235,0.75)' }]}>
                الدورة الحالية
              </Text>
            </View>
            <Text style={[styles.courseTitle, { color: colors.primaryForeground }]}>
              {dashboard.activeEnrollment.course?.title ?? 'دورة التجويد'}
            </Text>
            <Text style={[styles.courseLevel, { color: colors.secondary }]}>
              المستوى {dashboard.activeEnrollment.course?.level === 1 ? 'الأول' : 'الثاني'}
            </Text>
          </View>
        </Animated.View>
      )}

      {!dashboard?.activeEnrollment && (
        <Animated.View entering={FadeInDown.delay(250)}>
          <View style={[styles.enrollCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Ionicons name="time-outline" size={24} color={colors.mutedForeground} />
            <Text style={[styles.enrollText, { color: colors.mutedForeground }]}>
              في انتظار قبول طلب الانضمام
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Daily wird */}
      {wird && (
        <Animated.View entering={FadeInDown.delay(300)}>
          <View
            style={[styles.wirdCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.wirdHeader}>
              <Ionicons name="star-outline" size={16} color={colors.secondary} />
              <Text style={[styles.wirdLabel, { color: colors.secondary }]}>
                وِرد اليوم
              </Text>
            </View>
            <Text style={[styles.wirdTitle, { color: colors.primary }]}>{wird.title}</Text>
            <Text
              style={[styles.wirdContent, { color: colors.mutedForeground }]}
              numberOfLines={3}
            >
              {wird.content}
            </Text>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingPulse: { width: 200, height: 200, borderRadius: 100 },
  greeting: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  greetingSub: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    marginBottom: 20,
  },
  progressCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  progressRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16 },
  ringContainer: { width: 100, height: 100 },
  svgWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBg: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 8,
  },
  ringCenter: { alignItems: 'center' },
  ringPct: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  ringLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: -2 },
  progressInfo: { flex: 1, gap: 6 },
  progressTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', textAlign: 'right' },
  progressDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', textAlign: 'right', lineHeight: 20 },
  daysTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },
  daysText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  statsGrid: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  courseCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    gap: 6,
  },
  courseHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  courseSub: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  courseTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', textAlign: 'right' },
  courseLevel: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'right' },
  enrollCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    gap: 8,
  },
  enrollText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  wirdCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 8,
  },
  wirdHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  wirdLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  wirdTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', textAlign: 'right' },
  wirdContent: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'right', lineHeight: 22 },
});
