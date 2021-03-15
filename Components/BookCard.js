// import React from 'react'
// import { View, Text } from 'react-native'
// import { Card, Button } from 'react-native-elements'

// export default function BookCard({book}) {
//     return (
//         <View key={book.id}>
//             <Card.Title>{book.title}</Card.Title>
//             <Card.Divider/>
//             <Card.Image source={book.imageUrl}>
//                 <Text style={{marginBottom: 10}}>
//                     {book.price}
//                 </Text>
//                 <Button
//                 icon={<Icon name='code' color='#ffffff' />}
//                 buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 2, marginBottom: 0}}
//                 title='VIEW NOW' />
//                 <Button
//                 buttonStyle={{borderRadius: 0, marginLeft: 2, marginRight: 0, marginBottom: 0}}
//                 title='VIEW NOW' />
//             </Card.Image>
//         </View>
//     )
// }

// export default function BookCard() {
//     return (
//             <Card>
//   <Card.Title>HELLO WORLD</Card.Title>
//   <Card.Divider/>
//   <Card.Image source={require('../assets/book.png')}>
//     <Text style={{marginBottom: 10}}>
//       The idea with React Native Elements is more about component structure than actual design.
//     </Text>
//     <Button
//       buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
//       title='VIEW NOW' />
//   </Card.Image>
// </Card>

//     )
// }

import React, { Component } from 'react';
import { 
    View, 
    Text,
    Image,
    StyleSheet,
    TouchableOpacity 
} from 'react-native';
// import themes from '../styles/theme.style';
export default class BookCard extends Component {
    addToCart = () => {
        // this.props.addItemsToCart(this.props.item)
    }
    render() {
        // const { product } = this.props;
            return (
        <View style={styles.container}>
            <Image source={require('../assets/book.png')} style={{width:150,height:150}}/>
            <View style={styles.productDes}>
                <Text>Hello World</Text>
                <Text>$34</Text>
                <Text>Omkar</Text>
                <TouchableOpacity onPress={this.addToCart} style={styles.addBtn}>
                    <Text style={styles.text}>Add to cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        margin: 10,
    },
    productDes: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    addBtn: {
        borderRadius: 30,
        margin: 10,
        backgroundColor: '#00695c'
    },
    text: {
        color: '#ffeb3b',
        fontSize: 16,
        padding: 10
    }
});