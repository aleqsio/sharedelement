import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useReanimatedTransitionProgress } from 'react-native-screens/reanimated';

import { Text, View } from '../components/Themed';
import { SharedElement } from '../SharedElement';
import { RootStackScreenProps } from '../types';

export default function NotFoundScreen({ navigation, route }: RootStackScreenProps<'Details'>) {
  return (
    <View style={styles.container}>
      <SharedElement
        style={{ height: 400, width: "100%" }}
        sharedId={`shared${route.params.index}`}
      >
        <Image
          style={{
            flex: 1,
          }}
          source={{
            uri: `https://picsum.photos/id/${
              route.params.index + 1010
            }/500/500`,
          }}
        />
      </SharedElement>
      <Text style={styles.title}>This is a detail screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding:20
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
