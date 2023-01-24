import React from 'react';
import {View, StyleSheet} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function MovieVideoScreen(props) {
  const {route} = props;
  const {video} = route.params;
  return (
    <View style={styles.videoScreen}>
      <YoutubePlayer play={true} height={300} videoId={video.key} />
    </View>
  );
}

const styles = StyleSheet.create({
  videoScreen: {
    justifyContent: 'center',
  },
});
