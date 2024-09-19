import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import TrackPlayer, {
  State,
  usePlaybackState,
  RepeatMode,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ControlCenter = () => {
  const playBackState = usePlaybackState();
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);

  useEffect(() => {
    const fetchRepeatMode = async () => {
      const mode = await TrackPlayer.getRepeatMode();
      setRepeatMode(mode);
    };

    fetchRepeatMode();
  }, []);

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };

  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const togglePlayback = async (playback: State) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack !== null) {
      if (playback === State.Paused || playback === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

  const toggleRepeatMode = async () => {
    let newMode;
    switch (repeatMode) {
      case RepeatMode.Off:
        newMode = RepeatMode.Track;
        break;
      case RepeatMode.Track:
        newMode = RepeatMode.Queue;
        break;
      case RepeatMode.Queue:
        newMode = RepeatMode.Off;
        break;
      default:
        newMode = RepeatMode.Off;
    }
    await TrackPlayer.setRepeatMode(newMode);
    setRepeatMode(newMode);
  };

  const currentPlaybackState = playBackState as State;

  return (
    <View style={styles.container}>
      <Pressable onPress={skipToPrevious}>
        <Icon style={styles.icon} name="skip-previous" size={40} />
      </Pressable>
      <Pressable onPress={() => togglePlayback(currentPlaybackState)}>
        <Icon
          style={styles.icon}
          name={currentPlaybackState === State.Playing ? 'pause' : 'play-arrow'}
          size={75}
        />
      </Pressable>
      <Pressable onPress={skipToNext}>
        <Icon style={styles.icon} name="skip-next" size={40} />
      </Pressable>
      <Pressable onPress={toggleRepeatMode}>
        <Icon
          style={styles.icon}
          name={
            repeatMode === RepeatMode.Off
              ? 'repeat'
              : repeatMode === RepeatMode.Track
              ? 'repeat-one'
              : 'repeat'
          }
          size={40}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 56,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#FFFFFF',
  },
  playButton: {
    marginHorizontal: 24,
  },
});

export default ControlCenter;
