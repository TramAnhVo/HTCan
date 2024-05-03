import React, { useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

export default CustomeCarousel = ({ data }) => {
    const [newData] = useState([{ key: 'spacer-left' },
    ...data,
    { key: 'spacer-right' }])
    const { width } = useWindowDimensions();
    const SIZE = width * 0.75;
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
                        [0.8, 1, 0.8]
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
                            <Image source={item.image} style={styles.imageCard} />
                        </Animated.View>
                    </View>
                );
            })}
        </Animated.ScrollView>
    )
}

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