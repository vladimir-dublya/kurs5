import { Image, StyleSheet } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {
  Button,
  Box,
  Text,
  HStack,
  VStack,
  Spacer,
  FlatList,
  Pressable,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Post } from "@/types/mainTypes";
import React from "react";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [load, setLoad] = useState(false);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      setLoad(true);
      const cachedPostsString = await AsyncStorage.getItem("posts");
      if (cachedPostsString) {
        const cachedPosts = JSON.parse(cachedPostsString);
        setPosts(cachedPosts);
      } else {
        const response = await axios.get<Post[]>(
          "http://jsonplaceholder.typicode.com/posts"
        );
        setPosts(response.data);
        await AsyncStorage.setItem("posts", JSON.stringify(response.data));
      }
      setLoad(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoad(false);
    }
  };

  const handleInfo = (id: number) => {
    router.push({ pathname: "info", params: { id: id } });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/homeImage.png")}
          style={styles.logo}
        />
      }
    >
      <FlatList
        data={posts}
        ListHeaderComponent={
          <Box alignItems="center">
            <Button
              onPress={fetchPosts}
              isLoading={load}
              isLoadingText="Fetching posts"
            >
              Fetch
            </Button>
          </Box>
        }
        renderItem={({ item }) => (
          <Box
            borderBottomWidth="1"
            _dark={{ borderColor: "muted.50" }}
            borderColor="muted.800"
            pl={["0", "4"]}
            pr={["0", "5"]}
            py="2"
          >
            <Pressable onPress={() => handleInfo(item.id)}>
              <HStack space={[2, 3]} justifyContent="space-between">
                <VStack>
                  <Text color="primary.50" bold>
                    {item.title}
                  </Text>
                  <Text color="primary.200">{item.body}</Text>
                </VStack>
              </HStack>
            </Pressable>
          </Box>
        )}
        keyExtractor={(item) => `${item.id}`}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
