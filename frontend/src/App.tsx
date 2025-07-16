import { Box, Group, Text, Burger, Drawer, Stack, Button, Switch, Paper, ActionIcon, LoadingOverlay } from '@mantine/core';
import { useState, useRef } from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';

// PLACEHOLDER: Replace with your actual ElevenLabs API key
const ELEVENLABS_API_KEY = 'sk_3329a5c1a77ff9868d6612fb227c998cfef56e57e55210c6';

interface MandarinWord {
  word: string;
  pinyin: string;
}

// Predefined Mandarin text about daily life
const SAMPLE_MANDARIN_TEXT: MandarinWord[] = [
  { word: "今天", pinyin: "jīn tiān" },
  { word: "天气", pinyin: "tiān qì" },
  { word: "很", pinyin: "hěn" },
  { word: "好", pinyin: "hǎo" },
  { word: "。", pinyin: "" },
  { word: "我", pinyin: "wǒ" },
  { word: "去", pinyin: "qù" },
  { word: "公园", pinyin: "gōng yuán" },
  { word: "散步", pinyin: "sàn bù" },
  { word: "。", pinyin: "" },
  { word: "看到", pinyin: "kàn dào" },
  { word: "很多", pinyin: "hěn duō" },
  { word: "人", pinyin: "rén" },
  { word: "在", pinyin: "zài" },
  { word: "锻炼", pinyin: "duàn liàn" },
  { word: "。", pinyin: "" },
  { word: "我", pinyin: "wǒ" },
  { word: "觉得", pinyin: "jué de" },
  { word: "很", pinyin: "hěn" },
  { word: "开心", pinyin: "kāi xīn" },
  { word: "。", pinyin: "" }
];

export default function App() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIdx, setCurrentWordIdx] = useState<number | null>(null);
  const [mandarinText, setMandarinText] = useState<MandarinWord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function generateMandarinText() {
    setIsGenerating(true);
    try {
      // Use the predefined text instead of making an API call
      setMandarinText(SAMPLE_MANDARIN_TEXT);
      setShowText(true);
    } catch (error) {
      console.error('Error setting text:', error);
      alert('Failed to load Mandarin text. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  // Helper to join Mandarin text for TTS
  const mandarinString = mandarinText.map((item) => item.word).join('');

  async function handlePlay() {
    // If audio is currently playing, stop it
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentWordIdx(null);
      return;
    }
    setIsPlaying(true);
    setCurrentWordIdx(null);
    try {
      // ElevenLabs TTS API call
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x/with-timestamps', {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          text: mandarinString,
          model_id: 'eleven_multilingual_v2',
          output_format: 'mp3_44100_128',
        }),
      });
      console.log('TTS response status:', response.status);
      if (!response.ok) throw new Error('TTS request failed');
      const data = await response.json();
      console.log('TTS data:', data);
      const audioUrl = `data:audio/mp3;base64,${data.audio_base64}`;
      const alignment = data.alignment;
      // Map character times to word indices
      // Build a mapping from character index to word index
      let charToWordIdx: number[] = [];
      let charIdx = 0;
      mandarinText.forEach((item, wordIdx) => {
        for (let i = 0; i < item.word.length; i++) {
          charToWordIdx[charIdx] = wordIdx;
          charIdx++;
        }
      });
      // Play audio
      const audio = new window.Audio(audioUrl);
      audioRef.current = audio;
      let raf: number;
      function step() {
        const currentTime = audio.currentTime;
        // Find the character being spoken
        let charIdx = alignment.character_start_times_seconds.findIndex((start: number, idx: number) => {
          const end = alignment.character_end_times_seconds[idx];
          return currentTime >= start && currentTime <= end;
        });
        if (charIdx !== -1) {
          setCurrentWordIdx(charToWordIdx[charIdx]);
        } else {
          setCurrentWordIdx(null);
        }
        if (!audio.paused && !audio.ended) {
          raf = requestAnimationFrame(step);
        } else {
          setCurrentWordIdx(null);
          setIsPlaying(false);
        }
      }
      audio.onplay = () => {
        raf = requestAnimationFrame(step);
      };
      audio.onended = () => {
        setCurrentWordIdx(null);
        setIsPlaying(false);
        cancelAnimationFrame(raf);
      };
      audio.play();
    } catch (e) {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
      setCurrentWordIdx(null);
      alert('Failed to play audio.');
    }
  }

  return (
    <Box style={{ minHeight: '100vh', background: 'white', padding: 0 }}>
      {/* Top Bar */}
      <Group justify="space-between" align="center" px="lg" py="md">
        <Text
          component="a"
          href="#"
          size="xl"
          fw={700}
          style={{
            textDecoration: 'underline',
            textUnderlineOffset: 4,
            color: 'black',
            letterSpacing: 1,
            fontFamily: 'Roboto Mono, monospace',
          }}
        >
          laoshi
        </Text>
        <Burger opened={menuOpened} onClick={() => setMenuOpened((o) => !o)} aria-label="Toggle menu" size="md" color="black" />
      </Group>

      {/* Burger Menu Drawer */}
      <Drawer
        opened={menuOpened}
        onClose={() => setMenuOpened(false)}
        title={<Text fw={700} size="lg" style={{ fontFamily: 'Roboto Mono, monospace' }}>Menu</Text>}
        padding="md"
        position="right"
        size="xs"
      >
        <Stack>
          <Text component="a" href="#" style={{ fontFamily: 'Roboto Mono, monospace' }}>History</Text>
        </Stack>
      </Drawer>

      {/* Main Content */}
      <Stack align="center" justify="center" mt="xl" px="md">
        <Button
          size="md"
          radius="md"
          style={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 600, letterSpacing: 1, marginBottom: 24 }}
          onClick={generateMandarinText}
          loading={isGenerating}
        >
          Generate Mandarin Text
        </Button>

        {showText && (
          <Paper withBorder radius="md" p="lg" style={{ width: '100%', maxWidth: 400, background: '#faf9f6', position: 'relative' }}>
            <LoadingOverlay visible={isGenerating} />
            <Group justify="space-between" align="center" mb="sm">
              <Switch
                size="sm"
                checked={showPinyin}
                onChange={(e) => setShowPinyin(e.currentTarget.checked)}
                label={<Text size="sm" style={{ fontFamily: 'Roboto Mono, monospace' }}>Show Pinyin</Text>}
              />
              <ActionIcon
                variant="light"
                size="lg"
                color="dark"
                aria-label="Play text"
                onClick={handlePlay}
                loading={isPlaying}
              >
                <IconPlayerPlay size={22} />
              </ActionIcon>
            </Group>
            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {mandarinText.map((item, idx) => (
                <Box key={idx} style={{ textAlign: 'center', minWidth: 28 }}>
                  <Text
                    size="xl"
                    style={{
                      fontWeight: 500,
                      fontFamily: 'sans-serif',
                      background: idx === currentWordIdx ? '#ffe066' : 'transparent',
                      borderRadius: 4,
                      transition: 'background 0.2s',
                    }}
                  >
                    {item.word}
                  </Text>
                  {showPinyin && item.pinyin && (
                    <Text size="xs" c="gray" style={{ fontFamily: 'Roboto Mono, monospace' }}>{item.pinyin}</Text>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
