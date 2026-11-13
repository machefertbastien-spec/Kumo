# Analytics Preview

PostHog est limité aux builds Preview et reste inactif tant que la configuration et le consentement explicite ne sont pas présents.

## Événements autorisés

- `app opened`
- `tracking_entry_saved`
- `tracking_first_entry_added`

Tous les événements portent seulement `app_id=kumo`, la plateforme, la version de l'app, `app_environment=preview` et `analytics_schema_version=1`.

## Données interdites

Aucun type de soin, quantité, date ou heure individuelle, durée, note, nom, identifiant bébé ou aidant, mesure de croissance, contenu du chat ou donnée familiale ne peut être envoyé.

Autocapture, événements de cycle de vie, GeoIP, profils de personne, feature flags et session replay sont désactivés. L'identifiant anonyme reste en mémoire pendant le lancement courant.

## Configuration EAS Preview

- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`
- `EXPO_PUBLIC_APP_ENVIRONMENT=preview`
- `EXPO_PUBLIC_POSTHOG_CONSENT_GRANTED=true` uniquement après validation de la politique de mesure

Aucune de ces variables ne doit être définie pour Production dans ce lot.
