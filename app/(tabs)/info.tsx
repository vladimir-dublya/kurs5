import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";

import { useRoute } from "@react-navigation/native";
import { Box, Button, Flex, Text } from "native-base";
import { useEffect, useState } from "react";
import axios from "axios";
import { Post, RouteObject } from "@/types/mainTypes";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";


export default function TabTwoScreen() {
  const route = useRoute();
  const routeObj: RouteObject = {...route.params}
  const { id } = routeObj;
  const [post, setPost] = useState<Post>({} as Post);
  const [load, setLoad] = useState(false);
  const router = useRouter();
  const fetchInfo = async () => {
    try {
      setLoad(true);
      const cachedPostsString = await AsyncStorage.getItem(`post/:${id}`);
      if (cachedPostsString) {
        const cachedPosts = JSON.parse(cachedPostsString);
        setPost(cachedPosts);
      } else {
        const response = await axios.get<Post>(
          `http://jsonplaceholder.typicode.com/posts/${id}`
        );
        setPost(response.data);
        await AsyncStorage.setItem(
          `post/:${id}`,
          JSON.stringify(response.data)
        );
      }
      setLoad(false);
    } catch (error) {
      console.error("Error fetching post:", error);
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [id]);

  const handleComments = () => {
    router.push({ pathname: "comments", params: { id: +id } });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <Box alignItems="center">
        <Button
          onPress={handleComments}
          isLoading={load}
          isLoadingText="Fetching posts"
        >
          See comments
        </Button>
      </Box>
      <Flex
        direction="column"
        mb="2.5"
        mt="1.5"
        _text={{
          color: "coolGray.800",
        }}
      >
        <Text fontSize="2xl" color="primary.50" bold>
          {post.title}
        </Text>

        <Text fontSize="xl" color="primary.50" bold>
          {post.body}
        </Text>
      </Flex>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
