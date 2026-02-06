import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Chip } from '../ui';
import { BottomSheet } from './BottomSheet';

const THEME = {
  text: "#4B3F39",
  muted: "#7A6A60",
  line: "#EFE7E1",
  card: "#FBF8F6",
  primary: "#D48A63",
};

const MIN_MS = 60 * 1000;

interface Event {
  id: string;
  type: 'feeding' | 'diaper' | 'sleep';
  ts: number;
  startTs?: number;
  endTs?: number | null;
  amountMl?: number;
  diaperType?: 'pee' | 'poo' | 'mixed';
  updatedAt?: number;
}

interface EditEventSheetProps {
  visible: boolean;
  event: Event | null;
  nowMs: number;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete: () => void;
  onStopSleepNow: () => void;
}

// Stepper component for time/amount adjustments
function Stepper({ value, onMinus, onPlus, suffix }: { value: string | number; onMinus: () => void; onPlus: () => void; suffix: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Pressable
        onPress={onMinus}
        style={({ pressed }) => ({
          width: 42,
          height: 42,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: THEME.line,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pressed ? "#EFE7E1" : THEME.card,
        })}
      >
        <Text style={{ fontSize: 22, fontWeight: "900", color: THEME.text }}>−</Text>
      </Pressable>
      <View
        style={{
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: THEME.line,
          backgroundColor: THEME.card,
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "900", color: THEME.text }}>
          {value}
          {suffix}
        </Text>
      </View>
      <Pressable
        onPress={onPlus}
        style={({ pressed }) => ({
          width: 42,
          height: 42,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: THEME.line,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pressed ? "#EFE7E1" : THEME.card,
        })}
      >
        <Text style={{ fontSize: 22, fontWeight: "900", color: THEME.text }}>+</Text>
      </Pressable>
    </View>
  );
}

