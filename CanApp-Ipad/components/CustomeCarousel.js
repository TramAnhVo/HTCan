import React, { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import ImageModal from "react-native-image-modal";
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const CustomeCarousel = ({ data }) => {
    const [newData] = useState([{ key: 'spacer-left' }, ...data, { key: 'spacer-right' }])
    const { width } = useWindowDimensions();
    const SIZE = width * 0.7 ;
    const SPACER = (width - SIZE) / 3;
    const x = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            x.value = event.contentOffset.x;
        },
    });

    return (
        <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            snapToInterval={SIZE}
            decelerationRate="fast"
            onScroll={onScroll}
        >
            {newData.map((item, index) => {

                const styleAnimated = useAnimatedStyle(() => {
                    const scale = interpolate(
                        x.value,
                        [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
                        [0.7 , 0.9 , 0.7]
                    );
                    return {
                        transform: [{ scale }],
                    }
                });

                if (!item.image) {
                    return <View style={{ width: SPACER }} key={index} />;
                }

                return (
                    <View style={{ width: SIZE }} key={index} >
                        <Animated.View style={[styles.imageContainer, styleAnimated]}>
                            <ImageModal
                                resizeMode='contain'
                                imageBackgroundColor='#ffff'
                                style={styles.imageCard}
                                source={{ uri: item.image }}
                            />
                        </Animated.View>

                    </View>
                );
            })}
        </Animated.ScrollView>
    )
}

export default CustomeCarousel;

const styles = StyleSheet.create({
    imageContainer: {
        borderRadius: 34,
        overflow: 'hidden'
    },
    imageCard: {
        width: '100%',
        height: undefined,
        aspectRatio: 1
    }
});