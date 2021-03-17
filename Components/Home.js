import React from 'react';
import { FlatList, Text, View, TouchableHighlight, Image , StyleSheet, Dimensions} from 'react-native'


// screen sizing
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const recipeNumColumns = 2;
// item size
const RECIPE_ITEM_HEIGHT = 200;
const RECIPE_ITEM_MARGIN = 5;
export default function Home() {
  const renderBooks = ({ item }) => (
    <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)' onPress={() => this.onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={require('../assets/book.png')} />
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.price}>Hello</Text>
      </View>
    </TouchableHighlight>
  );
  return (

    <View>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
          renderItem={renderBooks}
          keyExtractor={item => item}
        />
      </View>

    // <ScrollView contentContainerStyle={styles.container}>
    //   <BookCard/>
    //   <BookCard/>
    //   <BookCard/>
    //   <BookCard/>
    //   <StatusBar style="auto" />
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: RECIPE_ITEM_MARGIN,
    marginTop: 20,
    width: (SCREEN_WIDTH - (recipeNumColumns + 1) * RECIPE_ITEM_MARGIN) / recipeNumColumns,
    height: RECIPE_ITEM_HEIGHT + 75,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 15
  },
  photo: {
    width: (SCREEN_WIDTH - (recipeNumColumns + 1) * RECIPE_ITEM_MARGIN) / recipeNumColumns,
    height: RECIPE_ITEM_HEIGHT,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444444',
    marginTop: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  price: {
    marginTop: 5,
    marginBottom: 5
  }
});