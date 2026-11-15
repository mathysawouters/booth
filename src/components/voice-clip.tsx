import Ionicons from '@expo/vector-icons/Ionicons';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Tappable } from '@/components/ui';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const MAX_SECONDS = 10;

export function VoiceClip({ uri, onChange }: { uri: string | null; onChange: (uri: string | null) => void }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder, 200);
  const player = useAudioPlayer(uri);
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current && !state.isRecording) {
      started.current = false;
      onChange(recorder.uri);
      void setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    }
  }, [state.isRecording, recorder, onChange]);

  async function start() {
    setError(null);
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      setError('Allow the microphone to record what they said.');
      return;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record({ forDuration: MAX_SECONDS });
    started.current = true;
  }

  function play() {
    void player.seekTo(0);
    player.play();
  }

  const seconds = Math.min(MAX_SECONDS, Math.floor(state.durationMillis / 1000));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {state.isRecording ? (
          <Tappable onPress={() => recorder.stop()} style={[styles.button, styles.recording]}>
            <Ionicons name="stop" size={22} color={Colors.white} />
            <Text style={[styles.label, styles.labelLight]}>
              Stop · {MAX_SECONDS - seconds}s left
            </Text>
          </Tappable>
        ) : (
          <Tappable onPress={start} style={styles.button}>
            <Ionicons name="mic" size={22} color={Colors.black} />
            <Text style={styles.label}>{uri === null ? 'Record 10 seconds' : 'Record again'}</Text>
          </Tappable>
        )}
        {uri !== null && !state.isRecording && (
          <>
            <Tappable accessibilityLabel="Play clip" onPress={play} style={styles.round}>
              <Ionicons name="play" size={22} color={Colors.black} />
            </Tappable>
            <Tappable
              accessibilityLabel="Delete clip"
              onPress={() => onChange(null)}
              style={styles.round}>
              <Ionicons name="trash" size={20} color={Colors.black} />
            </Tappable>
          </>
        )}
      </View>
      {error !== null && <Body muted>{error}</Body>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  button: {
    flex: 1,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.soft,
    borderRadius: Radius.pill,
  },
  recording: {
    backgroundColor: Colors.black,
  },
  label: {
    color: Colors.black,
    fontFamily: Fonts.sansBold,
    fontSize: 16,
  },
  labelLight: {
    color: Colors.white,
  },
  round: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
