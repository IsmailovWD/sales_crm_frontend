import { computed, h, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { Moon, Speedometer, Sunny } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { DeviceMeetingRoom24Filled } from '@vicons/fluent'

export default function useTheme() {
  const { t } = useI18n() // Access translation function

  const modeOptions = computed(() => [
    {
      icon: () => h(NIcon, {}, { default: () => h(Sunny) }),
      key: 'light',
      label: t('mode.light'),
    },
    {
      icon: () => h(NIcon, null, { default: () => h(Moon) }),
      key: 'dark',
      label: t('mode.dark'),
    },
    {
      icon: () => h(NIcon, null, { default: () => h(DeviceMeetingRoom24Filled) }),
      key: 'auto',
      label: t('mode.auto'),
    },
  ])

  return { modeOptions }
}
