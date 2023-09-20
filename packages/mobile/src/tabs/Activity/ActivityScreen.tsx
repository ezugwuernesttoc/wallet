import { openRequireWalletModal } from '$core/ModalContainer/RequireWallet/RequireWallet';
import { Screen, Text, Button, Icon, List, Spacer, Steezy, View } from '@tonkeeper/uikit';
import { getNewNotificationsCount } from '$core/Notifications/NotificationsActivity';
import { useNotificationsStore } from '$store/zustand/notifications';
import { useActivityList } from '@tonkeeper/shared/query/hooks';
import { Notification } from '$core/Notifications/Notification';
import { useWallet } from '@tonkeeper/shared/hooks/useWallet';
import { openNotificationsScreen } from '$navigation/helper';
import { ActivityList } from '@tonkeeper/shared/components';
import { useIsFocused } from '@react-navigation/native';
import { memo, useCallback, useEffect } from 'react';
import { useNavigation } from '@tonkeeper/router';
import { LayoutAnimation } from 'react-native';
import { t } from '@tonkeeper/shared/i18n';

export const ActivityScreen = memo(() => {
  const activityList = useActivityList();

  const nav = useNavigation();
  const wallet = useWallet();

  const notifications = useNotificationsStore((state) => state.notifications);
  const lastSeenAt = useNotificationsStore((state) => state.last_seen_activity_screen);
  const updateLastSeenActivityScreen = useNotificationsStore(
    (state) => state.actions.updateLastSeenActivityScreen,
  );

  const handlePressRecevie = useCallback(() => {
    if (wallet) {
      nav.go('ReceiveModal');
    } else {
      openRequireWalletModal();
    }
  }, [wallet]);

  const handlePressBuy = useCallback(() => {
    if (wallet) {
      nav.openModal('Exchange', { category: 'buy' });
    } else {
      openRequireWalletModal();
    }
  }, [wallet]);

  const onRemoveNotification = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      return () => updateLastSeenActivityScreen();
    }
  }, [isFocused, updateLastSeenActivityScreen]);

  const handleOpenNotificationsScreen = useCallback(() => {
    openNotificationsScreen();
  }, []);

  if (activityList.error) {
    return (
      <Screen>
        <View style={styles.emptyContainer}>
          <Text type="h2" textAlign="center">
            Ooops!
          </Text>
          <Spacer y={4} />
          <Text type="body1" color="textSecondary">
            {activityList.error}
          </Text>
          <View style={styles.emptyButtons}>
            <Button
              title={'Reload'}
              onPress={() => activityList.reload()}
              color="secondary"
              size="small"
            />
          </View>
        </View>
      </Screen>
    );
  }

  if (!wallet || (!activityList.isLoading && activityList.sections.length < 1)) {
    return (
      <Screen>
        <View style={styles.emptyContainer}>
          <Text type="h2" textAlign="center">
            {t('activity.empty_transaction_title')}
          </Text>
          <Spacer y={4} />
          <Text type="body1" color="textSecondary">
            {t('activity.empty_transaction_caption')}
          </Text>
          <View style={styles.emptyButtons}>
            <Button
              title={t('activity.buy_toncoin_btn')}
              onPress={handlePressBuy}
              color="secondary"
              size="small"
            />
            <Spacer x={12} />
            <Button
              title={t('activity.receive_btn')}
              onPress={handlePressRecevie}
              color="secondary"
              size="small"
            />
          </View>
        </View>
      </Screen>
    );
  }

  const newNotificationsCount = getNewNotificationsCount(notifications, lastSeenAt);

  const renderNotificationsHeader = notifications.length ? (
    <View>
      <Spacer y={12} />
      {notifications.slice(0, Math.min(newNotificationsCount, 2)).map((notification) => (
        <Notification
          onRemove={onRemoveNotification}
          notification={notification}
          key={notification.received_at}
        />
      ))}
      <List style={styles.listStyle.static}>
        <List.Item
          leftContent={
            <View style={styles.iconContainer}>
              <Icon name={'ic-bell-28'} color={'iconSecondary'} />
            </View>
          }
          rightContent={
            newNotificationsCount - 2 > 0 ? (
              <View style={styles.notificationsCount}>
                <Text type="label2">{newNotificationsCount - 2}</Text>
              </View>
            ) : null
          }
          onPress={handleOpenNotificationsScreen}
          title={t('notifications.notifications')}
          subtitle={t('notifications.from_connected')}
          chevron
        />
      </List>
    </View>
  ) : undefined;

  return (
    <Screen>
      <Screen.LargeHeader title={t('activity.screen_title')} />
      <ActivityList
        ListHeaderComponent={renderNotificationsHeader}
        isReloading={activityList.isReloading}
        isLoading={activityList.isLoading}
        sections={activityList.sections}
        hasMore={activityList.hasMore}
        onLoadMore={activityList.loadMore}
        onReload={activityList.reload}
      />
    </Screen>
  );
});

const styles = Steezy.create(({ colors }) => ({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  emptyButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
  emptyTitleText: {
    textAlign: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundContentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationsHeader: {},
  notificationsCount: {
    backgroundColor: colors.backgroundContentTint,
    minWidth: 24,
    paddingHorizontal: 7,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  listStyle: {
    marginBottom: 8,
  },
}));
