
import React, { Component } from 'react';
import { 
    View, 
    Text,
    Image,
    StyleSheet,
    TouchableOpacity 
} from 'react-native'
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