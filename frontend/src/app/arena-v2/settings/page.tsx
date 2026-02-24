"use client";

import { useState } from "react";
import { SettingsCard } from "@/components/arena-v2/settings/SettingsCard";
import { SettingsSlider } from "@/components/arena-v2/settings/SettingsSlider";
import { SettingsToggle } from "@/components/arena-v2/settings/SettingsToggle";

type ColorMode = "dark" | "high-contrast";

export default function ArenaV2SettingsPage() {
  const [masterVolume, setMasterVolume] = useState(85);
  const [effectsVolume, setEffectsVolume] = useState(70);
  const [musicStreamEnabled, setMusicStreamEnabled] = useState(true);
  const [voiceCommEnabled, setVoiceCommEnabled] = useState(false);
  const [energyPulseEnabled, setEnergyPulseEnabled] = useState(true);
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [hudOpacity, setHudOpacity] = useState(45);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  const handleSave = () => {
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 1800);
  };

  return (
    <main className="min-h-screen bg-[#060d1f] px-4 py-6 text-[#d8e4ff] sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-290 rounded-md border-2 border-[#273a63] bg-[#0b1836] p-4 shadow-[0_0_0_2px_#08132a] sm:p-6">
        <header className="mb-6 flex flex-col gap-4 border-b border-[#22345b] pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-pixel text-4xl uppercase tracking-[0.12em] text-[#eef4ff] sm:text-5xl">GLOBAL_SETTINGS</h1>
            <p className="mt-2 font-pixel text-[10px] uppercase tracking-[0.16em] text-[#8b9bc0]">
              CONFIGURE_TERMINAL_INTERFACE_AND_AUDIO_ARRAYS
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start border border-[#20612a] bg-[#092212] px-3 py-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.9)] animate-pulse" />
            <span className="font-pixel text-[9px] uppercase tracking-[0.14em] text-[#5eff52]">LIVE_CONNECTION_STABLE</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2.1fr_1.2fr]">
          <SettingsCard title="AUDIO_CONFIGURATION">
            <div className="space-y-5">
              <SettingsSlider label="MASTER_VOLUME" value={masterVolume} onChange={setMasterVolume} />
              <SettingsSlider label="EFFECTS_VOLUME" value={effectsVolume} onChange={setEffectsVolume} />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SettingsToggle label="MUSIC_STREAM" enabled={musicStreamEnabled} onChange={setMusicStreamEnabled} />
                <SettingsToggle label="VOICE_COMM" enabled={voiceCommEnabled} onChange={setVoiceCommEnabled} />
              </div>
            </div>
          </SettingsCard>

          <div className="space-y-4">
            <SettingsCard title="ENERGY_PULSE">
              <p className="mb-4 font-pixel text-[9px] uppercase tracking-[0.13em] text-[#8b9bc0]">
                ENABLE_VISUAL_RWA_UI_PULSES_FOR_LIVE_YIELD
              </p>
              <button
                type="button"
                onClick={() => setEnergyPulseEnabled((prev) => !prev)}
                className={`flex h-12 w-full items-center justify-between border-2 border-black px-3 font-pixel text-[11px] uppercase tracking-[0.14em] transition ${
                  energyPulseEnabled
                    ? "bg-[#39ff14] text-black hover:brightness-95"
                    : "bg-[#0e1528] text-[#d8e4ff] hover:border-[#39ff14]"
                }`}
              >
                <span>{energyPulseEnabled ? "ENABLED" : "DISABLED"}</span>
                <span className="text-lg">{energyPulseEnabled ? "●" : "○"}</span>
              </button>
            </SettingsCard>

            <SettingsCard title="COLOR_MODE">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setColorMode("dark")}
                  className={`h-11 w-full border-2 border-black font-pixel text-[10px] uppercase tracking-[0.14em] transition ${
                    colorMode === "dark"
                      ? "bg-[#39ff14] text-black"
                      : "bg-[#0e1528] text-[#d8e4ff] hover:border-[#39ff14]"
                  }`}
                >
                  DARK_MODE
                </button>
                <button
                  type="button"
                  onClick={() => setColorMode("high-contrast")}
                  className={`h-11 w-full border-2 font-pixel text-[10px] uppercase tracking-[0.14em] transition ${
                    colorMode === "high-contrast"
                      ? "border-[#39ff14] bg-[#39ff14] text-black"
                      : "border-[#25365d] bg-transparent text-[#d8e4ff] hover:border-[#39ff14]"
                  }`}
                >
                  HIGH_CONTRAST_TERMINAL
                </button>
              </div>
            </SettingsCard>
          </div>
        </div>

        <div className="mt-4">
          <SettingsCard title="HUD_CONFIGURATION">
            <SettingsSlider
              label="ARENA_OVERLAY_OPACITY"
              value={hudOpacity}
              onChange={setHudOpacity}
              segmented
            />
          </SettingsCard>
        </div>

        <footer className="mt-6 space-y-2">
          <button
            type="button"
            onClick={handleSave}
            className="h-14 w-full border-2 border-[#236f2d] bg-[#39ff14] font-pixel text-2xl uppercase tracking-[0.2em] text-black transition hover:brightness-95"
          >
            SAVE_CONFIGURATION_SEQUENCE
          </button>
          <p className="h-5 text-center font-pixel text-[10px] uppercase tracking-[0.18em] text-[#62ff5f]">
            {saveState === "saved" ? "CONFIGURATION_SEQUENCE_SAVED" : ""}
          </p>
        </footer>
      </div>
    </main>
  );
}
