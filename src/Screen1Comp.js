import React, { useEffect } from "react";
import { View, Image, Text, Pressable } from "react-native";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import LinearGradient from 'react-native-linear-gradient';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Screen1Comp({
    item,
    index,
    width,
    height,
    setOpen,
    setimgIndex
}) {

    const delay = index * 120;

    const posx = useSharedValue(-width);

    const imageAnimateStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: posx.value }
            ]
        }
    });

    useEffect(() => {
        posx.value = withDelay(delay, withSpring(0));
    }, []);

    const handleEvent = () => {
        setOpen(true);
        setimgIndex(index);
    }

    return (
        <>
            <Animated.View style={[imageAnimateStyle, { position: 'relative', width: width, height: height }]}>
                {item?.img &&
                    <AnimatedImage source={item.img} style={[{ width: width, height: height, backgroundColor: '#202020' }]} />
                }
                <Pressable onPress={handleEvent} style={{ width: width, position: 'absolute', bottom: 0 }}>
                    <LinearGradient colors={['#4c669f00', '#000']} style={{ width: width, height: height, justifyContent: 'flex-end' }}>
                        <View style={{ paddingBottom: 10, paddingHorizontal: 10 }}>
                            <Text style={{ fontSize: 18, color: '#fff', paddingVertical: 2 }}>{item.title}</Text>
                            <Text style={{ fontSize: 14, color: '#ffffff88', paddingVertical: 2, fontStyle: 'italic' }}>{item.releaseDate}</Text>
                        </View>
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        </>
    );

}