export function EditEventSheet({ visible, event, nowMs, onClose, onSave, onDelete, onStopSleepNow }: EditEventSheetProps) {
  // ✅ Hooks must be unconditional (avoid returning before hooks)
  const [amount, setAmount] = useState(event?.amountMl ?? 0);
  const [diaperType, setDiaperType] = useState<'pee' | 'poo' | 'mixed'>(event?.diaperType ?? "pee");
  const [ts, setTs] = useState(event?.ts ?? Date.now());
  const [startTs, setStartTs] = useState(event?.startTs ?? event?.ts ?? Date.now());
  const [endTs, setEndTs] = useState<number | null>(event?.endTs ?? null);

  // ✅ Fix exhaustive-deps: depend on `event` (not nowMs) so it doesn't reset every 30s
  useEffect(() => {
    if (!visible) return;
    if (!event) return;

    const baseNow = Date.now();
    setAmount(event.amountMl ?? 0);
    setDiaperType(event.diaperType ?? "pee");
    setTs(event.ts ?? baseNow);
    setStartTs(event.startTs ?? event.ts ?? baseNow);
    setEndTs(event.endTs ?? null);
  }, [event, visible]);

  if (!visible) return null;

  const type = event?.type;
  const isSleep = type === "sleep";
  const isFeeding = type === "feeding";
  const isDiaper = type === "diaper";
  const sleepInProgress = isSleep && !event?.endTs;

  const save = () => {
    if (!event) return;

    if (isFeeding) {
      onSave({
        ...event,
        ts,
        amountMl: Math.max(0, Math.round(amount)),
        updatedAt: Date.now(),
      });
      onClose();
      return;
    }

    if (isDiaper) {
      onSave({
        ...event,
        ts,
        diaperType,
        updatedAt: Date.now(),
      });
      onClose();
      return;
    }

    if (isSleep) {
      const s = Math.min(startTs, endTs ?? startTs);
      const e = endTs != null ? Math.max(endTs, s) : null;

      onSave({
        ...event,
        ts: s,
        startTs: s,
        endTs: e,
        updatedAt: Date.now(),
      });
      onClose();
      return;
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={{ fontWeight: "900", fontSize: 16, color: THEME.text }}>
        Modifier • {type === "feeding" ? "Repas" : type === "diaper" ? "Couche" : "Dodo"}
      </Text>

      <Text style={{ marginTop: 6, color: THEME.muted }}>
        {format(new Date(event?.ts ?? nowMs), "EEEE dd MMM • HH:mm", { locale: fr })}
      </Text>

      {/* Feeding */}
      {isFeeding && (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontWeight: "800", color: THEME.muted }}>Quantité</Text>
          <View style={{ marginTop: 10 }}>
            <Stepper
              value={amount}
              suffix=" ml"
              onMinus={() => setAmount((v) => Math.max(0, v - 10))}
              onPlus={() => setAmount((v) => v + 10)}
            />
          </View>

          <Text style={{ marginTop: 12, fontWeight: "800", color: THEME.muted }}>Heure</Text>
          <View style={{ marginTop: 10 }}>
            <Stepper
              value={format(new Date(ts), "HH:mm", { locale: fr })}
              suffix=""
              onMinus={() => setTs((v) => v - 5 * MIN_MS)}
              onPlus={() => setTs((v) => v + 5 * MIN_MS)}
            />
          </View>
        </View>
      )}

      {/* Diaper */}
      {isDiaper && (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontWeight: "800", color: THEME.muted }}>Type</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
            <Chip label="Pipi" active={diaperType === "pee"} onPress={() => setDiaperType("pee")} />
            <Chip label="Caca" active={diaperType === "poo"} onPress={() => setDiaperType("poo")} />
            <Chip label="Mixte" active={diaperType === "mixed"} onPress={() => setDiaperType("mixed")} />
          </View>

          <Text style={{ marginTop: 12, fontWeight: "800", color: THEME.muted }}>Heure</Text>
          <View style={{ marginTop: 10 }}>
            <Stepper
              value={format(new Date(ts), "HH:mm", { locale: fr })}
              suffix=""
              onMinus={() => setTs((v) => v - 5 * MIN_MS)}
              onPlus={() => setTs((v) => v + 5 * MIN_MS)}
            />
          </View>
        </View>
      )}

      {/* Sleep */}
      {isSleep && (
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontWeight: "800", color: THEME.muted }}>Début</Text>
          <View style={{ marginTop: 10 }}>
            <Stepper
              value={format(new Date(startTs), "HH:mm", { locale: fr })}
              suffix=""
              onMinus={() => setStartTs((v) => v - 5 * MIN_MS)}
              onPlus={() => setStartTs((v) => v + 5 * MIN_MS)}
            />
          </View>

          <Text style={{ marginTop: 12, fontWeight: "800", color: THEME.muted }}>Fin</Text>

          {sleepInProgress ? (
            <View style={{ marginTop: 10 }}>
              <Pressable
                onPress={onStopSleepNow}
                style={({ pressed }) => ({
                  paddingVertical: 12,
                  borderRadius: 16,
                  backgroundColor: THEME.primary,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ textAlign: "center", fontWeight: "900", color: THEME.card }}>
                  Terminer maintenant
                </Text>
              </Pressable>

              <Text style={{ marginTop: 8, color: THEME.muted, fontSize: 12 }}>
                (Ou ajuste le début uniquement)
              </Text>
            </View>
          ) : (
            <View style={{ marginTop: 10 }}>
              <Stepper
                value={format(new Date(endTs ?? nowMs), "HH:mm", { locale: fr })}
                suffix=""
                onMinus={() => setEndTs((v) => (v ?? nowMs) - 5 * MIN_MS)}
                onPlus={() => setEndTs((v) => (v ?? nowMs) + 5 * MIN_MS)}
              />
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 14,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: THEME.line,
            backgroundColor: pressed ? "#EFE7E1" : THEME.card,
          })}
        >
          <Text style={{ textAlign: "center", fontWeight: "900", color: THEME.text }}>Annuler</Text>
        </Pressable>

        <Pressable
          onPress={save}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 14,
            borderRadius: 18,
            backgroundColor: THEME.primary,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{ textAlign: "center", fontWeight: "900", color: THEME.card }}>Enregistrer</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() =>
          Alert.alert("Supprimer ?", "Cet événement sera supprimé.", [
            { text: "Annuler", style: "cancel" },
            { text: "Supprimer", style: "destructive", onPress: onDelete },
          ])
        }
        style={({ pressed }) => ({
          marginTop: 10,
          paddingVertical: 12,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: "#F0C6C6",
          backgroundColor: pressed ? "#FFF3F3" : THEME.card,
        })}
      >
        <Text style={{ textAlign: "center", fontWeight: "900", color: "#C23B3B" }}>Supprimer</Text>
      </Pressable>
    </BottomSheet>
  );
}
