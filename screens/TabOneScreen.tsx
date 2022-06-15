import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Button, FlatList, Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { refreshByMeasureId, SharedElement } from '../SharedElement';
import { RootTabScreenProps } from '../types';
import { Dimensions } from "react-native";

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const {navigate}=useNavigation();
  const [show, setShow] = useState(true);


  return (
    <View style={styles.container}>
      {/* <SharedElement id="shared">
        <Image
          style={{
            width: 50,
            height: 50,
          }}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
      </SharedElement> */}
      <FlatList
        style={{ flex: 1 }}
        // onViewableItemsChanged={() => {
        //   refreshByMeasureId("scrollview");
        // }}
        data={[1, 2, 3, 4, 5, 6,7]}
        renderItem={({ index }) => {
          return (
            <TouchableOpacity
            onPress={() => {
              navigate("Detail", { index: index });
            }}
              style={{
                height: 200,
                width: Dimensions.get("window").width - 20,
                margin: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                flexDirection: "row",
                elevation: 5,
              }}
            >
              <SharedElement
                style={{
                  height: 150,
                  margin: 25,
                  width: 150,
                }}
                sharedId={`shared${index}`}
                measureId="scrollview"
              >
                <Image
                  source={{
                    uri: `https://picsum.photos/id/${index+1010}/150/150`,
                  }}
                  style={{
                    flex: 1,
                    width: "100%",
                  }}
                />
              </SharedElement>
              <Text style={{ margin: 25, fontSize: 50 }}>{index }</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => String(index)}
        onScroll={() => refreshByMeasureId("scrollview")}
        scrollEventThrottle={16}
      />
      {/* <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        {show && (
         
        )}
        <Button
          onPress={() => navigate("NotFound")}
          title="Go to a detail route"
        />
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1000,
    width: '80%',
  },
});
