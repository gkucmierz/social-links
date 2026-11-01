<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { NanoSwitch, NanoSelect, GlobalTooltip } from '@gkucmierz/nano-ui'
import {
  SocialLinks,
  PREDEFINED_PROFILES,
  TYPE_DESKTOP,
  TYPE_MOBILE,
  TYPE_DEFAULT
} from '../src/main.ts'
import pkg from '../package.json'

const appVersion = pkg.version || '1.16.0'
const lang = ref('pl')
const copiedKey = ref('')
const studioInputRef = ref(null)
const studioFormRef = ref(null)

// Live interactive state
const rawInput = ref('http://www.linkedin.com/in/gkucmierz')
const selectedProfileMode = ref('auto')
const tableSearch = ref('')

// Engine Config state
const cfg = ref({
  usePredefinedProfiles: true,
  trimInput: true,
  allowQueryParams: false
})

// Custom profiles registered at runtime in the browser sandbox
const customProfiles = ref([])
const customForm = ref({
  name: 'bluesky',
  desktopMatch: '(https?://)?(www\\.)?bsky\\.app/profile/({PROFILE_ID})/?',
  desktopPattern: 'https://bsky.app/profile/{PROFILE_ID}',
  mobileMatch: '(https?://)?m\\.bsky\\.app/profile/({PROFILE_ID})/?',
  mobilePattern: 'https://m.bsky.app/profile/{PROFILE_ID}',
  sampleUrl: 'https://bsky.app/profile/gkucmierz.bsky.social'
})
const customStatusMsg = ref('')

// Tri-state (indeterminate) master switch for Engine Config flags
const allConfigFlagsOn = computed(
  () => cfg.value.usePredefinedProfiles && cfg.value.trimInput && cfg.value.allowQueryParams
)
const configFlagsIndeterminate = computed(() => {
  const count =
    Number(cfg.value.usePredefinedProfiles) +
    Number(cfg.value.trimInput) +
    Number(cfg.value.allowQueryParams)
  return count > 0 && count < 3
})
function toggleAllConfigFlags(nextVal) {
  const target = Boolean(nextVal)
  cfg.value.usePredefinedProfiles = target
  cfg.value.trimInput = target
  cfg.value.allowQueryParams = target
}

// Reactive SocialLinks instance rebuilt whenever config or customProfiles change
const socialLinksInstance = computed(() => {
  const instance = new SocialLinks({
    usePredefinedProfiles: cfg.value.usePredefinedProfiles,
    trimInput: cfg.value.trimInput,
    allowQueryParams: cfg.value.allowQueryParams
  })
  for (const cp of customProfiles.value) {
    instance.addProfile(cp.name, cp.matches)
  }
  return instance
})

const allProfilesList = computed(() => {
  const base = cfg.value.usePredefinedProfiles ? PREDEFINED_PROFILES : []
  return [...base, ...customProfiles.value]
})

const profileSelectOptions = computed(() => {
  const autoOpt = {
    value: 'auto',
    labelPl: '✨ Auto-detekcja (detectProfile)',
    labelEn: '✨ Auto-detect (detectProfile)',
    badge: 'AUTO',
    color: '#4ce6d1'
  }
  const profOpts = allProfilesList.value.map((p) => {
    const hasMobile = p.matches.some((m) => m.type === TYPE_MOBILE)
    return {
      value: p.name,
      label: p.name,
      badge: hasMobile ? 'DESKTOP + MOBILE' : 'DESKTOP',
      color: customProfiles.value.some((c) => c.name === p.name) ? '#f59e0b' : '#38bdf8'
    }
  })
  return [autoOpt, ...profOpts]
})

// Curated 1-click presets demonstrating v1.16.0 features
const presets = [
  {
    id: 'linkedin-in',
    label: 'LinkedIn (/in/)',
    url: 'http://www.linkedin.com/in/gkucmierz',
    profile: 'auto'
  },
  {
    id: 'linkedin-company',
    label: 'LinkedIn (/company/ • v1.16)',
    url: 'https://www.linkedin.com/company/gkucmierz/',
    profile: 'auto'
  },
  {
    id: 'linkedin-percent',
    label: 'Percent-Encoded (%C3%AD • v1.16)',
    url: 'https://de.linkedin.com/in/hugo-ben%C3%ADcio-11666815/',
    profile: 'auto'
  },
  {
    id: 'linkedin-cyrillic',
    label: 'Unicode / Cyrylica (v1.16)',
    url: 'https://www.linkedin.com/in/альмир-давлетов-21b3a5180',
    profile: 'auto'
  },
  {
    id: 'x-profile',
    label: 'X (x.com)',
    url: 'https://www.x.com/gkucmierz/',
    profile: 'auto'
  },
  {
    id: 'github-profile',
    label: 'GitHub',
    url: 'http://github.com/gkucmierz',
    profile: 'auto'
  },
  {
    id: 'mastodon-profile',
    label: 'Mastodon (@user)',
    url: 'https://mastodon.social/@gkucmierz',
    profile: 'auto'
  },
  {
    id: 'youtube-profile',
    label: 'YouTube (@channel)',
    url: 'https://www.youtube.com/@gkucmierz',
    profile: 'auto'
  },
  {
    id: 'lemmy-profile',
    label: 'Lemmy World',
    url: 'https://lemmy.world/u/gkucmierz',
    profile: 'auto'
  },
  {
    id: 'query-params',
    label: 'Link z ?utm_source=...',
    url: 'https://github.com/gkucmierz?utm_source=newsletter',
    profile: 'github'
  }
]

// Live evaluation results from SocialLinks
const evaluation = computed(() => {
  const sl = socialLinksInstance.value
  const input = rawInput.value || ''

  let detected = ''
  let scores = []
  try {
    detected = sl.detectProfile(input)
    scores = sl.scoreProfiles(input)
  } catch {}

  const targetProfile =
    selectedProfileMode.value === 'auto' ? detected : selectedProfileMode.value

  let isValid = false
  let profileId = null
  let sanitizedDefault = null
  let sanitizedDesktop = null
  let sanitizedMobile = null
  let errorMsg = null

  if (targetProfile && sl.hasProfile(targetProfile)) {
    try {
      isValid = sl.isValid(targetProfile, input)
      if (isValid) {
        profileId = sl.getProfileId(targetProfile, input)
        try {
          sanitizedDefault = sl.sanitize(targetProfile, input, TYPE_DEFAULT)
        } catch {}
        try {
          sanitizedDesktop = sl.sanitize(targetProfile, input, TYPE_DESKTOP)
        } catch {}
        try {
          sanitizedMobile = sl.sanitize(targetProfile, input, TYPE_MOBILE)
        } catch {}
      }
    } catch (err) {
      errorMsg = err?.message || String(err)
    }
  }

  return {
    input,
    detected,
    targetProfile,
    isValid,
    profileId,
    sanitizedDefault,
    sanitizedDesktop,
    sanitizedMobile,
    scores,
    errorMsg
  }
})

