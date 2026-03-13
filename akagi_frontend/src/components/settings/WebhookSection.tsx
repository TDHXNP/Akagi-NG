import { type FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { CapsuleSwitch } from '@/components/ui/capsule-switch';
import { Input } from '@/components/ui/input';
import { SettingsItem } from '@/components/ui/settings-item';
import type { Paths, PathValue, Settings } from '@/types';

interface WebhookSectionProps {
  settings: Settings;
  updateSetting: <P extends Paths<Settings>>(
    path: readonly [...P],
    value: PathValue<Settings, P>,
    shouldDebounce?: boolean,
  ) => void;
}

export const WebhookSection: FC<WebhookSectionProps> = memo(({ settings, updateSetting }) => {
  const { t } = useTranslation();

  return (
    <div className='space-y-4'>
      <h3 className='settings-section-title'>{t('settings.webhook.title')}</h3>

      <SettingsItem label={t('settings.webhook.enabled')}>
        <CapsuleSwitch
          className='w-fit max-w-full'
          checked={settings.webhook.enabled}
          onCheckedChange={(val) => {
            updateSetting(['webhook', 'enabled'], val);
          }}
          labelOn={t('common.on')}
          labelOff={t('common.off')}
        />
      </SettingsItem>

      {settings.webhook.enabled && (
        <SettingsItem label={t('settings.webhook.url')}>
          <Input
            value={settings.webhook.url}
            placeholder='https://example.com/webhook'
            onChange={(e) => updateSetting(['webhook', 'url'], e.target.value)}
          />
        </SettingsItem>
      )}
    </div>
  );
});

WebhookSection.displayName = 'WebhookSection';
