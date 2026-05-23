import { computed } from 'vue'
import { useSettings } from './use-settings'

export type Lang = 'zh' | 'en'

export function useLocale() {
  const settings = useSettings()

  // Derived from settings.language so it persists to localStorage
  const lang = computed<Lang>(() => settings.language === 'en' ? 'en' : 'zh')

  function toggleLang() {
    settings.language = settings.language === 'en' ? 'zh-CN' : 'en'
  }

  return { lang, toggleLang }
}
