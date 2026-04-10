import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import SplashScreen from "./screens/SplashScreen";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import LibraryScreen from "./screens/LibraryScreen";
import PostEditorScreen from "./screens/PostEditorScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111111",
          borderTopColor: "#222222",
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: "#ff6b35",
        tabBarInactiveTintColor: "#555555",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />, tabBarLabel: "Home" }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="images" size={size} color={color} />, tabBarLabel: "Library" }} />
      <Tab.Screen name="PostEditor" component={PostEditorScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />, tabBarLabel: "Create" }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />, tabBarLabel: "Analytics" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />, tabBarLabel: "Settings" }} />
      <Tab.Screen
  name="Intelligence"
  component={CompetitiveIntelligenceScreen}
  options={{
    tabBarLabel: 'Intel',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="telescope-outline" size={size} color={color} />
    ),
  }}
/>
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}