// Sync HTML5 CustomValidity with SocialLinks engine so :user-invalid / :user-valid reflect real profile match
watch(
  [rawInput, evaluation],
  () => {
    const el = studioInputRef.value
    if (!el || typeof el.setCustomValidity !== 'function') return
    const trimmed = rawInput.value.trim()
    if (!trimmed) {
      el.setCustomValidity(' Link lub identyfikator nie może być pusty.')
    } else if (!evaluation.value.isValid) {
      el.setCustomValidity(' Podany link nie pasuje do wybranego profilu.')
    } else {
      el.setCustomValidity('')
    }
    if (el.hasAttribute('aria-invalid')) {
      syncInputAriaInvalid(el)
    }
  },
  { immediate: true }
)

const generatedCodeSnippet = computed(() => {
  const ev = evaluation.value
  const profArg =
    selectedProfileMode.value === 'auto'
      ? `socialLinks.detectProfile(${JSON.stringify(ev.input)}) // -> ${JSON.stringify(ev.detected)}`
      : JSON.stringify(selectedProfileMode.value)

  const hasCustomConfig =
    !cfg.value.usePredefinedProfiles || !cfg.value.trimInput || cfg.value.allowQueryParams

  const configBlock = hasCustomConfig
    ? `const socialLinks = new SocialLinks({\n  usePredefinedProfiles: ${cfg.value.usePredefinedProfiles},\n  trimInput: ${cfg.value.trimInput},\n  allowQueryParams: ${cfg.value.allowQueryParams}\n});`
    : `const socialLinks = new SocialLinks();`

  const targetVar = selectedProfileMode.value === 'auto' ? 'profile' : JSON.stringify(ev.targetProfile)

  return `import { SocialLinks, TYPE_DESKTOP, TYPE_MOBILE } from 'social-links';

${configBlock}
const input = ${JSON.stringify(ev.input)};
${selectedProfileMode.value === 'auto' ? `const profile = ${profArg};\n` : ''}
const isValid = socialLinks.isValid(${targetVar}, input); // ${ev.isValid}
const profileId = socialLinks.getProfileId(${targetVar}, input); // ${JSON.stringify(ev.profileId)}
const desktopUrl = socialLinks.sanitize(${targetVar}, input, TYPE_DESKTOP);
// -> ${JSON.stringify(ev.sanitizedDesktop || ev.sanitizedDefault)}
${
  ev.sanitizedMobile
    ? `const mobileUrl = socialLinks.sanitize(${targetVar}, input, TYPE_MOBILE);\n// -> ${JSON.stringify(ev.sanitizedMobile)}`
    : '// (Ten profil używa ujednoliconego wzorca Desktop/Default)'
}`
})

function registerCustomProfile() {
  const name = customForm.value.name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
  if (!name) return
  const matches = [
    {
      match: customForm.value.desktopMatch.trim(),
      group: 3,
      type: TYPE_DESKTOP,
      pattern: customForm.value.desktopPattern.trim()
    }
  ]
  if (customForm.value.mobileMatch.trim() && customForm.value.mobilePattern.trim()) {
    matches.push({
      match: customForm.value.mobileMatch.trim(),
      group: 2,
      type: TYPE_MOBILE,
      pattern: customForm.value.mobilePattern.trim()
    })
  }
  matches.push({ match: '({PROFILE_ID})', group: 1 })

  const existingIdx = customProfiles.value.findIndex((p) => p.name === name)
  if (existingIdx >= 0) {
    customProfiles.value.splice(existingIdx, 1, { name, matches })
  } else {
    customProfiles.value.push({ name, matches })
  }

  rawInput.value = customForm.value.sampleUrl.trim()
  selectedProfileMode.value = name
  customStatusMsg.value =
    lang.value === 'pl'
      ? `Zarejestrowano profil "${name}" i załadowano do studia powyżej ✓`
      : `Registered profile "${name}" and loaded into the studio above ✓`
  setTimeout(() => {
    customStatusMsg.value = ''
  }, 4000)
}

function getSampleUrlForProfile(profileObj) {
  const firstDesktop =
    profileObj.matches.find((m) => m.type === TYPE_DESKTOP && m.pattern) ||
    profileObj.matches.find((m) => m.pattern)
  if (firstDesktop?.pattern) {
    return firstDesktop.pattern.replace('{PROFILE_ID}', 'gkucmierz')
  }
  return 'https://linkedin.com/in/gkucmierz'
}

function testProfileInStudio(profileObj) {
  rawInput.value = getSampleUrlForProfile(profileObj)
  selectedProfileMode.value = profileObj.name
  if (typeof window !== 'undefined') {
    document.getElementById('studio-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const filteredProfilesCatalog = computed(() => {
  const q = tableSearch.value.trim().toLowerCase()
  return allProfilesList.value
    .map((p) => {
      const desktopRule = p.matches.find((m) => m.type === TYPE_DESKTOP && m.pattern) || p.matches[0]
      const mobileRule = p.matches.find((m) => m.type === TYPE_MOBILE && m.pattern)
      return {
        name: p.name,
        matches: p.matches,
        rulesCount: p.matches.length,
        hasMobile: Boolean(mobileRule),
        primaryRegex: desktopRule?.match || '',
        desktopPattern: desktopRule?.pattern || '—',
        mobilePattern: mobileRule?.pattern || '—',
        sampleUrl: getSampleUrlForProfile(p)
      }
    })
    .filter((row) => {
      if (!q) return true
      return (
        row.name.toLowerCase().includes(q) ||
        row.primaryRegex.toLowerCase().includes(q) ||
        row.desktopPattern.toLowerCase().includes(q)
      )
    })
})

const uiText = computed(() =>
  lang.value === 'pl'
    ? {
        zeroDeps: '0 Zależności Runtime',
        tsBadge: 'TypeScript + CJS/ESM',
        brandSub:
          'Wykrywanie, walidacja i sanityzacja linków społecznościowych (Desktop & Mobile) • 26 gotowych profili',
        copyInstall: 'Kopiuj CLI',
        copied: 'Skopiowano ✓',
        heroTag1: '26 WBUDOWANYCH PLATFORM SPOŁECZNOŚCIOWYCH',
        heroTag2: 'SANITYZACJA DESKTOP & MOBILE (TYPE_DESKTOP / TYPE_MOBILE)',
        heroTag3: 'UNICODE + PERCENT-ENCODING + LINKEDIN COMPANY (v1.16)',
        heroHeading:
          'Jedna lekka biblioteka do wykrywania, walidacji i normalizacji linków social media.',
        heroLead:
          'Użytkownicy wklejają w formularzach wszystko: linki http:// bez SSL, subdomeny krajowe (de.linkedin.com), mobilne adresy (m.youtube.com, mwlite), ukośniki na końcu lub same nazwy użytkownika (@gkucmierz). Pakiet social-links zamienia dowolny wariant w czysty, kanoniczny URL lub wyodrębnia sam identyfikator {PROFILE_ID}.',
        pillars: [
          {
            num: '26',
            label: 'Gotowych profili platform',
            desc: 'Od LinkedIn (/in/ oraz /company/), X, GitHub, YouTube i Mastodon po Lemmy, Keybase, Substack, Twitch, Spotify oraz StackOverflow.'
          },
          {
            num: '0 Deps',
            label: 'Czysty TypeScript skompilowany do lib/',
            desc: 'Zero zewnętrznych zależności runtime. Pełne definicje typów .d.ts (Profile, ProfileMatch, Config, Score) dla projektów TS oraz JS.'
          },
          {
            num: 'v1.16.0',
            label: 'Diakrytyki, Cyrylica i %Hex',
            desc: 'Rozszerzony wzorzec PROFILE_ID obsługuje znaki międzynarodowe (\\u0080-\\uFFFF), kodowanie procentowe (%C3%AD) oraz profile firmowe LinkedIn.'
          }
        ],
        studioEyebrow: 'INTERAKTYWNE STUDIO NA ŻYWO (SILNIK TYPESCRIPT)',
        studioTitle: 'Tester Detekcji, Walidacji i Sanityzacji Linków',
        inputLabel: 'Wklej link społecznościowy lub identyfikator użytkownika',
        inputHint:
          'Format: pełny URL (np. https://de.linkedin.com/in/gkucmierz/) lub sam identyfikator profilu (np. gkucmierz)',
        inputError:
          'Wprowadzony ciąg nie pasuje do wybranego profilu lub zawiera niedozwolone parametry query.',
        presetsLabel: 'Szybkie presety testowe (1-klik):',
        profileSelectLabel: 'Docelowy profil walidacji',
        configTitle: 'Konfiguracja instancji new SocialLinks(config)',
        masterSwitchLabel: 'Wszystkie flagi silnika (tryb pełny / mieszany indeterminate)',
        resTitle: 'Wynik działania metod SocialLinks na żywo',
        codeTitle: 'Gotowy kod JS / TS dla bieżącego testu',
        copyCode: 'Kopiuj kod',
        customEyebrow: 'ROZSZERZALNOŚĆ • ADDPROFILE()',
        customTitle: 'Piaskownica Własnych Profili (socialLinks.addProfile)',
        customDesc:
          'Możesz w locie rejestrować własne sieci społecznościowe (np. Bluesky, Threads, Discord) przekazując tablicę reguł RegExp z tokenem {PROFILE_ID}.',
        registerBtn: 'Zarejestruj profil i przetestuj w Studio',
        tableEyebrow: 'MACIERZ WSZYSTKICH 26 WBUDOWANYCH PROFILI',
        tableTitle: 'Katalog Reguł Dopasowań i Wzorców Sanityzacji',
        tableCaption:
          'Zestawienie wszystkich 26 predefiniowanych profili w paczce social-links wraz z wyrażeniami regularnymi i wzorcami URL',
        searchPlaceholder: 'Filtruj spośród 26 profili (np. linkedin, mastodon, x, youtube)...',
        colProfile: 'Profil',
        colModes: 'Tryby',
        colRegex: 'Główny RegExp (match)',
        colPattern: 'Kanoniczny wzorzec (pattern)',
        colAction: 'Akcja',
        testBtn: 'Testuj w Studio ↑',
        footerNote:
          'Licencja MIT • Zero zależności runtime • Zbudowano w Vue 3 + @gkucmierz/nano-ui + vue-url-cleaner'
      }
    : {
        zeroDeps: '0 Runtime Deps',
        tsBadge: 'TypeScript + CJS/ESM',
        brandSub:
          'Detect, validate & sanitize social media links (Desktop & Mobile) • 26 predefined profiles',
        copyInstall: 'Copy CLI',
        copied: 'Copied ✓',
        heroTag1: '26 PREDEFINED SOCIAL PLATFORMS',
        heroTag2: 'DESKTOP & MOBILE SANITIZATION (TYPE_DESKTOP / TYPE_MOBILE)',
        heroTag3: 'UNICODE + PERCENT-ENCODING + LINKEDIN COMPANY (v1.16)',
        heroHeading:
          'One zero-dependency library to detect, validate, and normalize social media URLs.',
        heroLead:
          'Users paste everything into profile inputs: unencrypted http:// links, country subdomains (de.linkedin.com), mobile URLs (m.youtube.com, mwlite), trailing slashes, or bare handles (@gkucmierz). social-links turns any variant into a clean canonical URL or extracts the raw {PROFILE_ID}.',
        pillars: [
          {
            num: '26',
            label: 'Built-in platform profiles',
            desc: 'From LinkedIn (/in/ & /company/), X, GitHub, YouTube, and Mastodon to Lemmy, Keybase, Substack, Twitch, Spotify, and StackOverflow.'
          },
          {
            num: '0 Deps',
            label: 'Pure TypeScript compiled to lib/',
            desc: 'Zero runtime dependencies. Ships complete .d.ts type declarations (Profile, ProfileMatch, Config, Score) for both TS and JS apps.'
          },
          {
            num: 'v1.16.0',
            label: 'Diacritics, Cyrillic & %Hex',
            desc: 'Expanded PROFILE_ID matcher supports international Unicode (\\u0080-\\uFFFF), percent-encoded IDs (%C3%AD), and LinkedIn company pages.'
          }
        ],
        studioEyebrow: 'LIVE INTERACTIVE STUDIO (TYPESCRIPT ENGINE)',
        studioTitle: 'Social Link Detection, Validation & Sanitization Tester',
        inputLabel: 'Paste a social media URL or profile handle',
        inputHint:
          'Format: full URL (e.g. https://de.linkedin.com/in/gkucmierz/) or bare profile handle (e.g. gkucmierz)',
        inputError:
          'The entered value does not match the selected profile or contains disallowed query parameters.',
        presetsLabel: 'Quick test presets (1-click):',
        profileSelectLabel: 'Target validation profile',
        configTitle: 'Instance configuration: new SocialLinks(config)',
        masterSwitchLabel: 'All engine flags (full / mixed indeterminate state)',
        resTitle: 'Live SocialLinks API Return Values',
        codeTitle: 'Generated JS / TS snippet for current test',
        copyCode: 'Copy snippet',
        customEyebrow: 'EXTENSIBILITY • ADDPROFILE()',
        customTitle: 'Custom Profile Sandbox (socialLinks.addProfile)',
        customDesc:
          'Register custom social networks on the fly (e.g. Bluesky, Threads, Discord) by passing an array of RegExp matchers with the {PROFILE_ID} token.',
        registerBtn: 'Register Profile & Test in Studio',
        tableEyebrow: 'COMPLETE 26 PREDEFINED PROFILES MATRIX',
        tableTitle: 'Catalog of Match RegExps & Sanitization Patterns',
        tableCaption:
          'Directory of all 26 predefined social media profiles in social-links with regular expressions and output URL templates',
        searchPlaceholder: 'Filter 26 profiles (e.g. linkedin, mastodon, x, youtube)...',
        colProfile: 'Profile',
        colModes: 'Modes',
        colRegex: 'Primary RegExp (match)',
        colPattern: 'Canonical Pattern (pattern)',
        colAction: 'Action',
        testBtn: 'Test in Studio ↑',
        footerNote:
          'MIT License • Zero runtime dependencies • Built with Vue 3 + @gkucmierz/nano-ui + vue-url-cleaner'
      }
)

async function copyText(text, key) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = ''
    }, 2000)
  } catch {}
}

// modern-web-guidance: validate-input-after-interaction ARIA + WeakMap fallback
const dirtyInputState = new WeakMap()

function syncInputAriaInvalid(el) {
  if (!el || typeof el.setAttribute !== 'function') return
  let isInvalid = false
  try {
    if (typeof CSS !== 'undefined' && CSS.supports('selector(:user-invalid)')) {
      isInvalid = el.matches(':user-invalid')
    } else {
      isInvalid = el.classList.contains('user-invalid-fallback')
    }
  } catch {}
  el.setAttribute('aria-invalid', isInvalid ? 'true' : 'false')
}

function handleFormValidationEvent(event) {
  const input = event.target
  if (!input || typeof input.checkValidity !== 'function') return

  if (typeof CSS === 'undefined' || !CSS.supports('selector(:user-invalid)')) {
    const state = dirtyInputState.get(input) || { hasInteracted: false, hasBlurred: false }
    if (event.type === 'input' || event.type === 'change') {
      state.hasInteracted = true
      dirtyInputState.set(input, state)
      if (state.hasBlurred) {
        const valid = input.checkValidity()
        input.classList.toggle('user-invalid-fallback', !valid)
        input.classList.toggle('user-valid-fallback', valid)
      }
    } else if (event.type === 'blur') {
      state.hasBlurred = true
      dirtyInputState.set(input, state)
      if (state.hasInteracted) {
        const valid = input.checkValidity()
        input.classList.toggle('user-invalid-fallback', !valid)
        input.classList.toggle('user-valid-fallback', valid)
      }
    }
  }
  syncInputAriaInvalid(input)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const qParam = params.get('q')
    const profParam = params.get('profile')
    const langParam = params.get('lang')
    if (qParam) rawInput.value = qParam
    if (profParam) selectedProfileMode.value = profParam
    if (langParam === 'en' || langParam === 'pl') lang.value = langParam
  }
  const formEl = studioFormRef.value
  if (formEl) {
    formEl.addEventListener('blur', handleFormValidationEvent, true)
    formEl.addEventListener('input', handleFormValidationEvent)
    formEl.addEventListener('change', handleFormValidationEvent)
  }
})

onUnmounted(() => {
  const formEl = studioFormRef.value
  if (formEl) {
    formEl.removeEventListener('blur', handleFormValidationEvent, true)
    formEl.removeEventListener('input', handleFormValidationEvent)
    formEl.removeEventListener('change', handleFormValidationEvent)
  }
})
</script>

<template>
  <div class="sl-shell">
    <!-- Sticky Header -->
    <header class="sl-header">
      <div class="sl-header-inner">
        <div class="brand-row">
          <div class="brand-icon-box" aria-hidden="true">
            <svg
              class="brand-svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                stroke="#4ce6d1"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                stroke="#38bdf8"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div>
            <div class="brand-title-wrap">
              <span class="brand-title">social-links</span>
              <span class="version-pill">v{{ appVersion }}</span>
              <span class="zero-deps-pill">{{ uiText.zeroDeps }}</span>
              <span class="ts-pill">{{ uiText.tsBadge }}</span>
            </div>
            <p class="brand-sub">{{ uiText.brandSub }}</p>
          </div>
        </div>

        <div class="header-right-group">
          <div class="header-install-box">
            <code>npm i social-links</code>
            <button
              type="button"
              class="copy-mini-btn"
              @click="copyText('npm i social-links', 'hdr')"
            >
              {{ copiedKey === 'hdr' ? uiText.copied : uiText.copyInstall }}
            </button>
          </div>

          <div class="lang-switch" role="group" aria-label="Wybór języka / Language">
            <button
              type="button"
              class="lang-btn"
              :class="{ active: lang === 'pl' }"
              @click="lang = 'pl'"
            >
              PL
            </button>
            <button
              type="button"
              class="lang-btn"
              :class="{ active: lang === 'en' }"
              @click="lang = 'en'"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="sl-main">
      <!-- Hero Banner -->
      <section class="hero-card">
        <div class="hero-badge-row">
          <span class="hero-tag teal">{{ uiText.heroTag1 }}</span>
          <span class="hero-tag cyan">{{ uiText.heroTag2 }}</span>
          <span class="hero-tag amber">{{ uiText.heroTag3 }}</span>
        </div>
        <h1 class="hero-heading">{{ uiText.heroHeading }}</h1>
        <p class="hero-lead">{{ uiText.heroLead }}</p>

        <div class="hero-pillars">
          <div v-for="(p, idx) in uiText.pillars" :key="idx" class="pillar-box">
            <div class="pillar-num">{{ p.num }}</div>
            <div class="pillar-label">{{ p.label }}</div>
            <p class="pillar-desc">{{ p.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Live Interactive Studio -->
      <section id="studio-section" class="studio-section" aria-labelledby="studio-heading">
        <div class="section-head">
          <div>
            <span class="section-eyebrow">{{ uiText.studioEyebrow }}</span>
            <h2 id="studio-heading" class="section-title">{{ uiText.studioTitle }}</h2>
          </div>
        </div>

        <div class="studio-grid">
          <!-- Left Card: Input, Presets, NanoSelect & NanoSwitch Config -->
          <form ref="studioFormRef" class="studio-left-card" novalidate @submit.prevent>
            <div class="field-block">
              <label for="social-link-input" class="field-title">{{ uiText.inputLabel }}</label>
              <!-- MANDATORY per validate-input-after-interaction: format hint placed ABOVE input -->
              <span id="social-link-hint" class="field-hint">{{ uiText.inputHint }}</span>
              <div class="input-with-clear">
                <input
                  id="social-link-input"
                  ref="studioInputRef"
                  v-model="rawInput"
                  type="text"
                  name="socialLink"
                  required
                  autocomplete="off"
                  spellcheck="false"
                  aria-describedby="social-link-hint"
                  aria-errormessage="social-link-error"
                  class="social-main-input"
                  placeholder="https://www.linkedin.com/in/gkucmierz"
                />
                <div id="social-link-error" class="field-error-msg">
                  <span aria-hidden="true">❌</span> {{ uiText.inputError }}
                </div>
                <button
                  v-if="rawInput"
                  type="button"
                  class="clear-input-btn"
                  :aria-label="lang === 'pl' ? 'Wyczyść pole' : 'Clear input'"
                  @click="rawInput = ''"
                >
                  ×
                </button>
              </div>
            </div>

            <!-- 1-Click Presets -->
            <div class="presets-block">
              <span class="presets-caption">{{ uiText.presetsLabel }}</span>
              <div class="preset-pills">
                <button
                  v-for="preset in presets"
                  :key="preset.id"
                  type="button"
                  class="preset-pill"
                  :class="{ active: rawInput === preset.url }"
                  @click="rawInput = preset.url; selectedProfileMode = preset.profile"
                >
                  {{ preset.label }}
                </button>
              </div>
            </div>

            <!-- Target Profile Selector (NanoSelect) -->
            <div class="field-block">
              <span class="field-title">{{ uiText.profileSelectLabel }}</span>
              <NanoSelect
                v-model="selectedProfileMode"
                :options="profileSelectOptions"
                :searchable="true"
                size="md"
                :lang="lang"
              />
            </div>

            <!-- Instance Configuration (NanoSwitch with indeterminate master) -->
            <div class="config-box">
              <div class="config-box-title">{{ uiText.configTitle }}</div>

              <div class="switch-row switch-master">
                <NanoSwitch
                  :model-value="allConfigFlagsOn"
                  :indeterminate="configFlagsIndeterminate"
                  size="compact"
                  color="purple"
                  :label="uiText.masterSwitchLabel"
                  @update:model-value="toggleAllConfigFlags"
                />
              </div>

              <div class="switch-row">
                <NanoSwitch
                  v-model="cfg.usePredefinedProfiles"
                  size="compact"
                  color="cyan"
                  :label="
                    lang === 'pl'
                      ? 'usePredefinedProfiles: true (Załaduj 26 wbudowanych profili)'
                      : 'usePredefinedProfiles: true (Load 26 predefined profiles)'
                  "
                />
              </div>

              <div class="switch-row">
                <NanoSwitch
                  v-model="cfg.trimInput"
                  size="compact"
                  color="cyan"
                  :label="
                    lang === 'pl'
                      ? 'trimInput: true (Automatycznie obcinaj białe znaki na końcach)'
                      : 'trimInput: true (Automatically trim leading/trailing whitespace)'
                  "
                />
              </div>

              <div class="switch-row">
                <NanoSwitch
                  v-model="cfg.allowQueryParams"
                  size="compact"
                  color="emerald"
                  :label="
                    lang === 'pl'
                      ? 'allowQueryParams: false -> true (Akceptuj ?utm_source=... i wycinaj przy sanitize)'
                      : 'allowQueryParams: false -> true (Allow ?utm_source=... and strip on sanitize)'
                  "
                />
              </div>
            </div>
          </form>

          <!-- Right Card: Live Output Diagnostics + Generated Code -->
          <div class="studio-right-card">
            <div class="diag-header">
              <span class="diag-title">{{ uiText.resTitle }}</span>
              <span
                class="validity-badge"
                :class="evaluation.isValid ? 'is-valid' : 'is-invalid'"
              >
                {{
                  evaluation.isValid
                    ? lang === 'pl'
                      ? '✓ VALID LINK / HANDLE'
                      : '✓ VALID LINK / HANDLE'
                    : lang === 'pl'
                      ? '✕ INVALID / NO MATCH'
                      : '✕ INVALID / NO MATCH'
                }}
              </span>
            </div>

            <div class="diag-grid">
              <div class="diag-item">
                <span class="diag-method">detectProfile(input)</span>
                <div class="diag-val-row">
                  <code class="diag-val highlight-teal">
                    {{ evaluation.detected ? `'${evaluation.detected}'` : "'' (none)" }}
                  </code>
                </div>
              </div>

              <div class="diag-item">
                <span class="diag-method">
                  isValid('{{ evaluation.targetProfile || '...' }}', input)
                </span>
                <div class="diag-val-row">
                  <code
                    class="diag-val"
                    :class="evaluation.isValid ? 'highlight-emerald' : 'highlight-red'"
                  >
                    {{ String(evaluation.isValid) }}
                  </code>
                </div>
              </div>

              <div class="diag-item">
                <span class="diag-method">
                  getProfileId('{{ evaluation.targetProfile || '...' }}', input)
                </span>
                <div class="diag-val-row">
                  <code class="diag-val highlight-cyan">
                    {{ evaluation.profileId ? `'${evaluation.profileId}'` : '—' }}
                  </code>
                  <button
                    v-if="evaluation.profileId"
                    type="button"
                    class="mini-action-btn"
                    @click="copyText(evaluation.profileId, 'pid')"
                  >
                    {{ copiedKey === 'pid' ? '✓' : 'Copy' }}
                  </button>
                </div>
              </div>

              <div class="diag-item">
                <span class="diag-method">sanitize(profile, input, TYPE_DESKTOP)</span>
                <div class="diag-val-row">
                  <code class="diag-val">
                    {{ evaluation.sanitizedDesktop || evaluation.sanitizedDefault || '—' }}
                  </code>
                  <button
                    v-if="evaluation.sanitizedDesktop || evaluation.sanitizedDefault"
                    type="button"
                    class="mini-action-btn"
                    @click="
                      copyText(
                        evaluation.sanitizedDesktop || evaluation.sanitizedDefault,
                        'desk'
                      )
                    "
                  >
                    {{ copiedKey === 'desk' ? '✓' : 'Copy' }}
                  </button>
                </div>
              </div>

              <div class="diag-item">
                <span class="diag-method">sanitize(profile, input, TYPE_MOBILE)</span>
                <div class="diag-val-row">
                  <code class="diag-val">
                    {{
                      evaluation.sanitizedMobile ||
                      (lang === 'pl' ? '(Brak osobnego wzorca mobilnego)' : '(No separate mobile pattern)')
                    }}
                  </code>
                  <button
                    v-if="evaluation.sanitizedMobile"
                    type="button"
                    class="mini-action-btn"
                    @click="copyText(evaluation.sanitizedMobile, 'mob')"
                  >
                    {{ copiedKey === 'mob' ? '✓' : 'Copy' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- scoreProfiles() breakdown -->
            <div class="scores-bar-box">
              <div class="scores-bar-head">
                <code>scoreProfiles(input)</code>
                <span class="scores-count">
                  {{ evaluation.scores.length }}
                  {{ lang === 'pl' ? 'dopasowanych profili' : 'matching profiles' }}
                </span>
              </div>
              <div v-if="evaluation.scores.length > 0" class="scores-chips">
                <button
                  v-for="s in evaluation.scores.slice(0, 10)"
                  :key="s.profileName"
                  type="button"
                  class="score-chip"
                  :class="{ active: evaluation.targetProfile === s.profileName }"
                  @click="selectedProfileMode = s.profileName"
                >
                  <span>{{ s.profileName }}</span>
                  <span class="score-num">score: {{ s.score }}</span>
                </button>
                <span v-if="evaluation.scores.length > 10" class="score-more">
                  +{{ evaluation.scores.length - 10 }}
                  {{ lang === 'pl' ? 'więcej (sam ID pasuje do każdego profilu)' : 'more (bare ID matches all profiles)' }}
                </span>
              </div>
              <div v-else class="scores-empty">
                {{ lang === 'pl' ? 'Brak dopasowań (score = 0).' : 'No matching profiles (score = 0).' }}
              </div>
            </div>

            <!-- Generated Code Block -->
            <div class="code-box">
              <div class="code-box-header">
                <span>{{ uiText.codeTitle }}</span>
                <button
                  type="button"
                  class="copy-mini-btn"
                  @click="copyText(generatedCodeSnippet, 'snippet')"
                >
                  {{ copiedKey === 'snippet' ? uiText.copied : uiText.copyCode }}
                </button>
              </div>
              <pre class="code-pre"><code>{{ generatedCodeSnippet }}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Custom Profile Sandbox (addProfile) -->
      <section class="custom-section" aria-labelledby="custom-heading">
        <div class="section-head">
          <div>
            <span class="section-eyebrow">{{ uiText.customEyebrow }}</span>
            <h2 id="custom-heading" class="section-title">{{ uiText.customTitle }}</h2>
            <p class="section-desc">{{ uiText.customDesc }}</p>
          </div>
        </div>

        <div class="custom-card">
          <div class="custom-grid">
            <label class="field-label">
              <span>profileName</span>
              <input v-model="customForm.name" type="text" class="field-input" />
            </label>
            <label class="field-label">
              <span>TYPE_DESKTOP match (RegExp z {PROFILE_ID})</span>
              <input v-model="customForm.desktopMatch" type="text" class="field-input" />
            </label>
            <label class="field-label">
              <span>TYPE_DESKTOP pattern</span>
              <input v-model="customForm.desktopPattern" type="text" class="field-input" />
            </label>
            <label class="field-label">
              <span>Przykładowy URL do przetestowania</span>
              <input v-model="customForm.sampleUrl" type="text" class="field-input" />
            </label>
          </div>

          <div class="custom-actions">
            <button type="button" class="register-btn" @click="registerCustomProfile">
              {{ uiText.registerBtn }}
            </button>
            <span v-if="customStatusMsg" class="custom-status-ok">{{ customStatusMsg }}</span>
          </div>
        </div>
      </section>

      <!-- Responsive Reference Table of All 26 Profiles (modern-web-guidance: responsive-table) -->
      <section class="table-section" aria-labelledby="profiles-table-caption">
        <div class="section-head table-head-row">
          <div>
            <span class="section-eyebrow">{{ uiText.tableEyebrow }}</span>
            <h2 class="section-title">{{ uiText.tableTitle }}</h2>
          </div>
          <div class="table-search-box">
            <input
              v-model="tableSearch"
              type="search"
              :placeholder="uiText.searchPlaceholder"
              class="field-input table-filter-input"
            />
          </div>
        </div>

        <div
          tabindex="0"
          role="region"
          aria-labelledby="profiles-table-caption"
          class="table-wrapper"
        >
          <table class="profiles-table">
            <caption id="profiles-table-caption" class="sr-only">
              {{ uiText.tableCaption }}
            </caption>
            <thead>
              <tr>
                <th scope="col">{{ uiText.colProfile }}</th>
                <th scope="col">{{ uiText.colModes }}</th>
                <th scope="col">{{ uiText.colRegex }}</th>
                <th scope="col">{{ uiText.colPattern }}</th>
                <th scope="col">{{ uiText.colAction }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prof in filteredProfilesCatalog" :key="prof.name">
                <th scope="row">
                  <span class="prof-row-name">{{ prof.name }}</span>
                </th>
                <td>
                  <div class="mode-badges">
                    <span class="mode-pill desktop">DESKTOP</span>
                    <span v-if="prof.hasMobile" class="mode-pill mobile">MOBILE</span>
                    <span class="rules-count-pill">{{ prof.rulesCount }} rules</span>
                  </div>
                </td>
                <td><code class="table-code">{{ prof.primaryRegex }}</code></td>
                <td>
                  <div class="pattern-stack">
                    <code class="table-code teal">{{ prof.desktopPattern }}</code>
                    <code v-if="prof.hasMobile" class="table-code cyan">
                      {{ prof.mobilePattern }}
                    </code>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    class="test-row-btn"
                    @click="testProfileInStudio(prof)"
                  >
                    {{ uiText.testBtn }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <footer class="sl-footer">
      <span>social-links v{{ appVersion }}</span>
      <span>•</span>
      <span>Port :20104 (dport)</span>
      <span>•</span>
      <span>{{ uiText.footerNote }}</span>
    </footer>

    <GlobalTooltip />
  </div>
</template>

<style>
:root {
  --bg-base: #060b12;
  --bg-card: #0c1422;
  --bg-elevated: #121e31;
  --border-subtle: rgba(148, 163, 184, 0.16);
  --border-teal: rgba(76, 230, 209, 0.4);
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --accent-teal: #4ce6d1;
  --accent-cyan: #38bdf8;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-red: #f87171;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-base);
  color: var(--text-main);
  font-family: var(--font-sans);
  line-height: 1.6;
  min-height: 100dvh;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.sl-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.sl-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(6, 11, 18, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
}

.sl-header-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(76, 230, 209, 0.2), rgba(56, 189, 248, 0.2));
  border: 1px solid var(--border-teal);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  line-height: 0;
}

.brand-svg {
  display: block;
  width: 20px;
  height: 20px;
}

.brand-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.brand-title {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 1.05rem;
  color: #ffffff;
}

.version-pill,
.zero-deps-pill,
.ts-pill {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
}

.version-pill {
  color: var(--accent-teal);
  background: rgba(76, 230, 209, 0.12);
  border: 1px solid rgba(76, 230, 209, 0.32);
}

.zero-deps-pill {
  color: var(--accent-emerald);
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.ts-pill {
  color: var(--accent-cyan);
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.brand-sub {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.header-right-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.header-install-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  padding: 6px 10px 6px 14px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: #e2e8f0;
}

.copy-mini-btn {
  background: rgba(76, 230, 209, 0.14);
  color: var(--accent-teal);
  border: 1px solid rgba(76, 230, 209, 0.35);
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.copy-mini-btn:hover {
  background: rgba(76, 230, 209, 0.25);
}

.lang-switch {
  display: inline-flex;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.lang-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 5px;
  cursor: pointer;
}

.lang-btn.active {
  background: rgba(76, 230, 209, 0.18);
  color: #ffffff;
}

.sl-main {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 44px;
  flex: 1;
}

.hero-card {
  background: radial-gradient(circle at top right, rgba(76, 230, 209, 0.11), transparent 55%),
    var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 32px;
}

.hero-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.hero-tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

.hero-tag.teal {
  color: var(--accent-teal);
  background: rgba(76, 230, 209, 0.12);
  border: 1px solid rgba(76, 230, 209, 0.3);
}

.hero-tag.cyan {
  color: var(--accent-cyan);
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.hero-tag.amber {
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

/* Responsive typography using clamp() combining viewport and rem units (modern-web-guidance: responsive-design) */
.hero-heading {
  font-size: clamp(1.5rem, 1rem + 2vw, 2.25rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
  color: #ffffff;
}

.hero-lead {
  color: var(--text-muted);
  font-size: clamp(0.95rem, 0.9rem + 0.25vw, 1.08rem);
  max-width: 920px;
  margin-bottom: 28px;
}

.hero-pillars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.pillar-box {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 18px;
}

.pillar-num {
  font-family: var(--font-mono);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--accent-teal);
  margin-bottom: 4px;
}

.pillar-label {
  font-weight: 700;
  font-size: 0.92rem;
  margin-bottom: 6px;
}

.pillar-desc {
  font-size: 0.83rem;
  color: var(--text-muted);
}

.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent-teal);
  letter-spacing: 0.08em;
}

.section-title {
  font-size: clamp(1.25rem, 1rem + 1vw, 1.65rem);
  font-weight: 800;
  color: #ffffff;
  margin-top: 4px;
  margin-bottom: 14px;
}

.section-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 18px;
}

.studio-grid {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 20px;
}

@media (max-width: 960px) {
  .studio-grid {
    grid-template-columns: 1fr;
  }
}

.studio-left-card,
.studio-right-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: #ffffff;
}

.field-hint {
  display: block;
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.input-with-clear {
  position: relative;
}

.social-main-input {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid rgba(76, 230, 209, 0.35);
  border-radius: 10px;
  padding: 11px 38px 11px 14px;
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.social-main-input:focus {
  border-color: var(--accent-teal);
}

.field-error-msg {
  display: none;
  color: var(--accent-red);
  font-size: 0.78rem;
  margin-top: 6px;
}

/* modern-web-guidance: validate-input-after-interaction (:user-invalid / :user-valid + fallback) */
.social-main-input:user-invalid,
.social-main-input.user-invalid-fallback {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.08);
}

.social-main-input:user-invalid + .field-error-msg,
.social-main-input.user-invalid-fallback + .field-error-msg {
  display: block;
}

.social-main-input:user-valid,
.social-main-input.user-valid-fallback {
  border-color: var(--accent-emerald);
}

.clear-input-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
}

.clear-input-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.16);
}

.presets-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.presets-caption {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-muted);
}

.preset-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.preset-pill {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  color: #cbd5e1;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.preset-pill:hover {
  border-color: var(--border-teal);
  color: #ffffff;
}

.preset-pill.active {
  background: rgba(76, 230, 209, 0.16);
  border-color: var(--accent-teal);
  color: var(--accent-teal);
  font-weight: 700;
}

.config-box {
  border-top: 1px solid var(--border-subtle);
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-box-title {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.switch-row {
  display: flex;
  align-items: center;
  padding: 3px 0;
}

.switch-master {
  padding-bottom: 8px;
  margin-bottom: 2px;
  border-bottom: 1px dashed var(--border-subtle);
}

.diag-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.diag-title {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  color: #ffffff;
}

.validity-badge {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
}

.validity-badge.is-valid {
  color: var(--accent-emerald);
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.validity-badge.is-invalid {
  color: var(--accent-red);
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.35);
}

.diag-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.diag-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.diag-method {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
}

.diag-val-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.diag-val {
  font-family: var(--font-mono);
  font-size: 0.84rem;
  color: #f8fafc;
  word-break: break-all;
}

.highlight-teal {
  color: var(--accent-teal);
  font-weight: 700;
}

.highlight-emerald {
  color: var(--accent-emerald);
  font-weight: 700;
}

.highlight-red {
  color: var(--accent-red);
  font-weight: 700;
}

.highlight-cyan {
  color: var(--accent-cyan);
  font-weight: 700;
}

.mini-action-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  color: #cbd5e1;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  padding: 3px 8px;
  border-radius: 5px;
  cursor: pointer;
  flex-shrink: 0;
}

.mini-action-btn:hover {
  color: #ffffff;
  border-color: var(--accent-teal);
}

.scores-bar-box {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scores-bar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-muted);
}

.scores-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.score-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: 6px;
  background: rgba(76, 230, 209, 0.08);
  border: 1px solid rgba(76, 230, 209, 0.25);
  color: #e2e8f0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  cursor: pointer;
}

.score-chip.active {
  background: rgba(76, 230, 209, 0.2);
  border-color: var(--accent-teal);
  color: #ffffff;
}

.score-num {
  color: var(--accent-teal);
  font-weight: 700;
}

.score-more,
.scores-empty {
  font-size: 0.74rem;
  color: var(--text-muted);
}

.code-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.code-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--accent-amber);
}

.code-pre {
  background: #04070d;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 14px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.5;
  color: #e2e8f0;
}

.custom-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.custom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.field-label {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-muted);
}

.field-input {
  margin-block-start: auto;
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--text-main);
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.custom-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.register-btn {
  background: linear-gradient(135deg, rgba(76, 230, 209, 0.22), rgba(56, 189, 248, 0.22));
  border: 1px solid var(--accent-teal);
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 9px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.register-btn:hover {
  background: linear-gradient(135deg, rgba(76, 230, 209, 0.34), rgba(56, 189, 248, 0.34));
}

.custom-status-ok {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--accent-emerald);
}

.table-head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.table-search-box {
  min-width: 280px;
  flex: 0 1 360px;
}

.table-filter-input {
  width: 100%;
}

/* Responsive Data Table with Container Queries & Sticky Headers (modern-web-guidance: responsive-table) */
.table-wrapper {
  overflow: auto;
  max-inline-size: 100%;
  max-block-size: min(640px, 80vh);
  container-type: inline-size;
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  background: var(--bg-card);
}

.profiles-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.84rem;
}

.profiles-table thead {
  position: sticky;
  inset-block-start: 0;
  z-index: 2;
  background: var(--bg-elevated);
}

.profiles-table th,
.profiles-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: top;
}

.profiles-table thead th {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.profiles-table tbody th {
  position: sticky;
  inset-inline-start: 0;
  z-index: 1;
  background: var(--bg-card);
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--accent-teal);
}

.mode-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.mode-pill,
.rules-count-pill {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
}

.mode-pill.desktop {
  color: var(--accent-teal);
  background: rgba(76, 230, 209, 0.12);
}

.mode-pill.mobile {
  color: var(--accent-cyan);
  background: rgba(56, 189, 248, 0.12);
}

.rules-count-pill {
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
}

.pattern-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.table-code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #cbd5e1;
  word-break: break-all;
}

.table-code.teal {
  color: var(--accent-teal);
}

.table-code.cyan {
  color: var(--accent-cyan);
}

.test-row-btn {
  background: rgba(76, 230, 209, 0.12);
  border: 1px solid rgba(76, 230, 209, 0.35);
  color: var(--accent-teal);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.test-row-btn:hover {
  background: rgba(76, 230, 209, 0.24);
  color: #ffffff;
}

@container (width < 600px) {
  .profiles-table,
  .profiles-table thead,
  .profiles-table tbody,
  .profiles-table tr,
  .profiles-table th,
  .profiles-table td {
    display: block;
  }

  .profiles-table thead {
    display: none;
  }

  .profiles-table tr {
    margin-block-end: 1rem;
    border: 1px solid var(--border-subtle);
  }

  .profiles-table tbody th {
    position: sticky;
    inset-block-start: 0;
    z-index: 2;
    background: var(--bg-elevated);
  }

  .profiles-table {
    --label-2: "Tryby";
    --label-3: "RegExp";
    --label-4: "Wzorzec";
    --label-5: "Akcja";
  }

  .profiles-table td:nth-child(2)::before {
    content: var(--label-2) ": ";
    font-weight: 700;
    color: var(--text-muted);
  }

  .profiles-table td:nth-child(3)::before {
    content: var(--label-3) ": ";
    font-weight: 700;
    color: var(--text-muted);
  }

  .profiles-table td:nth-child(4)::before {
    content: var(--label-4) ": ";
    font-weight: 700;
    color: var(--text-muted);
  }

  .profiles-table td:nth-child(5)::before {
    content: var(--label-5) ": ";
    font-weight: 700;
    color: var(--text-muted);
  }
}

.sl-footer {
  border-top: 1px solid var(--border-subtle);
  padding: 20px 24px;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--text-muted);
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
