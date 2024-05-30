import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";

import { useRoute } from "@react-navigation/native";
import {
  Box,
  FlatList,
  HStack,
  Spinner,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import axios from "axios";
import { Comment, RouteObject } from "@/types/mainTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export default function TabTwoScreen() {
  const route = useRoute();
  const routeObj: RouteObject = {...route.params}
  const { id } = routeObj;
  const [comments, setComments] = useState<Comment[]>([]);
  const [load, setLoad] = useState(false);

  const fetchInfoComments = async () => {
    try {
      setLoad(true);
      const cachedCommentsString = await AsyncStorage.getItem(
        `comments/:${id}`
      );
      if (cachedCommentsString) {
        const cachedComments = JSON.parse(cachedCommentsString);
        setComments(cachedComments);
      } else {
        const response = await axios.get<Comment[]>(
          `http://jsonplaceholder.typicode.com/posts/${id}/comments`
        );
        setComments(response.data);
        await AsyncStorage.setItem(
          `comments/:${id}`,
          JSON.stringify(response.data)
        );
      }
      setLoad(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchInfoComments();
  }, [id]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      {load ? (
        <Spinner accessibilityLabel="Loading posts" />
      ) : (
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              _dark={{
                borderColor: "muted.50",
              }}
              borderColor="muted.800"
              pl={["0", "4"]}
              pr={["0", "5"]}
              py="2"
            >
              <HStack space={[2, 3]} justifyContent="space-between">
                <VStack>
                  <Text color="primary.50" bold>
                    {item.name}
                  </Text>
                  <Text color="primary.200">{item.body}</Text>
                  <Text
                    fontSize="xs"
                    color="primary.200"
                    alignSelf="flex-start"
                  >
                    {item.email}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => `${item.id}`}
        />
      )}
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
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
