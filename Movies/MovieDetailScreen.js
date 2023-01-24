import React, {useState, useEffect} from 'react';
import {Image, Text, StyleSheet, ScrollView} from 'react-native';
import axios from 'axios';

export default function MovieDetailScreen(props) {
  const [movieDetails, setMovieDetails] = useState([]);
  const [genres, setGenres] = useState([]);
  const [videos, setVideos] = useState([]);

  const {route} = props;
  const {movie} = route.params;

  let IMAGEPATH = 'http://image.tmdb.org/t/p/w500';
  let imageurl = IMAGEPATH + movie.backdrop_path;

  useEffect(() => {
    axios
      .get(
        'https://api.themoviedb.org/3/movie/' +
          movie.id +
          '?api_key=7b47d1ed517fb2769851d717e91b287c&append_to_response=videos',
      )
      .then(response => {
        console.log(response.data);
        setMovieDetails(response.data);
        setGenres(response.data.genres);
        setVideos(response.data.videos.results);
      });
  }, []);

  let genreItems = genres.map(genre => {
    return <Text>{genre.name} </Text>;
  });

  const linkPressed = index => {
    props.navigation.navigate('MovieVideo', {video: videos[index]});
  };

  let videoItems = videos.map(function (video, index) {
    return (
      <Text
        style={{color: 'blue', fontSize: 14}}
        onPress={_ => linkPressed(index)}
        key={video.id}>
        {video.name} {'\n'}
      </Text>
    );
  });

  return (
    <ScrollView>
      <Image source={{uri: imageurl}} style={styles.image} />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.text}>{movie.release_date}</Text>
      <Text style={styles.text}>{movie.overview}</Text>
      <Text style={styles.text}>
        {'\n'}Genres: {genreItems}
      </Text>
      <Text style={styles.text}>
        {'\n'}Runtime: {movieDetails.runtime} min
      </Text>
      <Text style={styles.text}>
        {'\n'}Homepage: {movieDetails.homepage}
      </Text>
      <Text style={styles.text}>
        {'\n'}Videos: {'\n'}
        {videoItems}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    aspectRatio: 670 / 250,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  text: {
    fontSize: 12,
    flexWrap: 'wrap',
  },
});
