import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, Pressable, StatusBar, Text, View } from "react-native";
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';

import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import ImageZoom from "react-native-image-pan-zoom";

//Local Data
import { img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13 } from "./Config";
import Screen1Comp from "./Screen1Comp";

const ImgColl = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];

const imgW = Dimensions.get('window').width;
const imgh = (imgW / 2880) * 1800;

const AnimatedImage = Animated.createAnimatedComponent(Image);

const ALL_FILMS_QUERY = gql`
  query AllFilms($first: Int, $after: String) {
    allFilms(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      films {
        title
        releaseDate
      }
    }
  }
`;

export default function Screen1() {

    const { loading, data, fetchMore } = useQuery(ALL_FILMS_QUERY, {
        variables: { first: 5 }
    });

    const scale = useSharedValue(1);

    const [movies, setMovies] = useState([]);
    const [isLast, setLast] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [imgIndex, setimgIndex] = useState(0);

    const imgAnimateStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value }
            ]
        }
    });

    useEffect(() => {
        setMovies(data?.allFilms?.films);
    }, [data, loading]);

    const loadMoreFilms = async () => {
        if (!loading && data?.allFilms?.pageInfo?.hasNextPage && !isLast) {
            fetchMore({
                variables: { after: data.allFilms.pageInfo.endCursor },
            }).then(res => {
                console.log(JSON.stringify(res));
                setMovies(prev => [...prev, ...(res.data?.allFilms?.films)]);
                if (!res.data?.allFilms?.pageInfo?.hasNextPage) {
                    setLast(true);
                }
            }).catch(e => {
                console.log(e);
            });
        }
    };

    const renderFilmItem = ({ item, index }) => {
        return (
            <>
                <Screen1Comp
                    item={{ ...item, img: ImgColl[index] }}
                    index={index}
                    width={imgW}
                    height={imgh}
                    setOpen={setOpen}
                    setimgIndex={setimgIndex}
                />
            </>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#202020', alignContent: 'center', alignItems: 'center' }}>
            <StatusBar backgroundColor="#000" />
            {loading ?
                <ActivityIndicator size="large" color="white" />
                :
                <FlatList
                    style={{ flex: 1 }}
                    data={movies || []}
                    renderItem={renderFilmItem}
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={() => (
                        <>
                            {!isLast &&
                                <View style={{ alignSelf: 'center', paddingVertical: 10 }}>
                                    <ActivityIndicator size="large" color="White" />
                                </View>
                            }
                        </>
                    )}
                    onEndReached={loadMoreFilms}
                    onEndReachedThreshold={1}
                />
            }
            <Modal
                animationType="slide"
                visible={isOpen}
                transparent={true}
            >
                <View style={{ flex: 1, position: 'relative', justifyContent: 'center', backgroundColor: '#000000ee', alignContent: 'center', alignItems: 'center' }}>
                    <ImageZoom cropWidth={Dimensions.get('window').width} cropHeight={Dimensions.get('window').height} imageWidth={imgW} imageHeight={imgh}>
                        <AnimatedImage source={ImgColl[imgIndex]} style={[imgAnimateStyle, { width: imgW, height: imgh }]} />
                    </ImageZoom>
                    <Pressable onPress={() => setOpen(false)} style={{ width: 50, height: 50, borderWidth: 2, borderColor: '#ffffff66', borderRadius: 80, position: 'absolute', bottom: 70, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, color: '#ffffff66' }}>X</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    );

}